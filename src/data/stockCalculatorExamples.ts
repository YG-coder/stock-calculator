/**
 * 주식 수익률·평단가 계산기 페이지의 계산 사례.
 *
 * 페이지 본문은 이 값만 표시하고, tests/stockCalculatorExamples.test.ts 가 같은 입력을
 * 실제 계산기 화면(ProfitCalculator·AveragePriceCalculator)에 넣어 결과 문자열을 대조한다.
 * 숫자를 바꾸면 테스트가 실패하므로 본문과 계산기가 어긋난 채 배포되지 않는다.
 * 표시 형식은 계산기 결과 표시와 같다(수익률 소수 둘째 자리·부호, 금액 쉼표).
 */

export type ProfitExample = {
    buy: string;
    current: string;
    quantity: string;
    expected: { rate: string; profit: string; evalAmount: string };
};

export type AverageExample = {
    rows: { price: string; quantity: string }[];
    current?: string;
    expected: {
        average: string;
        totalQuantity: string;
        totalAmount: string;
        profit?: string;
        rate?: string;
    };
};

/** 수익률 계산기 — 기본 사례 */
export const PROFIT_BASIC: ProfitExample = {
    buy: "70000",
    current: "80000",
    quantity: "100",
    expected: { rate: "+14.29", profit: "+1,000,000", evalAmount: "8,000,000" },
};

/** 두 번 나눠 산 경우 — 첫 매수가를 넣었을 때(잘못된 기준) */
export const PROFIT_WRONG_BASIS: ProfitExample = {
    buy: "10000",
    current: "9500",
    quantity: "20",
    expected: { rate: "-5.00", profit: "-10,000", evalAmount: "190,000" },
};

/** 같은 보유분 — 평단가를 넣었을 때(올바른 기준) */
export const PROFIT_AVERAGE_BASIS: ProfitExample = {
    buy: "9000",
    current: "9500",
    quantity: "20",
    expected: { rate: "+5.56", profit: "+10,000", evalAmount: "190,000" },
};

/** 위 두 사례의 실제 매수 내역(평단가 계산기 입력) */
export const PROFIT_SPLIT_BUYS: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "8000", quantity: "10" },
    ],
    current: "9500",
    expected: { average: "9,000", totalQuantity: "20", totalAmount: "180,000", profit: "+10,000", rate: "+5.56" },
};

/**
 * 수수료를 반영하면 달라지는 정도 — 계산기가 아니라 본문 설명용 예시.
 * 수수료율 0.015%는 설명을 위한 가정값이다(실제 수수료율은 증권사·계좌마다 다르다).
 * 매도 시 세금은 이 예시에 넣지 않는다.
 */
export const PROFIT_FEE_ILLUSTRATION = {
    base: PROFIT_BASIC,
    assumedFeeRatePercent: "0.015",
    buyFee: "1,050",
    sellFee: "1,200",
    netProfit: "997,750",
    netRate: "14.25",
} as const;

/** 평단가 계산기 — 세 번 나눠 산 기본 사례 */
export const AVERAGE_BASIC: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "8000", quantity: "10" },
        { price: "7000", quantity: "20" },
    ],
    expected: { average: "8,000", totalQuantity: "40", totalAmount: "320,000" },
};

/** 물타기 전: 10,000원에 10주 보유, 현재가 8,000원 */
export const AVERAGE_DOWN_BEFORE: AverageExample = {
    rows: [{ price: "10000", quantity: "10" }],
    current: "8000",
    expected: { average: "10,000", totalQuantity: "10", totalAmount: "100,000", profit: "-20,000", rate: "-20.00" },
};

/** 물타기 후: 8,000원에 10주 추가 */
export const AVERAGE_DOWN_AFTER: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "8000", quantity: "10" },
    ],
    current: "8000",
    expected: { average: "9,000", totalQuantity: "20", totalAmount: "180,000", profit: "-20,000", rate: "-11.11" },
};

/** 물타기 후 7,000원까지 더 내렸을 때 — 추가 매수 전후 */
export const AVERAGE_DOWN_FURTHER_BEFORE: AverageExample = {
    rows: [{ price: "10000", quantity: "10" }],
    current: "7000",
    expected: { average: "10,000", totalQuantity: "10", totalAmount: "100,000", profit: "-30,000", rate: "-30.00" },
};
export const AVERAGE_DOWN_FURTHER_AFTER: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "8000", quantity: "10" },
    ],
    current: "7000",
    expected: { average: "9,000", totalQuantity: "20", totalAmount: "180,000", profit: "-40,000", rate: "-22.22" },
};

