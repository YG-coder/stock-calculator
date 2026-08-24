import { describe, expect, it } from "vitest";
import { buildSorrSimulationInput, parseAnnualReturns, simulateSorr, sorrSurvivalRate } from "@/lib/sorr";
import { runSimulation } from "@/lib/montecarlo";

describe("SoRR", () => {
  it("같은 수익률 집합도 인출 시 순서에 따라 결과가 달라진다", () => {
    const returns = [-0.3, 0.2, 0.2, 0.2];
    const original = simulateSorr(1_000, 10, 0, returns);
    const reversed = simulateSorr(1_000, 10, 0, [...returns].reverse());
    expect(original.terminal).not.toBeCloseTo(reversed.terminal, 8);
  });

  it("인출이 없으면 순서와 무관하다", () => {
    const returns = [-0.3, 0.2, 0.2, 0.2];
    expect(simulateSorr(1_000, 0, 0, returns).terminal).toBeCloseTo(
      simulateSorr(1_000, 0, 0, [...returns].reverse()).terminal,
      8,
    );
  });

  it("문자열 수익률을 소수로 변환한다", () => {
    expect(parseAnnualReturns("-10, 5  20")).toEqual([-0.1, 0.05, 0.2]);
  });

  it("라이브러리에서 잘못된 수익률과 입력을 거부한다", () => {
    expect(() => parseAnnualReturns("10, 오타, 5")).toThrow("숫자만");
    expect(() => simulateSorr(100, 10, 0, [0.1, Number.NaN])).toThrow("연 수익률");
    expect(() => simulateSorr(0, 10, 0, [0.1, 0.2])).toThrow("초기 자산");
  });

  it("엔진 기반 SoRR은 월초 물가연동 인출과 미소진 확률을 사용한다", () => {
    const input = buildSorrSimulationInput({ seed: 1, paths: 1, years: 1, initialAssets: 1_000, monthlyWithdrawal: 50, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0 });
    expect(input.cashFlow).toMatchObject({ monthlyAmount: -50, timing: "start", inflationIndexed: true });
    const result = runSimulation(input);
    expect(result.terminal.p50).toBeCloseTo(400);
    expect(sorrSurvivalRate(result)).toBe(1);
  });

  it("엔진 기반 SoRR은 소진 확률과 시점을 기록한다", () => {
    const result = runSimulation(buildSorrSimulationInput({ seed: 1, paths: 1, years: 1, initialAssets: 100, monthlyWithdrawal: 50, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0 }));
    expect(sorrSurvivalRate(result)).toBe(0);
    expect(result.depletion?.rate).toBe(1);
    expect(result.depletion?.percentiles.p50).toBe(1);
  });
});
