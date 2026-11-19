import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { runSimulation } from "@/lib/montecarlo";
import type { SimulationInput } from "@/lib/montecarlo/types";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";
import { CALCULATOR_HELP_BY_PATH } from "@/lib/calculatorHelp";
import { GettingStarted } from "@/components/ui/Shared";
import { uiHarness } from "./uiHarness";

// ‘처음 사용하시나요?’ 도움말의 ‘무엇을 입력하나요’·‘입력 예시’ 소절을 검사한다.
// 1) 소절 검사는 렌더링된 도움말(<details>) 안의 해당 제목 바로 아래 문단만 본다.
//    페이지 본문·FAQ·결과 대기 안내에 같은 필드명이 있어도 통과하지 않는다(맨 아래 ‘검사 범위’ 참고).
// 2) 예시 재현은 예시 문구에 적힌 값만 실제 계산기 컴포넌트에 입력한다.
//    입력하는 값마다 예시 소절에 그 표기(says)가 있어야 하므로 테스트에서만 값을 보충할 수 없다.
//    예시에 없는 칸(경로 수 기본값, 기본 선택된 방향·시장 등)은 건드리지 않는다.
const env = vi.hoisted(() => ({ path: "/", hook: undefined as unknown }));
const idle = (): UseMonteCarloState => ({
  status: "idle", result: null, progress: null, error: null, mode: "worker",
  run: (input: SimulationInput) => {
    try { env.hook = { ...idle(), status: "done", result: runSimulation(input) }; }
    catch (e) { env.hook = { ...idle(), status: "error", error: { message: (e as Error).message } }; }
  },
  cancel: () => {},
  reset: () => { env.hook = idle(); },
});
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => env.hook }));
vi.mock("next/navigation", () => ({ usePathname: () => env.path }));

type H = ReturnType<typeof uiHarness>;
type Entry = { id: string; value: string; says: string };
const HELP_SUMMARY = "처음 사용하시나요?";
const helpBlocks = (html: string) => (html.match(/<details\b[\s\S]*?<\/details>/g) ?? []).filter((block) => block.includes(HELP_SUMMARY));
/** 렌더링된 도움말 안에서 제목 바로 아래 문단만 돌려준다. 도움말이 없거나 여러 개면 실패한다. */
function helpSection(html: string, heading: "무엇을 입력하나요" | "입력 예시"): string {
  const blocks = helpBlocks(html);
  if (blocks.length !== 1) throw new Error(`도움말 블록 수가 1이 아닙니다: ${blocks.length}`);
  const match = blocks[0].match(new RegExp(`<h3[^>]*>${heading}</h3>\\s*<p[^>]*>([^<]*)</p>`));
  if (!match) throw new Error(`도움말에 ‘${heading}’ 소절이 없습니다.`);
  return match[1].replace(/&amp;/g, "&");
}
/** 도움말을 뺀 화면의 보이는 글자(입력값·placeholder 같은 속성은 제외). 공백은 모두 지운다. */
const screenWithoutHelp = (h: H) => h.html().replace(/<details\b[\s\S]*?<\/details>/g, (block) => (block.includes(HELP_SUMMARY) ? "" : block)).replace(/<[^>]*>/g, " ").replace(/\s+/g, "");
const fname = (type: unknown) => (typeof type === "function" ? type.name : "");
const resultCardValid = (h: H) => h.nodes().find((n) => fname(n.type) === "ResultCard")?.props.isValid;
const text = (x: unknown): string => (Array.isArray(x) ? x.map(text).join("") : typeof x === "string" ? x : "");
function click(h: H, buttonLabel: string) {
  const button = h.nodes().find((n) => n.type === "button" && text(n.props.children).includes(buttonLabel));
  if (!button) throw new Error(`버튼 없음: ${buttonLabel}`);
  if (button.props.disabled) throw new Error(`버튼 비활성: ${buttonLabel}`);
  (button.props.onClick as () => void)();
}
async function open(path: string, component: string): Promise<H> {
  env.path = path;
  env.hook = idle();
  const mod = await import(`../src/components/calculator/${component}Calculator.tsx`);
  return uiHarness(mod.default);
}
/** 예시 소절에 적힌 값만 입력한다. skip 에 든 칸은 비워 둔다. */
function typeExample(h: H, entries: Entry[], skip: string[] = [], override: Record<string, string> = {}) {
  const example = helpSection(h.html(), "입력 예시");
  for (const entry of entries) {
    expect(example, `예시에 ‘${entry.says}’ 표기가 있어야 ${entry.id} 칸에 입력할 수 있다`).toContain(entry.says);
    if (skip.includes(entry.id)) continue;
    h.change(entry.id, override[entry.id] ?? entry.value);
  }
}

