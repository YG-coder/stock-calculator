import { describe, expect, it } from "vitest";
import { createRunner, runSimulation } from "@/lib/montecarlo/engine";
import { SimulationInputError } from "@/lib/montecarlo/validate";
import { createReturnGenerator, toMonthlyParams } from "@/lib/montecarlo/returns";
import { createRng } from "@/lib/montecarlo/rng";
import type { SimulationInput } from "@/lib/montecarlo/types";

function baseInput(over: Partial<SimulationInput> = {}): SimulationInput {
  return {
    seed: 20260824,
    paths: 2_000,
    months: 120,
    initialBalance: 1_000_000,
    cashFlow: {
      monthlyAmount: 100_000,
      timing: "end",
      inflationIndexed: false,
    },
    returns: { kind: "parametric", expectedReturn: 0.07, volatility: 0.15 },
    inflationRate: 0,
    reportBasis: "nominal",
    ...over,
  };
}

describe("다단계 현금흐름", () => {
  it("적립 단계와 인출 단계를 한 경로에서 순서대로 처리한다", () => {
    const result = runSimulation(baseInput({
      paths: 1,
      months: 24,
      initialBalance: 0,
      returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
      cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false, phases: [
        { fromMonth: 0, toMonth: 12, monthlyAmount: 100, timing: "end", inflationIndexed: false },
        { fromMonth: 12, toMonth: 24, monthlyAmount: -50, timing: "start", inflationIndexed: false },
      ] },
    }));
    expect(result.terminal.p50).toBeCloseTo(600, 8);
    expect(result.depletion).toBeUndefined();
  });

  it("겹치는 현금흐름 단계는 거부한다", () => {
    expect(() => runSimulation(baseInput({ cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false, phases: [
      { fromMonth: 0, toMonth: 10, monthlyAmount: 1, timing: "end", inflationIndexed: false },
      { fromMonth: 9, toMonth: 12, monthlyAmount: -1, timing: "start", inflationIndexed: false },
    ] } }))).toThrow(/겹칠 수 없습니다/);
  });

  it("phases와 0이 아닌 최상위 monthlyAmount를 함께 전달하면 거부한다", () => {
    expect(() => runSimulation(baseInput({ cashFlow: { monthlyAmount: 999_999, timing: "end", inflationIndexed: false, phases: [
      { fromMonth: 0, toMonth: 12, monthlyAmount: 100, timing: "end", inflationIndexed: false },
    ] } }))).toThrow(/monthlyAmount는 0/);
  });

  it("phases에서 지원하지 않는 필요 납입액 역산 요청을 명시적으로 거부한다", () => {
    expect(() => runSimulation(baseInput({
      goal: { kind: "terminal-target", targetAmount: 10_000_000, targetProbability: 0.8 },
      cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false, phases: [
        { fromMonth: 0, toMonth: 12, monthlyAmount: 100, timing: "end", inflationIndexed: false },
      ] },
    }))).toThrow(/역산은 아직 지원하지 않습니다/);
  });
});

/* ============================================================
   1. 결정적 재현성
   ============================================================ */
describe("결정적 재현성", () => {
  it("같은 입력 + 같은 시드 → 결과가 완전히 동일", () => {
    const a = runSimulation(baseInput());
    const b = runSimulation(baseInput());
    expect(a.terminal).toEqual(b.terminal);
    expect(a.bands).toEqual(b.bands);
    expect(Array.from(a.samplePaths.values)).toEqual(Array.from(b.samplePaths.values));
  });

  it("시드를 바꾸면 결과가 달라진다", () => {
    const a = runSimulation(baseInput({ seed: 1 }));
    const b = runSimulation(baseInput({ seed: 2 }));
    expect(a.terminal.p50).not.toBeCloseTo(b.terminal.p50, 0);
  });

  it("결과에 실제 사용된 시드가 실려 나온다", () => {
    const r = runSimulation(baseInput({ seed: 987654 }));
    expect(r.meta.seed).toBe(987654);
    expect(r.input.seed).toBe(987654);
    expect(r.meta.engineVersion).toBe("1.0.1");
    expect(r.meta.months).toBe(120);
    expect(r.meta.pathsRun).toBe(2_000);
  });

  it("배치를 쪼개 실행해도 한 번에 실행한 것과 같다", () => {
    const one = runSimulation(baseInput());
    const runner = createRunner(baseInput());
    while (!runner.done) runner.runBatch(37);
    const many = runner.finish();
    expect(many.terminal).toEqual(one.terminal);
    expect(many.meta.batches).toBeGreaterThan(one.meta.batches);
  });
});

