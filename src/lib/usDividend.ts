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
 * 미국주식 배당 계산.
 *
 * 원천징수세율을 비워 두면 Number("") === 0 이라 세금 0원으로 계산되어
 * "세후 = 세전"이 정상 결과처럼 보인다. 국내 배당 계산기와 같은 기준으로
 * 빈칸은 계산하지 않고, 0 을 직접 입력한 경우에만 0% 로 계산한다.
 */
export function calculateUsDividend({
    shares,
    annualDividendPerShareUsd,
    buyPriceUsd,
    exchangeRate,
    withholdingTaxRate,
}: UsDividendInput): UsDividendResult {
    if (withholdingTaxRate.trim() === "") {
        return { ...INVALID, missingFields: ["withholdingTaxRate"] };
    }

    const qty = Number(shares);
    const annualDividend = Number(annualDividendPerShareUsd);
    const buyPrice = Number(buyPriceUsd);
    const rate = Number(exchangeRate);
    const taxRatePercent = Number(withholdingTaxRate);

    if (
        !Number.isFinite(qty) ||
        !Number.isFinite(annualDividend) ||
        !Number.isFinite(buyPrice) ||
        !Number.isFinite(rate) ||
        !Number.isFinite(taxRatePercent) ||
        qty <= 0 ||
        annualDividend < 0 ||
        buyPrice <= 0 ||
        rate <= 0 ||
        taxRatePercent < 0 ||
        taxRatePercent >= 100
    ) {
        return INVALID;
    }

    const taxRate = taxRatePercent / 100;
    const grossAnnualDividendUsd = qty * annualDividend;
    const taxAmountUsd = grossAnnualDividendUsd * taxRate;
    const netAnnualDividendUsd = grossAnnualDividendUsd - taxAmountUsd;

    const grossAnnualDividendKrw = grossAnnualDividendUsd * rate;
    const netAnnualDividendKrw = netAnnualDividendUsd * rate;
    const monthlyNetDividendKrw = netAnnualDividendKrw / 12;

    const totalBuyAmountUsd = qty * buyPrice;
    const grossYield =
        totalBuyAmountUsd > 0 ? (grossAnnualDividendUsd / totalBuyAmountUsd) * 100 : 0;
    const netYield =
        totalBuyAmountUsd > 0 ? (netAnnualDividendUsd / totalBuyAmountUsd) * 100 : 0;

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