type Case = {
  name: string; path: string; component: string;
  inputSays?: string[]; inputOmits?: string[];
  entries: Entry[];
  /** 시뮬레이터는 실행 버튼을 누른다. */
  run?: string;
  /** 예시대로 입력했을 때 결과에 나와야 하는 문구(공백 제거). 수기 검산 값이다. */
  expected: string[];
};

const CASES: Case[] = [
  {
    // 매수 1,000 + 수수료 1 = 1,001 / 매도 1,100 − 수수료 1.1 = 1,098.9 / 순손익 97.9 / 수수료 합 2.1
    name: "코인 수익", path: "/crypto/profit", component: "CryptoProfit",
    inputSays: ["매수 수수료율(%)", "매도 수수료율(%)", "0을 입력"],
    entries: [
      { id: "buyPrice", value: "100", says: "100 USDT에 10개 매수" }, { id: "quantity", value: "10", says: "10개 매수" },
      { id: "sellPrice", value: "110", says: "110 USDT에 매도" },
      { id: "buyFeeRate", value: "0.1", says: "매수 수수료율 0.1%" }, { id: "sellFeeRate", value: "0.1", says: "매도 수수료율 0.1%" },
    ],
    expected: ["실제순손익97.9USDT", "총수수료2.1USDT", "수수료반영전손익100USDT"],
  },
  {
    // 포지션 1,000×5 = 5,000 / 롱 손익 5,000×5% = 250 / 수수료 5,000×0.1% + 5,250×0.1% = 10.25 / 순손익 239.75
    name: "코인 레버리지 수익", path: "/crypto/leverage-profit", component: "CryptoLeverageProfit",
    inputSays: ["거래 수수료율(%)", "롱·숏 방향을 선택", "0을 입력"],
    entries: [
      { id: "entryPrice", value: "100", says: "진입가 100" }, { id: "exitPrice", value: "105", says: "종료가 105" },
      { id: "margin", value: "1000", says: "증거금 1,000" }, { id: "leverage", value: "5", says: "레버리지 5배" },
      { id: "feeRate", value: "0.1", says: "거래 수수료율 0.1%" },
    ],
    expected: ["실제순손익239.75USDT", "포지션규모5,000USDT", "수수료반영전손익250USDT", "총수수료10.25USDT"],
  },
  {
    // 세전 100×1 = 100 USD / 원천징수 15% = 15 USD / 세후 85 USD = 114,750원 / 월 9,562.5원
    name: "미국주식 배당", path: "/us-stocks/dividend", component: "USDividend",
    inputSays: ["원천징수세율"],
    entries: [
      { id: "shares", value: "100", says: "100주" }, { id: "annualDividendPerShareUsd", value: "1", says: "주당 연간 배당금 1달러" },
      { id: "buyPriceUsd", value: "50", says: "매수가 50달러" }, { id: "exchangeRate", value: "1350", says: "환율 1,350원" },
      { id: "withholdingTaxRate", value: "15", says: "원천징수세율 15%(가정)" },
    ],
    expected: ["연간세후배당금85USD", "연간세후배당금114,750원", "원천징수세금15USD", "월예상세후배당금9,562.5원"],
  },
  {
    // 세전 100×1,000 = 100,000원 / 세금 15.4% = 15,400원 / 세후 84,600원
    name: "국내 배당", path: "/dividend-calculator", component: "Dividend",
    inputSays: ["세율"],
    entries: [
      { id: "shares", value: "100", says: "100주" }, { id: "dividendPerShare", value: "1000", says: "주당 배당금 1,000원" },
      { id: "buyPrice", value: "50000", says: "평균 매수가 50,000원" }, { id: "taxRate", value: "15.4", says: "세율 15.4%(가정)" },
    ],
    expected: ["세후총배당금84,600원", "세금15,400원", "세전총배당금100,000원"],
  },
  {
    // 매수 1,000 USD×1,300 = 1,300,000원 / 매도 1,100 USD×1,350 = 1,485,000원 / 수수료 칸은 비워 둠(0원) / 손익 +185,000원
    name: "미국주식 환율 손익", path: "/us-stocks/exchange-profit", component: "USExchangeProfit",
    inputSays: ["수수료(원)", "비워 두면 0원"],
    entries: [
      { id: "buyPriceUsd", value: "100", says: "100달러에 10주 매수" }, { id: "quantity", value: "10", says: "10주 매수" },
      { id: "sellPriceUsd", value: "110", says: "110달러에 매도" },
      { id: "buyExchangeRate", value: "1300", says: "환율 1,300원→1,350원" }, { id: "sellExchangeRate", value: "1350", says: "→1,350원" },
    ],
    expected: ["원화기준실제손익+185,000원", "매매수수료합계0원"],
  },
  {
    // 롱(기본 선택)·양(+) 펀딩비: 10,000×0.01%×1회 = 1 USDT 지급
    name: "코인 펀딩비", path: "/crypto/funding-fee", component: "CryptoFundingFee",
    inputSays: ["적용 횟수", "롱·숏 방향을 선택"], inputOmits: ["지급 횟수"],
    entries: [
      { id: "positionSize", value: "10000", says: "포지션 10,000 USDT" }, { id: "fundingRate", value: "0.01", says: "펀딩비율 0.01%" },
      { id: "fundingCount", value: "1", says: "1회" },
    ],
    expected: ["총예상펀딩비(지급)-1USDT"],
  },
  {
    // 합계 1,100만 원 → 목표 660만·440만·0 / 부족한 자산은 해외주식(140만)뿐이라 새 투자금 100만 원이 모두 해외주식으로 간다
    name: "무매도 리밸런싱", path: "/no-sell-rebalancing-calculator", component: "NoSellRebalancing",
    inputSays: ["현재 평가금액", "목표 비중", "새 투자금", "쓰지 않는 행에도 평가금액 0과 목표 비중 0"],
    entries: [
      { id: "asset-value-0", value: "7000000", says: "국내주식 700만 원" }, { id: "asset-weight-0", value: "60", says: "국내주식 700만 원·목표 비중 60%" },
      { id: "asset-value-1", value: "3000000", says: "해외주식 300만 원" }, { id: "asset-weight-1", value: "40", says: "해외주식 300만 원·목표 비중 40%" },
      { id: "asset-value-2", value: "0", says: "채권·현금 0원" }, { id: "asset-weight-2", value: "0", says: "채권·현금 0원·목표 비중 0%" },
      { id: "rebalancing-contribution", value: "1000000", says: "새 투자금 100만 원" },
    ],
    expected: ["해외주식+1,000,000", "국내주식+0"],
  },
  {
    // 기대수익률 0.6×8 + 0.4×3 = 6.00% / 분산 0.12² + 0.032² + 2×0.12×0.032×0.2 = 0.01696 → 변동성 13.02% / 가중 변동성 15.20%
    name: "포트폴리오", path: "/portfolio-calculator", component: "Portfolio",
    inputSays: ["연 기대수익률", "연 변동성", "상관계수", "비중에 0을 입력"],
    entries: [
      { id: "portfolio-weight-0", value: "60", says: "주식 비중 60%" }, { id: "portfolio-return-0", value: "8", says: "주식 비중 60%·연 기대수익률 8%" }, { id: "portfolio-volatility-0", value: "20", says: "8%·연 변동성 20%" },
      { id: "portfolio-weight-1", value: "40", says: "채권 비중 40%" }, { id: "portfolio-return-1", value: "3", says: "채권 비중 40%·연 기대수익률 3%" }, { id: "portfolio-volatility-1", value: "8", says: "3%·연 변동성 8%" },
      { id: "portfolio-weight-2", value: "0", says: "현금 비중 0%" }, { id: "correlation-01", value: "0.2", says: "주식–채권 상관계수 0.2" },
    ],
    expected: ["연기대수익률6.00%", "연변동성13.02%", "상관관계를무시한가중변동성15.20%"],
  },
];

