"use client";

import { useMemo, useState } from "react";
import {
    CalculatorCard,
    CalculatorLayout,
    InputField,
    ResultCard,
    ResultDetail,
    ResultHighlight,
} from "@/components/ui/Shared";

function formatNumber(value: number) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        maximumFractionDigits: 2,
    }).format(value);
}

export default function DividendCalculator() {
    const [price, setPrice] = useState("");
    const [shares, setShares] = useState("");
    const [dividendPerShare, setDividendPerShare] = useState("");
    const [market, setMarket] = useState<"kr" | "us">("kr");

    const taxRate = market === "kr" ? 0.154 : 0.15;

    const result = useMemo(() => {
        const priceNum = Number(price);
        const sharesNum = Number(shares);
        const dividendNum = Number(dividendPerShare);

        if (
            !Number.isFinite(priceNum) ||
            !Number.isFinite(sharesNum) ||
            !Number.isFinite(dividendNum) ||
            priceNum <= 0 ||
            sharesNum <= 0 ||
            dividendNum < 0
        ) {
            return null;
        }

        const totalInvestment = priceNum * sharesNum;
        const grossDividend = dividendNum * sharesNum;
        const taxAmount = grossDividend * taxRate;
        const netDividend = grossDividend - taxAmount;
        const grossYield = (grossDividend / totalInvestment) * 100;
        const netYield = (netDividend / totalInvestment) * 100;

        return {
            totalInvestment,
            grossDividend,
            taxAmount,
            netDividend,
            grossYield,
            netYield,
        };
    }, [price, shares, dividendPerShare, taxRate]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="배당 수익 계산기"
                description="주가, 보유 수량, 1주당 배당금을 입력하면 세전·세후 배당금과 배당수익률을 계산할 수 있습니다."
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            시장 선택
                        </label>
                        <select
                            value={market}
                            onChange={(e) => setMarket(e.target.value as "kr" | "us")}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                        >
                            <option value="kr">국내 주식 (배당소득세 15.4%)</option>
                            <option value="us">미국 주식 (배당 원천징수 15%)</option>
                        </select>
                    </div>

                    <InputField
                        id="price"
                        label="현재 주가"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="예: 80000"
                        unit="원"
                    />

                    <InputField
                        id="shares"
                        label="보유 수량"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        placeholder="예: 100"
                        unit="주"
                    />

                    <InputField
                        id="dividendPerShare"
                        label="1주당 배당금"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={dividendPerShare}
                        onChange={(e) => setDividendPerShare(e.target.value)}
                        placeholder="예: 1500"
                        unit="원"
                    />
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    <p>
                        국내 주식은 배당소득세 15.4%, 미국 주식은 배당 원천징수 15%를 기준으로 계산합니다.
                    </p>
                    <p className="mt-1">
                        미국 주식은 일반적인 W-8BEN 제출 기준이며, 실제 세율은 계좌 및 세무 상황에 따라 달라질 수 있습니다.
                    </p>
                </div>
            </CalculatorCard>

            <ResultCard
                title="배당 수익 계산 결과"
                emptyMessage="값을 입력하면 예상 배당금과 배당수익률이 표시됩니다."
                isValid={!!result}
            >
                {result && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <ResultHighlight
                            label="세후 배당금"
                            value={formatNumber(result.netDividend)}
                            unit="원"
                            tone={
                                result.netDividend > 0
                                    ? "positive"
                                    : result.netDividend < 0
                                        ? "negative"
                                        : "default"
                            }
                        />

                        <ResultHighlight
                            label="세후 배당수익률"
                            value={formatNumber(result.netYield)}
                            unit="%"
                            tone={
                                result.netYield > 0
                                    ? "positive"
                                    : result.netYield < 0
                                        ? "negative"
                                        : "default"
                            }
                        />

                        <ResultDetail
                            label="총 투자금"
                            value={formatNumber(result.totalInvestment)}
                            unit="원"
                        />

                        <ResultDetail
                            label="세전 배당금"
                            value={formatNumber(result.grossDividend)}
                            unit="원"
                        />

                        <ResultDetail
                            label="예상 세금"
                            value={formatNumber(result.taxAmount)}
                            unit="원"
                        />

                        <ResultDetail
                            label="세전 배당수익률"
                            value={formatNumber(result.grossYield)}
                            unit="%"
                        />
                    </div>
                )}
            </ResultCard>
        </CalculatorLayout>
    );
}