/** 본전까지 필요한 상승률(현재가 8,000원 기준) — 수익률 계산기로 검산 */
export const BREAK_EVEN_BEFORE: ProfitExample = {
    buy: "8000",
    current: "10000",
    quantity: "1",
    expected: { rate: "+25.00", profit: "+2,000", evalAmount: "10,000" },
};
export const BREAK_EVEN_AFTER: ProfitExample = {
    buy: "8000",
    current: "9000",
    quantity: "1",
    expected: { rate: "+12.50", profit: "+1,000", evalAmount: "9,000" },
};

/** 불타기 전후: 10,000원에 10주 보유, 12,000원에 10주 추가, 현재가 12,000원 */
export const AVERAGE_UP_BEFORE: AverageExample = {
    rows: [{ price: "10000", quantity: "10" }],
    current: "12000",
    expected: { average: "10,000", totalQuantity: "10", totalAmount: "100,000", profit: "+20,000", rate: "+20.00" },
};
export const AVERAGE_UP_AFTER: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "12000", quantity: "10" },
    ],
    current: "12000",
    expected: { average: "11,000", totalQuantity: "20", totalAmount: "220,000", profit: "+20,000", rate: "+9.09" },
};
/** 불타기 후 11,000원으로 내렸을 때 */
export const AVERAGE_UP_PULLBACK: AverageExample = {
    rows: [
        { price: "10000", quantity: "10" },
        { price: "12000", quantity: "10" },
    ],
    current: "11000",
    expected: { average: "11,000", totalQuantity: "20", totalAmount: "220,000", profit: "+0", rate: "+0.00" },
};

export const PROFIT_EXAMPLES = { PROFIT_BASIC, PROFIT_WRONG_BASIS, PROFIT_AVERAGE_BASIS, BREAK_EVEN_BEFORE, BREAK_EVEN_AFTER };
export const AVERAGE_EXAMPLES = {
    PROFIT_SPLIT_BUYS,
    AVERAGE_BASIC,
    AVERAGE_DOWN_BEFORE,
    AVERAGE_DOWN_AFTER,
    AVERAGE_DOWN_FURTHER_BEFORE,
    AVERAGE_DOWN_FURTHER_AFTER,
    AVERAGE_UP_BEFORE,
    AVERAGE_UP_AFTER,
    AVERAGE_UP_PULLBACK,
};

/**
 * 나머지 계산기 페이지의 계산 사례(2026-11-09 설명 정리).
 *
 * inputs 의 키는 각 계산기 입력란의 id, expected 의 키는 결과 항목 라벨이다(라벨이 겹치면 "라벨|단위").
 * 기대값은 Python Fraction/Decimal 로 따로 계산한 값이며 구현 결과를 복사하지 않았다.
 * 표시 형식(소수 자릿수·부호·단위 포함 여부)은 각 계산기의 결과 표시 방식을 그대로 따른다.
 */
export type CalculatorExample = {
    inputs: Record<string, string>;
    expected: Record<string, string>;
};

/** 목표가 계산기: 50,000원 매수, 목표 수익률 15% → 57,500원 (수수료·세금 미반영) */
export const TARGET_BASIC: CalculatorExample = {
    inputs: { buyPrice: "50000", targetRate: "15" },
    expected: { "목표 가격": "57,500", "주당 예상 수익": "7,500", "목표 수익률": "15" },
};

/** 손절가 계산기: 10,000원 100주, 손절 비율 5% → 손절가 9,500원, 예상 손실 50,000원 */
export const STOP_LOSS_BASIC: CalculatorExample = {
    inputs: { "sl-buy-price": "10000", "sl-quantity": "100", "sl-percent": "5" },
    expected: {
        "손절가": "9,500원",
        "1주당 손실 금액": "500원",
        "총 손실 금액": "50,000원",
        "총 매수 금액": "1,000,000원",
        "총 손실 비율": "5.00%",
    },
};

/** 본전 회복 계산기: 손실률 → 원금 회복에 필요한 상승률(%) */
export const BREAK_EVEN_LOSS_20: CalculatorExample = { inputs: { lossRate: "20" }, expected: { "본전 회복 요구 상승률": "+25.00" } };
export const BREAK_EVEN_LOSS_30: CalculatorExample = { inputs: { lossRate: "30" }, expected: { "본전 회복 요구 상승률": "+42.86" } };
export const BREAK_EVEN_LOSS_50: CalculatorExample = { inputs: { lossRate: "50" }, expected: { "본전 회복 요구 상승률": "+100.00" } };

