import { describe, expect, it } from "vitest";
import { runSimulation } from "@/lib/montecarlo/engine";
import type { SimulationInput } from "@/lib/montecarlo/types";

/**
 * 성능 예산: 10,000경로 × 480개월(4.8M 스텝)을 데스크톱에서 1초 이내.
 * CI 에서 실패시키지 않는다 — 머신 편차가 커서 플레이키해진다.
 * 측정값을 출력하고 추세를 사람이 본다.
 */
const BUDGET_MS = 1_000;

function input(paths: number, months: number, goal: boolean): SimulationInput {
  return {
    seed: 20260824,
    paths,
    months,
    initialBalance: 10_000_000,
    cashFlow: { monthlyAmount: 500_000, timing: "end", inflationIndexed: true },
    returns: { kind: "parametric", expectedReturn: 0.07, volatility: 0.15 },
    inflationRate: 0.02,
    reportBasis: "real",
    goal: goal
      ? { kind: "terminal-target", targetAmount: 1_000_000_000, targetProbability: 0.8 }
      : undefined,
  };
}

describe("성능 벤치마크", () => {
  it("10,000경로 × 480개월", () => {
    // 워밍업 — JIT 이 안정된 뒤 측정한다
    runSimulation(input(500, 480, true));

    for (const goal of [false, true]) {
      const t0 = performance.now();
      const r = runSimulation(input(10_000, 480, goal));
      const elapsed = performance.now() - t0;
      const stepsPerSec = (10_000 * 480) / (elapsed / 1000) / 1e6;
      console.log(
        `[perf] paths=10000 months=480 goal=${goal} → ${elapsed.toFixed(0)}ms ` +
          `(${stepsPerSec.toFixed(1)}M steps/s, 예산 ${BUDGET_MS}ms) ` +
          `truncatedShocks=${r.meta.truncatedShocks}`
      );
      expect(r.meta.pathsRun).toBe(10_000);
      // 절단 비율 정합성 — 계약상 이론값 6.51e-05 (df 6, |z|>8)
      const truncRate = r.meta.truncatedShocks / (10_000 * 480);
      console.log(`[perf] 절단 비율 ${truncRate.toExponential(2)} (이론 6.51e-05)`);
      expect(truncRate).toBeGreaterThan(3e-5);
      expect(truncRate).toBeLessThan(1.2e-4);
    }
  }, 120_000);

  it("규모별 확장성", () => {
    for (const [paths, months] of [
      [1_000, 480],
      [10_000, 120],
      [50_000, 120],
    ] as const) {
      const t0 = performance.now();
      runSimulation(input(paths, months, true));
      console.log(
        `[perf] paths=${paths} months=${months} → ${(performance.now() - t0).toFixed(0)}ms`
      );
    }
    expect(true).toBe(true);
  }, 120_000);
});
