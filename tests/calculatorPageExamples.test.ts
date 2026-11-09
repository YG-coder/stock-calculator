import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { uiHarness, visibleCopy } from "./uiHarness";
import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";
import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";
import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
import DividendCalculator from "@/components/calculator/DividendCalculator";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
import OverseasStockTaxCalculator from "@/components/calculator/OverseasStockTaxCalculator";
import CryptoProfitCalculator from "@/components/calculator/CryptoProfitCalculator";
import CryptoLeverageProfitCalculator from "@/components/calculator/CryptoLeverageProfitCalculator";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CryptoLiquidationCalculator from "@/components/calculator/CryptoLiquidationCalculator";
import CryptoAverageCalculator from "@/components/calculator/CryptoAverageCalculator";
import USExchangeProfitCalculator from "@/components/calculator/USExchangeProfitCalculator";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import { CALCULATOR_EXAMPLES, CRYPTO_AVERAGE_BASIC, type CalculatorExample } from "@/data/stockCalculatorExamples";

const pathname = { current: "/" };
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

// 태그 경계마다 공백이 들어가는 추출 방식이라, 브라우저 표시와 같게 공백을 지우고 비교한다.
const flat = (html: string) => visibleCopy(html).replace(/\s+/g, "");
const has = (text: string, v: string) => expect(text).toContain(v.replace(/\s+/g, ""));

type H = ReturnType<typeof uiHarness>;
type N = ReturnType<H["nodes"]>[number];
const fname = (n: N) => (typeof n.type === "function" ? (n.type as { name: string }).name : "");
/** 결과 항목을 라벨 → 값으로 모은다. 같은 라벨이 단위만 다르게 반복되면 "라벨|단위" 키로도 넣는다. */
const values = (h: H) => {
  const out: Record<string, string> = {};
  for (const n of h.nodes().filter((n) => ["ResultHighlight", "ResultDetail"].includes(fname(n)))) {
    const label = String(n.props.label);
    const value = String(n.props.value);
    out[label] = value;
    if (n.props.unit !== undefined) out[`${label}|${String(n.props.unit)}`] = value;
  }
  return out;
};
const label = (x: unknown): string => (Array.isArray(x) ? x.map(label).join("") : typeof x === "string" ? x : "");

const COMPONENTS: Record<keyof typeof CALCULATOR_EXAMPLES, () => unknown> = {
  TARGET_BASIC: TargetPriceCalculator,
  STOP_LOSS_BASIC: StopLossCalculator,
  BREAK_EVEN_LOSS_20: BreakEvenCalculator,
  BREAK_EVEN_LOSS_30: BreakEvenCalculator,
  BREAK_EVEN_LOSS_50: BreakEvenCalculator,
  RISK_REWARD_BASIC: RiskRewardCalculator,
  POSITION_BASIC: PositionSizeCalculator,
  POSITION_FLOOR: PositionSizeCalculator,
  DIVIDEND_BASIC: DividendCalculator,
  COMPOUND_BASIC: CompoundInterestCalculator,
  COMPOUND_TEN_YEARS: CompoundInterestCalculator,
  OVERSEAS_TAX_BASIC: OverseasStockTaxCalculator,
  CRYPTO_PROFIT_BASIC: CryptoProfitCalculator,
  CRYPTO_LEVERAGE_BASIC: CryptoLeverageProfitCalculator,
  CRYPTO_FUNDING_BASIC: CryptoFundingFeeCalculator,
  CRYPTO_ENTRY_BASIC: CryptoEntryCalculator,
  CRYPTO_LIQUIDATION_BASIC: CryptoLiquidationCalculator,
  US_EXCHANGE_BASIC: USExchangeProfitCalculator,
  US_DIVIDEND_BASIC: USDividendCalculator,
};

function run(Component: () => unknown, c: CalculatorExample) {
  const h = uiHarness(Component);
  for (const [id, value] of Object.entries(c.inputs)) h.change(id, value);
  return values(h);
}

