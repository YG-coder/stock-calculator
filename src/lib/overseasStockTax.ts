import { OVERSEAS_STOCK_TAX } from "@/lib/taxRates";

export type OverseasStockTaxInput = {
    buyAmount: string;
    sellAmount: string;
    deduction: string;
};

export type OverseasStockTaxField = keyof OverseasStockTaxInput;

export type OverseasStockTaxResult = {
    valid: boolean;
    /** 비어 있는 필수 입력. 빈칸은 0 으로 간주하지 않는다. */
    missingFields: OverseasStockTaxField[];
    grossGain: number;
    taxableGain: number;
    taxAmount: number;
    netGain: number;
    effectiveRate: number;
};

const INVALID: OverseasStockTaxResult = {
    valid: false,
    missingFields: [],
    grossGain: 0,
    taxableGain: 0,
    taxAmount: 0,
    netGain: 0,
    effectiveRate: 0,
};

const REQUIRED_FIELDS: OverseasStockTaxField[] = ["buyAmount", "sellAmount", "deduction"];

/**
 * 해외주식 양도소득세 입력값 기준 계산.
 *
 * 빈칸은 Number("") === 0 이라 그대로 두면 기본공제 0원(세금 2배)이나
 * 취득가 0원으로 조용히 계산된다. 세 입력 모두 빈칸이면 계산하지 않고,
 * 사용자가 0 을 직접 입력한 경우에만 0 으로 계산한다.
 */
export function calculateOverseasStockTax(input: OverseasStockTaxInput): OverseasStockTaxResult {
    const missingFields = REQUIRED_FIELDS.filter((field) => input[field].trim() === "");
    if (missingFields.length > 0) {
        return { ...INVALID, missingFields };
    }

    const { buyAmount, sellAmount, deduction } = input;
    const buy = Number(buyAmount);
    const sell = Number(sellAmount);
    const basicDeduction = Number(deduction);

    if (
        !Number.isFinite(buy) ||
        !Number.isFinite(sell) ||
        !Number.isFinite(basicDeduction) ||
        buy < 0 ||
        sell < 0 ||
        basicDeduction < 0
    ) {
        return INVALID;
    }

    if (buy <= 0 && sell <= 0) {
        return INVALID;
    }

    const grossGain = sell - buy;
    const taxableGain = Math.max(0, grossGain - basicDeduction);
    const taxAmount = taxableGain * OVERSEAS_STOCK_TAX.rate;
    const netGain = grossGain - taxAmount;
    const effectiveRate = grossGain > 0 ? (taxAmount / grossGain) * 100 : 0;

    return { valid: true, missingFields: [], grossGain, taxableGain, taxAmount, netGain, effectiveRate };
}
