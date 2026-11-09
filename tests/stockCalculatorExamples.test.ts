import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { uiHarness, visibleCopy } from "./uiHarness";
import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
import ProfitCalculator from "@/components/calculator/ProfitCalculator";
import {
  AVERAGE_EXAMPLES,
  PROFIT_EXAMPLES,
  PROFIT_FEE_ILLUSTRATION,
  type AverageExample,
  type ProfitExample,
} from "@/data/stockCalculatorExamples";

const pathname = { current: "/profit-calculator" };
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));
// 태그 경계마다 공백이 들어가는 추출 방식이라, 브라우저 표시와 같게 공백을 지우고 비교한다.
const flat = (html: string) => visibleCopy(html).replace(/\s+/g, "");
const has = (text: string, v: string) => expect(text).toContain(v.replace(/\s+/g, ""));

// 페이지 본문에 쓰는 계산 사례를 실제 계산기 화면에 같은 입력으로 넣어 결과 문자열을 대조한다.
// 숫자 자체는 별도로 Python Fraction 으로 계산해 같은 값임을 확인했다.

type H = ReturnType<typeof uiHarness>;
type N = ReturnType<H["nodes"]>[number];
const fname = (n: N) => (typeof n.type === "function" ? (n.type as { name: string }).name : "");
const values = (h: H) =>
  Object.fromEntries(
    h.nodes()
      .filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n)))
      .map((n) => [String(n.props.label), String(n.props.value)]),
  );
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" ? x : "");
const priceIds = (h: H) => h.nodes().filter((n) => fname(n) === "InputField" && String(n.props.id).startsWith("price-")).map((n) => String(n.props.id));

function runProfit(c: ProfitExample) {
  const h = uiHarness(ProfitCalculator);
  h.change("buyPrice", c.buy);
  h.change("currentPrice", c.current);
  h.change("quantity", c.quantity);
  return values(h);
}

function runAverage(c: AverageExample) {
  const h = uiHarness(AveragePriceCalculator);
  for (let i = 2; i < c.rows.length; i++) {
    (h.nodes().find((n) => n.type === "button" && label(n.props.children).includes("추가 매수 입력"))!.props.onClick as () => void)();
  }
  c.rows.forEach((row, i) => {
    const id = priceIds(h)[i].slice("price-".length);
    h.change(`price-${id}`, row.price);
    h.change(`qty-${id}`, row.quantity);
  });
  if (c.current !== undefined) h.change("currentPrice", c.current);
  return values(h);
}

describe("수익률 계산기 페이지 사례 = 실제 계산 결과", () => {
  for (const [name, c] of Object.entries(PROFIT_EXAMPLES)) {
    it(name, () => {
      expect(runProfit(c)).toEqual({ "예상 수익률": c.expected.rate, "평가 손익": c.expected.profit, "평가 금액": c.expected.evalAmount });
    });
  }
});

describe("평단가 계산기 페이지 사례 = 실제 계산 결과", () => {
  for (const [name, c] of Object.entries(AVERAGE_EXAMPLES)) {
    it(name, () => {
      const v = runAverage(c);
      expect(v).toMatchObject({
        "평균 단가": c.expected.average,
        "총 보유 수량": c.expected.totalQuantity,
        "총 매수 금액": c.expected.totalAmount,
        "매수 횟수": String(c.rows.length),
      });
      if (c.current !== undefined) expect(v).toMatchObject({ "평가 손익": c.expected.profit, "수익률": c.expected.rate });
    });
  }
});

describe("본문 논리의 전제 — 물타기·불타기 전후 손익금이 같다", () => {
  it("물타기 전후 손익금 동일, 수익률만 축소", () => {
    expect(AVERAGE_EXAMPLES.AVERAGE_DOWN_BEFORE.expected.profit).toBe(AVERAGE_EXAMPLES.AVERAGE_DOWN_AFTER.expected.profit);
    expect(AVERAGE_EXAMPLES.AVERAGE_UP_BEFORE.expected.profit).toBe(AVERAGE_EXAMPLES.AVERAGE_UP_AFTER.expected.profit);
  });
  it("본전 상승률 사례의 가격이 물타기 사례의 평단가와 일치", () => {
    expect(Number(PROFIT_EXAMPLES.BREAK_EVEN_BEFORE.current).toLocaleString("ko-KR")).toBe(AVERAGE_EXAMPLES.AVERAGE_DOWN_BEFORE.expected.average);
    expect(Number(PROFIT_EXAMPLES.BREAK_EVEN_AFTER.current).toLocaleString("ko-KR")).toBe(AVERAGE_EXAMPLES.AVERAGE_DOWN_AFTER.expected.average);
    expect(PROFIT_EXAMPLES.BREAK_EVEN_BEFORE.buy).toBe(AVERAGE_EXAMPLES.AVERAGE_DOWN_BEFORE.current);
  });
  it("평단가 기준 수익률 사례가 분할 매수 평단가와 일치", () => {
    expect(Number(PROFIT_EXAMPLES.PROFIT_AVERAGE_BASIS.buy).toLocaleString("ko-KR")).toBe(AVERAGE_EXAMPLES.PROFIT_SPLIT_BUYS.expected.average);
    expect(PROFIT_EXAMPLES.PROFIT_WRONG_BASIS.buy).toBe(AVERAGE_EXAMPLES.PROFIT_SPLIT_BUYS.rows[0].price);
  });
});

