import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildGoalProbabilityInput } from "@/lib/goal-probability";
import { runSimulation } from "@/lib/montecarlo";
import { formatPercentFromRatio } from "@/lib/number";
import { requiredNumber } from "@/lib/uiInput";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";
import { visibleCopy } from "./uiHarness";

// 목표 시나리오 비율을 입력해 계산한 결과 화면의 라벨이 입력값과 같은지 본다.
// 회귀 1: 58 → "57.99999999999999%"(부동소수점). 회귀 2: 99.99999 → "100%", 0.00001 → "0%"(과한 반올림).
const hookState: { current: UseMonteCarloState } = { current: undefined as unknown as UseMonteCarloState };
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => hookState.current }));
vi.mock("next/navigation", () => ({ usePathname: () => "/goal-probability-calculator" }));

const { default: GoalProbabilityCalculator } = await import("@/components/calculator/GoalProbabilityCalculator");

/** 화면과 같은 경로(문자열 → requiredNumber → 엔진 입력)로 실행한 결과를 훅에 실어 결과 화면을 그린다. */
function resultScreen(percentInput: string): string {
  const result = runSimulation(buildGoalProbabilityInput({
    seed: 7, paths: 300, years: 10, initialBalance: 10_000_000, monthlyAmount: 500_000,
    expectedReturnPercent: 7, volatilityPercent: 15, inflationPercent: 2, timing: "end", inflationIndexed: false,
    targetAmount: 100_000_000, targetProbabilityPercent: requiredNumber(percentInput), reportBasis: "real",
  }));
  expect(result.goal?.inversion?.requiredMonthlyAmount, `${percentInput}% 역산 결과`).toBeDefined();
  hookState.current = { status: "done", result, progress: null, error: null, mode: "worker", run: () => {}, cancel: () => {}, reset: () => {} };
  return visibleCopy(renderToStaticMarkup(createElement(GoalProbabilityCalculator)));
}

const LABEL = /(\S+)% 시나리오 목표에 필요한 월 투자금/;

describe("목표달성확률 결과 라벨 = 입력한 목표 비율", () => {
  for (const input of ["58", "56", "7", "29", "57", "80", "57.5", "99.9", "99.99999", "0.00001", "0.5", "33.333"]) {
    it(`${input}% 입력`, () => {
      const text = resultScreen(input);
      expect(text.match(LABEL)?.[1]).toBe(input);
    });
  }
  it("경계 근처 입력이 0%·100%로 표시되지 않는다", () => {
    expect(resultScreen("99.99999")).not.toContain("100% 시나리오 목표에");
    expect(resultScreen("0.00001")).not.toMatch(/(^|\s)0% 시나리오 목표에/);
  });
});

describe("formatPercentFromRatio — 표시한 퍼센트 ÷ 100 이 원래 비율과 같다", () => {
  it("입력 문자열을 그대로 되돌리고 지수 표기를 쓰지 않는다", () => {
    for (const input of ["58", "56", "7", "29", "57", "80", "57.5", "99.99999", "0.00001", "0.0000001", "99.999999999", "1", "50"]) {
      const ratio = Number(input) / 100;
      const text = formatPercentFromRatio(ratio);
      expect(text).toBe(input);
      expect(Number(text) / 100).toBe(ratio);
      expect(text).not.toMatch(/e/i);
    }
    expect(formatPercentFromRatio(0)).toBe("0");
    expect(formatPercentFromRatio(1)).toBe("100");
    expect(formatPercentFromRatio(Number.NaN)).toBe("-");
    // 고치기 전 표시식이 실제로 깨졌던 값
    expect(String(0.58 * 100)).toBe("57.99999999999999");
  });
});
