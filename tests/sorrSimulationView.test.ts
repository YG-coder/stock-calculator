import { describe, expect, it, vi } from "vitest";
import { runSimulation } from "@/lib/montecarlo";
import { buildSorrSimulationInput, SORR_NEGATIVE_WITHDRAWAL_MESSAGE, sorrWithdrawalIssue } from "@/lib/sorr";
import type { SimulationInput } from "@/lib/montecarlo/types";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";
import { uiHarness, visibleCopy } from "./uiHarness";

// 순서 위험 페이지의 월 인출 시뮬레이션 화면을 입력 → 버튼 → 결과 순서로 검사한다.
// 회귀: 월 생활비 −100,000원이 매달 입금으로 계산되어 최종 2,200,000원·생존율 100% 가 나왔다.
// 훅 대역은 실제 훅처럼 동작한다: run 은 실제 엔진을 실행하고 입력 오류는 error 로 돌려주며, reset 은 결과를 지운다.
const hookState: { current: UseMonteCarloState } = { current: undefined as unknown as UseMonteCarloState };
const calls = { run: 0 };
const idle = (): UseMonteCarloState => ({
  status: "idle", result: null, progress: null, error: null, mode: "worker",
  run: (input: SimulationInput) => {
    calls.run += 1;
    try { hookState.current = { ...idle(), status: "done", result: runSimulation(input) }; }
    catch (e) { hookState.current = { ...idle(), status: "error", error: { message: (e as Error).message } }; }
  },
  cancel: () => {},
  reset: () => { hookState.current = idle(); },
});
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => hookState.current }));
vi.mock("next/navigation", () => ({ usePathname: () => "/sequence-risk-calculator" }));

const { default: SorrSimulationCalculator } = await import("@/components/calculator/SorrSimulationCalculator");

type H = ReturnType<typeof uiHarness>;
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" ? x : "");
const runButton = (h: H) => h.nodes().find((n) => n.type === "button" && label(n.props.children).includes("월 인출 시뮬레이션"))!;
const click = (h: H) => (runButton(h).props.onClick as () => void)();
const screen = (h: H) => visibleCopy(h.html()).replace(/\s+/g, " ");
// 결과가 있을 때만 나오는 문구(빈 결과 카드도 제목은 같아서 제목으로는 구분할 수 없다)
const RESULT_TITLE = "기간 종료까지 자산이 소진되지 않은 경로";

/** 시작 자산 100만 원, 1년, 수익률·변동성·물가 0 — 생활비만 바꾼다. */
function open(withdrawal: string): H {
  hookState.current = idle();
  calls.run = 0;
  const h = uiHarness(SorrSimulationCalculator);
  const inputs: Record<string, string> = { "sorr-mc-assets": "1000000", "sorr-mc-years": "1", "sorr-mc-return": "0", "sorr-mc-volatility": "0", "sorr-mc-inflation": "0", "sorr-mc-paths": "100", "sorr-mc-seed": "1" };
  for (const [id, value] of Object.entries(inputs)) h.change(id, value);
  if (withdrawal !== "") h.change("sorr-mc-withdrawal", withdrawal);
  return h;
}

describe("월 인출 시뮬레이션 — 음수 생활비", () => {
  it("음수 생활비는 엔진에 전달하지 않고 이유를 표시한다", () => {
    const h = open("-100000");
    expect(screen(h)).toContain(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    expect(runButton(h).props.disabled).toBe(true);
    expect(() => click(h)).not.toThrow(); // 버튼 경로에서 예외가 새지 않는다
    expect(calls.run).toBe(0);
    expect(hookState.current.result).toBeNull();
    expect(screen(h)).not.toContain(RESULT_TITLE);
    expect(screen(h)).not.toContain("2,200,000");
  });
  it("정상 계산 뒤 음수로 바꾸면 이전 결과가 남지 않는다", () => {
    const h = open("50000");
    click(h);
    expect(screen(h)).toContain(RESULT_TITLE);
    h.change("sorr-mc-withdrawal", "-100000");
    expect(hookState.current.result).toBeNull();
    expect(screen(h)).not.toContain(RESULT_TITLE);
    expect(screen(h)).not.toContain("400,000");
    expect(screen(h)).toContain(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    click(h);
    expect(calls.run).toBe(1); // 처음의 정상 실행 한 번뿐
  });
  it("입력 생성 함수도 음수 생활비를 거부한다(다른 호출 경로 방어)", () => {
    const values = { seed: 1, paths: 100, years: 1, initialAssets: 1_000_000, monthlyWithdrawal: -100_000, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0 };
    expect(() => buildSorrSimulationInput(values)).toThrow(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    expect(buildSorrSimulationInput({ ...values, monthlyWithdrawal: 0 }).cashFlow.monthlyAmount).toBe(-0);
    expect(buildSorrSimulationInput({ ...values, monthlyWithdrawal: 50_000 }).cashFlow.monthlyAmount).toBe(-50_000);
    expect(sorrWithdrawalIssue(-0.01)).toBe(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    for (const ok of [0, 50_000, Number.NaN]) expect(sorrWithdrawalIssue(ok)).toBeNull();
  });
});

describe("월 인출 시뮬레이션 — 생활비는 자산에서 빠진다", () => {
  // 수익률 0 이므로 손계산: 최종 = 시작 자산 − 생활비 × 12
  it("명시적 0원: 최종 1,000,000원, 생존율 100%", () => {
    const h = open("0");
    expect(screen(h)).not.toContain(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    click(h);
    expect(hookState.current.result?.terminal.p50).toBe(1_000_000);
    expect(screen(h)).toContain("중간 결과 (중앙값, 현재 가치) 1,000,000");
    expect(screen(h)).toContain("100.0%");
  });
  it("월 50,000원: 최종 400,000원", () => {
    const h = open("50000");
    click(h);
    expect(hookState.current.result?.terminal.p50).toBe(400_000);
    expect(screen(h)).toContain("중간 결과 (중앙값, 현재 가치) 400,000");
  });
  it("빈칸은 0원으로 계산하지 않고 입력을 기다린다", () => {
    const h = open("");
    expect(screen(h)).not.toContain(SORR_NEGATIVE_WITHDRAWAL_MESSAGE);
    click(h);
    expect(hookState.current.result).toBeNull();
    expect(hookState.current.status).toBe("error");
    expect(screen(h)).not.toContain(RESULT_TITLE);
  });
});