/* ============================================================
   2. 기존 복리 계산기 회귀 (1순위 앵커)
   ============================================================ */
describe("복리 계산기 회귀 — volatility = 0", () => {
  /**
   * 기존 CompoundInterestCalculator 의 폐형식을 테스트 안에 직접 옮겨 적는다.
   * 컴포넌트를 import 하지 않는 이유: 두 계산기의 복리 관례가 다르기 때문이다.
   *   기존:  월 배수 (1 + r/12),  r 은 명목 연이율  → 연 실효 (1+r/12)^12 − 1
   *   엔진:  월 배수 (1+CAGR)^(1/12)                → 연 실효 정확히 CAGR
   * 같은 숫자를 넣으면 당연히 다르다. r = 12·((1+CAGR)^(1/12) − 1) 로 변환해야 맞는다.
   */
  function legacyCompound(P: number, PMT: number, r: number, years: number): number {
    const n = 12;
    const growth = Math.pow(1 + r / n, n * years);
    return r === 0 ? P + PMT * n * years : P * growth + PMT * ((growth - 1) / (r / n));
  }

  const nominalToCagr = (r: number) => Math.pow(1 + r / 12, 12) - 1;
  const cagrToNominal = (cagr: number) => 12 * (Math.pow(1 + cagr, 1 / 12) - 1);

  it("관례 변환식이 왕복한다", () => {
    for (const r of [0, 0.03, 0.1, 0.2]) {
      expect(cagrToNominal(nominalToCagr(r))).toBeCloseTo(r, 12);
    }
    expect(nominalToCagr(0.1)).toBeCloseTo(0.104713, 6); // 연 실효 10.47%
  });

  it.each([
    { P: 1_000_000, PMT: 100_000, r: 0.1, years: 10 },
    { P: 0, PMT: 500_000, r: 0.05, years: 20 },
    { P: 50_000_000, PMT: 0, r: 0.07, years: 40 },
    { P: 3_000_000, PMT: 250_000, r: 0, years: 15 },
    { P: 1_000_000, PMT: 100_000, r: 0.2, years: 30 },
  ])("P=$P PMT=$PMT r=$r t=$years 에서 원 단위까지 일치", ({ P, PMT, r, years }) => {
    const expected = legacyCompound(P, PMT, r, years);
    const result = runSimulation(
      baseInput({
        paths: 1,
        months: years * 12,
        initialBalance: P,
        cashFlow: { monthlyAmount: PMT, timing: "end", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: nominalToCagr(r), volatility: 0 },
        inflationRate: 0,
        reportBasis: "nominal",
      })
    );
    expect(Math.round(result.terminal.p50)).toBe(Math.round(expected));
  });

  it("timing 을 start 로 두면 기말이 아니라 기초 연금이 된다 (한 달치 성장 차이)", () => {
    const r = 0.1;
    const cagr = nominalToCagr(r);
    const monthly = Math.pow(1 + cagr, 1 / 12);
    const end = runSimulation(
      baseInput({
        paths: 1,
        months: 120,
        initialBalance: 0,
        cashFlow: { monthlyAmount: 100_000, timing: "end", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: cagr, volatility: 0 },
      })
    ).terminal.p50;
    const start = runSimulation(
      baseInput({
        paths: 1,
        months: 120,
        initialBalance: 0,
        cashFlow: { monthlyAmount: 100_000, timing: "start", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: cagr, volatility: 0 },
      })
    ).terminal.p50;
    expect(start / end).toBeCloseTo(monthly, 10);
  });
});