/** 손익비 계산기: 진입 10,000·손절 9,500·목표 11,500 → 손익비 3.00R, 손익분기 승률 25.0% */
export const RISK_REWARD_BASIC: CalculatorExample = {
    inputs: { entryPrice: "10000", stopPrice: "9500", targetPrice: "11500" },
    expected: { "손익비": "3.00", "리스크 금액": "500", "보상 금액": "1,500", "손익분기 승률": "25.0" },
};

/** 포지션 사이즈: 자본 1,000만 원, 허용 손실 1%, 진입 10,000·손절 9,500 → 200주, 200만 원 */
export const POSITION_BASIC: CalculatorExample = {
    inputs: { totalCapital: "10000000", riskPercent: "1", entryPrice: "10000", stopLossPrice: "9500" },
    expected: { "권장 매수 금액 (포지션 크기)": "2,000,000", "권장 매수 수량": "200", "총 자본 대비 비중": "20.0" },
};
/** 같은 조건에서 손절가 9,700원 → 100,000 ÷ 300 = 333.33… → 333주로 내림 */
export const POSITION_FLOOR: CalculatorExample = {
    inputs: { totalCapital: "10000000", riskPercent: "1", entryPrice: "10000", stopLossPrice: "9700" },
    expected: { "권장 매수 금액 (포지션 크기)": "3,330,000", "권장 매수 수량": "333", "총 자본 대비 비중": "33.3" },
};

/** 배당 수익 계산기(원화): 100주 × 1,500원, 평균 매수가 50,000원, 세율 15.4% → 세후 126,900원 */
export const DIVIDEND_BASIC: CalculatorExample = {
    inputs: { shares: "100", dividendPerShare: "1500", buyPrice: "50000", taxRate: "15.4" },
    expected: {
        "세전 총 배당금": "150,000",
        "세금": "23,100",
        "세후 총 배당금": "126,900",
        "총 투자금": "5,000,000",
        "세전 배당수익률": "3",
        "세후 배당수익률": "2.54",
    },
};

/** 복리 계산기(월복리·매월 말 납입): 초기 500만 원, 월 30만 원, 연 8%, 20년 */
export const COMPOUND_BASIC: CalculatorExample = {
    inputs: { initial: "5000000", monthly: "300000", rate: "8", years: "20" },
    expected: { "최종 자산": "201,340,139", "총 투자금": "77,000,000", "총 수익": "124,340,139" },
};
/** 초기 1,000만 원, 월 30만 원, 연 7%, 10년 */
export const COMPOUND_TEN_YEARS: CalculatorExample = {
    inputs: { initial: "10000000", monthly: "300000", rate: "7", years: "10" },
    expected: { "최종 자산": "72,022,056", "총 투자금": "46,000,000", "총 수익": "26,022,056" },
};

/** 해외주식 세금 계산기: 매수 1,000만 원·매도 1,600만 원·기본공제 250만 원 → 세금 77만 원(22%) */
export const OVERSEAS_TAX_BASIC: CalculatorExample = {
    inputs: { buyAmount: "10000000", sellAmount: "16000000", deduction: "2500000" },
    expected: { "총 손익": "6,000,000", "과세 대상 금액": "3,500,000", "입력값 기준 예상 세금": "770,000", "세후 손익": "5,230,000" },
};

/** 코인 수익 계산기(현물): 50,000 → 60,000 USDT, 1개, 매수·매도 수수료 0.05% */
export const CRYPTO_PROFIT_BASIC: CalculatorExample = {
    inputs: { buyPrice: "50000", sellPrice: "60000", quantity: "1", buyFeeRate: "0.05", sellFeeRate: "0.05" },
    expected: {
        "총 매수 금액(수수료 포함)": "50,025",
        "총 매도 금액(수수료 차감)": "59,970",
        "총 수수료": "55",
        "수수료 반영 전 손익": "10,000",
        "실제 순손익": "9,945",
        "수익률": "19.88",
    },
};

/** 코인 레버리지 수익: 70,000 → 73,500 USDT 롱, 증거금 1,000 USDT, 10배, 수수료율 0.05% */
export const CRYPTO_LEVERAGE_BASIC: CalculatorExample = {
    inputs: { entryPrice: "70000", exitPrice: "73500", margin: "1000", leverage: "10", feeRate: "0.05" },
    expected: {
        "포지션 규모": "10,000",
        "가격 변동률": "5",
        "수수료 반영 전 손익": "500",
        "총 수수료": "10.25",
        "실제 순손익": "489.75",
        "증거금 대비 수익률(ROE)": "48.98",
    },
};

