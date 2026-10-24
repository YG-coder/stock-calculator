import { describe, expect, it } from "vitest";
import { uiHarness, visibleCopy } from "./uiHarness";
import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
import ProfitCalculator from "@/components/calculator/ProfitCalculator";
import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";

// 기대값은 독립 기준(Python Fraction, 앱 코드 미사용)으로 계산해 고정했다.
// 표시 규칙은 기존 그대로: 금액 Intl(KRW 0·USD 2자리, 0에서 먼 쪽·뒤쪽 0 생략·쉼표), 수량 4자리, 비율 toFixed.
// 부호·물타기 안내·자본 초과 분기는 반올림 전 정확값으로 판정한다.

type H = ReturnType<typeof uiHarness>;
type N = ReturnType<H["nodes"]>[number];
const fname = (n: N) => (typeof n.type === "function" ? (n.type as { name: string }).name : "");
const values = (h: H) =>
  Object.fromEntries(
    h.nodes()
      .filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n)))
      .map((n) => [String(n.props.label), String(n.props.value)]),
  );
const tone = (h: H) => h.nodes().find((n) => fname(n) === "ResultHighlight" && n.props.label === "평가 손익")?.props.tone;
const isValid = (h: H) => Boolean(h.nodes().find((n) => fname(n) === "ResultCard")?.props.isValid);
const text = (h: H) => visibleCopy(h.html()).replace(/\s+/g, "");
const usd = (h: H) => (h.props("CurrencyToggle") as { onChange: (v: string) => void }).onChange("USD");
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" ? x : "");
const click = (h: H, pred: (n: N) => boolean) => (h.nodes().find((n) => n.type === "button" && pred(n))!.props.onClick as () => void)();
const priceIds = (h: H) => h.nodes().filter((n) => fname(n) === "InputField" && String(n.props.id).startsWith("price-")).map((n) => String(n.props.id));

function average(cur: "KRW" | "USD", rows: [string, string][], current?: string) {
  const h = uiHarness(AveragePriceCalculator);
  if (cur === "USD") usd(h);
  for (let i = 2; i < rows.length; i++) click(h, (n) => label(n.props.children).includes("추가 매수 입력"));
  rows.forEach(([p, q], i) => {
    const id = priceIds(h)[i].slice("price-".length);
    if (p) h.change(`price-${id}`, p);
    if (q) h.change(`qty-${id}`, q);
  });
  if (current !== undefined) h.change("currentPrice", current);
  return h;
}
function profit(cur: "KRW" | "USD", buy: string, current: string, qty: string) {
  const h = uiHarness(ProfitCalculator);
  if (cur === "USD") usd(h);
  h.change("buyPrice", buy);
  h.change("currentPrice", current);
  h.change("quantity", qty);
  return h;
}
function position(cur: "KRW" | "USD", capital: string, risk: string, entry: string, stop: string) {
  const h = uiHarness(PositionSizeCalculator);
  if (cur === "USD") usd(h);
  h.change("totalCapital", capital);
  h.change("riskPercent", risk);
  h.change("entryPrice", entry);
  h.change("stopLossPrice", stop);
  return h;
}

describe("평균단가 — 정확한 합계·평균과 반올림 전 판정", () => {
  it("USD 10.01×0.5주 + 10×0.5주: 평균 10.005 → 10.01 USD, 총 매수 10.01, 손익 −0.005 → −0.01", () => {
    const h = average("USD", [["10.01", "0.5"], ["10", "0.5"]], "10");
    expect(values(h)).toEqual({ "평균 단가": "10.01", "총 보유 수량": "1", "총 매수 금액": "10.01", "매수 횟수": "2", "평가 손익": "-0.01", "수익률": "-0.05", "평가 금액": "10" });
    expect(tone(h)).toBe("negative");
  });
  it("KRW 999,999,999,999×999,999주 + 1×1주: 총 매수 999,998,999,999,000,002원", () => {
    expect(values(average("KRW", [["999999999999", "999999"], ["1", "1"]], "999999999999"))).toMatchObject({
      "총 매수 금액": "999,998,999,999,000,002", "평균 단가": "999,998,999,999", "총 보유 수량": "1,000,000",
      "평가 손익": "+999,999,999,998", "평가 금액": "999,999,999,999,000,000",
    });
  });
  it("같은 가격만 매수하면 '평단가 변동 없음'(0.1×1 + 0.1×2), 손익 정확히 0은 +0·positive", () => {
    expect(text(average("USD", [["0.1", "1"], ["0.1", "2"]]))).toContain("평단가변동없음");
    const h = average("KRW", [["0.1", "3"], ["0.2", "3"]], "0.15");
    expect(values(h)).toMatchObject({ "평가 손익": "+0", "수익률": "+0.00" });
    expect(tone(h)).toBe("positive");
  });
  it("수량 4자리 동점 0.00015 → 0.0002주", () => {
    expect(values(average("KRW", [["1", "0.00015"]]))["총 보유 수량"]).toBe("0.0002");
  });
  it("빈 행 제외·한쪽만 입력한 행 차단·행 삭제·초기화·10행 계약은 그대로", () => {
    expect(isValid(average("KRW", [["1000", "2"], ["", ""]]))).toBe(true);
    const partial = average("KRW", [["1000", "2"], ["2000", ""]]);
    expect(isValid(partial)).toBe(false);
    click(partial, (n) => n.props["aria-label"] === "2차 매수 삭제");
    expect(isValid(partial)).toBe(true);
    expect(values(partial)["총 매수 금액"]).toBe("2,000");
    click(partial, (n) => label(n.props.children).trim() === "초기화");
    expect(isValid(partial)).toBe(false);
    expect(priceIds(partial)).toHaveLength(2);
    const ten = average("KRW", Array.from({ length: 10 }, (_, i) => [String(1000 + i), String(i + 1)] as [string, string]), "1005");
    click(ten, (n) => label(n.props.children).includes("추가 매수 입력"));
    expect(priceIds(ten)).toHaveLength(10);
    expect(values(ten)).toMatchObject({ "평균 단가": "1,006", "총 매수 금액": "55,330", "평가 손익": "-55", "수익률": "-0.10" });
    for (const v of ["0", "-1", "-", "."]) expect(isValid(average("KRW", [["1000", v]]))).toBe(false);
  });
});

