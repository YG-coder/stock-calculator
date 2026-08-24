import { describe, expect, it } from "vitest";
import { runSimulation } from "@/lib/montecarlo/engine";
import {
  buildRequiredContributions,
  countLessOrEqual,
  probabilityForContribution,
  requiredForProbability,
} from "@/lib/montecarlo/affine";
import { quantileSorted } from "@/lib/montecarlo/stats";
import type { SimulationInput } from "@/lib/montecarlo/types";

const PATHS = 10_000;

function goalInput(over: Partial<SimulationInput> = {}): SimulationInput {
  return {
    seed: 20260824,
    paths: PATHS,
    months: 240,
    initialBalance: 10_000_000,
    cashFlow: { monthlyAmount: 500_000, timing: "end", inflationIndexed: false },
    returns: { kind: "parametric", expectedReturn: 0.07, volatility: 0.15 },
    inflationRate: 0,
    reportBasis: "nominal",
    goal: { kind: "terminal-target", targetAmount: 500_000_000 },
    ...over,
  };
}

describe("아핀 분해", () => {
  it("적립 시나리오에서 affine 계수가 채워진다", () => {
    const r = runSimulation(goalInput());
    expect(r.meta.clamped).toBe(false);
    expect(r.affine).toBeDefined();
    expect(r.affine!.A.length).toBe(PATHS);
    expect(r.affine!.B.length).toBe(PATHS);
  });

  it("W_T = A + c·B 가 실제 시뮬레이션 결과와 일치한다", () => {
    const c = 500_000;
    const r = runSimulation(goalInput({ cashFlow: { monthlyAmount: c, timing: "end", inflationIndexed: false } }));
    const { A, B } = r.affine!;
    // 경로별 종말자산의 중앙값을 아핀식으로 재구성해 분포가 같은지 본다.
    const rebuilt = Float64Array.from({ length: PATHS }, (_, j) => A[j] + c * B[j]);
    rebuilt.sort();
    for (const [p, actual] of [
      [0.1, r.terminal.p10],
      [0.5, r.terminal.p50],
      [0.9, r.terminal.p90],
    ] as const) {
      expect(Math.abs(quantileSorted(rebuilt, PATHS, p) / actual - 1)).toBeLessThan(1e-12);
    }
  });

  it("납입액을 바꿔도 A·B 는 변하지 않는다 (재시뮬 불필요의 근거)", () => {
    const a = runSimulation(goalInput({ cashFlow: { monthlyAmount: 300_000, timing: "end", inflationIndexed: false } }));
    const b = runSimulation(goalInput({ cashFlow: { monthlyAmount: 900_000, timing: "end", inflationIndexed: false } }));
    expect(Array.from(a.affine!.A)).toEqual(Array.from(b.affine!.A));
    expect(Array.from(a.affine!.B)).toEqual(Array.from(b.affine!.B));
  });

  it("인출로 클램프가 발생하면 affine 을 만들지 않고 사유를 경고에 남긴다", () => {
    const r = runSimulation(
      goalInput({
        initialBalance: 10_000_000,
        cashFlow: { monthlyAmount: -300_000, timing: "start", inflationIndexed: false },
        returns: { kind: "parametric", expectedReturn: 0.02, volatility: 0.2 },
      })
    );
    expect(r.meta.clamped).toBe(true);
    expect(r.affine).toBeUndefined();
    expect(r.meta.warnings.join(" ")).toContain("선형 정확 역산을 사용할 수 없습니다");
  });
});

