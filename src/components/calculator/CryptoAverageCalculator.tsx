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

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CryptoAverageCalculator() {
    const [price1, setPrice1] = useState("");
    const [qty1, setQty1] = useState("");
    const [price2, setPrice2] = useState("");
    const [qty2, setQty2] = useState("");

    const result = useMemo(() => {
        const p1 = Number(price1);
        const q1 = Number(qty1);
        const p2 = Number(price2);
        const q2 = Number(qty2);

        if (
            !Number.isFinite(p1) ||
            !Number.isFinite(q1) ||
            !Number.isFinite(p2) ||
            !Number.isFinite(q2) ||
            p1 < 0 ||
            q1 < 0 ||
            p2 < 0 ||
            q2 < 0
        ) {
            return {
                valid: false,
                avgPrice: 0,
                totalQty: 0,
                totalAmount: 0,
            };
        }

        const totalQty = q1 + q2;
        const totalAmount = p1 * q1 + p2 * q2;

        if (totalQty <= 0) {
            return {
                valid: false,
                avgPrice: 0,
                totalQty: 0,
                totalAmount: 0,
            };
        }

        const avgPrice = totalAmount / totalQty;

        return {
            valid: true,
            avgPrice,
            totalQty,
            totalAmount,
        };
    }, [price1, qty1, price2, qty2]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 물타기 조건 입력"
                description="기존 매수 정보와 추가 매수 정보를 입력하면 평균 단가가 계산됩니다."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="price1"
                        label="기존 매수 가격"
                        type="number"
                        placeholder="예: 100000000"
                        value={price1}
                        onChange={(e) => setPrice1(e.target.value)}
                    />
                    <InputField
                        id="qty1"
                        label="기존 보유 수량"
                        type="number"
                        placeholder="예: 0.15"
                        value={qty1}
                        onChange={(e) => setQty1(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="price2"
                        label="추가 매수 가격"
                        type="number"
                        placeholder="예: 85000000"
                        value={price2}
                        onChange={(e) => setPrice2(e.target.value)}
                    />
                    <InputField
                        id="qty2"
                        label="추가 매수 수량"
                        type="number"
                        placeholder="예: 0.1"
                        value={qty2}
                        onChange={(e) => setQty2(e.target.value)}
                    />
                </div>
            </CalculatorCard>

            <ResultCard
                title="코인 물타기 계산 결과"
                emptyMessage="보유 수량과 추가 매수 정보를 입력하면 평균 단가가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="새 평균 단가"
                    value={formatNumber(result.avgPrice)}
                    tone="default"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 보유 수량"
                        value={formatNumber(result.totalQty, 8)}
                    />
                    <ResultDetail
                        label="총 매수 금액"
                        value={formatNumber(result.totalAmount)}
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}