describe("수수료 가정 예시 — 정수 산술로 독립 계산", () => {
  it("0.015% 가정: 매수 1,050원·매도 1,200원, 손익 997,750원, 약 14.25%", () => {
    // 금액이 2^53 보다 훨씬 작아 정수 연산이 정확하다.
    const f = PROFIT_FEE_ILLUSTRATION;
    const buyAmount = Number(f.base.buy) * Number(f.base.quantity);
    const sellAmount = Number(f.base.current) * Number(f.base.quantity);
    expect(f.assumedFeeRatePercent).toBe("0.015"); // 0.015% = 15 / 100,000
    expect((buyAmount * 15) % 100_000).toBe(0);
    expect((sellAmount * 15) % 100_000).toBe(0);
    const buyFee = (buyAmount * 15) / 100_000;
    const sellFee = (sellAmount * 15) / 100_000;
    expect(buyFee.toLocaleString("ko-KR")).toBe(f.buyFee);
    expect(sellFee.toLocaleString("ko-KR")).toBe(f.sellFee);
    const net = sellAmount - buyAmount - buyFee - sellFee;
    expect(net.toLocaleString("ko-KR")).toBe(f.netProfit);
    // 수익률(%) = net / (매입 금액 + 매수 수수료) × 100, 소수 둘째 자리 반올림 — 만분율 정수로 계산
    const basisPoints = Math.floor((net * 1_000_000) / (buyAmount + buyFee)); // % × 10^4 (내림)
    const hundredths = Math.floor((basisPoints + 50) / 100); // % × 10^2 (반올림)
    expect(`${Math.floor(hundredths / 100)}.${String(hundredths % 100).padStart(2, "0")}`).toBe(f.netRate);
  });
});

describe("페이지 렌더링 — 중복 설명 제거와 사례 노출", () => {
  it("수익률 페이지: '더 알아보기' 중복 블록이 없고 사례·제목·설명이 실제 기능과 맞다", async () => {
    pathname.current = "/profit-calculator";
    const { default: Page, metadata } = await import("@/app/profit-calculator/page");
    const text = flat(renderToStaticMarkup(createElement(Page)));
    has(text, "주식 수익률 계산기"); expect(text).not.toContain("에대해더알아보기");
    has(text, "증권사 앱 수익률과 계산기 결과가 다른 이유");
    for (const v of ["수익률 +14.29%", "평가 손익 +1,000,000원", "-5.00%(손익 -10,000원)으로", "+5.56%(손익 +10,000원)이", "손익은 997,750원", "약 14.25%입니다"]) has(text, v);
    expect(String(metadata.title)).toContain("주식 수익률 계산기");
    expect(String(metadata.description)).toContain("수수료·세금·환율은 반영하지 않은");
  });
  it("평단가 페이지: '더 알아보기' 중복 블록이 없고 물타기·불타기 사례가 노출된다", async () => {
    pathname.current = "/average-price-calculator";
    const { default: Page, metadata } = await import("@/app/average-price-calculator/page");
    const text = flat(renderToStaticMarkup(createElement(Page)));
    expect(text).not.toContain("에대해더알아보기");
    has(text, "물타기하면 평단가는 낮아지는데 손실금은 왜 그대로일까?");
    has(text, "불타기하면 수익금은 그대로인데 수익률은 왜 낮아질까?");
    for (const v of ["평균 단가는 8,000원입니다", "평균 단가는 9,000원으로 내려가고", "수익률은 -11.11%가", "여전히 -20,000원입니다", "-30,000원이지만", "-40,000원입니다", "+25.00%에서 +12.50%로", "11,000원으로 올라가고", "+9.09%로 낮아집니다", "손익이 0원으로 본전이"]) has(text, v);
    expect(text).not.toMatch(/\+0원/);
    expect(String(metadata.description)).toContain("최대 10회");
  });
});
