/**
 * src/lib/montecarlo/engine.ts
 * 역할: 시뮬레이션 루프. 순수 계산 모듈 — DOM·React·Worker·fetch 를 모른다.
 *       난수 생성 방식도 모른다(ReturnGenerator 주입).
 *
 * 월별 진행 순서 (계약 문서 §4). 숨기지 않고 입력으로 드러낸다.
 *   1) timing === "start" 이면 현금흐름 반영
 *   2) 그 달의 수익 배수 적용
 *   3) timing === "end" 이면 현금흐름 반영
 *   4) 잔액이 0 이하로 떨어지면(양수였던 경로에 한해) 0 으로 클램프하고 소진 시점 기록 후 종료
 *   5) 연 단위 그리드 시점이면 기록 (reportBasis 가 "real" 이면 이때 환산)
 *
 * 진행 계산은 항상 **명목**으로 돌리고 실질 환산은 기록 단계에서만 한다(이중 할인 방지).
 *
 * v1 이 하지 않는 것: 세금, 거래비용, 리밸런싱, 환율, 다자산.
 * 전부 경로를 상태 의존으로 만들어 선형 정확 역산을 깨뜨린다. 4단계 이후 별도 설계.
 */

import type {
  AffineCoefficients,
  PercentileBand,
  DepletionResult,
  GoalResult,
  SamplePaths,
  SimulationInput,
  SimulationResult,
  SimulationRunner,
  RunOptions,
} from "./types";
import { ENGINE_VERSION } from "./types";
import { createRng, type Rng } from "./rng";
import { createReturnGenerator, type ReturnGenerator } from "./returns";
import { distributionFromSorted, percentilesFromSorted } from "./stats";
import {
  buildRequiredContributions,
  probabilityForContribution,
  requiredForProbability,
} from "./affine";
import { SimulationInputError, collectWarnings, validateInput } from "./validate";

/** 팬 차트에 겹쳐 그릴 대표 경로 수. */
export const SAMPLE_PATH_COUNT = 200;

const now = (): number =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

/** 연 단위 그리드. 마지막 달은 12의 배수가 아니어도 반드시 포함한다. */
function buildGrid(months: number): Int32Array {
  const points: number[] = [];
  for (let m = 0; m <= months; m += 12) points.push(m);
  if (points[points.length - 1] !== months) points.push(months);
  return Int32Array.from(points);
}

