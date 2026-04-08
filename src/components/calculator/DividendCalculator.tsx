"use client";

import { useMemo, useState } from "react";

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
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    배당 수익 계산기
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    주가, 보유 수량, 1주당 배당금을 입력하면 세전·세후 배당금과 배당수익률을 계산할 수 있습니다.
                </p>
            </div>

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

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        현재 주가
                    </label>
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="예: 80000"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        보유 수량
                    </label>
                    <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        placeholder="예: 100"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        1주당 배당금
                    </label>
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={dividendPerShare}
                        onChange={(e) => setDividendPerShare(e.target.value)}
                        placeholder="예: 1500"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                    />
                </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                <p>
                    국내 주식은 배당소득세 15.4%, 미국 주식은 배당 원천징수 15%를 기준으로 계산합니다.
                </p>
                <p className="mt-1">
                    미국 주식은 일반적인 W-8BEN 제출 기준이며, 실제 세율은 계좌 및 세무 상황에 따라 달라질 수 있습니다.
                </p>
            </div>

            <div className="mt-8">
                {result ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">총 투자금</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {formatNumber(result.totalInvestment)}원
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">세전 배당금</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {formatNumber(result.grossDividend)}원
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">예상 세금</p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                {formatNumber(result.taxAmount)}원
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">세후 배당금</p>
                            <p className="mt-2 text-2xl font-bold text-red-600">
                                {formatNumber(result.netDividend)}원
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">세전 배당수익률</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {formatNumber(result.grossYield)}%
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="text-sm font-medium text-slate-500">세후 배당수익률</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {formatNumber(result.netYield)}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                        값을 입력하면 예상 배당금과 배당수익률이 표시됩니다.
                    </div>
                )}
            </div>
        </section>
    );
}