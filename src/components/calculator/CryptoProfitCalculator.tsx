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

export default function CryptoProfitCalculator() {
    const [buyPrice, setBuyPrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyFeeRate, setBuyFeeRate] = useState("0.05");
    const [sellFeeRate, setSellFeeRate] = useState("0.05");

    const result = useMemo(() => {
        const buy = Number(buyPrice);
        const sell = Number(sellPrice);
        const qty = Number(quantity);
        const buyFee = Number(buyFeeRate) / 100;
        const sellFee = Number(sellFeeRate) / 100;

        if (
            !Number.isFinite(buy) ||
            !Number.isFinite(sell) ||
            !Number.isFinite(qty) ||
            !Number.isFinite(buyFee) ||
            !Number.isFinite(sellFee) ||
            buy <= 0 ||
            sell <= 0 ||
            qty <= 0 ||
            buyFee < 0 ||
            sellFee < 0
        ) {
            return {
                valid: false,
                totalBuy: 0,
                totalSell: 0,
                totalFee: 0,
                grossProfit: 0,
                netProfit: 0,
                profitRate: 0,
            };
        }

        const buyAmount = buy * qty;
        const sellAmount = sell * qty;

        const buyFeeAmount = buyAmount * buyFee;
        const sellFeeAmount = sellAmount * sellFee;

        const totalBuy = buyAmount + buyFeeAmount;
        const totalSell = sellAmount - sellFeeAmount;
        const grossProfit = sellAmount - buyAmount;
        const netProfit = totalSell - totalBuy;
        const totalFee = buyFeeAmount + sellFeeAmount;
        const profitRate = totalBuy > 0 ? (netProfit / totalBuy) * 100 : 0;

        return {
            valid: true,
            totalBuy,
            totalSell,
            totalFee,
            grossProfit,
            netProfit,
            profitRate,
        };
    }, [buyPrice, sellPrice, quantity, buyFeeRate, sellFeeRate]);

    const tone =
        result.netProfit > 0 ? "positive" : result.netProfit < 0 ? "negative" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 수익 계산 조건 입력"
                description="매수 가격, 매도 가격, 수량, 수수료를 입력하면 실제 수익과 수익률을 계산합니다."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyPrice"
                        label="매수 가격"
                        type="number"
                        placeholder="예: 100000000"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                    <InputField
                        id="sellPrice"
                        label="매도 가격"
                        type="number"
                        placeholder="예: 110000000"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                    />
                </div>

                <InputField
                    id="quantity"
                    label="매수 수량"
                    type="number"
                    placeholder="예: 0.25"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyFeeRate"
                        label="매수 수수료율"
                        type="number"
                        placeholder="예: 0.05"
                        unit="%"
                        value={buyFeeRate}
                        onChange={(e) => setBuyFeeRate(e.target.value)}
                    />
                    <InputField
                        id="sellFeeRate"
                        label="매도 수수료율"
                        type="number"
                        placeholder="예: 0.05"
                        unit="%"
                        value={sellFeeRate}
                        onChange={(e) => setSellFeeRate(e.target.value)}
                    />
                </div>
            </CalculatorCard>

            <ResultCard
                title="코인 수익 계산 결과"
                emptyMessage="매수 가격, 매도 가격, 수량을 입력하면 예상 수익이 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="세전/세후 반영 실제 순수익"
                    value={formatNumber(result.netProfit)}
                    tone={tone}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 매수 금액(수수료 포함)"
                        value={formatNumber(result.totalBuy)}
                    />
                    <ResultDetail
                        label="총 매도 금액(수수료 차감)"
                        value={formatNumber(result.totalSell)}
                    />
                    <ResultDetail
                        label="총 수수료"
                        value={formatNumber(result.totalFee)}
                    />
                    <ResultDetail
                        label="수익률"
                        value={formatNumber(result.profitRate)}
                        unit="%"
                    />
                    <ResultDetail
                        label="수수료 반영 전 손익"
                        value={formatNumber(result.grossProfit)}
                    />
                    <ResultDetail
                        label="실제 순손익"
                        value={formatNumber(result.netProfit)}
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}