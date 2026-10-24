"use client";
import { add, div, formatGrouped, fromInt, mul, requiredFiniteNumberExact, sign, sub, EXACT_ZERO, type Exact } from "@/lib/exactDecimal";

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
import CommaBreaks from "@/components/calculator/CommaBreaks";

type Currency = "KRW" | "USDT";

/** Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }) 기준 표시(정확값을 표시할 때 한 번만 반올림) */
function formatNumber(value: Exact, maximumFractionDigits = 2) {
    return formatGrouped(value, maximumFractionDigits);
}

const HUNDRED = fromInt(100);

export default function CryptoProfitCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [buyPrice, setBuyPrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyFeeRate, setBuyFeeRate] = useState("");
    const [sellFeeRate, setSellFeeRate] = useState("");

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        // 입력 십진값 그대로 정확히 계산하고, 표시할 때만 한 번 반올림한다(색은 반올림 전 정확값의 부호).
        const buy = requiredFiniteNumberExact(buyPrice);
        const sell = requiredFiniteNumberExact(sellPrice);
        const qty = requiredFiniteNumberExact(quantity);
        const buyFeePercent = requiredFiniteNumberExact(buyFeeRate);
        const sellFeePercent = requiredFiniteNumberExact(sellFeeRate);

        if (
            !buy ||
            !sell ||
            !qty ||
            !buyFeePercent ||
            !sellFeePercent ||
            sign(buy) <= 0 ||
            sign(sell) <= 0 ||
            sign(qty) <= 0 ||
            sign(buyFeePercent) < 0 ||
            sign(sellFeePercent) < 0
        ) {
            return {
                valid: false,
                totalBuy: EXACT_ZERO,
                totalSell: EXACT_ZERO,
                totalFee: EXACT_ZERO,
                grossProfit: EXACT_ZERO,
                netProfit: EXACT_ZERO,
                profitRate: EXACT_ZERO,
            };
        }

        const buyFee = div(buyFeePercent, HUNDRED);
        const sellFee = div(sellFeePercent, HUNDRED);

        const buyAmount = mul(buy, qty);
        const sellAmount = mul(sell, qty);

        const buyFeeAmount = mul(buyAmount, buyFee);
        const sellFeeAmount = mul(sellAmount, sellFee);

        const totalBuy = add(buyAmount, buyFeeAmount);
        const totalSell = sub(sellAmount, sellFeeAmount);
        const grossProfit = sub(sellAmount, buyAmount);
        const netProfit = sub(totalSell, totalBuy);
        const totalFee = add(buyFeeAmount, sellFeeAmount);
        const profitRate = sign(totalBuy) > 0 ? mul(div(netProfit, totalBuy), HUNDRED) : EXACT_ZERO;

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
        sign(result.netProfit) > 0 ? "positive" : sign(result.netProfit) < 0 ? "negative" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 수익 계산 조건 입력"
                description="매수 가격, 매도 가격, 수량, 수수료를 입력하면 실제 수익과 수익률을 계산합니다."
            >
                <CurrencyToggle value={currency} onChange={setCurrency} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="buyPrice"
                        label="매수 가격"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 100000000" : "예: 70000"}
                        unit={moneyUnit}
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                    <InputField
                        id="sellPrice"
                        label="매도 가격"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 110000000" : "예: 77000"}
                        unit={moneyUnit}
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

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USDT 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    선택한 통화 기준으로 직접 값을 입력하세요.
                </p>
            </CalculatorCard>

            <ResultCard
                title="코인 수익 계산 결과"
                emptyMessage="매수 가격, 매도 가격, 수량을 입력하면 예상 수익이 계산됩니다."
                isValid={result.valid}
            >
                <CommaBreaks>
                    <ResultHighlight
                        label="실제 순손익"
                        value={formatNumber(result.netProfit)}
                        unit={moneyUnit}
                        tone={tone}
                    />
                </CommaBreaks>

                <div className="grid gap-4 sm:grid-cols-2">
                    <CommaBreaks>
                        <ResultDetail
                            label="총 매수 금액(수수료 포함)"
                            value={formatNumber(result.totalBuy)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="총 매도 금액(수수료 차감)"
                            value={formatNumber(result.totalSell)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="총 수수료"
                            value={formatNumber(result.totalFee)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="수익률"
                            value={formatNumber(result.profitRate)}
                            unit="%"
                        />
                        <ResultDetail
                            label="수수료 반영 전 손익"
                            value={formatNumber(result.grossProfit)}
                            unit={moneyUnit}
                        />
                        <ResultDetail
                            label="실제 순손익"
                            value={formatNumber(result.netProfit)}
                            unit={moneyUnit}
                        />
                    </CommaBreaks>
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}