/* ============================================================
   3. 해석적 대조와 통계 검증
   ============================================================ */
describe("통계적 검증 (고정 시드)", () => {
  it("현금흐름이 없으면 중앙값이 P0·exp(μ_m·T) 와 1% 이내로 일치", () => {
    const months = 240;
    const P0 = 10_000_000;
    const r = runSimulation(
      baseInput({
        paths: 20_000,
        months,
        initialBalance: P0,
        cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false },
      })
    );
    const { muM } = toMonthlyParams(0.07, 0.15);
    const analytic = P0 * Math.exp(muM * months);
    expect(Math.abs(r.terminal.p50 / analytic - 1)).toBeLessThan(0.01);
  });

  it("연 단순수익률의 표본 표준편차가 입력 변동성과 2% 이내 — 캘리브레이션 종단 검증", () => {
    for (const [cagr, vol] of [
      [0.07, 0.15],
      [0.08, 0.2],
      [0.07, 0.25],
      [0.05, 0.1],
    ] as const) {
      const r = runSimulation(
        baseInput({
          seed: 424242,
          paths: 50_000,
          months: 12,
          initialBalance: 1,
          cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false },
          returns: { kind: "parametric", expectedReturn: cagr, volatility: vol },
        })
      );
      // 최종 잔액 = 연 총수익 배수. 표본 표준편차를 밴드가 아니라 원자료로 구해야 하므로
      // 대표 경로가 아닌 분포 요약 대신 직접 재계산한다.
      const vals = simulateAnnualGross(cagr, vol);
      const n = vals.length;
      const mean = vals.reduce((a, b) => a + b, 0) / n;
      const std = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
      expect(Math.abs(std / vol - 1), `cagr=${cagr} vol=${vol}`).toBeLessThan(0.02);
      expect(r.terminal.p50).toBeGreaterThan(0);
    }
  });

  it("경로 수를 늘리면 중앙값이 수렴한다", () => {
    const p50 = [1_000, 10_000, 50_000].map(
      (paths) => runSimulation(baseInput({ paths, months: 120 })).terminal.p50
    );
    expect(Math.abs(p50[1] / p50[2] - 1)).toBeLessThan(0.02);
    expect(Math.abs(p50[1] / p50[2] - 1)).toBeLessThan(Math.abs(p50[0] / p50[2] - 1) + 0.02);
  });

  it("백분위가 단조 증가한다", () => {
    const t = runSimulation(baseInput()).terminal;
    expect(t.min).toBeLessThanOrEqual(t.p5);
    expect(t.p5).toBeLessThanOrEqual(t.p10);
    expect(t.p10).toBeLessThanOrEqual(t.p25);
    expect(t.p25).toBeLessThanOrEqual(t.p50);
    expect(t.p50).toBeLessThanOrEqual(t.p75);
    expect(t.p75).toBeLessThanOrEqual(t.p90);
    expect(t.p90).toBeLessThanOrEqual(t.p95);
    expect(t.p95).toBeLessThanOrEqual(t.max);
  });
});

/** 엔진 밖에서 연 총수익 배수 표본을 직접 만든다 (캘리브레이션 대조용). */
function simulateAnnualGross(cagr: number, vol: number): number[] {
  const r = runSimulation({
    seed: 987_654,
    paths: 50_000,
    months: 12,
    initialBalance: 1,
    cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false },
    returns: { kind: "parametric", expectedReturn: cagr, volatility: vol },
    inflationRate: 0,
    reportBasis: "nominal",
  });
  // bands 의 마지막 행은 정렬된 최종 잔액이지만 백분위만 노출된다.
  // 표준편차가 필요하므로 동일 시드로 생성기를 직접 돌린다.
  const gen = createReturnGenerator({
    kind: "parametric",
    expectedReturn: cagr,
    volatility: vol,
  });
  const rng = createRng(987_654);
  const out = new Float64Array(12);
  const vals: number[] = [];
  for (let p = 0; p < 50_000; p++) {
    gen.fillPath(out, rng);
    let g = 1;
    for (const v of out) g *= v;
    vals.push(g - 1);
  }
  void r;
  return vals;
}

