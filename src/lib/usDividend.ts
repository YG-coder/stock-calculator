import {
    EXACT_ZERO,
    compare,
    div,
    fromInt,
    mul,
    parseNumberExact,
    sign,
    sub,
    toNumber,
    type Exact,
} from "@/lib/exactDecimal";

export type UsDividendInput = {
    shares: string;
    annualDividendPerShareUsd: string;
    buyPriceUsd: string;
    exchangeRate: string;
    withholdingTaxRate: string;
};

export type UsDividendResult = {
    valid: boolean;
    /** 비어 있는 필수 입력. 현재는 원천징수세율만 빈칸과 0% 를 구분한다. */
    missingFields: (keyof UsDividendInput)[];
    grossAnnualDividendUsd: number;
    netAnnualDividendUsd: number;
    grossAnnualDividendKrw: number;
    netAnnualDividendKrw: number;
    monthlyNetDividendKrw: number;
    grossYield: number;
    netYield: number;
    taxAmountUsd: number;
};

/** 화면 표시용: 같은 결과를 입력 십진값의 정확한 유리수로 돌려준다(중간 반올림 없음). */
export type UsDividendExactResult = {
    valid: boolean;
    missingFields: (keyof UsDividendInput)[];
    grossAnnualDividendUsd: Exact;
    netAnnualDividendUsd: Exact;
    grossAnnualDividendKrw: Exact;
    netAnnualDividendKrw: Exact;
    monthlyNetDividendKrw: Exact;
    grossYield: Exact;
    netYield: Exact;
    taxAmountUsd: Exact;
};

const INVALID_EXACT: UsDividendExactResult = {
    valid: false,
    missingFields: [],
    grossAnnualDividendUsd: EXACT_ZERO,
    netAnnualDividendUsd: EXACT_ZERO,
    grossAnnualDividendKrw: EXACT_ZERO,
    netAnnualDividendKrw: EXACT_ZERO,
    monthlyNetDividendKrw: EXACT_ZERO,
    grossYield: EXACT_ZERO,
    netYield: EXACT_ZERO,
    taxAmountUsd: EXACT_ZERO,
};

const INVALID: UsDividendResult = {
    valid: false,
    missingFields: [],
    grossAnnualDividendUsd: 0,
    netAnnualDividendUsd: 0,
    grossAnnualDividendKrw: 0,
    netAnnualDividendKrw: 0,
    monthlyNetDividendKrw: 0,
    grossYield: 0,
    netYield: 0,
    taxAmountUsd: 0,
};

/**
 * 미국주식 배당 계산(정확 계산). 화면은 이 결과를 표시 단계에서 한 번만 반올림한다.
 *
 * 원천징수세율을 비워 두면 Number("") === 0 이라 세금 0원으로 계산되어
 * "세후 = 세전"이 정상 결과처럼 보인다. 국내 배당 계산기와 같은 기준으로
 * 빈칸은 계산하지 않고, 0 을 직접 입력한 경우에만 0% 로 계산한다.
 * 나머지 입력은 기존 Number(값)과 같은 계약(빈칸 → 0, '-'·'.' → 숫자 아님)으로 입력 십진값을 그대로 읽는다.
 */
export function calculateUsDividendExact({
    shares,
    annualDividendPerShareUsd,
    buyPriceUsd,
    exchangeRate,
    withholdingTaxRate,
}: UsDividendInput): UsDividendExactResult {
    if (withholdingTaxRate.trim() === "") {
        return { ...INVALID_EXACT, missingFields: ["withholdingTaxRate"] };
    }
    // 주당 배당금 빈칸을 0달러로 계산하지 않는다. 무배당이면 0을 직접 입력한다.
    if (annualDividendPerShareUsd.trim() === "") {
        return { ...INVALID_EXACT, missingFields: ["annualDividendPerShareUsd"] };
    }

    const qty = parseNumberExact(shares);
    const annualDividend = parseNumberExact(annualDividendPerShareUsd);
    const buyPrice = parseNumberExact(buyPriceUsd);
    const rate = parseNumberExact(exchangeRate);
    const taxRatePercent = parseNumberExact(withholdingTaxRate);

    if (
        !qty ||
        !annualDividend ||
        !buyPrice ||
        !rate ||
        !taxRatePercent ||
        sign(qty) <= 0 ||
        sign(annualDividend) < 0 ||
        sign(buyPrice) <= 0 ||
        sign(rate) <= 0 ||
        sign(taxRatePercent) < 0 ||
        compare(taxRatePercent, fromInt(100)) >= 0
    ) {
        return INVALID_EXACT;
    }

    const grossAnnualDividendUsd = mul(qty, annualDividend);
    const taxAmountUsd = mul(grossAnnualDividendUsd, div(taxRatePercent, fromInt(100)));
    const netAnnualDividendUsd = sub(grossAnnualDividendUsd, taxAmountUsd);

    // 환율을 곱하거나 12로 나누기 전에 반올림하지 않는다.
    const grossAnnualDividendKrw = mul(grossAnnualDividendUsd, rate);
    const netAnnualDividendKrw = mul(netAnnualDividendUsd, rate);
    const monthlyNetDividendKrw = div(netAnnualDividendKrw, fromInt(12));

    const totalBuyAmountUsd = mul(qty, buyPrice);
    const grossYield = mul(div(grossAnnualDividendUsd, totalBuyAmountUsd), fromInt(100));
    const netYield = mul(div(netAnnualDividendUsd, totalBuyAmountUsd), fromInt(100));

    return {
        valid: true,
        missingFields: [],
        grossAnnualDividendUsd,
        netAnnualDividendUsd,
        grossAnnualDividendKrw,
        netAnnualDividendKrw,
        monthlyNetDividendKrw,
        grossYield,
        netYield,
        taxAmountUsd,
    };
}

/**
 * 미국주식 배당 계산(기존 Number API). 유효성·빈칸/0 구분은 calculateUsDividendExact와 같고,
 * 각 값은 정확한 결과에 가장 가까운 Number다. 화면 표시는 calculateUsDividendExact를 쓴다.
 */
export function calculateUsDividend(input: UsDividendInput): UsDividendResult {
    const r = calculateUsDividendExact(input);
    if (!r.valid) return { ...INVALID, missingFields: r.missingFields };
    return {
        valid: true,
        missingFields: [],
        grossAnnualDividendUsd: toNumber(r.grossAnnualDividendUsd),
        netAnnualDividendUsd: toNumber(r.netAnnualDividendUsd),
        grossAnnualDividendKrw: toNumber(r.grossAnnualDividendKrw),
        netAnnualDividendKrw: toNumber(r.netAnnualDividendKrw),
        monthlyNetDividendKrw: toNumber(r.monthlyNetDividendKrw),
        grossYield: toNumber(r.grossYield),
        netYield: toNumber(r.netYield),
        taxAmountUsd: toNumber(r.taxAmountUsd),
    };
}
