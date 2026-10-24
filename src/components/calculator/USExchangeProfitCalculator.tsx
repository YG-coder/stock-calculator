"use client";
import {
    EXACT_ZERO,
    add,
    div,
    formatGrouped,
    fromInt,
    mul,
    parseNumberExact,
    requiredNumberExact,
    sign,
    sub,
    type Exact,
} from "@/lib/exactDecimal";

import { useMemo, useState } from "react";
import {
    CalculatorLayout,
    CalculatorCard,
    ResultCard,
    ResultHighlight,
    ResultDetail,
    InputField,
} from "@/components/ui/Shared";
import CommaBreaks from "@/components/calculator/CommaBreaks";

// 정확히 계산한 값을 기존 Intl 규칙(최대 2자리, 0에서 먼 쪽, 쉼표, 0으로 반올림되는 음수는 "-0")으로 표시 단계에서 한 번만 반올림한다.
function formatNumber(value: Exact, maximumFractionDigits = 2) {
    return formatGrouped(value, maximumFractionDigits);
}

const INVALID = {
    valid: false,
    totalBuyUsd: EXACT_ZERO,
    totalSellUsd: EXACT_ZERO,
    totalBuyKrw: EXACT_ZERO,
    totalSellKrw: EXACT_ZERO,
    usdProfit: EXACT_ZERO,
    krwProfit: EXACT_ZERO,
    krwProfitRate: EXACT_ZERO,
    exchangeEffectKrw: EXACT_ZERO,
    noFxProfitKrw: EXACT_ZERO,
    totalFeeKrw: EXACT_ZERO,
};

export default function USExchangeProfitCalculator() {
    const [buyPriceUsd, setBuyPriceUsd] = useState("");
    const [sellPriceUsd, setSellPriceUsd] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyExchangeRate, setBuyExchangeRate] = useState("");
    const [sellExchangeRate, setSellExchangeRate] = useState("");
    const [buyFeeKrw, setBuyFeeKrw] = useState("");
    const [sellFeeKrw, setSellFeeKrw] = useState("");

    const result = useMemo(() => {
        // requiredNumber·Number(값 || "0")과 같은 계약으로 입력 십진값을 정확히 읽는다.
        const buyPrice = requiredNumberExact(buyPriceUsd);
        const sellPrice = requiredNumberExact(sellPriceUsd);
        const qty = requiredNumberExact(quantity);
        const buyRate = requiredNumberExact(buyExchangeRate);
        const sellRate = requiredNumberExact(sellExchangeRate);
        const buyFee = parseNumberExact(buyFeeKrw || "0");
        const sellFee = parseNumberExact(sellFeeKrw || "0");

        if (
            !buyPrice ||
            !sellPrice ||
            !qty ||
            !buyRate ||
            !sellRate ||
            !buyFee ||
            !sellFee ||
            sign(buyPrice) <= 0 ||
            sign(sellPrice) <= 0 ||
            sign(qty) <= 0 ||
            sign(buyRate) <= 0 ||
            sign(sellRate) <= 0 ||
            sign(buyFee) < 0 ||
            sign(sellFee) < 0
        ) {
            return INVALID;
        }

        // 정확한 유리수 계산(비슷한 두 큰 값의 뺄셈도 자릿수 손실 없음)
        const totalBuyUsd = mul(buyPrice, qty);
        const totalSellUsd = mul(sellPrice, qty);

        const totalBuyKrw = add(mul(totalBuyUsd, buyRate), buyFee);
        const totalSellKrw = sub(mul(totalSellUsd, sellRate), sellFee);

        const usdProfit = sub(totalSellUsd, totalBuyUsd);
        const krwProfit = sub(totalSellKrw, totalBuyKrw);
        const krwProfitRate = sign(totalBuyKrw) > 0 ? mul(div(krwProfit, totalBuyKrw), fromInt(100)) : EXACT_ZERO;

        // 환율 효과는 "매도 시점 원화 가치 - 매수 환율로 환산했을 때의 원화 가치" 차이만이다.
        // 수수료는 환율과 무관하므로 여기에 섞지 않는다.
        // (이전 구현은 krwProfit 에서 빼는 방식이라 수수료 전액이 환율 효과로 잡혔다.)
        const exchangeEffectKrw = mul(totalSellUsd, sub(sellRate, buyRate));
        // 수수료를 뺀 순수 매매손익(매수 환율 고정 기준). 표시용 보조 값.
        const noFxProfitKrw = mul(sub(totalSellUsd, totalBuyUsd), buyRate);

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
            noFxProfitKrw,
            totalFeeKrw: add(buyFee, sellFee),
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

    // 색·'+' 부호는 반올림 전 정확값으로 판정한다(0으로 반올림되는 아주 작은 손익도 부호를 따른다).
    const tone =
        sign(result.krwProfit) > 0 ? "positive" : sign(result.krwProfit) < 0 ? "negative" : "default";

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
                {/* 긴 금액이 좁은 화면에서 카드 밖으로 넘치지 않게 쉼표 뒤 줄바꿈(글자 크기·숫자·부호·단위 그대로) */}
                <CommaBreaks>
                    <ResultHighlight
                        label="원화 기준 실제 손익"
                        value={`${sign(result.krwProfit) > 0 ? "+" : ""}${formatNumber(result.krwProfit)}`}
                        unit="원"
                        tone={tone}
                    />
                </CommaBreaks>
                <div className="grid gap-4 sm:grid-cols-2">
                    <CommaBreaks>
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
                            value={`${sign(result.usdProfit) > 0 ? "+" : ""}${formatNumber(result.usdProfit)}`}
                            unit="USD"
                        />
                        <ResultDetail
                            label="원화 기준 수익률"
                            value={formatNumber(result.krwProfitRate)}
                            unit="%"
                        />
                        <ResultDetail
                            label="환율 효과 (수수료 제외)"
                            value={`${sign(result.exchangeEffectKrw) > 0 ? "+" : ""}${formatNumber(
                                result.exchangeEffectKrw
                            )}`}
                            unit="원"
                        />
                        <ResultDetail
                            label="매매 수수료 합계"
                            value={formatNumber(result.totalFeeKrw)}
                            unit="원"
                        />
                    </CommaBreaks>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                    환율 효과는 매도 대금에 매도 환율과 매수 환율을 각각 적용했을 때의 원화 차이입니다.
                    수수료는 환율과 무관하므로 따로 표시합니다. 세금은 반영하지 않았습니다.
                </p>
            </ResultCard>
        </CalculatorLayout>
    );
}
