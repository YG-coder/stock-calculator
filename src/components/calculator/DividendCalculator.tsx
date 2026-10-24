"use client";
import {
    EXACT_ZERO,
    compare,
    div,
    formatGrouped,
    fromInt,
    mul,
    requiredNumberExact,
    sign,
    sub,
    type Exact,
} from "@/lib/exactDecimal";

import { withParticle } from "@/lib/korean";
import { useMemo, useState, type ChangeEvent } from "react";
import {
    DOMESTIC_DIVIDEND_TAX,
    FINANCIAL_INCOME_THRESHOLD,
    US_DIVIDEND_WITHHOLDING,
} from "@/lib/taxRates";
import {
    CalculatorLayout,
    CalculatorCard,
    ResultCard,
    ResultHighlight,
    ResultDetail,
    InputField,
} from "@/components/ui/Shared";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";
import CommaBreaks from "@/components/calculator/CommaBreaks";

type Currency = "KRW" | "USD";

// 세율 기본값·안내 문구는 모두 taxRates.ts 를 단일 소스로 삼는다.
// 국내 배당은 원천징수세율, 미국 배당은 한미 조세조약에 따른 현지 원천징수세율을 쓴다.
const DEFAULT_TAX_RATE: Record<Currency, string> = {
    KRW: String(DOMESTIC_DIVIDEND_TAX.ratePercent),
    USD: String(US_DIVIDEND_WITHHOLDING.ratePercent),
};

// 입력 십진값으로 정확히 계산한 값을 기존 Intl 규칙(최대 2자리, 0에서 먼 쪽, 쉼표)으로 표시 단계에서 한 번만 반올림한다.
function formatNumber(value: Exact, maximumFractionDigits = 2) {
    return formatGrouped(value, maximumFractionDigits);
}

const INVALID = {
    valid: false,
    grossDividend: EXACT_ZERO,
    taxAmount: EXACT_ZERO,
    netDividend: EXACT_ZERO,
    totalInvestment: EXACT_ZERO,
    grossYield: EXACT_ZERO,
    netYield: EXACT_ZERO,
};

export default function DividendCalculator() {
    const [currency, setCurrency] = useState<Currency>("KRW");

    const [shares, setShares] = useState("");
    const [dividendPerShare, setDividendPerShare] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [taxRate, setTaxRate] = useState("");

    const moneyUnit = currency === "KRW" ? "원" : "USD";

    const handleCurrencyChange = (next: Currency) => {
        setCurrency(next);
    };

    const handleTaxRateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaxRate(e.target.value);
    };

    // 세율을 비워 두면 Number("") === 0 이라 세금 0원으로 계산되어
    // "세후 배당금 = 세전 배당금"이 정상 결과처럼 보인다.
    // 미입력과 0% 를 구분해 조용히 통과시키지 않는다.
    const taxRateEntered = taxRate.trim() !== "";

    const result = useMemo(() => {
        // requiredNumber와 같은 계약(빈칸은 미입력)으로 입력 십진값을 정확히 읽는다.
        const qty = requiredNumberExact(shares);
        const dividend = requiredNumberExact(dividendPerShare);
        const price = requiredNumberExact(buyPrice);
        const taxPercent = requiredNumberExact(taxRate);

        if (taxRate.trim() === "") {
            return INVALID;
        }

        if (
            !qty ||
            !dividend ||
            !price ||
            !taxPercent ||
            sign(qty) <= 0 ||
            sign(dividend) < 0 ||
            sign(price) <= 0 ||
            sign(taxPercent) < 0 ||
            compare(taxPercent, fromInt(100)) >= 0
        ) {
            return INVALID;
        }

        // 정확한 유리수 계산(중간 반올림 없음)
        const grossDividend = mul(qty, dividend);
        const taxAmount = mul(grossDividend, div(taxPercent, fromInt(100)));
        const netDividend = sub(grossDividend, taxAmount);
        const totalInvestment = mul(qty, price);
        const grossYield = mul(div(grossDividend, totalInvestment), fromInt(100));
        const netYield = mul(div(netDividend, totalInvestment), fromInt(100));

        return {
            valid: true,
            grossDividend,
            taxAmount,
            netDividend,
            totalInvestment,
            grossYield,
            netYield,
        };
    }, [shares, dividendPerShare, buyPrice, taxRate]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="배당 수익 계산기"
                description="보유 수량, 주당 배당금, 평균 매수가, 세율을 입력하면 세전·세후 배당금과 배당수익률을 계산할 수 있습니다."
            >
                <CurrencyToggle
                    value={currency}
                    onChange={handleCurrencyChange}
                    options={["KRW", "USD"] as const}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="shares"
                        label="보유 수량"
                        type="number"
                        placeholder="예: 100"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                    />
                    <InputField
                        id="dividendPerShare"
                        label="주당 배당금"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 500" : "예: 2"}
                        unit={moneyUnit}
                        value={dividendPerShare}
                        onChange={(e) => setDividendPerShare(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyPrice"
                        label="평균 매수가"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 10000" : "예: 50"}
                        unit={moneyUnit}
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                    <InputField
                        id="taxRate"
                        label="세율"
                        type="number"
                        placeholder={`예: ${DEFAULT_TAX_RATE[currency]}`}
                        unit="%"
                        value={taxRate}
                        onChange={handleTaxRateChange}
                    />
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다. 세율 입력 예시는 국내{" "}
                    {DOMESTIC_DIVIDEND_TAX.rateDisplay}, 미국 {US_DIVIDEND_WITHHOLDING.rateDisplay}(현지
                    원천징수 기준)이며, 실제 적용할 세율을 직접 입력하세요.
                </p>
            </CalculatorCard>

            <ResultCard
                title="배당 수익 계산 결과"
                emptyMessage={
                    taxRateEntered
                        ? "보유 수량, 배당금, 평균 매수가를 입력하면 결과가 계산됩니다."
                        : "보유 수량, 배당금, 평균 매수가와 함께 세율을 입력하면 결과가 계산됩니다. 세율을 비워 두면 세후 금액을 계산할 수 없습니다."
                }
                isValid={result.valid}
            >
                {/* 긴 금액이 좁은 화면에서 카드 밖으로 넘치지 않게 쉼표 뒤 줄바꿈(글자 크기·숫자·단위 그대로) */}
                <CommaBreaks>
                    <ResultHighlight
                        label="세후 총 배당금"
                        value={formatNumber(result.netDividend)}
                        unit={moneyUnit}
                        tone="positive"
                    />
                </CommaBreaks>

                <div className="grid gap-4 sm:grid-cols-2">
                    <CommaBreaks>
                        <ResultDetail
                            label="세전 총 배당금"
                            value={formatNumber(result.grossDividend)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="세금"
                            value={formatNumber(result.taxAmount)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="총 투자금"
                            value={formatNumber(result.totalInvestment)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="세전 배당수익률"
                            value={formatNumber(result.grossYield)}
                            unit="%"
                        />
                        <ResultDetail
                            label="세후 배당수익률"
                            value={formatNumber(result.netYield)}
                            unit="%"
                        />
                    </CommaBreaks>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    연간 이자·배당 금융소득 합계가 {withParticle(FINANCIAL_INCOME_THRESHOLD.amountDisplay, "을/를")} 초과하면
                    금융소득종합과세 대상이 될 수 있으며 실제 세금은 달라질 수 있습니다.
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}
