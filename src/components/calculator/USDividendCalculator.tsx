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

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function USDividendCalculator() {
    const [shares, setShares] = useState("100");
    const [annualDividendPerShareUsd, setAnnualDividendPerShareUsd] = useState("2");
    const [buyPriceUsd, setBuyPriceUsd] = useState("50");
    const [exchangeRate, setExchangeRate] = useState("1350");
    const [withholdingTaxRate, setWithholdingTaxRate] = useState("15");

    const result = useMemo(() => {
        const qty = Number(shares);
        const annualDividend = Number(annualDividendPerShareUsd);
        const buyPrice = Number(buyPriceUsd);
        const rate = Number(exchangeRate);
        const taxRate = Number(withholdingTaxRate) / 100;

        if (
            !Number.isFinite(qty) ||
            !Number.isFinite(annualDividend) ||
            !Number.isFinite(buyPrice) ||
            !Number.isFinite(rate) ||
            !Number.isFinite(taxRate) ||
            qty <= 0 ||
            annualDividend < 0 ||
            buyPrice <= 0 ||
            rate <= 0 ||
            taxRate < 0 ||
            taxRate >= 1
        ) {
            return {
                valid: false,
                grossAnnualDividendUsd: 0,
                netAnnualDividendUsd: 0,
                grossAnnualDividendKrw: 0,
                netAnnualDividendKrw: 0,
                monthlyNetDividendKrw: 0,
                grossYield: 0,
                netYield: 0,
                taxAmountUsd: 0,
            };
        }

        const grossAnnualDividendUsd = qty * annualDividend;
        const taxAmountUsd = grossAnnualDividendUsd * taxRate;
        const netAnnualDividendUsd = grossAnnualDividendUsd - taxAmountUsd;

        const grossAnnualDividendKrw = grossAnnualDividendUsd * rate;
        const netAnnualDividendKrw = netAnnualDividendUsd * rate;
        const monthlyNetDividendKrw = netAnnualDividendKrw / 12;

        const totalBuyAmountUsd = qty * buyPrice;
        const grossYield = totalBuyAmountUsd > 0 ? (grossAnnualDividendUsd / totalBuyAmountUsd) * 100 : 0;
        const netYield = totalBuyAmountUsd > 0 ? (netAnnualDividendUsd / totalBuyAmountUsd) * 100 : 0;

        return {
            valid: true,
            grossAnnualDividendUsd,
            netAnnualDividendUsd,
            grossAnnualDividendKrw,
            netAnnualDividendKrw,
            monthlyNetDividendKrw,
            grossYield,
            netYield,
            taxAmountUsd,
        };
    }, [shares, annualDividendPerShareUsd, buyPriceUsd, exchangeRate, withholdingTaxRate]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="미국주식 배당 계산기"
                description="보유 수량, 연간 주당 배당금, 매수가, 환율, 원천징수세율을 입력하면 세전·세후 배당금과 배당수익률을 계산할 수 있습니다."
            >
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
                        id="annualDividendPerShareUsd"
                        label="연간 주당 배당금"
                        type="number"
                        placeholder="예: 2"
                        unit="USD"
                        value={annualDividendPerShareUsd}
                        onChange={(e) => setAnnualDividendPerShareUsd(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyPriceUsd"
                        label="평균 매수가"
                        type="number"
                        placeholder="예: 50"
                        unit="USD"
                        value={buyPriceUsd}
                        onChange={(e) => setBuyPriceUsd(e.target.value)}
                    />
                    <InputField
                        id="exchangeRate"
                        label="환율"
                        type="number"
                        placeholder="예: 1350"
                        unit="원/USD"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(e.target.value)}
                    />
                </div>

                <InputField
                    id="withholdingTaxRate"
                    label="배당 원천징수세율"
                    type="number"
                    placeholder="예: 15"
                    unit="%"
                    value={withholdingTaxRate}
                    onChange={(e) => setWithholdingTaxRate(e.target.value)}
                />

                <p className="text-sm leading-relaxed text-slate-500">
                    미국주식 배당은 보통 원천징수 후 실수령액이 달라지므로, 세전 배당금과 세후 배당금을 함께 확인하는 것이 중요합니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="미국주식 배당 계산 결과"
                emptyMessage="보유 수량과 배당금 정보를 입력하면 결과가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="연간 세후 배당금"
                    value={formatNumber(result.netAnnualDividendKrw)}
                    unit="원"
                    tone="positive"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="연간 세전 배당금"
                        value={formatNumber(result.grossAnnualDividendUsd)}
                        unit="USD"
                    />
                    <ResultDetail
                        label="연간 세후 배당금"
                        value={formatNumber(result.netAnnualDividendUsd)}
                        unit="USD"
                    />
                    <ResultDetail
                        label="연간 세전 배당금(원화)"
                        value={formatNumber(result.grossAnnualDividendKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="월 예상 세후 배당금"
                        value={formatNumber(result.monthlyNetDividendKrw)}
                        unit="원"
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
                    <ResultDetail
                        label="원천징수 세금"
                        value={formatNumber(result.taxAmountUsd)}
                        unit="USD"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}