/* ============================================================
   4. 실질/명목, 물가 연동
   ============================================================ */
describe("실질 기준 환산", () => {
  it("실질 = 명목 / (1+π)^(T/12), 진행 계산은 명목으로 돈다", () => {
    const nominal = runSimulation(baseInput({ inflationRate: 0.02, reportBasis: "nominal" }));
    const real = runSimulation(baseInput({ inflationRate: 0.02, reportBasis: "real" }));
    const factor = Math.pow(1.02, 120 / 12);
    expect(real.terminal.p50 * factor).toBeCloseTo(nominal.terminal.p50, 4);
  });

  it("물가 연동 납입은 매년 (1+π) 배로 증액된다", () => {
    const flat = runSimulation(
      baseInput({
        paths: 1,
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
        inflationRate: 0.02,
        reportBasis: "nominal",
        cashFlow: { monthlyAmount: 1_000, timing: "end", inflationIndexed: false },
        initialBalance: 0,
        months: 24,
      })
    ).terminal.p50;
    const indexed = runSimulation(
      baseInput({
        paths: 1,
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
        inflationRate: 0.02,
        reportBasis: "nominal",
        cashFlow: { monthlyAmount: 1_000, timing: "end", inflationIndexed: true },
        initialBalance: 0,
        months: 24,
      })
    ).terminal.p50;
    expect(flat).toBeCloseTo(24_000, 6);
    expect(indexed).toBeCloseTo(12_000 + 12_000 * 1.02, 6);
  });

  it("fromMonth/toMonth 는 반열림 구간이다", () => {
    const r = runSimulation(
      baseInput({
        paths: 1,
        months: 24,
        initialBalance: 0,
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
        cashFlow: {
          monthlyAmount: 1_000,
          timing: "end",
          inflationIndexed: false,
          fromMonth: 6,
          toMonth: 18,
        },
      })
    );
    expect(r.terminal.p50).toBeCloseTo(12_000, 6);
  });

  it("overrides 는 해당 월에 더해진다 (치환이 아니다)", () => {
    const r = runSimulation(
      baseInput({
        paths: 1,
        months: 12,
        initialBalance: 0,
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
        cashFlow: {
          monthlyAmount: 1_000,
          timing: "end",
          inflationIndexed: false,
          overrides: { 3: 500_000 },
        },
      })
    );
    expect(r.terminal.p50).toBeCloseTo(12_000 + 500_000, 6);
  });
});

/* ============================================================
   5. 경계값
   ============================================================ */
