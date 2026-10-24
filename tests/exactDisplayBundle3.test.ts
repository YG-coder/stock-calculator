import { describe, expect, it } from "vitest";
import { uiHarness, visibleCopy } from "./uiHarness";
import DividendCalculator from "@/components/calculator/DividendCalculator";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import USExchangeProfitCalculator from "@/components/calculator/USExchangeProfitCalculator";
import StockTransactionTaxCalculator from "@/components/calculator/StockTransactionTaxCalculator";
import { calculateUsDividend } from "@/lib/usDividend";
import { calculateStockTransactionTax } from "@/lib/stockTransactionTax";

// 기대값은 독립 기준(Python Fraction, 앱 코드 미사용)으로 계산해 고정했다.
// 표시 규칙은 기존 그대로: Intl ko-KR 최대 2자리(증권거래세 0자리)·0에서 먼 쪽·뒤쪽 0 생략·쉼표, 증권거래세는 세목별 원 미만 내림.

type H = ReturnType<typeof uiHarness>;
type N = ReturnType<H["nodes"]>[number];
const fname = (n: N) => (typeof n.type === "function" ? (n.type as { name: string }).name : "");
const items = (h: H) =>
  h.nodes()
    .filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n)))
    .map((n) => [String(n.props.label), String(n.props.value), String(n.props.unit ?? "")]);
const value = (h: H, label: string, unit?: string) => items(h).find(([l, , u]) => l === label && (unit === undefined || u === unit))?.[1];
const isValid = (h: H) => Boolean(h.nodes().find((n) => fname(n) === "ResultCard")?.props.isValid);
const tone = (h: H) => h.nodes().find((n) => fname(n) === "ResultHighlight")?.props.tone;
const text = (h: H) => visibleCopy(h.html()).replace(/\s+/g, "");
const fill = (h: H, fields: Record<string, string>) => {
  for (const [id, v] of Object.entries(fields)) if (v !== "") h.change(id, v);
  return h;
};
const dividend = (cur: "KRW" | "USD", shares: string, dividendPerShare: string, buyPrice: string, taxRate: string) => {
  const h = uiHarness(DividendCalculator);
  if (cur === "USD") (h.props("CurrencyToggle") as { onChange: (v: string) => void }).onChange("USD");
  return fill(h, { shares, dividendPerShare, buyPrice, taxRate });
};
const usDividend = (shares: string, annualDividendPerShareUsd: string, buyPriceUsd: string, exchangeRate: string, withholdingTaxRate: string) =>
  fill(uiHarness(USDividendCalculator), { shares, annualDividendPerShareUsd, buyPriceUsd, exchangeRate, withholdingTaxRate });
const usx = (buyPriceUsd: string, sellPriceUsd: string, quantity: string, buyExchangeRate: string, sellExchangeRate: string, buyFeeKrw = "", sellFeeKrw = "") =>
  fill(uiHarness(USExchangeProfitCalculator), { buyPriceUsd, sellPriceUsd, quantity, buyExchangeRate, sellExchangeRate, buyFeeKrw, sellFeeKrw });
const stt = (market: string, saleAmount: string) => fill(uiHarness(StockTransactionTaxCalculator), { market, saleAmount });