describe("페이지 사례 = 실제 계산기 결과 (기대값은 Fraction/Decimal 로 독립 산출)", () => {
  for (const [name, c] of Object.entries(CALCULATOR_EXAMPLES) as [keyof typeof CALCULATOR_EXAMPLES, CalculatorExample][]) {
    it(name, () => {
      expect(run(COMPONENTS[name], c)).toMatchObject(c.expected);
    });
  }

  it("CRYPTO_AVERAGE_BASIC", () => {
    const h = uiHarness(CryptoAverageCalculator);
    const c = CRYPTO_AVERAGE_BASIC;
    const priceIds = () => h.nodes().filter((n) => fname(n) === "InputField" && String(n.props.id).startsWith("c-price-")).map((n) => String(n.props.id));
    for (let i = 2; i < c.rows.length; i++) {
      (h.nodes().find((n) => n.type === "button" && label(n.props.children).includes("추가 매수 입력"))!.props.onClick as () => void)();
    }
    c.rows.forEach((row, i) => {
      const id = priceIds()[i].slice("c-price-".length);
      h.change(`c-price-${id}`, row.price);
      h.change(`c-qty-${id}`, row.quantity);
    });
    if (c.current !== undefined) h.change("c-currentPrice", c.current);
    expect(values(h)).toMatchObject({
      "새 평균 단가": c.expected.average,
      "총 보유 수량": c.expected.totalQuantity,
      "총 매수 금액": c.expected.totalAmount,
      "매수 횟수": String(c.rows.length),
      "평가 손익": c.expected.profit,
      "수익률": c.expected.rate,
    });
  });
});

type PageModule = { default: () => unknown; metadata: { title?: unknown; description?: unknown; openGraph?: { title?: unknown; description?: unknown } } };

/** 렌더한 HTML 에서 FAQPage JSON-LD(@graph 안)의 질문·답변을 꺼낸다. dangerouslySetInnerHTML 이라 엔티티 변환은 없다. */
type LdNode = { "@type"?: string; "@graph"?: LdNode[]; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] };
function jsonLdFaqs(html: string): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const root = JSON.parse(m[1]) as LdNode;
    for (const node of root["@graph"] ?? [root]) {
      if (node["@type"] === "FAQPage") for (const q of node.mainEntity ?? []) out.push({ question: q.name, answer: q.acceptedAnswer.text });
    }
  }
  return out;
}

async function renderPage(path: string, importer: () => Promise<PageModule>) {
  pathname.current = path;
  const mod = await importer();
  const html = renderToStaticMarkup(createElement(mod.default as () => null));
  return { html, text: flat(html), meta: mod.metadata };
}

