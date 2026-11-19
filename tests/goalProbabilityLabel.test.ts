import { describe, expect, it, vi } from "vitest";
import { runSimulation } from "@/lib/montecarlo";
import { formatPercentFromRatio, normalizePercentInput, percentLabelForRatio } from "@/lib/number";
import type { SimulationInput } from "@/lib/montecarlo/types";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";
import { uiHarness, visibleCopy } from "./uiHarness";

// 목표 시나리오 비율을 화면에 입력하고 계산 버튼을 눌러 나온 결과 화면의 라벨이 입력값과 같은지 본다.
// 회귀 1: 58 → "57.99999999999999%"(부동소수점). 회귀 2: 99.99999 → "100%", 0.00001 → "0%"(넷째 자리 반올림).
// 회귀 3: 0.000000000000000000001 → "0%"(소수 20자리 탐색 한계).
// 훅은 화면이 넘긴 엔진 입력을 실제 엔진으로 바로 실행해 결과를 돌려주는 대역이다.
const hookState: { current: UseMonteCarloState } = { current: undefined as unknown as UseMonteCarloState };
const idle = (): UseMonteCarloState => ({
  status: "idle", result: null, progress: null, error: null, mode: "worker",
  run: (input: SimulationInput) => { hookState.current = { ...idle(), status: "done", result: runSimulation(input) }; },
  cancel: () => {}, reset: () => {},
});
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => hookState.current }));
vi.mock("next/navigation", () => ({ usePathname: () => "/goal-probability-calculator" }));

const { default: GoalProbabilityCalculator } = await import("@/components/calculator/GoalProbabilityCalculator");

type H = ReturnType<typeof uiHarness>;
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" ? x : "");
const clickRun = (h: H) => (h.nodes().find((n) => n.type === "button" && label(n.props.children).includes("달성 가능성 계산"))!.props.onClick as () => void)();

/** 화면 입력 → 계산 버튼 → 결과 화면 텍스트 */
function resultScreen(percentInput: string): string {
  hookState.current = idle();
  const h = uiHarness(GoalProbabilityCalculator);
  const inputs: Record<string, string> = {
    "goal-target": "100000000", "goal-probability": percentInput, "goal-years": "10", "goal-initial": "10000000",
    "goal-monthly": "500000", "goal-return": "7", "goal-volatility": "15", "goal-inflation": "2", "goal-paths": "300", "goal-seed": "7",
  };
  for (const [id, value] of Object.entries(inputs)) h.change(id, value);
  clickRun(h);
  const result = hookState.current.result;
  expect(result?.input.goal?.targetProbability, `${percentInput}% 가 엔진 입력으로 전달`).toBe(Number(percentInput) / 100);
  expect(result?.goal?.inversion?.requiredMonthlyAmount, `${percentInput}% 역산 결과`).toBeDefined();
  return visibleCopy(h.html());
}

const LABEL = /(\S+)% 시나리오 목표에 필요한 월 투자금/;
const TINY = "0.000000000000000000001"; // 비율 1e-23 — 엔진이 허용하는 입력
const LONG = "12.345678901234567890123456789"; // 배정밀도보다 긴 입력

describe("목표달성확률 결과 라벨 = 계산을 요청할 때 입력한 목표 비율", () => {
  for (const input of ["58", "56", "7", "29", "57", "80", "57.5", "99.9", "99.99999", "0.00001", "0.5", "33.333", TINY, LONG]) {
    it(`${input}% 입력`, () => {
      expect(resultScreen(input).match(LABEL)?.[1]).toBe(input);
    });
  }
  it("경계 근처 입력이 0%·100%로 표시되지 않는다", () => {
    expect(resultScreen("99.99999")).not.toContain("100% 시나리오 목표에");
    for (const input of ["0.00001", TINY]) expect(resultScreen(input)).not.toMatch(/(^|\s)0% 시나리오 목표에/);
  });
  it("표기만 다른 입력은 값이 같게 다듬어 표시한다", () => {
    expect(resultScreen("58.0").match(LABEL)?.[1]).toBe("58");
    expect(resultScreen("058.50").match(LABEL)?.[1]).toBe("58.5");
    expect(resultScreen(".5").match(LABEL)?.[1]).toBe("0.5");
  });
});

