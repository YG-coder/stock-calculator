"use client";

import { withParticle } from "@/lib/korean";
import { useMemo, useState } from "react";
import { FINANCIAL_INCOME_THRESHOLD } from "@/lib/taxRates";
import { calculateUsDividendExact } from "@/lib/usDividend";
import { formatGrouped, type Exact } from "@/lib/exactDecimal";
import {
    CalculatorLayout,
    CalculatorCard,
    ResultCard,
    ResultHighlight,
    ResultDetail,
    InputField,
} from "@/components/ui/Shared";
import CommaBreaks from "@/components/calculator/CommaBreaks";

// 정확히 계산한 값을 기존 Intl 규칙(최대 2자리, 0에서 먼 쪽, 쉼표)으로 표시 단계에서 한 번만 반올림한다.
function formatNumber(value: Exact, maximumFractionDigits = 2) {
    return formatGrouped(value, maximumFractionDigits);
}

export default function USDividendCalculator() {
    const [shares, setShares] = useState("");
    const [annualDividendPerShareUsd, setAnnualDividendPerShareUsd] = useState("");
    const [buyPriceUsd, setBuyPriceUsd] = useState("");
    const [exchangeRate, setExchangeRate] = useState("");
    const [withholdingTaxRate, setWithholdingTaxRate] = useState("");

    const result = useMemo(
        () =>
            calculateUsDividendExact({
                shares,
                annualDividendPerShareUsd,
                buyPriceUsd,
                exchangeRate,
                withholdingTaxRate,
            }),
        [shares, annualDividendPerShareUsd, buyPriceUsd, exchangeRate, withholdingTaxRate]
    );

    // 원천징수세율 빈칸과 0% 를 구분한다. 빈칸이면 세후 금액을 계산하지 않는다.
    const emptyMessage = result.missingFields.includes("withholdingTaxRate")
        ? "보유 수량, 배당금, 매수가, 환율과 함께 원천징수세율을 입력하면 결과가 계산됩니다. 원천징수세율을 비워 두면 세후 배당금을 계산할 수 없습니다. 원천징수가 없다면 0을 입력하세요."
        : "값을 입력하면 결과가 자동으로 계산됩니다.";

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
                emptyMessage={emptyMessage}
                isValid={result.valid}
            >
                {/* 긴 월 배당금이 좁은 화면에서 카드 밖으로 넘치지 않게 쉼표 뒤 줄바꿈(글자 크기·숫자·단위 그대로). 세부 항목은 측정 범위에서 넘치지 않아 그대로 둔다 */}
                <CommaBreaks>
                    <ResultHighlight
                        label="월 예상 세후 배당금"
                        value={formatNumber(result.monthlyNetDividendKrw)}
                        unit="원"
                    />
                </CommaBreaks>
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

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                    이 계산기의 세율은 미국 현지에서 먼저 떼는 원천징수세율이며, 국내에서 정산되는
                    최종 세금과 동일한 개념이 아닙니다. 국내에서 다른 이자·배당소득과 합산하여 연간
                    금융소득이 {withParticle(FINANCIAL_INCOME_THRESHOLD.amountDisplay, "을/를")} 초과하면 종합과세 대상이 될 수
                    있습니다.
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}