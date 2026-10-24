import { describe, expect, it } from "vitest";
import { uiHarness, visibleCopy } from "./uiHarness";
import CryptoAverageCalculator from "@/components/calculator/CryptoAverageCalculator";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CryptoProfitCalculator from "@/components/calculator/CryptoProfitCalculator";
import CryptoLiquidationCalculator from "@/components/calculator/CryptoLiquidationCalculator";
import CryptoLeverageProfitCalculator from "@/components/calculator/CryptoLeverageProfitCalculator";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import { calculateLeverageProfit } from "@/lib/cryptoLeverageProfit";
import { calculateFundingFee } from "@/lib/fundingFee";

// 기대값은 독립 기준(Python Fraction, 앱 코드 미사용)으로 계산해 고정했다.
// 표시 규칙은 기존 그대로다.
//  - Intl ko-KR 최대 d자리: 0에서 먼 쪽, 뒤쪽 0 생략, 쉼표
//  - 표 고정 2자리
//  - toFixed(2)
//  - 가격: 1 미만은 유효숫자 4자리, 그 밖은 소수 2자리
// 부호·색·분기는 반올림 전 정확값으로 판정한다.

type H = ReturnType<typeof uiHarness>;
type N = ReturnType<H["nodes"]>[number];
const fname = (n: N) => (typeof n.type === "function" ? (n.type as { name: string }).name : "");
const items = (h: H) =>
  h.nodes()
    .filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n)))
    .map((n) => [String(n.props.label), String(n.props.value), String(n.props.unit ?? "")]);