describe("수익률 — 정확한 손익과 부호", () => {
  it("USD 10.00→10.01·0.5주: 손익 0.005 → +0.01 USD", () => {
    expect(values(profit("USD", "10.00", "10.01", "0.5"))).toEqual({ "예상 수익률": "+0.10", "평가 손익": "+0.01", "평가 금액": "5.01" });
  });
  it("USD 111.03→4,642.94·802,102,702,280주: 손익 +3,635,057,257,489,754.8 USD", () => {
    expect(values(profit("USD", "111.03", "4642.94", "802102702280"))).toEqual({
      "예상 수익률": "+4081.70", "평가 손익": "+3,635,057,257,489,754.8", "평가 금액": "3,724,114,720,523,903.2",
    });
  });
  it("손실 동점 −0.005 → −0.01, 수익률 ±0.005% 동점은 0에서 먼 쪽", () => {
    expect(values(profit("USD", "10.01", "10.00", "0.5"))).toMatchObject({ "예상 수익률": "-0.10", "평가 손익": "-0.01" });
    expect(values(profit("KRW", "200", "200.01", "1"))["예상 수익률"]).toBe("+0.01");
    expect(values(profit("KRW", "200", "199.99", "1"))["예상 수익률"]).toBe("-0.01");
  });
  it("같은 가격은 부호 없이 0, 아주 가까운 두 가격의 차이도 정확히 계산한다", () => {
    expect(values(profit("KRW", "50000", "50000", "10"))).toEqual({ "예상 수익률": "0.00", "평가 손익": "0", "평가 금액": "500,000" });
    expect(values(profit("USD", "100", "100.00000000000001", "1000000000000000"))).toMatchObject({
      "평가 손익": "+10", "평가 금액": "100,000,000,000,000,010",
    });
  });
  it("정상값과 무효 입력은 기존과 같다", () => {
    expect(values(profit("KRW", "50000", "55000", "100"))).toEqual({ "예상 수익률": "+10.00", "평가 손익": "+500,000", "평가 금액": "5,500,000" });
    for (const [b, c, q] of [["", "1", "1"], ["1", "0", "1"], ["1", "1", "-1"], ["-", "1", "1"], [".", "1", "1"]]) expect(isValid(profit("KRW", b, c, q))).toBe(false);
  });
});

describe("포지션 규모 — 정확한 금액·비율과 bigint 수량", () => {
  it("기존 10주 경계 보존: USD 100·1%·10.3·10.2 → 10주·103 USD, 최대 9주", () => {
    const h = position("USD", "100", "1", "10.3", "10.2");
    expect(values(h)).toEqual({ "권장 매수 금액 (포지션 크기)": "103", "권장 매수 수량": "10", "총 자본 대비 비중": "103.0" });
    expect(text(h)).toContain("최대수량은9주입니다");
  });
  it("C-2 원시 입력: 1,865,740·0.16%·244,911,130,838.15·244,911,130,837.15 → 731,059,725,551,877.75 USD", () => {
    const h = position("USD", "1865740", "0.16", "244911130838.15", "244911130837.15");
    expect(values(h)).toEqual({ "권장 매수 금액 (포지션 크기)": "731,059,725,551,877.75", "권장 매수 수량": "2,985", "총 자본 대비 비중": "39183365611.1" });
  });
  it("자본 9,007,199,254,740,993원·50%·1·0.5 → 9,007,199,254,740,993주, 같은 원 금액, 손실 4,503,599,627,370,497원", () => {
    const h = position("KRW", "9007199254740993", "50", "1", "0.5");
    expect(values(h)).toEqual({ "권장 매수 금액 (포지션 크기)": "9,007,199,254,740,993", "권장 매수 수량": "9,007,199,254,740,993", "총 자본 대비 비중": "100.0" });
    expect(text(h)).toContain("최대-4,503,599,627,370,497원(50.00%)으로제한됩니다");
  });
  it("자본 초과 안내의 최대 수량도 bigint 그대로: 9,007,199,254,740,993주", () => {
    const h = position("KRW", "9007199254740993", "100", "1", "0.5");
    expect(values(h)["권장 매수 수량"]).toBe("18,014,398,509,481,986");
    expect(text(h)).toContain("자본금9,007,199,254,740,993원로실제매수가능한최대수량은9,007,199,254,740,993주입니다");
  });
  it("권장 금액이 자본과 정확히 같으면 초과가 아니다(0.3·10%·0.1·0.09 → 3주·0.3 USD)", () => {
    const h = position("USD", "0.3", "10", "0.1", "0.09");
    expect(text(h)).toContain("최대-0.03USD(10.00%)으로제한됩니다");
    expect(text(h)).not.toContain("총자본금을초과합니다");
  });
  it("정수 경계 아래·위와 0주 안내", () => {
    expect(values(position("USD", "100", "1", "10.3", "10.2000001"))["권장 매수 수량"]).toBe("10");
    expect(values(position("USD", "100", "1", "10.3", "10.1999999"))["권장 매수 수량"]).toBe("9");
    expect(text(position("USD", "1", "0.5", "1000", "1"))).toContain("허용리스크금액(0.01USD)이1주당손실보다작아");
  });
});
