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

export default function USExchangeProfitCalculator() {
    const [buyPriceUsd, setBuyPriceUsd] = useState("");
    const [sellPriceUsd, setSellPriceUsd] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyExchangeRate, setBuyExchangeRate] = useState("");
    const [sellExchangeRate, setSellExchangeRate] = useState("");
    const [buyFeeKrw, setBuyFeeKrw] = useState("");
    const [sellFeeKrw, setSellFeeKrw] = useState("");

    const result = useMemo(() => {
        const buyPrice = Number(buyPriceUsd);
        const sellPrice = Number(sellPriceUsd);
        const qty = Number(quantity);
        const buyRate = Number(buyExchangeRate);
        const sellRate = Number(sellExchangeRate);
        const buyFee = Number(buyFeeKrw || "0");
        const sellFee = Number(sellFeeKrw || "0");

        if (
            !Number.isFinite(buyPrice) ||
            !Number.isFinite(sellPrice) ||
            !Number.isFinite(qty) ||
            !Number.isFinite(buyRate) ||
            !Number.isFinite(sellRate) ||
            !Number.isFinite(buyFee) ||
            !Number.isFinite(sellFee) ||
            buyPrice <= 0 ||
            sellPrice <= 0 ||
            qty <= 0 ||
            buyRate <= 0 ||
            sellRate <= 0 ||
            buyFee < 0 ||
            sellFee < 0
        ) {
            return {
                valid: false,
                totalBuyUsd: 0,
                totalSellUsd: 0,
                totalBuyKrw: 0,
                totalSellKrw: 0,
                usdProfit: 0,
                krwProfit: 0,
                krwProfitRate: 0,
                exchangeEffectKrw: 0,
            };
        }

        const totalBuyUsd = buyPrice * qty;
        const totalSellUsd = sellPrice * qty;

        const totalBuyKrw = totalBuyUsd * buyRate + buyFee;
        const totalSellKrw = totalSellUsd * sellRate - sellFee;

        const usdProfit = totalSellUsd - totalBuyUsd;
        const krwProfit = totalSellKrw - totalBuyKrw;
        const krwProfitRate = totalBuyKrw > 0 ? (krwProfit / totalBuyKrw) * 100 : 0;

        const noFxProfitKrw = (totalSellUsd - totalBuyUsd) * buyRate;
        const exchangeEffectKrw = krwProfit - noFxProfitKrw;

        return {
            valid: true,
            totalBuyUsd,
            totalSellUsd,
            totalBuyKrw,
            totalSellKrw,
            usdProfit,
            krwProfit,
            krwProfitRate,
            exchangeEffectKrw,
        };
    }, [
        buyPriceUsd,
        sellPriceUsd,
        quantity,
        buyExchangeRate,
        sellExchangeRate,
        buyFeeKrw,
        sellFeeKrw,
    ]);

    const tone =
        result.krwProfit > 0 ? "positive" : result.krwProfit < 0 ? "negative" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="미국주식 환율 반영 수익 입력"
                description="매수·매도 가격, 수량, 매수·매도 시점 환율, 수수료를 입력하면 원화 기준 실제 수익을 계산할 수 있습니다."
            >
                <InputField
                    id="buyPriceUsd"
                    label="매수가"
                    type="number"
                    placeholder="예: 100"
                    unit="USD"
                    value={buyPriceUsd}
                    onChange={(e) => setBuyPriceUsd(e.target.value)}
                />
                <InputField
                    id="sellPriceUsd"
                    label="매도가"
                    type="number"
                    placeholder="예: 120"
                    unit="USD"
                    value={sellPriceUsd}
                    onChange={(e) => setSellPriceUsd(e.target.value)}
                />
                <InputField
                    id="quantity"
                    label="수량"
                    type="number"
                    placeholder="예: 10"
                    unit="주"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <InputField
                    id="buyExchangeRate"
                    label="매수 환율"
                    type="number"
                    placeholder="예: 1350"
                    unit="원"
                    value={buyExchangeRate}
                    onChange={(e) => setBuyExchangeRate(e.target.value)}
                />
                <InputField
                    id="sellExchangeRate"
                    label="매도 환율"
                    type="number"
                    placeholder="예: 1380"
                    unit="원"
                    value={sellExchangeRate}
                    onChange={(e) => setSellExchangeRate(e.target.value)}
                />
                <InputField
                    id="buyFeeKrw"
                    label="매수 수수료"
                    type="number"
                    placeholder="예: 0"
                    unit="원"
                    value={buyFeeKrw}
                    onChange={(e) => setBuyFeeKrw(e.target.value)}
                />
                <InputField
                    id="sellFeeKrw"
                    label="매도 수수료"
                    type="number"
                    placeholder="예: 0"
                    unit="원"
                    value={sellFeeKrw}
                    onChange={(e) => setSellFeeKrw(e.target.value)}
                />

                <p className="text-sm text-slate-500">
                    값을 입력하면 결과가 자동으로 계산됩니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="환율 반영 수익 계산 결과"
                emptyMessage="값을 입력하면 결과가 자동으로 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="원화 기준 실제 손익"
                    value={`${result.krwProfit > 0 ? "+" : ""}${formatNumber(result.krwProfit)}`}
                    unit="원"
                    tone={tone}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 매수 금액"
                        value={formatNumber(result.totalBuyUsd)}
                        unit="USD"
                    />
                    <ResultDetail
                        label="총 매도 금액"
                        value={formatNumber(result.totalSellUsd)}
                        unit="USD"
                    />
                    <ResultDetail
                        label="원화 매수 금액"
                        value={formatNumber(result.totalBuyKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="원화 매도 금액"
                        value={formatNumber(result.totalSellKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="달러 기준 손익"
                        value={`${result.usdProfit > 0 ? "+" : ""}${formatNumber(result.usdProfit)}`}
                        unit="USD"
                    />
                    <ResultDetail
                        label="원화 기준 수익률"
                        value={formatNumber(result.krwProfitRate)}
                        unit="%"
                    />
                    <ResultDetail
                        label="환율 효과"
                        value={`${result.exchangeEffectKrw > 0 ? "+" : ""}${formatNumber(
                            result.exchangeEffectKrw
                        )}`}
                        unit="원"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}