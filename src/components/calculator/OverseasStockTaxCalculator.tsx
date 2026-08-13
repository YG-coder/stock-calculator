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
    const [deduction, setDeduction] = useState("2500000");

    const result = useMemo(() => {
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

        const grossGain = sell - buy;
        const taxableGain = Math.max(0, grossGain - basicDeduction);
        const taxAmount = taxableGain * 0.22;
        const netGain = grossGain - taxAmount;
        // 실효세율 = 세금 ÷ 양도차익(총 손익) × 100. 라벨('실효 세율')과 정의를 일치시킴.
        // (매도금액을 분모로 쓰면 '매도금액 대비 세부담률'이 되어 라벨과 불일치)
        // 양도차익이 기본공제 이하이면 세금이 0이므로 실효세율도 0%로 표시됨.
        const effectiveRate = grossGain > 0 ? (taxAmount / grossGain) * 100 : 0;

        return {
            valid: true,
            grossGain,
            taxableGain,
            taxAmount,
            netGain,
            effectiveRate,
        };
    }, [buyAmount, sellAmount, deduction]);

    const tone =
        result.taxAmount > 0 ? "negative" : result.taxAmount < 0 ? "positive" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="해외주식 양도소득세 입력"
                description="매수 금액, 매도 금액, 기본공제를 입력하면 예상 과세 대상 금액과 세금을 계산할 수 있습니다."
            >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                    이 계산기는 입력한 거래 기준의 예상값이며, 실제 해외주식 양도소득세는 해당 연도 전체
                    해외주식 손익을 통산한 뒤 기본공제를 적용해 계산합니다. 총 매수 금액은 매수 당시
                    환율이 반영된 실제 원화 취득금액을, 총 매도 금액은 매도 당시 환율이 반영된 실제
                    원화 양도가액을 입력하세요. 환율 변동 효과는 두 금액의 차이에 이미 포함되므로
                    별도로 환차익을 더하지 않습니다.
                </div>

                <InputField
                    id="buyAmount"
                    label="총 매수 금액 (매수 시점 환율 반영 원화)"
                    type="number"
                    placeholder="예: 10000000"
                    unit="원"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                />
                <InputField
                    id="sellAmount"
                    label="총 매도 금액 (매도 시점 환율 반영 원화)"
                    type="number"
                    placeholder="예: 15000000"
                    unit="원"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
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
                    label="입력값 기준 예상 세금"
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

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    연간 손익통산 전 예상값이며 실제 신고세액과 다를 수 있습니다.
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}