describe("시작 도움말 — 입력 안내 소절", () => {
  for (const c of CASES) {
    it(`${c.name}: ‘무엇을 입력하나요’가 화면의 입력 칸을 가리킨다`, async () => {
      const h = await open(c.path, c.component);
      const input = helpSection(h.html(), "무엇을 입력하나요");
      expect(input).toBe(CALCULATOR_HELP_BY_PATH[c.path].input);
      for (const says of c.inputSays ?? []) expect(input).toContain(says);
      for (const omits of c.inputOmits ?? []) expect(input).not.toContain(omits);
    });
  }
});

describe("시작 도움말 — 입력 예시만으로 결과가 나온다", () => {
  for (const c of CASES) {
    it(`${c.name}: 예시 값 → 수기 검산 결과`, async () => {
      const h = await open(c.path, c.component);
      for (const phrase of c.expected) expect(screenWithoutHelp(h)).not.toContain(phrase);
      typeExample(h, c.entries);
      const screen = screenWithoutHelp(h);
      for (const phrase of c.expected) expect(screen).toContain(phrase);
    });
  }
});

describe("시작 도움말 — 빈칸과 직접 입력한 0의 구분", () => {
  const find = (name: string) => CASES.find((c) => c.name === name)!;
  it("코인 수익: 수수료율 한 칸이라도 비우면 결과가 없고, 두 칸에 0을 넣으면 순손익 100", async () => {
    const c = find("코인 수익");
    for (const blank of ["buyFeeRate", "sellFeeRate"]) {
      const h = await open(c.path, c.component);
      typeExample(h, c.entries, [blank]);
      expect(resultCardValid(h)).toBe(false);
      expect(screenWithoutHelp(h)).not.toContain("실제순손익");
    }
    const h = await open(c.path, c.component);
    typeExample(h, c.entries, [], { buyFeeRate: "0", sellFeeRate: "0" });
    expect(screenWithoutHelp(h)).toContain("실제순손익100USDT");
  });
  it("코인 레버리지 수익: 수수료율을 비우면 결과가 없고, 0을 넣으면 순손익 250", async () => {
    const c = find("코인 레버리지 수익");
    const blank = await open(c.path, c.component);
    typeExample(blank, c.entries, ["feeRate"]);
    expect(resultCardValid(blank)).toBe(false);
    expect(screenWithoutHelp(blank)).not.toContain("실제순손익");
    const zero = await open(c.path, c.component);
    typeExample(zero, c.entries, [], { feeRate: "0" });
    expect(screenWithoutHelp(zero)).toContain("실제순손익250USDT");
  });
  it("미국주식 배당: 원천징수세율을 비우면 결과가 없고, 0을 넣으면 세후 100 USD", async () => {
    const c = find("미국주식 배당");
    const blank = await open(c.path, c.component);
    typeExample(blank, c.entries, ["withholdingTaxRate"]);
    expect(resultCardValid(blank)).toBe(false);
    expect(screenWithoutHelp(blank)).not.toContain("연간세후배당금");
    const zero = await open(c.path, c.component);
    typeExample(zero, c.entries, [], { withholdingTaxRate: "0" });
    expect(screenWithoutHelp(zero)).toContain("연간세후배당금100USD");
  });
  it("국내 배당: 세율을 비우면 결과가 없고, 0을 넣으면 세후 100,000원", async () => {
    const c = find("국내 배당");
    const blank = await open(c.path, c.component);
    typeExample(blank, c.entries, ["taxRate"]);
    expect(resultCardValid(blank)).toBe(false);
    expect(screenWithoutHelp(blank)).not.toContain("세후총배당금");
    const zero = await open(c.path, c.component);
    typeExample(zero, c.entries, [], { taxRate: "0" });
    expect(screenWithoutHelp(zero)).toContain("세후총배당금100,000원");
  });
  it("무매도 리밸런싱: 쓰지 않는 행을 비워 두면 결과가 없다", async () => {
    const c = find("무매도 리밸런싱");
    const h = await open(c.path, c.component);
    typeExample(h, c.entries, ["asset-value-2", "asset-weight-2"]);
    expect(screenWithoutHelp(h)).not.toContain("해외주식+1,000,000");
    expect(screenWithoutHelp(h)).toContain("없으면0을직접입력");
  });
  it("포트폴리오: 쓰지 않는 자산의 비중을 비워 두면 결과가 없다", async () => {
    const c = find("포트폴리오");
    const h = await open(c.path, c.component);
    typeExample(h, c.entries, ["portfolio-weight-2"]);
    expect(screenWithoutHelp(h)).not.toContain("연기대수익률6.00%");
    expect(screenWithoutHelp(h)).toContain("0도직접입력해야합니다");
  });
});