describe("목표 역산 — 분위수 방향", () => {
  it.each([0.9, 0.8, 0.5, 0.1])(
    "p=%s 에서 구한 납입액을 실제로 넣고 재시뮬하면 성공확률이 p 이상, 1/N 이내로 최소다",
    (p) => {
      const first = runSimulation(
        goalInput({ goal: { kind: "terminal-target", targetAmount: 500_000_000, targetProbability: p } })
      );
      const inv = first.goal!.inversion!;
      expect(inv.method).toBe("linear-exact");

      const check = runSimulation(
        goalInput({
          cashFlow: { monthlyAmount: inv.requiredMonthlyAmount, timing: "end", inflationIndexed: false },
          goal: { kind: "terminal-target", targetAmount: 500_000_000 },
        })
      );
      // 경험적 CDF 상으로는 정확히 목표 이상이어야 한다
      expect(inv.successProbabilityAt).toBeGreaterThanOrEqual(p - 1e-12);

      const actual = check.goal!.successProbability;
      // 재시뮬 값은 경계 경로 하나가 부동소수 반올림으로 뒤집힐 수 있다.
      // c* 는 그 경로의 종말자산이 목표와 "정확히" 같아지는 값이므로,
      // A + c*·B 의 마지막 비트에서 목표를 근소하게 밑돌 수 있다. 1경로만큼 여유를 둔다.
      expect(actual).toBeGreaterThanOrEqual(p - 1.5 / PATHS);
      // 경로 수 유한성에 따른 이산 오차 이내로 최소여야 한다
      expect(actual).toBeLessThan(p + 5 / PATHS);
    }
  );

  it("p 가 커질수록 필요 납입액이 커진다 — 방향이 뒤집히면 즉시 잡힌다", () => {
    const req = [0.1, 0.5, 0.9].map(
      (p) =>
        runSimulation(
          goalInput({ goal: { kind: "terminal-target", targetAmount: 500_000_000, targetProbability: p } })
        ).goal!.inversion!.requiredMonthlyAmount
    );
    expect(req[0]).toBeLessThan(req[1]);
    expect(req[1]).toBeLessThan(req[2]);
  });

  it("실질 기준 목표 금액은 명목으로 환산해 비교한다", () => {
    const real = runSimulation(
      goalInput({
        inflationRate: 0.02,
        reportBasis: "real",
        goal: { kind: "terminal-target", targetAmount: 500_000_000, targetProbability: 0.8 },
      })
    );
    const nominal = runSimulation(
      goalInput({
        inflationRate: 0.02,
        reportBasis: "nominal",
        goal: {
          kind: "terminal-target",
          targetAmount: 500_000_000 * Math.pow(1.02, 20),
          targetProbability: 0.8,
        },
      })
    );
    expect(real.goal!.inversion!.requiredMonthlyAmount).toBeCloseTo(
      nominal.goal!.inversion!.requiredMonthlyAmount,
      4
    );
  });

  it("sortedRequired 만으로 확률↔납입액을 양방향 조회할 수 있다", () => {
    const r = runSimulation(
      goalInput({ goal: { kind: "terminal-target", targetAmount: 500_000_000, targetProbability: 0.8 } })
    );
    const inv = r.goal!.inversion!;
    const sorted = inv.sortedRequired!;
    const rc = {
      sorted,
      fixedCount: inv.fixedPaths.count,
      fixedSuccesses: inv.fixedPaths.successes,
      totalPaths: PATHS,
    };
    expect(probabilityForContribution(rc, inv.requiredMonthlyAmount)).toBeCloseTo(
      inv.successProbabilityAt,
      12
    );
    expect(requiredForProbability(rc, 0.8)).toBeCloseTo(inv.requiredMonthlyAmount, 12);
  });
});

describe("아핀 유틸 — 단위 테스트", () => {
  const A = Float64Array.from([100, 200, 300, 400]);
  const B = Float64Array.from([1, 1, 1, 1]);

  it("c_j = (W* − A_j)/B_j 를 오름차순으로 정렬한다", () => {
    const rc = buildRequiredContributions(A, B, 500);
    expect(Array.from(rc.sorted)).toEqual([100, 200, 300, 400]);
    expect(rc.fixedCount).toBe(0);
  });

  it("B_j <= 0 인 경로는 분위수에서 제외하고 상수로 더한다", () => {
    const b = Float64Array.from([1, 0, 1, 0]);
    const rc = buildRequiredContributions(A, b, 250);
    expect(rc.fixedCount).toBe(2);
    // A=200 은 250 미만이라 실패, A=400 은 성공
    expect(rc.fixedSuccesses).toBe(1);
    expect(Array.from(rc.sorted)).toEqual([-50, 150]);
    // c = 150 이면 두 경로(-50, 150) 성공 + 고정 성공 1 = 3/4
    expect(probabilityForContribution(rc, 150)).toBeCloseTo(0.75, 12);
  });

  it("모든 경로가 고정이면 역산이 불가능함을 null 로 알린다", () => {
    const rc = buildRequiredContributions(A, Float64Array.from([0, 0, 0, 0]), 1_000);
    expect(rc.sorted.length).toBe(0);
    expect(requiredForProbability(rc, 0.9)).toBeNull();
  });

  it("납입 없이도 목표 확률을 넘으면 0 을 돌려준다", () => {
    const rc = buildRequiredContributions(A, B, 0);
    expect(requiredForProbability(rc, 0.5)).toBe(0);
  });

  it("countLessOrEqual 은 경계에서 포함한다", () => {
    const s = Float64Array.from([1, 2, 2, 3]);
    expect(countLessOrEqual(s, 0)).toBe(0);
    expect(countLessOrEqual(s, 2)).toBe(3);
    expect(countLessOrEqual(s, 3)).toBe(4);
    expect(countLessOrEqual(s, 99)).toBe(4);
  });

  it("분위수 인덱스가 ceil(p·N) − 1 이다", () => {
    const n = 10;
    const a = new Float64Array(n).fill(0);
    const b = new Float64Array(n).fill(1);
    for (let i = 0; i < n; i++) a[i] = -i; // c_j = W* + i
    const rc = buildRequiredContributions(a, b, 0);
    // c_j = 0..9 오름차순
    expect(requiredForProbability(rc, 0.9)).toBe(8); // 10번째 중 9번째 값
    expect(requiredForProbability(rc, 0.1)).toBe(0);
  });
});
