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
    const [shares, setShares] = useState("");
    const [annualDividendPerShareUsd, setAnnualDividendPerShareUsd] = useState("");
    const [buyPriceUsd, setBuyPriceUsd] = useState("");
    const [exchangeRate, setExchangeRate] = useState("");
    const [withholdingTaxRate, setWithholdingTaxRate] = useState("");

    const result = useMemo(() => {
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
                title="미국주식 배당 정보 입력"
                description="보유 주식 수, 주당 연간 배당금, 매수가, 환율, 원천징수세율을 입력하면 세전·세후 배당 수익을 계산할 수 있습니다."
            >
                <InputField
                    id="shares"
                    label="보유 수량"
                    type="number"
                    placeholder="예: 100"
                    unit="주"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                />
                <InputField
                    id="annualDividendPerShareUsd"
                    label="주당 연간 배당금"
                    type="number"
                    placeholder="예: 2"
                    unit="USD"
                    value={annualDividendPerShareUsd}
                    onChange={(e) => setAnnualDividendPerShareUsd(e.target.value)}
                />
                <InputField
                    id="buyPriceUsd"
                    label="매수가"
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
                    unit="원"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                />
                <InputField
                    id="withholdingTaxRate"
                    label="원천징수세율"
                    type="number"
                    placeholder="예: 15"
                    unit="%"
                    value={withholdingTaxRate}
                    onChange={(e) => setWithholdingTaxRate(e.target.value)}
                />

                <p className="text-sm text-slate-500">
                    값을 입력하면 결과가 자동으로 계산됩니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="미국주식 배당 계산 결과"
                emptyMessage="값을 입력하면 결과가 자동으로 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="월 예상 세후 배당금"
                    value={formatNumber(result.monthlyNetDividendKrw)}
                    unit="원"
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
                        label="연간 세전 배당금"
                        value={formatNumber(result.grossAnnualDividendKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="연간 세후 배당금"
                        value={formatNumber(result.netAnnualDividendKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="원천징수 세금"
                        value={formatNumber(result.taxAmountUsd)}
                        unit="USD"
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