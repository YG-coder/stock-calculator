import { describe, expect, it, vi } from "vitest";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
import { uiHarness } from "./uiHarness";

// 복리 계산기의 통화별 표시 자릿수: USD 는 센트(소수 둘째 자리)까지, KRW 는 정수 원.
// 회귀: 세 항목 모두 소수 0자리로 표시해 100.50달러가 101, 수익 0.12달러가 0 으로 보였다.
// 결과 카드의 각 라벨(ResultHighlight·ResultDetail)에 대응하는 금액과 단위를 읽는다.
vi.mock("next/navigation", () => ({ usePathname: () => "/compound-interest-calculator" }));

type H = ReturnType<typeof uiHarness>;
const fname = (type: unknown) => (typeof type === "function" ? type.name : "");
/** 라벨 → "금액 단위" */
function card(h: H): Record<string, string> {
  const out: Record<string, string> = {};
  for (const n of h.nodes().filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n.type)))) {
    out[String(n.props.label)] = `${String(n.props.value)} ${String(n.props.unit)}`;
  }
  return out;
}
const setCurrency = (h: H, currency: "KRW" | "USD") => (h.nodes().find((n) => fname(n.type) === "CurrencyToggle")!.props.onChange as (c: string) => void)(currency);
function open(currency: "KRW" | "USD", inputs: { initial: string; monthly: string; rate: string; years: string }): H {
  const h = uiHarness(CompoundInterestCalculator);
  setCurrency(h, currency);
  for (const [id, value] of Object.entries(inputs)) h.change(id, value);
  return h;
}

const NO_RETURN = { initial: "100.50", monthly: "0", rate: "0", years: "1" };
const SMALL_RETURN = { initial: "100", monthly: "0", rate: "0.12", years: "1" };

describe("복리 계산기 — USD 결과의 센트 표시", () => {
  it("100.50달러·수익률 0%: 최종 자산과 총 투자금은 100.5 USD, 총 수익은 0 USD", () => {
    expect(card(open("USD", NO_RETURN))).toEqual({ "최종 자산": "100.5 USD", "총 투자금": "100.5 USD", "총 수익": "0 USD" });
  });
  it("100달러·연 0.12%·1년: 최종 자산 100.12 USD, 총 투자금 100 USD, 총 수익 0.12 USD", () => {
    // 독립 검산: 100 × (1 + 0.0012 ÷ 12)¹² = 100.12006…, 수익 0.12006… → 센트 반올림 100.12 / 0.12
    const total = 100 * (1 + 0.0012 / 12) ** 12;
    expect(total).toBeGreaterThan(100.12);
    expect(total).toBeLessThan(100.1201);
    expect(total.toFixed(2)).toBe("100.12");
    expect((total - 100).toFixed(2)).toBe("0.12");
    expect(card(open("USD", SMALL_RETURN))).toEqual({ "최종 자산": "100.12 USD", "총 투자금": "100 USD", "총 수익": "0.12 USD" });
  });
  it("센트 아래는 화면에서만 반올림한다(셋째 자리 이하는 표시하지 않음)", () => {
    // 100 × (1 + 0.07 ÷ 12)¹² = 107.22900…
    const shown = card(open("USD", { initial: "100", monthly: "0", rate: "7", years: "1" }));
    expect(shown["최종 자산"]).toBe("107.23 USD");
    expect(shown["총 수익"]).toBe("7.23 USD");
  });
});

describe("복리 계산기 — 통화 전환", () => {
  it("같은 입력에서 KRW 는 원 단위, 다시 USD 로 바꾸면 센트가 돌아온다", () => {
    const h = open("USD", SMALL_RETURN);
    expect(card(h)["최종 자산"]).toBe("100.12 USD");
    setCurrency(h, "KRW");
    expect(card(h)).toEqual({ "최종 자산": "100 원", "총 투자금": "100 원", "총 수익": "0 원" });
    setCurrency(h, "USD");
    expect(card(h)).toEqual({ "최종 자산": "100.12 USD", "총 투자금": "100 USD", "총 수익": "0.12 USD" });
  });
  it("KRW 는 기존처럼 정수 원으로 표시한다", () => {
    // 1,000만 원·월 0·연 7%·1년: 10,000,000 × (1 + 0.07 ÷ 12)¹² = 10,722,900.8…
    expect(card(open("KRW", { initial: "10000000", monthly: "0", rate: "7", years: "1" }))).toEqual({ "최종 자산": "10,722,901 원", "총 투자금": "10,000,000 원", "총 수익": "722,901 원" });
  });
});
