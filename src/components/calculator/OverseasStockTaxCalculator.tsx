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

function formatNumber(value: number) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        maximumFractionDigits: 0,
    }).format(value);
}

export default function OverseasStockTaxCalculator() {
    const [buyAmount, setBuyAmount] = useState("");
    const [sellAmount, setSellAmount] = useState("");
    const [exchangeGain, setExchangeGain] = useState("");
    const [deduction, setDeduction] = useState("");

    const result = useMemo(() => {
        const buy = Number(buyAmount);
        const sell = Number(sellAmount);
        const fx = Number(exchangeGain || "0");
        const basicDeduction = Number(deduction);

        if (
            !Number.isFinite(buy) ||
            !Number.isFinite(sell) ||
            !Number.isFinite(fx) ||
            !Number.isFinite(basicDeduction) ||
            buy < 0 ||
            sell < 0 ||
            basicDeduction < 0
        ) {
            return {
                valid: false,
                grossGain: 0,
                taxableGain: 0,
                taxAmount: 0,
                netGain: 0,
                effectiveRate: 0,
            };
        }

        if (buy <= 0 && sell <= 0) {
            return {
                valid: false,
                grossGain: 0,
                taxableGain: 0,
                taxAmount: 0,
                netGain: 0,
                effectiveRate: 0,
            };
        }

        const grossGain = sell - buy + fx;
        const taxableGain = Math.max(0, grossGain - basicDeduction);
        const taxAmount = taxableGain * 0.22;
        const netGain = grossGain - taxAmount;
        const effectiveRate = sell > 0 ? (taxAmount / sell) * 100 : 0;

        return {
            valid: true,
            grossGain,
            taxableGain,
            taxAmount,
            netGain,
            effectiveRate,
        };
    }, [buyAmount, sellAmount, exchangeGain, deduction]);

    const tone =
        result.taxAmount > 0 ? "negative" : result.taxAmount < 0 ? "positive" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="해외주식 양도소득세 입력"
                description="매수 금액, 매도 금액, 환차익, 기본공제를 입력하면 예상 과세 대상 금액과 세금을 계산할 수 있습니다."
            >
                <InputField
                    id="buyAmount"
                    label="총 매수 금액"
                    type="number"
                    placeholder="예: 10000000"
                    unit="원"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                />
                <InputField
                    id="sellAmount"
                    label="총 매도 금액"
                    type="number"
                    placeholder="예: 15000000"
                    unit="원"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                />
                <InputField
                    id="exchangeGain"
                    label="환차익"
                    type="number"
                    placeholder="예: 300000"
                    unit="원"
                    value={exchangeGain}
                    onChange={(e) => setExchangeGain(e.target.value)}
                />
                <InputField
                    id="deduction"
                    label="기본공제"
                    type="number"
                    placeholder="예: 2500000"
                    unit="원"
                    value={deduction}
                    onChange={(e) => setDeduction(e.target.value)}
                />

                <p className="text-sm text-slate-500">
                    값을 입력하면 결과가 자동으로 계산됩니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="해외주식 세금 계산 결과"
                emptyMessage="값을 입력하면 결과가 자동으로 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="예상 세금"
                    value={formatNumber(result.taxAmount)}
                    unit="원"
                    tone={tone}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 손익"
                        value={formatNumber(result.grossGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="과세 대상 금액"
                        value={formatNumber(result.taxableGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="세후 손익"
                        value={formatNumber(result.netGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="실효 세율"
                        value={formatNumber(result.effectiveRate)}
                        unit="%"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}