describe("배당 — 정확한 곱셈과 세후 계산", () => {
  it("C-1: USD 5,729.5주 × 36,915.59 = 211,507,872.905 → 211,507,872.91", () => {
    expect(value(dividend("USD", "5729.5", "36915.59", "26398.26", "22"), "세전 총 배당금")).toBe("211,507,872.91");
  });
  it("C-2: 큰 수량·배당금의 세전·세금·세후가 끝자리까지 정확하다", () => {
    expect(items(dividend("USD", "373839684036", "44119603238239", "10439.87", "6.1")).slice(0, 3)).toEqual([
      ["세후 총 배당금", "15,487,545,363,779,956,231,276,395.16", "USD"],
      ["세전 총 배당금", "16,493,658,534,376,950,193,052,604", "USD"],
      ["세금", "1,006,113,170,596,993,961,776,208.84", "USD"],
    ]);
  });
  it("정상값·세율 0·무배당은 기존과 같고, 세율 빈칸·100%·음수 배당은 결과를 숨긴다", () => {
    expect(items(dividend("KRW", "100", "500", "10000", "15.4"))).toEqual([
      ["세후 총 배당금", "42,300", "원"], ["세전 총 배당금", "50,000", "원"], ["세금", "7,700", "원"],
      ["총 투자금", "1,000,000", "원"], ["세전 배당수익률", "5", "%"], ["세후 배당수익률", "4.23", "%"],
    ]);
    expect(value(dividend("KRW", "100", "500", "10000", "0"), "세금")).toBe("0");
    expect(value(dividend("KRW", "100", "0", "10000", "15.4"), "세후 총 배당금")).toBe("0");
    expect(text(dividend("KRW", "100", "500", "10000", ""))).toContain("세율을비워두면세후금액을계산할수없습니다.");
    for (const h of [dividend("KRW", "100", "500", "10000", "100"), dividend("KRW", "100", "-1", "10000", "15"), dividend("KRW", "0", "500", "10000", "15")]) expect(isValid(h)).toBe(false);
  });
});

describe("미국주식 배당 — 환율·월 환산 전 중간 반올림 없음", () => {
  it("C-1: 연간 세전 배당금(원) 정확값 129,161,474.985 → 129,161,474.99", () => {
    expect(value(usDividend("197.0", "447.69", "24135081694.66", "1464.50", "7.2"), "연간 세전 배당금", "원")).toBe("129,161,474.99");
  });
  it("C-2: 월 예상 세후 배당금 1,443,614,325,079,004.1289… → 1,443,614,325,079,004.13원", () => {
    const h = usDividend("12323880111", "1267.83", "0.0006", "1133.55", "2.19");
    expect(value(h, "월 예상 세후 배당금")).toBe("1,443,614,325,079,004.13");
    expect(value(h, "연간 세후 배당금", "원")).toBe("17,323,371,900,948,049.55");
  });
  it("주당 배당금 빈칸은 미입력, 명시적 0은 무배당. 세율 빈칸과 0%를 구분한다", () => {
    const base = { shares: "100", buyPriceUsd: "50", exchangeRate: "1350" };
    expect(calculateUsDividend({ ...base, annualDividendPerShareUsd: "", withholdingTaxRate: "15" }).missingFields).toEqual(["annualDividendPerShareUsd"]);
    expect(calculateUsDividend({ ...base, annualDividendPerShareUsd: "2", withholdingTaxRate: "" }).missingFields).toEqual(["withholdingTaxRate"]);
    expect(value(usDividend("100", "0", "50", "1350", "15"), "월 예상 세후 배당금")).toBe("0");
    expect(value(usDividend("100", "2", "50", "1350", "0"), "원천징수 세금")).toBe("0");
    expect(items(usDividend("100", "2", "50", "1350", "15"))[0]).toEqual(["월 예상 세후 배당금", "19,125", "원"]);
    expect(text(usDividend("100", "2", "50", "1350", ""))).toContain("원천징수가없다면0을입력하세요.");
  });
});

