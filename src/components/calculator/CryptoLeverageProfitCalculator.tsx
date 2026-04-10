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

export default function CryptoLeverageProfitCalculator() {
    const [entryPrice, setEntryPrice] = useState("");
    const [exitPrice, setExitPrice] = useState("");
    const [margin, setMargin] = useState("");
    const [leverage, setLeverage] = useState("");
    const [positionType, setPositionType] = useState<"long" | "short">("long");
    const [feeRate, setFeeRate] = useState("0.05");

    const result = useMemo(() => {
        const entry = Number(entryPrice);
        const exit = Number(exitPrice);
        const marginValue = Number(margin);
        const lev = Number(leverage);
        const fee = Number(feeRate) / 100;

        if (
            !Number.isFinite(entry) ||
            !Number.isFinite(exit) ||
            !Number.isFinite(marginValue) ||
            !Number.isFinite(lev) ||
            !Number.isFinite(fee) ||
            entry <= 0 ||
            exit <= 0 ||
            marginValue <= 0 ||
            lev <= 0 ||
            fee < 0
        ) {
            return {
                valid: false,
                positionSize: 0,
                priceChangeRate: 0,
                grossPnl: 0,
                totalFee: 0,
                netPnl: 0,
                roe: 0,
            };
        }

        const positionSize = marginValue * lev;

        const priceChangeRate =
            positionType === "long"
                ? (exit - entry) / entry
                : (entry - exit) / entry;

        const grossPnl = positionSize * priceChangeRate;

        const entryFee = positionSize * fee;
        const exitFee = positionSize * fee;
        const totalFee = entryFee + exitFee;

        const netPnl = grossPnl - totalFee;
        const roe = (netPnl / marginValue) * 100;

        return {
            valid: true,
            positionSize,
            priceChangeRate: priceChangeRate * 100,
            grossPnl,
            totalFee,
            netPnl,
            roe,
        };
    }, [entryPrice, exitPrice, margin, leverage, positionType, feeRate]);

    const tone =
        result.netPnl > 0 ? "positive" : result.netPnl < 0 ? "negative" : "default";

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="레버리지 수익 계산 조건 입력"
                description="진입가, 종료가, 증거금, 레버리지, 포지션 방향을 입력하면 실제 수익과 ROE를 계산합니다."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="entryPrice"
                        label="진입 가격"
                        type="number"
                        placeholder="예: 100000000"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                    />
                    <InputField
                        id="exitPrice"
                        label="종료 가격"
                        type="number"
                        placeholder="예: 105000000"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="margin"
                        label="투입 증거금"
                        type="number"
                        placeholder="예: 1000000"
                        unit="원"
                        value={margin}
                        onChange={(e) => setMargin(e.target.value)}
                    />
                    <InputField
                        id="leverage"
                        label="레버리지"
                        type="number"
                        placeholder="예: 10"
                        unit="배"
                        value={leverage}
                        onChange={(e) => setLeverage(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-700">포지션 방향</span>
                        <select
                            value={positionType}
                            onChange={(e) => setPositionType(e.target.value as "long" | "short")}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                        >
                            <option value="long">롱 (Long)</option>
                            <option value="short">숏 (Short)</option>
                        </select>
                    </label>

                    <InputField
                        id="feeRate"
                        label="거래 수수료율"
                        type="number"
                        placeholder="예: 0.05"
                        unit="%"
                        value={feeRate}
                        onChange={(e) => setFeeRate(e.target.value)}
                    />
                </div>
            </CalculatorCard>

            <ResultCard
                title="레버리지 수익 계산 결과"
                emptyMessage="진입가, 종료가, 증거금, 레버리지를 입력하면 예상 수익이 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="실제 순손익"
                    value={formatNumber(result.netPnl)}
                    unit="원"
                    tone={tone}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="포지션 규모"
                        value={formatNumber(result.positionSize)}
                        unit="원"
                    />
                    <ResultDetail
                        label="가격 변동률"
                        value={formatNumber(result.priceChangeRate)}
                        unit="%"
                    />
                    <ResultDetail
                        label="수수료 반영 전 손익"
                        value={formatNumber(result.grossPnl)}
                        unit="원"
                    />
                    <ResultDetail
                        label="총 수수료"
                        value={formatNumber(result.totalFee)}
                        unit="원"
                    />
                    <ResultDetail
                        label="증거금 대비 수익률(ROE)"
                        value={formatNumber(result.roe)}
                        unit="%"
                    />
                </div>
            </ResultCard>
        </CalculatorLayout>
    );
}