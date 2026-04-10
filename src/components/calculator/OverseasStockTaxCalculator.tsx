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
    const [deduction, setDeduction] = useState("2500000");

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

        const grossGain = sell - buy + fx;
        const taxableGain = Math.max(0, grossGain - basicDeduction);
        const taxAmount = taxableGain * 0.22;
        const netGain = grossGain - taxAmount;
        const effectiveRate = sell > 0 ? (taxAmount / sell) * 100 : 0;

        return {
            valid: buy > 0 || sell > 0,
            grossGain,
            taxableGain,
            taxAmount,
            netGain,
            effectiveRate,
        };
    }, [buyAmount, sellAmount, exchangeGain, deduction]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="해외주식 양도세 계산 조건 입력"
                description="매수 금액, 매도 금액, 환차익/환차손, 기본공제 금액을 입력하세요."
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
                    label="환차익 / 환차손"
                    type="number"
                    placeholder="예: 300000"
                    unit="원"
                    value={exchangeGain}
                    onChange={(e) => setExchangeGain(e.target.value)}
                />

                <InputField
                    id="deduction"
                    label="기본공제 금액"
                    type="number"
                    placeholder="예: 2500000"
                    unit="원"
                    value={deduction}
                    onChange={(e) => setDeduction(e.target.value)}
                />
            </CalculatorCard>

            <ResultCard
                title="해외주식 세금 계산 결과"
                emptyMessage="매수/매도 금액을 입력하면 예상 양도세와 세후 수익이 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="예상 양도소득세"
                    value={formatNumber(result.taxAmount)}
                    unit="원"
                    tone={
                        result.taxAmount > 0
                            ? "negative"
                            : result.taxAmount < 0
                                ? "positive"
                                : "default"
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 수익"
                        value={formatNumber(result.grossGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="과세 대상 수익"
                        value={formatNumber(result.taxableGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="세후 수익"
                        value={formatNumber(result.netGain)}
                        unit="원"
                    />
                    <ResultDetail
                        label="매도금 대비 세금 비율"
                        value={result.effectiveRate.toFixed(2)}
                        unit="%"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}