// 시뮬레이터는 경로마다 값이 달라지므로 금액 자체는 고정하지 않는다.
// 예시 값에서 수기로 정해지는 표시(기간·경로 수·목표 금액·25배 금액)와 결과 문구가 나오는지만 본다.
type SimCase = Omit<Case, "expected"> & { run: string; expected: string[]; onceMissing: string[] };
const SIM_CASES: SimCase[] = [
  {
    name: "목표 달성 가능성", path: "/goal-probability-calculator", component: "GoalProbability", run: "달성 가능성 계산",
    inputSays: ["목표 시나리오 비율", "연평균 수익률·변동성·연 물가상승률", "0을 직접 입력"],
    entries: [
      { id: "goal-target", value: "100000000", says: "목표 금액 1억 원" }, { id: "goal-probability", value: "80", says: "목표 시나리오 비율 80%" },
      { id: "goal-years", value: "10", says: "목표 기간 10년" }, { id: "goal-initial", value: "10000000", says: "현재 투자금 1,000만 원" },
      { id: "goal-monthly", value: "500000", says: "현재 월 투자금 50만 원" }, { id: "goal-return", value: "7", says: "연평균 수익률 7%" },
      { id: "goal-volatility", value: "15", says: "변동성 15%" }, { id: "goal-inflation", value: "2", says: "연 물가상승률 2%" },
    ],
    expected: ["목표달성확률결과10,000개시나리오·10년", "80%시나리오목표에필요한월투자금", "목표금액100,000,000원"],
    onceMissing: ["goal-probability", "goal-return", "goal-volatility", "goal-inflation"],
  },
  {
    // 40세→50세 은퇴→80세 종료 = 40년 계획 / 25배 참고 금액 250만×12×25 = 7억 5,000만 원
    name: "FIRE", path: "/fire-calculator", component: "Fire", run: "FIRE 시뮬레이션",
    inputSays: ["현재 나이, 은퇴 목표 나이, 계획 종료 나이", "연평균 수익률·변동성·연 물가상승률", "0을 직접 입력"],
    inputOmits: ["은퇴까지의 기간"],
    entries: [
      { id: "fire-age", value: "40", says: "현재 나이 40세" }, { id: "fire-retire", value: "50", says: "은퇴 목표 나이 50세" }, { id: "fire-end", value: "80", says: "계획 종료 나이 80세" },
      { id: "fire-assets", value: "100000000", says: "현재 투자자산 1억 원" }, { id: "fire-save", value: "1000000", says: "은퇴 전 월 투자금 100만 원" },
      { id: "fire-spend", value: "2500000", says: "현재 기준 월 생활비 250만 원" }, { id: "fire-return", value: "7", says: "연평균 수익률 7%" },
      { id: "fire-vol", value: "15", says: "변동성 15%" }, { id: "fire-inflation", value: "2", says: "연 물가상승률 2%" },
    ],
    expected: ["FIRE시뮬레이션결과10,000개시나리오·40년계획", "25배참고금액750,000,000원"],
    onceMissing: ["fire-age", "fire-retire", "fire-end", "fire-return", "fire-vol", "fire-inflation"],
  },
  {
    // 공통 도움말이 아니라 계산기가 직접 렌더링하는 도움말이다.
    name: "순서 위험 월 인출", path: "/sequence-risk-calculator", component: "SorrSimulation", run: "월 인출 시뮬레이션",
    inputSays: ["현재 기준 월 생활비", "인출 기간", "연평균 수익률·변동성·연 물가상승률", "0을 직접 입력"],
    entries: [
      { id: "sorr-mc-assets", value: "500000000", says: "은퇴 시작 자산 5억 원" }, { id: "sorr-mc-withdrawal", value: "2000000", says: "현재 기준 월 생활비 200만 원" },
      { id: "sorr-mc-years", value: "30", says: "인출 기간 30년" }, { id: "sorr-mc-return", value: "7", says: "연평균 수익률 7%" },
      { id: "sorr-mc-volatility", value: "15", says: "변동성 15%" }, { id: "sorr-mc-inflation", value: "2", says: "연 물가상승률 2%" },
    ],
    expected: ["월인출시뮬레이션결과10,000개경로·30년", "기간종료까지자산이소진되지않은경로"],
    onceMissing: ["sorr-mc-inflation"],
  },
];

