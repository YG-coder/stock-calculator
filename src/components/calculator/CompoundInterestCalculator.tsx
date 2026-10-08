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
import { calculateCompoundInterest } from "@/lib/compoundInterest";

type Currency = "KRW" | "USD";

function formatNumber(value: number, maximumFractionDigits = 0) {
    // 유한하지 않은 값을 "0" 으로 보이면 틀린 결과가 정상값처럼 보인다.
    if (!Number.isFinite(value)) return "-";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CompoundInterestCalculator() {
    const [currency, setCurrency] = useState<Currency>("KRW");

    const [initial, setInitial] = useState("");
    const [monthly, setMonthly] = useState("");
    const [rate, setRate] = useState("");
    const [years, setYears] = useState("");

    const moneyUnit = currency === "KRW" ? "원" : "USD";

    const result = useMemo(
        () => calculateCompoundInterest({ initial, monthly, rate, years }),
        [initial, monthly, rate, years]
    );

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
                        placeholder={currency === "KRW" ? "예: 1000000" : "예: 1000"}
                    />
                    <InputField
                        id="monthly"
                        label="월 추가 투자금"
                        type="number"
                        value={monthly}
                        onChange={(e) => setMonthly(e.target.value)}
                        unit={moneyUnit}
                        placeholder={currency === "KRW" ? "예: 100000" : "예: 100"}
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
                        placeholder="예: 10"
                    />
                    <InputField
                        id="years"
                        label="투자 기간"
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        unit="년"
                        placeholder="예: 10"
                    />
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                    월복리와 매월 말 납입 기준입니다. 연 수익률을 12로 나누어 월 수익률로 적용하므로,
                    1년에 한 번 복리를 적용한 결과와 다를 수 있습니다.
                </p>

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
                    value={result.overflow ? "-" : formatNumber(result.total)}
                    unit={result.overflow ? undefined : moneyUnit}
                />

                {result.overflow ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                        입력한 수익률과 기간으로는 결과가 계산할 수 있는 숫자 범위를 넘습니다.
                        수익률이나 투자 기간을 줄여 다시 계산하세요.
                    </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 투자금"
                        value={formatNumber(result.principal)}
                        unit={moneyUnit}
                    />
                    <ResultDetail
                        label="총 수익"
                        value={result.overflow ? "-" : formatNumber(result.profit)}
                        unit={result.overflow ? undefined : moneyUnit}
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}