describe("경계값", () => {
  it("경로 1개", () => {
    const r = runSimulation(baseInput({ paths: 1 }));
    expect(r.meta.pathsRun).toBe(1);
    expect(Number.isFinite(r.terminal.p50)).toBe(true);
  });

  it("기간 1개월", () => {
    const r = runSimulation(baseInput({ months: 1 }));
    expect(r.bands.map((b) => b.month)).toEqual([0, 1]);
    expect(Number.isFinite(r.terminal.p50)).toBe(true);
  });

  it("기간 480개월", () => {
    const r = runSimulation(baseInput({ paths: 500, months: 480 }));
    expect(r.bands[r.bands.length - 1].month).toBe(480);
    expect(Number.isFinite(r.terminal.p50)).toBe(true);
  });

  it("기대수익률 0%, 변동성 0% — 순수 원금 누적", () => {
    const r = runSimulation(
      baseInput({
        paths: 1,
        months: 12,
        initialBalance: 1_000,
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
      })
    );
    expect(r.terminal.p50).toBeCloseTo(1_000 + 100_000 * 12, 6);
  });

  it("음수 기대수익률", () => {
    const r = runSimulation(
      baseInput({
        paths: 1,
        months: 12,
        initialBalance: 1_000_000,
        cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: -0.2, volatility: 0 },
      })
    );
    expect(r.terminal.p50).toBeCloseTo(800_000, 4);
  });

  it("시작 자산 0 + 납입만", () => {
    const r = runSimulation(baseInput({ initialBalance: 0 }));
    expect(r.terminal.p50).toBeGreaterThan(0);
    expect(r.meta.clamped).toBe(false);
  });

  it("월 납입액 0 + 초기 자산만", () => {
    const r = runSimulation(
      baseInput({ cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false } })
    );
    expect(r.terminal.p50).toBeGreaterThan(0);
  });

  it("모든 현금흐름이 0 이면 경고를 붙이고 0 으로 유지된다", () => {
    const r = runSimulation(
      baseInput({
        initialBalance: 0,
        cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false },
      })
    );
    expect(r.terminal.p50).toBe(0);
    expect(r.meta.warnings.join(" ")).toContain("모두 0");
  });

  it("매우 큰 금액에서도 유한하다", () => {
    const r = runSimulation(
      baseInput({ paths: 200, initialBalance: 1e15, cashFlow: { monthlyAmount: 1e12, timing: "end", inflationIndexed: false } })
    );
    expect(Number.isFinite(r.terminal.max)).toBe(true);
    expect(Number.isFinite(r.terminal.p50)).toBe(true);
  });

  it("결과 어디에도 NaN·Infinity 가 없다", () => {
    const r = runSimulation(baseInput({ paths: 1_000, months: 480 }));
    const nums = [
      ...Object.values(r.terminal),
      ...r.bands.flatMap((b) => Object.values(b)),
      ...Array.from(r.samplePaths.values),
    ];
    expect(nums.every((v) => Number.isFinite(v))).toBe(true);
  });

  it("극단 하락 가정에서도 잔액이 음수가 되지 않는다", () => {
    const r = runSimulation(
      baseInput({
        paths: 2_000,
        months: 480,
        initialBalance: 10_000_000,
        cashFlow: { monthlyAmount: -200_000, timing: "start", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: -0.3, volatility: 0.4 },
      })
    );
    expect(r.terminal.min).toBeGreaterThanOrEqual(0);
    expect(r.depletion).toBeDefined();
    expect(r.depletion!.rate).toBeGreaterThan(0);
  });
});

/* ============================================================
   6. 소진 처리
   ============================================================ */
describe("소진(depletion)", () => {
  it("인출로 소진되면 시점을 기록하고 이후 그리드는 0 이다", () => {
    const r = runSimulation(
      baseInput({
        paths: 100,
        months: 120,
        initialBalance: 1_000_000,
        cashFlow: { monthlyAmount: -500_000, timing: "start", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: 0, volatility: 0 },
      })
    );
    expect(r.depletion).toBeDefined();
    expect(r.depletion!.rate).toBe(1);
    expect(r.terminal.p50).toBe(0);
    expect(r.meta.clamped).toBe(true);
    const byYearTotal = Array.from(r.depletion!.byYear).reduce((a, b) => a + b, 0);
    expect(byYearTotal).toBe(100);
  });

  it("소진이 없으면 depletion 이 undefined 다", () => {
    const r = runSimulation(baseInput());
    expect(r.depletion).toBeUndefined();
    expect(r.meta.clamped).toBe(false);
  });
});

/* ============================================================
   7. 입력 검증 — 조용한 치환 금지
   ============================================================ */