/** 코인 펀딩비: 포지션 10,000 USDT, 펀딩비율 +0.01%, 3회, 롱(기본) → 1회 −1, 누적 −3(지급) */
export const CRYPTO_FUNDING_BASIC: CalculatorExample = {
    inputs: { positionSize: "10000", fundingRate: "0.01", fundingCount: "3" },
    expected: { "총 예상 펀딩비 (지급)": "-3", "1회당 펀딩비": "-1", "누적 펀딩비": "-3" },
};

/** 코인 레버리지 진입: 진입 10,000·손절 9,900 USDT, 원금 100, 리스크 5%, 손익비 1.5 */
export const CRYPTO_ENTRY_BASIC: CalculatorExample = {
    inputs: { entryPrice: "10000", stopPrice: "9900", seed: "100", riskPercent: "5", rewardRatio: "1.5" },
    expected: { "손절폭": "1", "이론 배율": "100", "리스크 금액": "5", "주문 명목가치": "500", "익절가": "10,150" },
};

/** 코인 청산가: 70,000 USDT 롱(기본), 10배, 유지증거금률 0.5% → 근사 청산가 63,350 */
export const CRYPTO_LIQUIDATION_BASIC: CalculatorExample = {
    inputs: { entryPrice: "70000", leverage: "10", maintenanceMarginRate: "0.5" },
    expected: { "격리마진 근사 청산가": "63,350", "파산 가격(이론값)": "63,000", "진입가 대비 변동 폭": "9.5" },
};

/** 코인 물타기: 70,000 USDT × 0.2개 + 60,000 USDT × 0.1개, 현재가 64,000 USDT */
export const CRYPTO_AVERAGE_BASIC: AverageExample = {
    rows: [
        { price: "70000", quantity: "0.2" },
        { price: "60000", quantity: "0.1" },
    ],
    current: "64000",
    expected: { average: "66,666.67", totalQuantity: "0.3", totalAmount: "20,000", profit: "-800", rate: "-4.00" },
};

/** 미국주식 환율 반영 수익: 100 → 120달러 10주, 환율 1,350 → 1,380원, 수수료 0 */
export const US_EXCHANGE_BASIC: CalculatorExample = {
    inputs: { buyPriceUsd: "100", sellPriceUsd: "120", quantity: "10", buyExchangeRate: "1350", sellExchangeRate: "1380" },
    expected: {
        "총 매수 금액": "1,000",
        "총 매도 금액": "1,200",
        "원화 매수 금액": "1,350,000",
        "원화 매도 금액": "1,656,000",
        "달러 기준 손익": "+200",
        "원화 기준 실제 손익": "+306,000",
        "원화 기준 수익률": "22.67",
        "환율 효과 (수수료 제외)": "+36,000",
        "매매 수수료 합계": "0",
    },
};

/** 미국주식 배당: 100주 × 연 2달러, 매수가 50달러, 환율 1,350원, 원천징수 15% */
export const US_DIVIDEND_BASIC: CalculatorExample = {
    inputs: { shares: "100", annualDividendPerShareUsd: "2", buyPriceUsd: "50", exchangeRate: "1350", withholdingTaxRate: "15" },
    expected: {
        "연간 세전 배당금|USD": "200",
        "원천징수 세금": "30",
        "연간 세후 배당금|USD": "170",
        "연간 세전 배당금|원": "270,000",
        "연간 세후 배당금|원": "229,500",
        "월 예상 세후 배당금": "19,125",
        "세전 배당수익률": "4",
        "세후 배당수익률": "3.4",
    },
};

export const CALCULATOR_EXAMPLES = {
    TARGET_BASIC,
    STOP_LOSS_BASIC,
    BREAK_EVEN_LOSS_20,
    BREAK_EVEN_LOSS_30,
    BREAK_EVEN_LOSS_50,
    RISK_REWARD_BASIC,
    POSITION_BASIC,
    POSITION_FLOOR,
    DIVIDEND_BASIC,
    COMPOUND_BASIC,
    COMPOUND_TEN_YEARS,
    OVERSEAS_TAX_BASIC,
    CRYPTO_PROFIT_BASIC,
    CRYPTO_LEVERAGE_BASIC,
    CRYPTO_FUNDING_BASIC,
    CRYPTO_ENTRY_BASIC,
    CRYPTO_LIQUIDATION_BASIC,
    US_EXCHANGE_BASIC,
    US_DIVIDEND_BASIC,
};
