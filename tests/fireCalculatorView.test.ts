import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildFireInput } from "@/lib/fire";
import { runSimulation } from "@/lib/montecarlo";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";

// 화면 연결 검증: 훅이 이전 결과를 들고 있을 때 컴포넌트가 무엇을 그리는지 본다.
const hookState: { current: UseMonteCarloState } = { current: undefined as unknown as UseMonteCarloState };
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => hookState.current }));
vi.mock("next/navigation", () => ({ usePathname: () => "/fire-calculator" }));

const { default: FireCalculator } = await import("@/components/calculator/FireCalculator");

const result = runSimulation(buildFireInput({ seed: 1, paths: 10, currentAge: 35.5, retirementAge: 55, planToAge: 85, currentAssets: 10_000_000, monthlyContribution: 0, monthlyExpenses: 0, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0 }));
const state = (overrides: Partial<UseMonteCarloState>): UseMonteCarloState => ({ status: "done", result, progress: null, error: null, mode: "worker", run: () => {}, cancel: () => {}, reset: () => {}, ...overrides });

describe("FireCalculator 이전 결과 표시", () => {
  it("현재 입력(빈칸)과 다른 결과는 변경 안내와 '이전 계산 결과'로 표시한다", () => {
    hookState.current = state({});
    const html = renderToStaticMarkup(createElement(FireCalculator));
    expect(html).toContain("입력값이 변경되었습니다. 다시 계산해 주세요.");
    expect(html).toContain("이전 계산 결과 · FIRE 시뮬레이션 결과");
    expect(html).toContain("이전 계산 결과 · 보수적 결과 범위");
    expect(html).toContain('data-stale="true"');
  });
  it("결과 설명의 기간은 결과의 실행 기간(594개월)으로 표시한다", () => {
    hookState.current = state({});
    const html = renderToStaticMarkup(createElement(FireCalculator));
    expect(html).toContain("10개 시나리오 · 49년 6개월 계획");
    expect(html).not.toContain("50년 계획");
  });
  it("결과가 없으면 변경 안내도 없다", () => {
    hookState.current = state({ status: "idle", result: null });
    const html = renderToStaticMarkup(createElement(FireCalculator));
    expect(html).not.toContain("입력값이 변경되었습니다");
  });
});
