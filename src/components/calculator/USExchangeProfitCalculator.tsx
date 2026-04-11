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
    const [buyPriceUsd, setBuyPriceUsd] = useState("100");
    const [sellPriceUsd, setSellPriceUsd] = useState("120");
    const [quantity, setQuantity] = useState("10");
    const [buyExchangeRate, setBuyExchangeRate] = useState("1350");
    const [sellExchangeRate, setSellExchangeRate] = useState("1380");
    const [buyFeeKrw, setBuyFeeKrw] = useState("0");
    const [sellFeeKrw, setSellFeeKrw] = useState("0");

    const result = useMemo(() => {
        const buyPrice = Number(buyPriceUsd);
        const sellPrice = Number(sellPriceUsd);
        const qty = Number(quantity);
        const buyRate = Number(buyExchangeRate);
        const sellRate = Number(sellExchangeRate);
        const buyFee = Number(buyFeeKrw);
        const sellFee = Number(sellFeeKrw);

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
                title="미국주식 환율 반영 수익 계산기"
                description="매수·매도 가격과 환율, 수량, 수수료를 입력하면 달러 기준 손익과 원화 기준 실제 수익을 계산할 수 있습니다."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyPriceUsd"
                        label="매수 가격"
                        type="number"
                        placeholder="예: 100"
                        unit="USD"
                        value={buyPriceUsd}
                        onChange={(e) => setBuyPriceUsd(e.target.value)}
                    />
                    <InputField
                        id="sellPriceUsd"
                        label="매도 가격"
                        type="number"
                        placeholder="예: 120"
                        unit="USD"
                        value={sellPriceUsd}
                        onChange={(e) => setSellPriceUsd(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="quantity"
                        label="수량"
                        type="number"
                        placeholder="예: 10"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <InputField
                        id="buyExchangeRate"
                        label="매수 환율"
                        type="number"
                        placeholder="예: 1350"
                        unit="원/USD"
                        value={buyExchangeRate}
                        onChange={(e) => setBuyExchangeRate(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="sellExchangeRate"
                        label="매도 환율"
                        type="number"
                        placeholder="예: 1380"
                        unit="원/USD"
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
                </div>

                <InputField
                    id="sellFeeKrw"
                    label="매도 수수료"
                    type="number"
                    placeholder="예: 0"
                    unit="원"
                    value={sellFeeKrw}
                    onChange={(e) => setSellFeeKrw(e.target.value)}
                />

                <p className="text-sm leading-relaxed text-slate-500">
                    미국주식은 달러 기준 수익이 나더라도 환율과 수수료에 따라 원화 기준 실제 수익이 달라질 수 있습니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="환율 반영 수익 계산 결과"
                emptyMessage="매수·매도 가격, 환율, 수량을 입력하면 결과가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="원화 기준 실제 순손익"
                    value={formatNumber(result.krwProfit)}
                    unit="원"
                    tone={tone}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="총 매수 금액"
                        value={formatNumber(result.totalBuyKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="총 매도 금액"
                        value={formatNumber(result.totalSellKrw)}
                        unit="원"
                    />
                    <ResultDetail
                        label="달러 기준 손익"
                        value={formatNumber(result.usdProfit)}
                        unit="USD"
                    />
                    <ResultDetail
                        label="원화 기준 수익률"
                        value={formatNumber(result.krwProfitRate)}
                        unit="%"
                    />
                    <ResultDetail
                        label="환율 영향 금액"
                        value={formatNumber(result.exchangeEffectKrw)}
                        unit="원"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}