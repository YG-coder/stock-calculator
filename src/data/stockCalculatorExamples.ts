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