describe("미국주식 환율 수익 — 곱셈·뺄셈 정확 계산과 부호", () => {
  it("C-1: 달러 손익 −6.955 → −6.96, 원화 손익 0.005 → +0.01", () => {
    expect(value(usx("0.6956", "0.0001", "10", "1070.13", "1326.33", "51674", "350"), "달러 기준 손익")).toBe("-6.96");
    const h = usx("0.01", "0.015", "1", "1", "1", "0", "0");
    expect(value(h, "원화 기준 실제 손익")).toBe("+0.01");
    expect(tone(h)).toBe("positive");
  });
  it("C-2: 환율 효과 정확히 10,000,000,000원, 비슷한 큰 값의 뺄셈", () => {
    expect(value(usx("1000000", "1000000", "1000000", "1400", "1400.01", "0", "0"), "환율 효과 (수수료 제외)")).toBe("+10,000,000,000");
    const h = usx("123456789.12", "123456789.13", "987654321", "1399.99", "1400", "0", "0");
    expect(value(h, "원화 기준 실제 손익")).toBe("+1,219,340,139,472,031.88");
    expect(value(h, "달러 기준 손익")).toBe("+9,876,543.21");
  });
  it("정확한 0은 부호 없이 0·default, 아주 작은 손익은 기존 규칙대로 +0·−0과 색", () => {
    const zero = usx("100", "100", "10", "1350", "1350", "0", "0");
    expect(value(zero, "원화 기준 실제 손익")).toBe("0");
    expect(tone(zero)).toBe("default");
    const up = usx("100", "100.0001", "1", "1", "1");
    expect([value(up, "원화 기준 실제 손익"), tone(up)]).toEqual(["+0", "positive"]);
    const down = usx("100.0001", "100", "1", "1", "1");
    expect([value(down, "원화 기준 실제 손익"), tone(down)]).toEqual(["-0", "negative"]);
  });
  it("정상값·수수료 빈칸(0)·잘못된 수수료는 기존과 같다", () => {
    expect(items(usx("100", "120", "10", "1350", "1380", "5000", "5000"))).toEqual([
      ["원화 기준 실제 손익", "+296,000", "원"], ["총 매수 금액", "1,000", "USD"], ["총 매도 금액", "1,200", "USD"],
      ["원화 매수 금액", "1,355,000", "원"], ["원화 매도 금액", "1,651,000", "원"], ["달러 기준 손익", "+200", "USD"],
      ["원화 기준 수익률", "21.85", "%"], ["환율 효과 (수수료 제외)", "+36,000", "원"], ["매매 수수료 합계", "10,000", "원"],
    ]);
    expect(value(usx("100", "120", "10", "1350", "1380"), "매매 수수료 합계")).toBe("0");
    expect(isValid(usx("100", "120", "10", "1350", "1380", "-", "0"))).toBe(false);
    expect(isValid(usx("100", "120", "10", "1350", "1380", "0", "-1"))).toBe(false);
  });
});

describe("증권거래세 — 세목별 원 미만 내림 순서 유지, 큰 금액 정확", () => {
  it("C-2: 코스피 99,999,999,999,999,999,999원 → 거래세·농특세 각각 내림 후 합계 199,999,999,999,999,998원", () => {
    expect(items(stt("kospi", "99999999999999999999"))).toEqual([
      ["예상 세금 합계", "199,999,999,999,999,998", "원"], ["증권거래세", "49,999,999,999,999,999", "원"],
      ["농어촌특별세", "149,999,999,999,999,999", "원"], ["합산 세율", "0.20", "%"], ["세금 차감 후 금액", "99,800,000,000,000,000,001", "원"],
    ]);
    // 기존 Number API도 같은 순서(세목별 내림 → 합산)를 유지한다.
    expect(calculateStockTransactionTax(999_999, "kospi")).toMatchObject({ transactionTax: 499, ruralTax: 1_499, totalTax: 1_998, netProceeds: 998_001 });
  });
  it("절사 경계 바로 아래: 197,530,864,217,999.99원 코스피 → 98,765,432,108 + 296,296,296,326", () => {
    expect(items(stt("kospi", "197530864217999.99")).slice(0, 3)).toEqual([
      ["예상 세금 합계", "395,061,728,434", "원"], ["증권거래세", "98,765,432,108", "원"], ["농어촌특별세", "296,296,296,326", "원"],
    ]);
  });
  it("정상값·시장별 세율·0원·빈칸은 기존과 같다", () => {
    expect(value(stt("kospi", "999999"), "예상 세금 합계")).toBe("1,998");
    for (const [m, tax, rate] of [["kosdaq", "20,000", "0.20"], ["konex", "10,000", "0.10"], ["kotc", "20,000", "0.20"], ["unlisted", "35,000", "0.35"]]) {
      const h = stt(m, "10000000");
      expect([value(h, "예상 세금 합계"), value(h, "합산 세율")]).toEqual([tax, rate]);
    }
    expect(isValid(stt("kospi", "0"))).toBe(false);
    expect(isValid(stt("kospi", ""))).toBe(false);
    expect(isValid(stt("kospi", "-100"))).toBe(false);
  });
});
