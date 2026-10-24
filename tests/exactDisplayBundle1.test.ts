import { describe, expect, it } from "vitest";
import { uiHarness, visibleCopy } from "./uiHarness";
import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";
import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";

// 기대값은 독립 기준(Python Fraction, 앱 코드 미사용)으로 계산해 고정했다.
// 표시 규칙은 기존 그대로: Intl(0에서 먼 쪽·뒤쪽 0 생략·쉼표) / toFixed(동점은 큰 쪽·쉼표 없음) / Math.round 후 쉼표.

type H = ReturnType<typeof uiHarness>;
const values = (h: H) =>
  Object.fromEntries(
    h.nodes()
      .filter((n) => typeof n.type === "function" && ["ResultHighlight", "ResultDetail"].includes((n.type as { name: string }).name))
      .map((n) => [String(n.props.label), String(n.props.value)]),
  );
const isValid = (h: H) => {
  const card = h.nodes().find((n) => typeof n.type === "function" && (n.type as { name: string }).name === "ResultCard");
  return Boolean(card?.props.isValid);
};
const text = (h: H) => visibleCopy(h.html()).replace(/\s+/g, "");
const usd = (h: H) => (h.props("CurrencyToggle") as { onChange: (v: string) => void }).onChange("USD");

function target(cur: "KRW" | "USD", buy: string, rate: string) {
  const h = uiHarness(TargetPriceCalculator);
  if (cur === "USD") usd(h);
  h.change("buyPrice", buy);
  h.change("targetRate", rate);
  return h;
}
function stopLoss(buy: string, qty: string, pct: string) {
  const h = uiHarness(StopLossCalculator);
  if (buy) h.change("sl-buy-price", buy);
  if (qty) h.change("sl-quantity", qty);
  if (pct) h.change("sl-percent", pct);
  return h;
}
function breakEven(loss: string) {
  const h = uiHarness(BreakEvenCalculator);
  h.change("lossRate", loss);
  return h;
}
function riskReward(cur: "KRW" | "USD", entry: string, stop: string, tgt: string) {
  const h = uiHarness(RiskRewardCalculator);
  if (cur === "USD") usd(h);
  h.change("entryPrice", entry);
  h.change("stopPrice", stop);
  h.change("targetPrice", tgt);
  return h;
}

describe("목표가 — 정확한 x.5와 큰 금액", () => {
  it("KRW 300원·0.5%: 정확값 301.5 → 302원(주당 수익 1.5 → 2원)", () => {
    expect(values(target("KRW", "300", "0.5"))).toMatchObject({ "목표 가격": "302", "주당 예상 수익": "2", "목표 수익률": "0.5" });
  });
  it("USD 1.15·10%: 목표가 1.265 → 1.27, 주당 수익 0.115 → 0.12", () => {
    expect(values(target("USD", "1.15", "10"))).toMatchObject({ "목표 가격": "1.27", "주당 예상 수익": "0.12" });
    expect(values(target("USD", "1.25", "10"))).toMatchObject({ "목표 가격": "1.38", "주당 예상 수익": "0.13" });
  });
  it("KRW 999,999,999,999,999원·1000% → 10,999,999,999,999,989원", () => {
    expect(values(target("KRW", "999999999999999", "1000"))).toMatchObject({ "목표 가격": "10,999,999,999,999,989", "주당 예상 수익": "9,999,999,999,999,990" });
  });
  it("정상값과 무효 입력은 기존과 같다", () => {
    expect(values(target("KRW", "50000", "15"))).toMatchObject({ "목표 가격": "57,500", "주당 예상 수익": "7,500" });
    expect(values(target("USD", "50", "15"))).toMatchObject({ "목표 가격": "57.5", "주당 예상 수익": "7.5" });
    expect(isValid(target("KRW", "0", "10"))).toBe(false);
    expect(isValid(target("KRW", "-100", "10"))).toBe(false);
    expect(isValid(target("KRW", "100", "0"))).toBe(false);
  });
});

