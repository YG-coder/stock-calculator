"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { DOMESTIC_DIVIDEND_TAX, US_DIVIDEND_WITHHOLDING } from "@/lib/taxRates";
import {
    CalculatorLayout,
    CalculatorCard,
    ResultCard,
    ResultHighlight,
    ResultDetail,
    InputField,
} from "@/components/ui/Shared";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";

type Currency = "KRW" | "USD";

// 국내 배당소득세(15.4%, 소득세 14% + 지방소득세 1.4%)와 달리
// 미국 배당은 한미 조세조약에 따른 현지 원천징수세율(15%)을 기본값으로 사용합니다.
// (사이트 내 "미국주식 배당 계산기" 안내 기준과 동일)
const DEFAULT_TAX_RATE: Record<Currency, string> = {
    KRW: String(DOMESTIC_DIVIDEND_TAX.ratePercent),
    USD: String(US_DIVIDEND_WITHHOLDING.ratePercent),
};

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

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
        const qty = Number(shares);
        const dividend = Number(dividendPerShare);
        const price = Number(buyPrice);
        const tax = Number(taxRate) / 100;

        if (taxRate.trim() === "") {
            return {
                valid: false,
                grossDividend: 0,
                taxAmount: 0,
                netDividend: 0,
                totalInvestment: 0,
                grossYield: 0,
                netYield: 0,
            };
        }

        if (
            !Number.isFinite(qty) ||
            !Number.isFinite(dividend) ||
            !Number.isFinite(price) ||
            !Number.isFinite(tax) ||
            qty <= 0 ||
            dividend < 0 ||
            price <= 0 ||
            tax < 0 ||
            tax >= 1
        ) {
            return {
                valid: false,
                grossDividend: 0,
                taxAmount: 0,
                netDividend: 0,
                totalInvestment: 0,
                grossYield: 0,
                netYield: 0,
            };
        }

        const grossDividend = qty * dividend;
        const taxAmount = grossDividend * tax;
        const netDividend = grossDividend - taxAmount;
        const totalInvestment = qty * price;
        const grossYield =
            totalInvestment > 0 ? (grossDividend / totalInvestment) * 100 : 0;
        const netYield =
            totalInvestment > 0 ? (netDividend / totalInvestment) * 100 : 0;

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
                    국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다. 세율 입력 예시는 국내
                    15.4%, 미국 15%(현지 원천징수 기준)이며, 실제 적용할 세율을 직접 입력하세요.
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
                <ResultHighlight
                    label="세후 총 배당금"
                    value={formatNumber(result.netDividend)}
                    unit={moneyUnit}
                    tone="positive"
                />

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    연간 이자·배당 금융소득 합계가 2,000만원을 초과하면 금융소득종합과세 대상이 될 수
                    있으며 실제 세금은 달라질 수 있습니다.
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}