describe("시작 도움말 — 시뮬레이터", () => {
  for (const c of SIM_CASES) {
    it(`${c.name}: ‘무엇을 입력하나요’가 화면의 입력 칸을 가리킨다`, async () => {
      const h = await open(c.path, c.component);
      const input = helpSection(h.html(), "무엇을 입력하나요");
      for (const says of c.inputSays ?? []) expect(input).toContain(says);
      for (const omits of c.inputOmits ?? []) expect(input).not.toContain(omits);
    });
    it(`${c.name}: 예시 값을 넣고 실행하면 결과가 나온다`, async () => {
      const h = await open(c.path, c.component);
      typeExample(h, c.entries);
      for (const phrase of c.expected) expect(screenWithoutHelp(h)).not.toContain(phrase);
      click(h, c.run);
      expect((env.hook as UseMonteCarloState).error).toBeNull();
      const screen = screenWithoutHelp(h);
      for (const phrase of c.expected) expect(screen).toContain(phrase);
    });
    it(`${c.name}: 예전 예시에 없던 칸을 비워 두면 결과가 나오지 않는다`, async () => {
      const h = await open(c.path, c.component);
      typeExample(h, c.entries, c.onceMissing);
      click(h, c.run);
      expect((env.hook as UseMonteCarloState).result).toBeNull();
      for (const phrase of c.expected) expect(screenWithoutHelp(h)).not.toContain(phrase);
    });
  }
});