export function createRunner(input: SimulationInput): SimulationRunner {
  const issues = validateInput(input);
  if (issues.length > 0) throw new SimulationInputError(issues);

  const startedAt = now();
  const { paths, months, initialBalance, inflationRate, reportBasis } = input;
  const cf = input.cashFlow;
  const c = cf.monthlyAmount;

  const rng: Rng = createRng(input.seed);
  const generator: ReturnGenerator = createReturnGenerator(input.returns);

  const grid = buildGrid(months);
  const gridLen = grid.length;

  // 그리드 시점 → 실질 환산 계수. reportBasis 가 "nominal" 이면 전부 1.
  const discount = new Float64Array(gridLen);
  for (let g = 0; g < gridLen; g++) {
    discount[g] =
      reportBasis === "real" ? 1 / Math.pow(1 + inflationRate, grid[g] / 12) : 1;
  }

  // 현금흐름 형상. shape[m] 은 "월 1원 납입"이 m 월에 얼마로 들어가는지(스칼라 c 에 비례).
  // fixed[m] 은 overrides — c 와 무관한 절대 금액이라 아핀 분해에서 상수항으로 간다.
  const shapeBefore = new Float64Array(months);
  const shapeAfter = new Float64Array(months);
  const fixedBefore = new Float64Array(months);
  const fixedAfter = new Float64Array(months);
  if (cf.phases?.length) {
    for (const phase of cf.phases) {
      for (let m = phase.fromMonth; m < phase.toMonth; m++) {
        const factor = phase.inflationIndexed ? Math.pow(1 + inflationRate, Math.floor(m / 12)) : 1;
        const target = phase.timing === "start" ? fixedBefore : fixedAfter;
        target[m] += phase.monthlyAmount * factor;
      }
    }
  } else {
    const fromMonth = cf.fromMonth ?? 0;
    const toMonth = cf.toMonth ?? months;
    for (let m = 0; m < months; m++) {
      if (m >= fromMonth && m < toMonth) {
        const target = cf.timing === "start" ? shapeBefore : shapeAfter;
        target[m] = cf.inflationIndexed ? Math.pow(1 + inflationRate, Math.floor(m / 12)) : 1;
      }
    }
  }
  if (cf.overrides) {
    for (const [key, value] of Object.entries(cf.overrides)) {
      const m = Number(key);
      if (m >= 0 && m < months) {
        const target = cf.timing === "start" ? fixedBefore : fixedAfter;
        target[m] += value;
      }
    }
  }

  // ---- 결과 버퍼 ----
  // 그리드 우선 배치: gridValues[g * paths + j]. 집계 시 각 행을 제자리 정렬한다.
  const gridValues = new Float64Array(gridLen * paths);
  const depletionMonth = new Int32Array(paths).fill(-1);
  const factors = new Float64Array(months);

  const goal = input.goal;
  const wantsAffine = goal?.kind === "terminal-target" && !cf.phases?.length;
  const A = wantsAffine ? new Float64Array(paths) : null;
  const B = wantsAffine ? new Float64Array(paths) : null;

  const sampleCount = Math.min(SAMPLE_PATH_COUNT, paths);
  const sampleValues = new Float64Array(sampleCount * gridLen);

  let completed = 0;
  let batches = 0;
  let clamped = false;
  let depletedCount = 0;

  function runPath(j: number): void {
    generator.fillPath(factors, rng);

    let bal = initialBalance;
    let a = initialBalance;
    let b = 0;
    let gi = 0;
    // "소진"은 잔액이 양수였다가 0 이하로 떨어진 사건이다.
    // 아직 한 번도 양수인 적이 없는 0(예: 납입이 6개월 뒤 시작하는 구간 설정)은
    // 소진이 아니다 — 이걸 구분하지 않으면 정상 시나리오가 첫 달에 종료된다.
    let everPositive = initialBalance > 0;

    // 월 0 기록
    gridValues[j] = bal * discount[0];
    gi = 1;

    let depleted = -1;
    for (let m = 0; m < months; m++) {
      const beforeUnit = shapeBefore[m];
      const afterUnit = shapeAfter[m];
      const beforeAbs = fixedBefore[m];
      const afterAbs = fixedAfter[m];
      const r = factors[m];

      bal += c * beforeUnit + beforeAbs;
      if (wantsAffine) {
        a += beforeAbs;
        b += beforeUnit;
      }
      bal *= r;
      if (wantsAffine) {
        a *= r;
        b *= r;
      }
      bal += c * afterUnit + afterAbs;
      if (wantsAffine) {
        a += afterAbs;
        b += afterUnit;
      }

      if (bal < 0 || (bal === 0 && everPositive)) {
        bal = 0;
        depleted = m;
        clamped = true;
      } else if (bal > 0) {
        everPositive = true;
      }

      if (gi < gridLen && m + 1 === grid[gi]) {
        gridValues[gi * paths + j] = bal * discount[gi];
        gi++;
      }
      if (depleted >= 0) break;
    }

    // 소진 이후 남은 그리드 시점은 0 으로 채운다.
    for (; gi < gridLen; gi++) gridValues[gi * paths + j] = 0;

    if (depleted >= 0) {
      depletionMonth[j] = depleted;
      depletedCount++;
    }
    if (wantsAffine && A && B) {
      A[j] = a;
      B[j] = b;
    }
    if (j < sampleCount) {
      for (let g = 0; g < gridLen; g++) {
        sampleValues[j * gridLen + g] = gridValues[g * paths + j];
      }
    }
  }

  function finish(): SimulationResult {
    const assumptions = generator.describe();
    const warnings = collectWarnings(input);

    // 목표 판정은 정렬 전에 — 정렬이 경로 순서를 파괴한다.
    const terminalRow = gridValues.subarray((gridLen - 1) * paths, gridLen * paths);

    let goalResult: GoalResult | undefined;
    if (goal?.kind === "terminal-target") {
      const target = goal.targetAmount ?? 0;
      let successes = 0;
      for (let j = 0; j < paths; j++) if (terminalRow[j] >= target) successes++;
      goalResult = {
        kind: goal.kind,
        successProbability: paths > 0 ? successes / paths : Number.NaN,
      };
    }

    // 아핀 계수는 클램프가 한 번도 없었을 때만 유효하다.
    let affine: AffineCoefficients | undefined;
    if (wantsAffine && A && B && !clamped) {
      affine = { A, B };
    } else if (wantsAffine && clamped) {
      warnings.push(
        "잔액이 0에 도달한 경로가 있어 선형 정확 역산을 사용할 수 없습니다(이분 탐색 폴백 대상)."
      );
    }

    if (goalResult && affine && goal?.targetProbability !== undefined) {
      // A·B 는 명목 기준이므로 목표 금액도 명목으로 환산해 비교한다.
      const targetReal = goal.targetAmount ?? 0;
      const targetNominal =
        reportBasis === "real"
          ? targetReal * Math.pow(1 + inflationRate, months / 12)
          : targetReal;
      const rc = buildRequiredContributions(affine.A, affine.B, targetNominal);
      const required = requiredForProbability(rc, goal.targetProbability);
      if (required !== null) {
        goalResult.inversion = {
          requiredMonthlyAmount: required,
          method: "linear-exact",
          successProbabilityAt: probabilityForContribution(rc, required),
          sortedRequired: rc.sorted,
          fixedPaths: { count: rc.fixedCount, successes: rc.fixedSuccesses },
        };
      } else {
        warnings.push(
          "이 가정에서는 월 납입액을 아무리 늘려도 목표 확률에 도달하지 않습니다."
        );
      }
    }

    // 대표 경로는 정렬 전에 이미 복사해 두었다.
    const samplePaths: SamplePaths = {
      months: grid,
      values: sampleValues,
      count: sampleCount,
    };

    // 소진 분포
    let depletion: DepletionResult | undefined;
    if (depletedCount > 0) {
      const years = Math.floor(months / 12) + 1;
      const byYear = new Int32Array(years);
      const depMonths = new Float64Array(depletedCount);
      let k = 0;
      for (let j = 0; j < paths; j++) {
        const m = depletionMonth[j];
        if (m >= 0) {
          depMonths[k++] = m;
          const y = Math.min(years - 1, Math.floor(m / 12));
          byYear[y]++;
        }
      }
      depMonths.sort();
      depletion = {
        rate: depletedCount / paths,
        byYear,
        percentiles: percentilesFromSorted(depMonths, depletedCount),
      };
    }

    // 밴드·최종분포 (각 행 제자리 정렬)
    const bands: PercentileBand[] = [];
    for (let g = 0; g < gridLen; g++) {
      const row = gridValues.subarray(g * paths, (g + 1) * paths);
      row.sort();
      bands.push({ month: grid[g], ...percentilesFromSorted(row, paths) });
    }
    const terminal = distributionFromSorted(terminalRow, paths);

    return {
      input,
      assumptions,
      bands,
      terminal,
      goal: goalResult,
      depletion,
      samplePaths,
      affine,
      meta: {
        engineVersion: ENGINE_VERSION,
        seed: input.seed,
        pathsRun: completed,
        months,
        elapsedMs: now() - startedAt,
        batches,
        truncatedShocks: generator.truncatedShocks,
        clamped,
        warnings,
      },
    };
  }

  return {
    get done() {
      return completed >= paths;
    },
    get completed() {
      return completed;
    },
    get total() {
      return paths;
    },
    runBatch(n: number): void {
      const end = Math.min(paths, completed + Math.max(1, Math.floor(n)));
      for (let j = completed; j < end; j++) runPath(j);
      completed = end;
      batches++;
    },
    finish,
  };
}

/**
 * 한 번에 끝내는 실행. 테스트와 메인 스레드 폴백이 쓴다.
 * 내부적으로 createRunner 를 쓰므로 Worker 경로와 코드가 갈리지 않는다.
 */
export function runSimulation(
  input: SimulationInput,
  opts: RunOptions = {}
): SimulationResult {
  const runner = createRunner(input);
  const batch = Math.max(1, Math.ceil(runner.total / 20));
  while (!runner.done) {
    runner.runBatch(batch);
    opts.onProgress?.(runner.completed, runner.total);
    if (opts.shouldCancel?.()) break;
  }
  return runner.finish();
}