describe("목표달성확률 결과 화면의 최소 월 투자금 (회귀: 56% 에 623,052원, 56.7% 에 627,394원, 56.70000000000001% 에 627,298원 제시)", () => {
  // 목표 1억, 초기 1,000만, 월 50만, 10년, 7%/15%/물가 2%, 현재가치·월말 고정 납입(화면 기본값), 10,000경로, 재현 번호 1
  for (const [input, amount] of [["56", "623,006"], ["56.00001", "623,052"], ["56.7", "627,298"], ["56.70001", "627,394"], ["56.70000000000001", "627,394"]] as const) {
    it(`목표 ${input}% → 화면에 ${amount}원`, () => {
      hookState.current = idle();
      const h = uiHarness(GoalProbabilityCalculator);
      const inputs: Record<string, string> = {
        "goal-target": "100000000", "goal-probability": input, "goal-years": "10", "goal-initial": "10000000",
        "goal-monthly": "500000", "goal-return": "7", "goal-volatility": "15", "goal-inflation": "2", "goal-paths": "10000", "goal-seed": "1",
      };
      for (const [id, value] of Object.entries(inputs)) h.change(id, value);
      clickRun(h);
      const text = visibleCopy(h.html()).replace(/\s+/g, " ");
      expect(text).toContain(`${input}% 시나리오 목표에 필요한 월 투자금 ${amount} `);
    });
  }
});

describe("퍼센트 표기 함수", () => {
  it("normalizePercentInput 은 값을 바꾸지 않고 표기만 정리한다", () => {
    for (const [input, text] of [[" 058.50 ", "58.5"], [".5", "0.5"], ["80.", "80"], ["0", "0"], ["000", "0"], [TINY, TINY], [LONG, LONG]] as const) expect(normalizePercentInput(input)).toBe(text);
    for (const bad of ["", " ", "-5", "1e-5", "abc", ".", "1.2.3"]) expect(normalizePercentInput(bad)).toBeNull();
  });
  it("percentLabelForRatio 는 요청 문자열이 결과 비율과 같을 때만 그 문자열을 쓴다", () => {
    expect(percentLabelForRatio(TINY, Number(TINY) / 100)).toBe(TINY);
    expect(percentLabelForRatio("58", 0.58)).toBe("58");
    // 요청 문자열과 결과가 연결되지 않으면(다른 값·빈 값) 결과의 비율에서 표기를 만든다
    expect(percentLabelForRatio("80", 0.58)).toBe("58");
    expect(percentLabelForRatio("", Number("99.99999") / 100)).toBe("99.99999");
  });
  it("formatPercentFromRatio: 표시한 퍼센트 ÷ 100 이 원래 비율과 같고 0·100 으로 뭉개지 않는다", () => {
    for (const input of ["58", "56", "7", "29", "57", "80", "57.5", "99.99999", "0.00001", "0.0000001", "99.999999999", "1", "50", TINY]) {
      const ratio = Number(input) / 100;
      const text = formatPercentFromRatio(ratio);
      expect(text).toBe(input);
      expect(Number(text) / 100).toBe(ratio);
    }
    expect(formatPercentFromRatio(0)).toBe("0");
    expect(formatPercentFromRatio(1)).toBe("100");
    expect(formatPercentFromRatio(Number.NaN)).toBe("-");
    // 소수 100자리로도 표기할 수 없는 값은 0 으로 줄이지 않는다
    expect(formatPercentFromRatio(1e-150)).not.toBe("0");
    // 고치기 전 표시식이 실제로 깨졌던 값
    expect(String(0.58 * 100)).toBe("57.99999999999999");
  });
});