describe("검사 범위 — 도움말 소절 밖의 같은 문구로는 통과하지 않는다", () => {
  const FIELD = "매수 수수료율(%)";
  const help = (input: string, example: string) => renderToStaticMarkup(createElement(GettingStarted, { what: "무엇", input, read: "읽기", example }));
  const elsewhere = `<p>${FIELD}을 입력하세요.</p><details><summary>자주 묻는 질문</summary><h3>무엇을 입력하나요</h3><p>${FIELD}</p></details><div>${FIELD}을 입력하면 결과가 계산됩니다.</div>`;
  it("본문·FAQ·결과 대기 안내에만 있으면 소절에서는 찾지 못한다", () => {
    const html = help("가격과 수량을 입력하세요.", "100에 10개") + elsewhere;
    expect(html).toContain(FIELD);
    expect(helpSection(html, "무엇을 입력하나요")).toBe("가격과 수량을 입력하세요.");
    expect(helpSection(html, "입력 예시")).toBe("100에 10개");
  });
  it("‘무엇을 입력하나요’에만 있으면 ‘입력 예시’ 소절에서는 찾지 못한다", () => {
    const html = help(`${FIELD}을 입력하세요.`, "100에 10개") + elsewhere;
    expect(helpSection(html, "무엇을 입력하나요")).toContain(FIELD);
    expect(helpSection(html, "입력 예시")).not.toContain(FIELD);
  });
  it("도움말이 렌더링되지 않은 화면은 실패한다", () => {
    expect(() => helpSection(elsewhere, "무엇을 입력하나요")).toThrow("도움말 블록 수");
  });
  it("결과 검사는 도움말 문구를 결과로 세지 않는다", async () => {
    const h = await open("/crypto/profit", "CryptoProfit");
    expect(h.html()).toContain("매도 수수료율 0.1%");
    expect(screenWithoutHelp(h)).not.toContain("매도수수료율0.1%");
  });
});