const PAGES: { path: string; importer: () => Promise<PageModule>; title: string; description: string[]; copy: string[]; absent?: string[] }[] = [
  {
    path: "/target-price-calculator",
    importer: () => import("@/app/target-price-calculator/page") as Promise<PageModule>,
    title: "주식 목표가 계산기 | 목표 수익률로 매도 가격 계산",
    description: ["매수가와 목표 수익률(%)", "수수료·세금·환율은 반영하지 않"],
    copy: ["57,500원", "주당 7,500원"],
  },
  {
    path: "/stop-loss-calculator",
    importer: () => import("@/app/stop-loss-calculator/page") as Promise<PageModule>,
    title: "주식 손절가 계산기 | 손절 비율로 손절가·예상 손실 계산",
    description: ["매수가, 보유 수량, 손절 비율(%)", "수수료·세금"],
    copy: ["9,500원", "50,000원"],
  },
  {
    path: "/break-even-calculator",
    importer: () => import("@/app/break-even-calculator/page") as Promise<PageModule>,
    title: "본전 회복 계산기 | 손실률별 원금 회복 필요 상승률",
    description: ["손실률(%)", "상승률"],
    copy: ["25.00%", "42.86%", "100.00%"],
    absent: ["− 1 × 100"],
  },
  {
    path: "/risk-reward-calculator",
    importer: () => import("@/app/risk-reward-calculator/page") as Promise<PageModule>,
    title: "손익비 계산기 | 손익비·손익분기 승률 계산",
    description: ["진입가, 손절가, 목표가", "손익분기 승률"],
    copy: ["3.00R", "25.0%"],
    absent: ["기대값"],
  },
  {
    path: "/position-size-calculator",
    importer: () => import("@/app/position-size-calculator/page") as Promise<PageModule>,
    title: "포지션 사이즈 계산기 | 허용 손실로 매수 수량·금액 계산",
    description: ["총 투자 자본금, 1회 허용 리스크(%), 진입 가격, 손절 라인", "내림"],
    copy: ["200주", "2,000,000원", "333주", "3,330,000원"],
  },
  {
    path: "/dividend-calculator",
    importer: () => import("@/app/dividend-calculator/page") as Promise<PageModule>,
    title: "배당 수익 계산기 | 세전·세후 배당금·배당수익률 계산",
    description: ["보유 수량, 주당 배당금, 평균 매수가, 세율(%)", "직접 입력"],
    copy: ["150,000원", "23,100원", "126,900원", "2.54%"],
    absent: ["국가별 세율", "비교할 수 있습니다"],
  },
  {
    path: "/compound-interest-calculator",
    importer: () => import("@/app/compound-interest-calculator/page") as Promise<PageModule>,
    title: "복리 계산기 | 월 적립 월복리 최종 금액 계산",
    description: ["초기 투자금, 월 추가 투자금, 연 수익률(%), 투자 기간(년)", "월복리"],
    copy: ["72,022,056원", "201,340,139원", "124,340,139원"],
    absent: ["역산"],
  },
  {
    path: "/overseas-stock-tax-calculator",
    importer: () => import("@/app/overseas-stock-tax-calculator/page") as Promise<PageModule>,
    title: "해외주식 세금 계산기 | 양도소득세·세후 수익 계산",
    description: ["총 매수 금액, 총 매도 금액, 기본공제", "거래 1건 기준"],
    copy: ["770,000원", "5,230,000원"],
  },
  { path: "/crypto/profit", importer: () => import("@/app/crypto/profit/page") as Promise<PageModule>, title: "코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산", description: ["매수·매도 수수료율(%)", "레버리지"], copy: ["9,945 USDT", "19.88%"] },
  { path: "/crypto/leverage-profit", importer: () => import("@/app/crypto/leverage-profit/page") as Promise<PageModule>, title: "코인 레버리지 수익 계산기 | 롱·숏 선물 순손익·ROE 계산", description: ["거래 수수료율", "펀딩비"], copy: ["489.75 USDT", "48.98%"] },
  { path: "/crypto/funding-fee", importer: () => import("@/app/crypto/funding-fee/page") as Promise<PageModule>, title: "코인 펀딩비 계산기 | 롱·숏 지급·수령 펀딩비 계산", description: ["포지션 방향", "적용 횟수"], copy: ["−3 USDT(지급)"], absent: ["예상 비용"] },
  { path: "/crypto/entry", importer: () => import("@/app/crypto/entry/page") as Promise<PageModule>, title: "코인 레버리지 진입 계산기 | 이론 배율·주문 명목가치 계산", description: ["손익비", "롱 전용"], copy: ["500 USDT", "10,150 USDT"] },
  { path: "/crypto/liquidation", importer: () => import("@/app/crypto/liquidation/page") as Promise<PageModule>, title: "코인 청산가 계산기 | 롱·숏 격리마진 청산가 계산", description: ["유지증거금률", "파산 가격"], copy: ["63,350 USDT", "63,000 USDT"] },
  { path: "/crypto/average", importer: () => import("@/app/crypto/average/page") as Promise<PageModule>, title: "코인 물타기·불타기 계산기 | 평균 단가·평가 손익 계산", description: ["최대 10회", "수수료"], copy: ["66,666.67 USDT", "0.3개"] },
  { path: "/us-stocks/exchange-profit", importer: () => import("@/app/us-stocks/exchange-profit/page") as Promise<PageModule>, title: "미국주식 환율 반영 수익 계산기 | 원화 손익·환율 효과 계산", description: ["원화 수수료", "세금"], copy: ["306,000원", "22.67%", "36,000원"] },
  { path: "/us-stocks/dividend", importer: () => import("@/app/us-stocks/dividend/page") as Promise<PageModule>, title: "미국주식 배당 계산기 | 원천징수 후 배당금·원화 환산 계산", description: ["원천징수세율", "종합과세"], copy: ["170달러", "229,500원", "19,125원"] },
  { path: "/dca-calculator", importer: () => import("@/app/dca-calculator/page") as Promise<PageModule>, title: "적립식 투자 시뮬레이션 | 월 적립 장기 자산 범위 계산", description: ["기본 1만 개 경로", "예측이나 보장이 아닙니다"], copy: ["적립식 투자 시뮬레이션"] },
  { path: "/goal-probability-calculator", importer: () => import("@/app/goal-probability-calculator/page") as Promise<PageModule>, title: "투자 목표달성확률 계산기 | 달성 시나리오 비율·필요 월 투자금", description: ["필요한 월 투자금", "세금과 거래비용"], copy: ["투자 목표달성확률 계산기"] },
  { path: "/fire-calculator", importer: () => import("@/app/fire-calculator/page") as Promise<PageModule>, title: "FIRE 은퇴 시뮬레이션 | 은퇴 자금 성공 시나리오 비율 계산", description: ["연금·세금·거래비용"], copy: ["FIRE 은퇴 시뮬레이션"], absent: ["확장할 예정"] },
  { path: "/sequence-risk-calculator", importer: () => import("@/app/sequence-risk-calculator/page") as Promise<PageModule>, title: "수익률 순서 위험 계산기 | 인출 소진 위험·정순/역순 비교", description: ["역순"], copy: ["기본 1만 개"], absent: ["수천 개"] },
  { path: "/no-sell-rebalancing-calculator", importer: () => import("@/app/no-sell-rebalancing-calculator/page") as Promise<PageModule>, title: "무매도 리밸런싱 계산기 | 새 투자금 자산별 매수액 계산", description: ["세금·수수료·주문 단위"], copy: ["무매도 리밸런싱 계산기"], absent: ["양도소득 실현"] },
  { path: "/portfolio-calculator", importer: () => import("@/app/portfolio-calculator/page") as Promise<PageModule>, title: "포트폴리오 계산기 | 기대수익률·변동성·분산효과 계산", description: ["세 자산", "상관계수"], copy: ["포트폴리오 계산기"] },
  { path: "/stock-transaction-tax-calculator", importer: () => import("@/app/stock-transaction-tax-calculator/page") as Promise<PageModule>, title: "증권거래세 계산기 | 시장별 세율 계산", description: ["증권거래세와 농어촌특별세"], copy: ["원 미만 절사", "20,000원"] },
];

