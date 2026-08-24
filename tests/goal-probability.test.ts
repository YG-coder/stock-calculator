import { describe, expect, it } from "vitest";
import { buildGoalProbabilityInput, type GoalProbabilityValues } from "@/lib/goal-probability";
import { runSimulation } from "@/lib/montecarlo";

const base: GoalProbabilityValues = { seed: 7, paths: 1000, years: 10, initialBalance: 0, monthlyAmount: 100_000, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0, timing: "end", inflationIndexed: false, reportBasis: "nominal", targetAmount: 24_000_000, targetProbabilityPercent: 80 };
describe("목표달성확률 공개 계산기", () => {
  it("목표 계약을 엔진 입력으로 변환한다", () => expect(buildGoalProbabilityInput(base).goal).toEqual({ kind: "terminal-target", targetAmount: 24_000_000, targetProbability: 0.8 }));
  it("변동성 0에서 필요한 월 투자금을 정확히 역산한다", () => {
    const result = runSimulation(buildGoalProbabilityInput(base));
    expect(result.goal?.successProbability).toBe(0);
    expect(result.goal?.inversion?.requiredMonthlyAmount).toBeCloseTo(200_000, 8);
    expect(result.goal?.inversion?.successProbabilityAt).toBe(1);
  });
  it("현재 납입액이 목표를 넘으면 성공 비율이 100%다", () => {
    const result = runSimulation(buildGoalProbabilityInput({ ...base, monthlyAmount: 250_000 }));
    expect(result.goal?.successProbability).toBe(1);
  });
});
