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
import CurrencyToggle from "@/components/calculator/CurrencyToggle";

type Currency = "KRW" | "USDT";

function formatNumber(value: number, maximumFractionDigits = 4) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CryptoEntryCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [entryPrice, setEntryPrice] = useState("10000");
    const [stopPrice, setStopPrice] = useState("9900");
    const [seed, setSeed] = useState("100");
    const [riskPercent, setRiskPercent] = useState("5");
    const [rewardRatio, setRewardRatio] = useState("1.5");

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        const entry = Number(entryPrice);
        const stop = Number(stopPrice);
        const seedValue = Number(seed);
        const risk = Number(riskPercent);
        const rr = Number(rewardRatio);

        if (
            !Number.isFinite(entry) ||
            !Number.isFinite(stop) ||
            !Number.isFinite(seedValue) ||
            !Number.isFinite(risk) ||
            !Number.isFinite(rr) ||
            entry <= 0 ||
            stop <= 0 ||
            seedValue <= 0 ||
            risk <= 0 ||
            rr <= 0 ||
            stop >= entry
        ) {
            return {
                valid: false,
                lossPercent: 0,
                leverage: 0,
                riskAmount: 0,
                positionSize: 0,
                takeProfitPrice: 0,
            };
        }

        const lossPercent = ((entry - stop) / entry) * 100;
        const leverage = lossPercent > 0 ? 100 / lossPercent : 0;
        const riskAmount = seedValue * (risk / 100);
        const positionSize = leverage * riskAmount;
        const takeProfitPrice = entry + (entry - stop) * rr;

        return {
            valid: true,
            lossPercent,
            leverage,
            riskAmount,
            positionSize,
            takeProfitPrice,
        };
    }, [entryPrice, stopPrice, seed, riskPercent, rewardRatio]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="100배 진입 계산 조건 입력"
                description="진입가, 손절가, 시드, 리스크 비율, 손익비를 입력하면 권장 배율과 주문 명목가치를 계산합니다."
            >
                <CurrencyToggle value={currency} onChange={setCurrency} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="entryPrice"
                        label="진입가"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 100000000" : "예: 10000"}
                        unit={moneyUnit}
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                    />
                    <InputField
                        id="stopPrice"
                        label="손절가"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 99000000" : "예: 9900"}
                        unit={moneyUnit}
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="seed"
                        label="시드"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 1000000" : "예: 100"}
                        unit={moneyUnit}
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                    />
                    <InputField
                        id="riskPercent"
                        label="리스크 비율"
                        type="number"
                        placeholder="예: 5"
                        unit="%"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(e.target.value)}
                    />
                </div>

                <InputField
                    id="rewardRatio"
                    label="손익비"
                    type="number"
                    placeholder="예: 1.5"
                    value={rewardRatio}
                    onChange={(e) => setRewardRatio(e.target.value)}
                />

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USDT 토글은 환율 자동 변환이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    이 계산기는 엑셀 구조와 동일하게 손절폭을 기준으로 배율과 주문 명목가치를 계산합니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="100배 진입 계산 결과"
                emptyMessage="진입가, 손절가, 시드, 리스크 비율을 입력하면 결과가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="주문 명목가치"
                    value={formatNumber(result.positionSize)}
                    unit={moneyUnit}
                    tone="default"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="손절폭"
                        value={formatNumber(result.lossPercent)}
                        unit="%"
                    />
                    <ResultDetail
                        label="권장 배율"
                        value={formatNumber(result.leverage)}
                        unit="배"
                    />
                    <ResultDetail
                        label="리스크 금액"
                        value={formatNumber(result.riskAmount)}
                        unit={moneyUnit}
                    />
                    <ResultDetail
                        label="익절가"
                        value={formatNumber(result.takeProfitPrice)}
                        unit={moneyUnit}
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}