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

export default function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState("");
    const [monthlyContribution, setMonthlyContribution] = useState("");
    const [annualRate, setAnnualRate] = useState("");
    const [years, setYears] = useState("");

    const result = useMemo(() => {
        const p = Number(principal);
        const m = Number(monthlyContribution);
        const r = Number(annualRate);
        const y = Number(years);

        if (
            !Number.isFinite(p) ||
            !Number.isFinite(m) ||
            !Number.isFinite(r) ||
            !Number.isFinite(y) ||
            p < 0 ||
            m < 0 ||
            r < 0 ||
            y <= 0
        ) {
            return {
                valid: false,
                finalAmount: 0,
                totalPrincipal: 0,
                totalContribution: 0,
                totalInvested: 0,
                totalInterest: 0,
            };
        }

        const months = Math.floor(y * 12);
        const monthlyRate = r / 100 / 12;

        let futureValue = p;

        for (let i = 0; i < months; i++) {
            futureValue = futureValue * (1 + monthlyRate) + m;
        }

        const totalContribution = m * months;
        const totalInvested = p + totalContribution;
        const totalInterest = futureValue - totalInvested;

        return {
            valid: true,
            finalAmount: futureValue,
            totalPrincipal: p,
            totalContribution,
            totalInvested,
            totalInterest,
        };
    }, [principal, monthlyContribution, annualRate, years]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="복리 투자 조건 입력"
                description="초기 투자금, 매월 추가 투자금, 예상 연 수익률, 투자 기간을 입력하세요."
            >
                <InputField
                    id="principal"
                    label="초기 투자금"
                    type="number"
                    placeholder="예: 10000000"
                    unit="원"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                />

                <InputField
                    id="monthlyContribution"
                    label="매월 추가 투자금"
                    type="number"
                    placeholder="예: 500000"
                    unit="원"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                />

                <InputField
                    id="annualRate"
                    label="예상 연 수익률"
                    type="number"
                    placeholder="예: 7"
                    unit="%"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                />

                <InputField
                    id="years"
                    label="투자 기간"
                    type="number"
                    placeholder="예: 10"
                    unit="년"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                />
            </CalculatorCard>

            <ResultCard
                title="복리 계산 결과"
                emptyMessage="투자 조건을 입력하시면 예상 최종 금액이 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="예상 최종 금액"
                    value={formatNumber(result.finalAmount)}
                    unit="원"
                    tone="positive"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="초기 투자금"
                        value={formatNumber(result.totalPrincipal)}
                        unit="원"
                    />
                    <ResultDetail
                        label="추가 투자금 합계"
                        value={formatNumber(result.totalContribution)}
                        unit="원"
                    />
                    <ResultDetail
                        label="총 납입 원금"
                        value={formatNumber(result.totalInvested)}
                        unit="원"
                    />
                    <ResultDetail
                        label="복리 수익"
                        value={formatNumber(result.totalInterest)}
                        unit="원"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}