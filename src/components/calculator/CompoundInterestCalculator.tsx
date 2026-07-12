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

function formatNumber(value: number, maximumFractionDigits = 0) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CompoundInterestCalculator() {
    const [currency, setCurrency] = useState<Currency>("KRW");

    const [initial, setInitial] = useState("1000000");
    const [monthly, setMonthly] = useState("100000");
    const [rate, setRate] = useState("10");
    const [years, setYears] = useState("10");

    const moneyUnit = currency === "KRW" ? "원" : "USD";

    const result = useMemo(() => {
        const P = Number(initial);
        const PMT = Number(monthly);
        const r = Number(rate) / 100;
        const t = Number(years);

        if (
            !Number.isFinite(P) ||
            !Number.isFinite(PMT) ||
            !Number.isFinite(r) ||
            !Number.isFinite(t) ||
            P < 0 ||
            PMT < 0 ||
            r < 0 ||
            t <= 0
        ) {
            return {
                valid: false,
                total: 0,
                principal: 0,
                profit: 0,
            };
        }

        const n = 12;
        const total =
            P * Math.pow(1 + r / n, n * t) +
            PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));

        const principal = P + PMT * n * t;
        const profit = total - principal;

        return {
            valid: true,
            total,
            principal,
            profit,
        };
    }, [initial, monthly, rate, years]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="복리 계산기"
                description="초기 투자금과 매월 투자금, 수익률을 입력하면 복리 기준 예상 자산을 계산합니다."
            >
                <CurrencyToggle
                    value={currency}
                    onChange={setCurrency}
                    options={["KRW", "USD"] as const}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="initial"
                        label="초기 투자금"
                        type="number"
                        value={initial}
                        onChange={(e) => setInitial(e.target.value)}
                        unit={moneyUnit}
                    />
                    <InputField
                        id="monthly"
                        label="월 추가 투자금"
                        type="number"
                        value={monthly}
                        onChange={(e) => setMonthly(e.target.value)}
                        unit={moneyUnit}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="rate"
                        label="연 수익률"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        unit="%"
                    />
                    <InputField
                        id="years"
                        label="투자 기간"
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        unit="년"
                    />
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="복리 계산 결과"
                emptyMessage="값을 입력하면 결과가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="최종 자산"
                    value={formatNumber(result.total)}
                    unit={moneyUnit}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 투자금"
                        value={formatNumber(result.principal)}
                        unit={moneyUnit}
                    />
                    <ResultDetail
                        label="총 수익"
                        value={formatNumber(result.profit)}
                        unit={moneyUnit}
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}