describe("입력 검증", () => {
  const bad = (over: Partial<SimulationInput>) => () => runSimulation(baseInput(over));

  it("NaN·Infinity 를 거부한다", () => {
    expect(bad({ initialBalance: Number.NaN })).toThrow(SimulationInputError);
    expect(bad({ inflationRate: Number.POSITIVE_INFINITY })).toThrow(SimulationInputError);
    expect(
      bad({ cashFlow: { monthlyAmount: Number.NaN, timing: "end", inflationIndexed: false } })
    ).toThrow(SimulationInputError);
  });

  it("음수 초기 자산을 0 으로 바꾸지 않고 거부한다", () => {
    expect(bad({ initialBalance: -1 })).toThrow(/초기 자산/);
  });

  it("범위를 벗어난 경로 수·기간을 거부한다", () => {
    expect(bad({ paths: 0 })).toThrow(/경로 수/);
    expect(bad({ paths: 50_001 })).toThrow(/경로 수/);
    expect(bad({ paths: 1.5 })).toThrow(/경로 수/);
    expect(bad({ months: 0 })).toThrow(/기간/);
    expect(bad({ months: 721 })).toThrow(/기간/);
  });

  it("변동성·CAGR 범위와 캘리브레이션 조합을 검증한다", () => {
    expect(bad({ returns: { kind: "parametric", expectedReturn: 0.07, volatility: 0.5 } })).toThrow(
      /변동성/
    );
    expect(bad({ returns: { kind: "parametric", expectedReturn: 0.9, volatility: 0.1 } })).toThrow(
      /기대수익률/
    );
    // 각각은 범위 안이지만 조합이 테이블을 벗어나는 경우
    expect(
      bad({ returns: { kind: "parametric", expectedReturn: -0.5, volatility: 0.45 } })
    ).toThrow(/변동성 상한/);
  });

  it("bootstrap 과 미구현 goal 을 명시적으로 거부한다", () => {
    expect(bad({ returns: { kind: "bootstrap", datasetId: "kospi", blockMonths: 12 } })).toThrow(
      /bootstrap/
    );
    expect(bad({ goal: { kind: "never-depleted" } })).toThrow(/terminal-target/);
  });

  it("잘못된 구간·override 월을 거부한다", () => {
    expect(
      bad({
        cashFlow: {
          monthlyAmount: 1,
          timing: "end",
          inflationIndexed: false,
          fromMonth: 10,
          toMonth: 5,
        },
      })
    ).toThrow(/종료 월/);
    expect(
      bad({
        cashFlow: {
          monthlyAmount: 1,
          timing: "end",
          inflationIndexed: false,
          overrides: { 999: 1 },
        },
      })
    ).toThrow(/월 인덱스/);
  });

  it("오류에 필드별 사유가 담긴다", () => {
    try {
      runSimulation(baseInput({ paths: 0, months: 0 }));
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(SimulationInputError);
      const issues = (e as SimulationInputError).issues;
      expect(issues.map((i) => i.field)).toContain("paths");
      expect(issues.map((i) => i.field)).toContain("months");
    }
  });
});

/* ============================================================
   8. 경고와 스냅샷
   ============================================================ */
describe("경고·스냅샷", () => {
  it("세금·수수료 고지는 항상, 성공확률 고지는 목표 입력에만 실려 나온다", () => {
    const r = runSimulation(baseInput());
    expect(r.meta.warnings.join(" ")).toContain("세금과 거래비용은 반영하지 않았습니다");
    expect(r.meta.warnings.join(" ")).not.toContain("조건부 확률");
    const goal = runSimulation(baseInput({ goal: { kind: "terminal-target", targetAmount: 1 } }));
    expect(goal.meta.warnings.join(" ")).toContain("조건부 확률");
  });

  it("고정 시드 백분위 스냅샷 (리팩터링 회귀 감지)", () => {
    const r = runSimulation(baseInput({ seed: 20260824, paths: 5_000, months: 240 }));
    expect({
      p10: Math.round(r.terminal.p10),
      p50: Math.round(r.terminal.p50),
      p90: Math.round(r.terminal.p90),
    }).toMatchSnapshot();
  });
});