describe("사례 가정이 세율·공제 상수와 일치", () => {
  it("배당 사례 세율 = 국내 배당소득세 기본값, 미국 배당 사례 세율 = 현지 원천징수 기본값", async () => {
    const { DOMESTIC_DIVIDEND_TAX, US_DIVIDEND_WITHHOLDING, OVERSEAS_STOCK_TAX } = await import("@/lib/taxRates");
    expect(CALCULATOR_EXAMPLES.DIVIDEND_BASIC.inputs.taxRate).toBe(String(DOMESTIC_DIVIDEND_TAX.ratePercent));
    expect(CALCULATOR_EXAMPLES.US_DIVIDEND_BASIC.inputs.withholdingTaxRate).toBe(String(US_DIVIDEND_WITHHOLDING.ratePercent));
    expect(Number(CALCULATOR_EXAMPLES.OVERSEAS_TAX_BASIC.inputs.deduction)).toBe(OVERSEAS_STOCK_TAX.basicDeduction);
    // 해외주식 사례의 세금 77만 원은 과세 대상 350만 원 × 22% — 세율 상수가 바뀌면 여기서 드러난다.
    expect(OVERSEAS_STOCK_TAX.rate).toBe(0.22);
  });
});

describe("페이지 렌더링 — 제목·설명·사례 노출·중복 블록 제거·FAQ = JSON-LD", () => {
  for (const p of PAGES) {
    it(p.path, async () => {
      const { html, text, meta } = await renderPage(p.path, p.importer);
      expect(text).not.toContain("에대해더알아보기");
      expect(String(meta.title)).toBe(p.title);
      for (const d of p.description) expect(String(meta.description)).toContain(d);
      // OG 제목·설명이 메타와 어긋나지 않게(설정 페이지는 openGraph 를 따로 가진다)
      if (meta.openGraph?.title) expect(String(meta.openGraph.title)).toContain(p.title.split(" | ")[0]);
      for (const v of p.copy) has(text, v);
      for (const v of p.absent ?? []) expect(text).not.toContain(v.replace(/\s+/g, ""));
      const faqs = jsonLdFaqs(html);
      expect(faqs.length).toBeGreaterThan(0);
      for (const f of faqs) {
        has(text, f.question);
        has(text, f.answer);
      }
    });
  }
});