const value = (h: H, label: string) => items(h).find(([l]) => l === label)?.[1];
const isValid = (h: H) => Boolean(h.nodes().find((n) => fname(n) === "ResultCard")?.props.isValid);
const tones = (h: H) => h.nodes().filter((n) => fname(n) === "ResultHighlight").map((n) => n.props.tone);
const text = (h: H) => visibleCopy(h.html().replace(/<wbr\s*\/?>/gi, "")).replace(/\s+/g, " ");
const fill = (h: H, fields: Record<string, string>) => {
  for (const [id, v] of Object.entries(fields)) if (v !== "") h.change(id, v);
  return h;
};
const select = (h: H, from: string, to: string) => {
  const s = h.nodes().find((n) => n.type === "select" && n.props.value === from);
  (s?.props.onChange as (e: unknown) => void)({ target: { value: to } });
};
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" || typeof x === "number" ? String(x) : "");
const click = (h: H, name: string) => {
  const b = h.nodes().find((n) => n.type === "button" && label(n.props.children).includes(name));
  (b?.props.onClick as () => void)();
};
const rowsOf = (html: string, table: number) =>
  [...([...html.matchAll(/<table[\s\S]*?<\/table>/g)][table]?.[0] ?? "").matchAll(/<tr([^>]*)>([\s\S]*?)<\/tr>/g)]
    .slice(1)
    .map((r) => ({ current: r[1].includes("bg-slate-50"), cells: [...r[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()) }));

const average = (rows: [string, string][], currentPrice = "", krw = false) => {
  const h = uiHarness(CryptoAverageCalculator);
  if (krw) (h.props("CurrencyToggle") as { onChange: (v: string) => void }).onChange("KRW");
  rows.forEach(([p, q], i) => fill(h, { [`c-price-${i + 1}`]: p, [`c-qty-${i + 1}`]: q }));
  return fill(h, { "c-currentPrice": currentPrice });
};
const entry = (entryPrice: string, stopPrice: string, seed: string, riskPercent: string, rewardRatio: string) =>
  fill(uiHarness(CryptoEntryCalculator), { entryPrice, stopPrice, seed, riskPercent, rewardRatio });
const profit = (buyPrice: string, sellPrice: string, quantity: string, buyFeeRate: string, sellFeeRate: string) =>
  fill(uiHarness(CryptoProfitCalculator), { buyPrice, sellPrice, quantity, buyFeeRate, sellFeeRate });
const liquidation = (entryPrice: string, leverage: string, maintenanceMarginRate: string, side = "long") => {
  const h = uiHarness(CryptoLiquidationCalculator);
  if (side === "short") select(h, "long", "short");
  return fill(h, { entryPrice, leverage, maintenanceMarginRate });
};
const leverage = (entryPrice: string, exitPrice: string, margin: string, lev: string, feeRate: string, side = "long") => {
  const h = uiHarness(CryptoLeverageProfitCalculator);
  if (side === "short") select(h, "long", "short");
  return fill(h, { entryPrice, exitPrice, margin, leverage: lev, feeRate });
};
const funding = (positionSize: string, fundingRate: string, fundingCount: string, side = "long") => {
  const h = uiHarness(CryptoFundingFeeCalculator);
  if (side === "short") select(h, "long", "short");
  return fill(h, { positionSize, fundingRate, fundingCount });
};

describe("코인 평균가 — 행별 합산과 가격 표시", () => {
  it("C-1: [10.01, 0.5]+[10, 0.5] → 평균 10.005 → 10.01, 총 매수 10.01, 평가 손익 −0.005 → −0.01", () => {
    const h = average([["10.01", "0.5"], ["10", "0.5"]], "10");
    expect([value(h, "새 평균 단가"), value(h, "총 매수 금액"), value(h, "평가 손익"), value(h, "수익률")]).toEqual(["10.01", "10.01", "-0.01", "-0.05"]);
    expect(tones(h)).toEqual(["default", "negative"]);
  });
  it("C-1: 1 × 2,965.6225, 현재가 31,935(KRW) → 평가 손익 +94,704,188.915 → +94,704,188.92", () => {
    expect(value(average([["1", "2965.6225"]], "31935", true), "평가 손익")).toBe("+94,704,188.92");
  });
  it("C-2: 총 매수 금액 999,998,999,999,000,002, 평가 손익 +999,999,999,998", () => {
    const h = average([["999999999999", "999999"], ["1", "1"]], "999999999999");
    expect([value(h, "총 매수 금액"), value(h, "평가 손익")]).toEqual(["999,998,999,999,000,002", "+999,999,999,998"]);
  });
  it("평단가 방향·0 손익은 정확값으로: 0.0001 × 0.0001 한 행은 '변동 없음', 손익 정확히 0은 +0", () => {
    expect(text(average([["0.0001", "0.0001"]], "0.0002"))).toContain("평단가 변동 없음");
    const zero = average([["10.01", "0.5"], ["10", "0.5"]], "10.005");
    expect([value(zero, "평가 손익"), value(zero, "수익률"), tones(zero)[1]]).toEqual(["+0", "+0.00", "positive"]);
  });
  it("가격 유효숫자 4자리 동점과 1 경계: 0.00085975 → 0.0008598, 0.99995 → 1", () => {
    expect(value(average([["0.0008598", "1"], ["0.0008597", "1"]]), "새 평균 단가")).toBe("0.0008598");
    expect(value(average([["0.99995", "3"]]), "새 평균 단가")).toBe("1");
  });
  it("행 조작은 그대로: 빈 행 제외·부분 입력 차단·최대 10행·초기화", () => {
    const h = average([["100", "1"], ["", ""]], "150");
    expect(isValid(h)).toBe(true);
    h.change("c-price-2", "200");
    expect(isValid(h)).toBe(false);
    for (let i = 0; i < 12; i++) click(h, "추가 매수 입력");
    expect(h.nodes().filter((n) => fname(n) === "InputField" && String(n.props.id).startsWith("c-price-")).length).toBe(10);
    expect(text(h)).toContain("최대 10회까지 입력할 수 있습니다.");
    click(h, "초기화");
    expect([isValid(h), h.nodes().filter((n) => fname(n) === "InputField" && String(n.props.id).startsWith("c-price-")).length]).toEqual([false, 2]);
  });
});

describe("코인 진입 — 결과 카드와 두 표", () => {
  it("C-1: 익절가 38,600.83935 → 38,600.8394(결과 카드와 표1 1:1.1 행)", () => {
    const h = entry("38180.85", "37799.0415", "5998.31", "0.2", "1.1");
    expect(value(h, "익절가")).toBe("38,600.8394");
    expect(rowsOf(h.html(), 0)[0]).toEqual({ current: true, cells: ["1 : 1.1", "38,600.8394", "+13.20"] });
  });
  it("C-2: 주문 명목가치 119,324,631,022.432와 표1·표2 값", () => {
    const h = entry("1406.48", "1392.4152", "35095479712.48", "3.4", "2");
    expect(value(h, "주문 명목가치")).toBe("119,324,631,022.432");
    expect(rowsOf(h.html(), 0).slice(0, 2).map((r) => r.cells)).toEqual([
      ["1 : 1.1", "1,421.9513", "+1,312,570,941.25"],
      ["1 : 2", "1,434.6096", "+2,386,492,620.45"],
    ]);
    expect(rowsOf(h.html(), 1)[1].cells[0]).toBe("1회");
  });
  it("현재 손익비 행은 정확값으로 병합·강조: 2.0000000000000001은 2와 다른 한 행", () => {
    const rows = rowsOf(entry("100", "99", "1000", "1", "2.0000000000000001").html(), 0);
    expect(rows.filter((r) => r.current).map((r) => r.cells[0])).toEqual(["1 : 2.0000000000000001"]);
    expect(rows.map((r) => r.cells[0]).slice(0, 3)).toEqual(["1 : 1.1", "1 : 2", "1 : 2.0000000000000001"]);
    const dup = rowsOf(entry("100", "99", "1000", "1", "2.0").html(), 0);
    expect([dup.length, dup.filter((r) => r.current).map((r) => r.cells[0])]).toEqual([10, ["1 : 2"]]);
  });
  it("유효성은 정확값으로: 진입가 1.00000000000000001 > 손절가 1이면 계산, 같으면 숨김", () => {
    const h = entry("1.00000000000000001", "1", "1000", "1", "2");
    expect([isValid(h), value(h, "이론 배율")]).toEqual([true, "100,000,000,000,000,001"]);
    expect(isValid(entry("100", "100", "1000", "1", "2"))).toBe(false);
    expect(isValid(entry("100", "99", "1000", "100", "2"))).toBe(false);
  });
});

describe("코인 수익 — 매수·매도 수수료와 순손익", () => {
  it("C-1: 100→110, 수수료 0.05%/0.05% → 9.895 → 9.9, 0.1%/0.05% → 9.845 → 9.85", () => {
    expect(value(profit("100", "110", "1", "0.05", "0.05"), "실제 순손익")).toBe("9.9");
    expect(value(profit("100", "110", "1", "0.1", "0.05"), "실제 순손익")).toBe("9.85");
  });
  it("C-2: 순손익 2,312,817,458,296,528,974.25와 큰 값 항목", () => {
    const h = profit("0.0236", "8844652875", "261624111", "0.05", "0.05");
    expect(items(h).slice(0, 4)).toEqual([
      ["실제 순손익", "2,312,817,458,296,528,974.25", "USDT"],
      ["총 매수 금액(수수료 포함)", "6,177,416.18", "USDT"],
      ["총 매도 금액(수수료 차감)", "2,312,817,458,302,706,390.44", "USDT"],
      ["총 수수료", "1,156,987,222,765,821.73", "USDT"],
    ]);
  });
  it("순손익 0은 기본 색, 수수료 빈칸은 미입력", () => {
    const h = profit("100", "100", "1", "0", "0");
    expect([value(h, "실제 순손익"), tones(h)]).toEqual(["0", ["default"]]);
    expect(isValid(profit("100", "110", "1", "0.1", ""))).toBe(false);
  });
});

describe("코인 청산가 — 격리마진 근사식(현재 그대로)", () => {
  it("C-1: 파산가 0.00085975 → 0.0008598, 변동 폭 14.625 → 14.63", () => {
    expect(value(liquidation("0.000905", "20", "0.5"), "파산 가격(이론값)")).toBe("0.0008598");
    expect(value(liquidation("4013.91", "6.4", "1"), "진입가 대비 변동 폭")).toBe("14.63");
  });
  it("C-2: 숏 청산가 33,377,721,726,515.67", () => {
    expect(value(liquidation("30481937649786", "10", "0.5", "short"), "격리마진 근사 청산가")).toBe("33,377,721,726,515.67");
  });
  it("가격 1 경계·경고 구간·무효 조건은 그대로", () => {
    expect(value(liquidation("1.05258", "20", "0"), "격리마진 근사 청산가")).toBe("1");
    expect(text(liquidation("100", "10", "0.5"))).toContain("레버리지가 높습니다.");
    expect(text(liquidation("100", "9.999999", "0.5"))).not.toContain("레버리지가 높습니다.");
    expect(isValid(liquidation("100", "1", "100"))).toBe(false);
  });
});

describe("레버리지 수익 — 롱·숏 손익과 양쪽 수수료", () => {
  it("C-1: 총 수수료 9.505 → 9.51(롱·숏)", () => {
    expect(value(leverage("100", "90.1", "1000", "10", "0.05"), "총 수수료")).toBe("9.51");
    expect(value(leverage("100", "90.1", "1000", "10", "0.05", "short"), "총 수수료")).toBe("9.51");
  });
  it("C-2: 숏 순손익 −67,940,779,480,352,685,111.61", () => {
    const h = leverage("137.32", "17527678479", "5320668999.85", "100", "0.04", "short");
    expect([value(h, "실제 순손익"), value(h, "수수료 반영 전 손익"), value(h, "총 수수료")]).toEqual([
      "-67,940,779,480,352,685,111.61", "-67,913,614,034,313,306,269.11", "27,165,446,039,378,842.5",
    ]);
  });
  it("Number API는 정확값에 가장 가까운 Number를 돌려준다", () => {
    const r = calculateLeverageProfit({ entryPrice: 100, exitPrice: 90.1, margin: 1000, leverage: 10, feeRatePercent: 0.05, position: "long" });
    expect([r.valid, r.totalFee, r.exitFee, r.netPnl, r.beyondLiquidation]).toEqual([true, 9.505, 4.505, -999.505, false]);
    expect(calculateLeverageProfit({ entryPrice: 100, exitPrice: 90, margin: 1000, leverage: 10, feeRatePercent: 0, position: "long" }).beyondLiquidation).toBe(false);
  });
});

describe("펀딩비 — 지급·수취 부호와 큰 금액", () => {
  it("C-2: 2,190,159,001,826,661,387 × 0.0050%(롱) → 회당 −109,507,950,091,333.07", () => {
    const h = funding("2190159001826661387", "0.0050", "1");
    expect(items(h)).toEqual([
      ["총 예상 펀딩비 (지급)", "-109,507,950,091,333.07", "USDT"],
      ["1회당 펀딩비", "-109,507,950,091,333.07", "USDT"],
      ["누적 펀딩비", "-109,507,950,091,333.07", "USDT"],
    ]);
    expect(calculateFundingFee({ positionSize: "2190159001826661387", fundingRate: "0.0050", fundingCount: "1", positionType: "long" }).netOneTime).toBe(-109507950091333.06935);
  });
  it("요율 빈칸·0·음수와 아주 작은 수령은 기존 규칙(+0, 수령)", () => {
    expect(isValid(funding("10000", "", "3"))).toBe(false);
    expect(items(funding("10000", "0", "3"))[0]).toEqual(["총 예상 펀딩비 (지급·수령 없음)", "0", "USDT"]);
    const up = funding("0.0001", "-0.0001", "1");
    expect([items(up)[0], tones(up)]).toEqual([["총 예상 펀딩비 (수령)", "+0", "USDT"], ["positive"]]);
    expect(items(funding("100", "0.005", "1", "short"))[0]).toEqual(["총 예상 펀딩비 (수령)", "+0.01", "USDT"]);
  });
});