describe("손절가 — 큰 금액·Math.round 동점", () => {
  it("매수가 999,999,999,999원·9,999주·33%: 총 손실 정확값 3,299,669,999,996,700.33 → 3,299,669,999,996,700원", () => {
    expect(values(stopLoss("999999999999", "9999", "33"))).toEqual({
      "손절가": "669,999,999,999원",
      "1주당 손실 금액": "330,000,000,000원",
      "총 손실 금액": "3,299,669,999,996,700원",
      "총 매수 금액": "9,998,999,999,990,001원",
      "총 손실 비율": "33.00%",
    });
  });
  it("정확히 x.5인 손절가는 올린다(10,030원·5% → 9,528.5 → 9,529원)", () => {
    expect(values(stopLoss("10030", "1", "5"))).toMatchObject({ "손절가": "9,529원", "1주당 손실 금액": "502원" });
  });
  it("100% 경계·0·빈칸 안내는 기존과 같다", () => {
    expect(text(stopLoss("100", "10", "100"))).toContain("손절비율은100%미만이어야합니다.");
    expect(text(stopLoss("100", "10", "100.0001"))).toContain("손절비율은100%미만이어야합니다.");
    expect(text(stopLoss("0", "10", "5"))).toContain("매수가는0보다큰값이어야합니다.");
    expect(values(stopLoss("100", "10", "99.999"))).toMatchObject({ "손절가": "0원", "총 손실 비율": "100.00%" });
    expect(values(stopLoss("100000", "10", "5"))).toMatchObject({ "손절가": "95,000원", "총 손실 금액": "50,000원", "총 손실 비율": "5.00%" });
  });
});

describe("본전 회복 — 뺄셈 상쇄 없이 정확히", () => {
  it("20% → +25.00%, 50% → +100.00%", () => {
    expect(values(breakEven("20"))["본전 회복 요구 상승률"]).toBe("+25.00");
    expect(values(breakEven("50"))["본전 회복 요구 상승률"]).toBe("+100.00");
  });
  it("99.9999999999% → +99999999999900.00%(결과 카드와 설명 문장 모두)", () => {
    const h = breakEven("99.9999999999");
    expect(values(h)["본전 회복 요구 상승률"]).toBe("+99999999999900.00");
    expect(text(h)).toContain("현재-99.9999999999%손실상태에서원금을회복하려면,남은자금으로무려+99999999999900.00%의수익을내야합니다.");
  });
  it("100에 아주 가까운 손실률도 0~100 사이면 계산하고, 0·100·음수·빈칸은 결과를 숨긴다", () => {
    expect(values(breakEven("99.999999999999999999"))["본전 회복 요구 상승률"]).toBe("+9999999999999999999900.00");
    for (const v of ["0", "100", "100.0001", "-20"]) expect(isValid(breakEven(v))).toBe(false);
  });
  it("설명 문장의 손실률은 입력 십진값 그대로 표시한다(0.00000001%를 1e-8%로 바꾸지 않음)", () => {
    expect(text(breakEven("0.00000001"))).toContain("현재-0.00000001%손실");
    expect(text(breakEven("20.50"))).toContain("현재-20.5%손실상태에서원금을회복하려면,남은자금으로무려+25.79%");
  });
});

describe("손익비 — 정확한 x.005와 큰 비율", () => {
  it("진입 100·손절 99·목표 100.005: 손익비 0.005 → 0.01 R, 승률 99.5%(카드와 문장 일치)", () => {
    const h = riskReward("KRW", "100", "99", "100.005");
    expect(values(h)).toMatchObject({ "손익비": "0.01", "리스크 금액": "1", "보상 금액": "0", "손익분기 승률": "99.5" });
    expect(text(h)).toContain("손익분기승률(99.5%)을넘어야");
    expect(values(riskReward("USD", "100", "99", "100.005"))).toMatchObject({ "손익비": "0.01", "보상 금액": "0.01" });
  });
  it("진입 0.0003·손절 0.00027·목표 1,094,664,223,873 → 36488807462433323.33 R", () => {
    expect(values(riskReward("KRW", "0.0003", "0.00027", "1094664223873"))).toMatchObject({
      "손익비": "36488807462433323.33", "보상 금액": "1,094,664,223,873", "손익분기 승률": "0.0",
    });
  });
  it("USD 금액 동점(0.005 → 0.01)과 정상값·무효 입력", () => {
    expect(values(riskReward("USD", "1", "0.995", "1.005"))).toMatchObject({ "손익비": "1.00", "리스크 금액": "0.01", "보상 금액": "0.01", "손익분기 승률": "50.0" });
    expect(values(riskReward("KRW", "50000", "47000", "56000"))).toMatchObject({ "손익비": "2.00", "리스크 금액": "3,000", "보상 금액": "6,000", "손익분기 승률": "33.3" });
    expect(isValid(riskReward("KRW", "100", "100", "110"))).toBe(false);
    expect(isValid(riskReward("KRW", "100", "90", "100"))).toBe(false);
  });
});
