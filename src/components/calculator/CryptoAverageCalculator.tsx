"use client";

import { useMemo, useRef, useState } from "react";
import {
    CalculatorLayout,
    CalculatorCard,
    ResultCard,
    ResultHighlight,
    ResultDetail,
    InputField,
} from "@/components/ui/Shared";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";

type Currency = "KRW" | "USDT";

type BuyRow = {
    id: number;
    price: string;
    quantity: string;
};

const MAX_ROWS = 10;

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

function toPositive(value: string): number {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
}

export default function CryptoAverageCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [rows, setRows] = useState<BuyRow[]>([
        { id: 1, price: "", quantity: "" },
        { id: 2, price: "", quantity: "" },
    ]);
    const [currentPrice, setCurrentPrice] = useState("");
    const nextId = useRef(3);

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const updateRow = (id: number, field: "price" | "quantity", value: string) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const addRow = () => {
        setRows((prev) => {
            if (prev.length >= MAX_ROWS) return prev;
            const id = nextId.current;
            nextId.current += 1;
            return [...prev, { id, price: "", quantity: "" }];
        });
    };

    const removeRow = (id: number) => {
        setRows((prev) =>
            prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)
        );
    };

    const resetRows = () => {
        setRows([
            { id: 1, price: "", quantity: "" },
            { id: 2, price: "", quantity: "" },
        ]);
        setCurrentPrice("");
        nextId.current = 3;
    };

    const result = useMemo(() => {
        let totalQty = 0;
        let totalAmount = 0;
        let validCount = 0;
        let firstValidPrice = 0; // 첫 번째 '유효한' 매수가 (물타기/불타기 판정 기준)

        for (const row of rows) {
            const p = toPositive(row.price);
            const q = toPositive(row.quantity);
            if (p > 0 && q > 0) {
                totalQty += q;
                totalAmount += p * q;
                validCount += 1;
                if (firstValidPrice === 0) firstValidPrice = p;
            }
        }

        if (validCount === 0 || totalQty <= 0) {
            return {
                valid: false,
                avgPrice: 0,
                totalQty: 0,
                totalAmount: 0,
                firstPrice: 0,
                buyCount: 0,
                hasCurrent: false,
                evalAmount: 0,
                profit: 0,
                profitRate: 0,
            };
        }

        const avgPrice = totalAmount / totalQty;
        const firstPrice = firstValidPrice;

        const cp = toPositive(currentPrice);
        const hasCurrent = cp > 0;
        const evalAmount = hasCurrent ? cp * totalQty : 0;
        const profit = hasCurrent ? evalAmount - totalAmount : 0;
        const profitRate =
            hasCurrent && totalAmount > 0 ? (profit / totalAmount) * 100 : 0;

        return {
            valid: true,
            avgPrice,
            totalQty,
            totalAmount,
            firstPrice,
            buyCount: validCount,
            hasCurrent,
            evalAmount,
            profit,
            profitRate,
        };
    }, [rows, currentPrice]);

    const directionNote =
        result.valid && result.firstPrice > 0
            ? result.avgPrice < result.firstPrice
                ? { text: "평단가 하락 · 물타기 효과", tone: "down" as const }
                : result.avgPrice > result.firstPrice
                    ? { text: "평단가 상승 · 불타기", tone: "up" as const }
                    : { text: "평단가 변동 없음", tone: "flat" as const }
            : null;

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 물타기·불타기 조건 입력"
                description="기존 매수 외에 추가 매수를 여러 번 입력할 수 있습니다. 하락 매수(물타기)와 상승 매수(불타기) 모두 평균 단가가 계산됩니다."
            >
                <CurrencyToggle value={currency} onChange={setCurrency} />

                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div
                            key={row.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">
                                    {index === 0 ? "1차 매수 (기존 보유)" : `${index + 1}차 매수`}
                                </span>
                                {index > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => removeRow(row.id)}
                                        className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                                        aria-label={`${index + 1}차 매수 삭제`}
                                    >
                                        삭제
                                    </button>
                                ) : null}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <InputField
                                    id={`c-price-${row.id}`}
                                    label={`매수 가격 (${moneyUnit})`}
                                    type="number"
                                    placeholder={currency === "KRW" ? "예: 100000000" : "예: 70000"}
                                    unit={moneyUnit}
                                    value={row.price}
                                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                                />
                                <InputField
                                    id={`c-qty-${row.id}`}
                                    label="수량"
                                    type="number"
                                    placeholder="예: 0.15"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={addRow}
                        disabled={rows.length >= MAX_ROWS}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        + 추가 매수 입력
                    </button>
                    <button
                        type="button"
                        onClick={resetRows}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        초기화
                    </button>
                    {rows.length >= MAX_ROWS ? (
                        <span className="self-center text-xs text-slate-400">
                            최대 {MAX_ROWS}회까지 입력할 수 있습니다.
                        </span>
                    ) : null}
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <InputField
                        id="c-currentPrice"
                        label={`현재가 (선택 · ${moneyUnit})`}
                        type="number"
                        placeholder={currency === "KRW" ? "예: 85000000" : "예: 59500"}
                        unit={moneyUnit}
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                    />
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        현재가를 입력하면 평가손익과 수익률도 함께 계산됩니다.
                        KRW / USDT 토글은 환율 자동 변환이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    </p>
                </div>
            </CalculatorCard>

            <ResultCard
                title="코인 평단가 계산 결과"
                emptyMessage="매수 가격과 수량을 입력하면 평균 단가가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="새 평균 단가"
                    value={formatNumber(result.avgPrice)}
                    unit={moneyUnit}
                    tone="default"
                />

                {directionNote ? (
                    <p
                        className={`mt-3 text-sm font-semibold ${
                            directionNote.tone === "down"
                                ? "text-blue-600"
                                : directionNote.tone === "up"
                                    ? "text-red-600"
                                    : "text-slate-500"
                        }`}
                    >
                        {directionNote.text}
                    </p>
                ) : null}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 보유 수량"
                        value={formatNumber(result.totalQty, 8)}
                    />
                    <ResultDetail
                        label="총 매수 금액"
                        value={formatNumber(result.totalAmount)}
                        unit={moneyUnit}
                    />
                    <ResultDetail label="매수 횟수" value={result.buyCount} unit="회" />
                </div>

                {result.hasCurrent ? (
                    <div className="mt-6 border-t border-slate-100 pt-6">
                        <ResultHighlight
                            label="평가 손익"
                            value={`${result.profit >= 0 ? "+" : ""}${formatNumber(result.profit)}`}
                            unit={moneyUnit}
                            tone={result.profit >= 0 ? "positive" : "negative"}
                        />
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <ResultDetail
                                label="수익률"
                                value={`${result.profitRate >= 0 ? "+" : ""}${result.profitRate.toFixed(2)}`}
                                unit="%"
                            />
                            <ResultDetail
                                label="평가 금액"
                                value={formatNumber(result.evalAmount)}
                                unit={moneyUnit}
                            />
                        </div>
                    </div>
                ) : null}
            </ResultCard>
        </CalculatorLayout>
    );
}
