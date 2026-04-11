"use client";

import { useMemo, useState } from "react";
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

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function DividendCalculator() {
    const [currency, setCurrency] = useState<Currency>("KRW");

    const [shares, setShares] = useState("100");
    const [dividendPerShare, setDividendPerShare] = useState("500");
    const [buyPrice, setBuyPrice] = useState("10000");
    const [taxRate, setTaxRate] = useState("15.4");

    const moneyUnit = currency === "KRW" ? "원" : "USD";

    const result = useMemo(() => {
        const qty = Number(shares);
        const dividend = Number(dividendPerShare);
        const price = Number(buyPrice);
        const tax = Number(taxRate) / 100;

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
                    onChange={setCurrency}
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
                        placeholder="예: 15.4"
                        unit="%"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                    />
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="배당 수익 계산 결과"
                emptyMessage="보유 수량, 배당금, 평균 매수가를 입력하면 결과가 계산됩니다."
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
            </ResultCard>
        </CalculatorLayout>
    );
}