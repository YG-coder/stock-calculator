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

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CryptoLiquidationCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [entryPrice, setEntryPrice] = useState("");
    const [leverage, setLeverage] = useState("");
    const [marginType, setMarginType] = useState<"isolated" | "cross">("isolated");
    const [positionType, setPositionType] = useState<"long" | "short">("long");
    const [maintenanceMarginRate, setMaintenanceMarginRate] = useState("0.5");

    const priceUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        const entry = Number(entryPrice);
        const lev = Number(leverage);
        const mmr = Number(maintenanceMarginRate) / 100;

        if (
            !Number.isFinite(entry) ||
            !Number.isFinite(lev) ||
            !Number.isFinite(mmr) ||
            entry <= 0 ||
            lev <= 0 ||
            mmr < 0 ||
            mmr >= 1
        ) {
            return {
                valid: false,
                liquidationPrice: 0,
                bankruptcyPrice: 0,
                lossPercent: 0,
                warning: "",
            };
        }

        const effectiveMmr = marginType === "cross" ? Math.max(0, mmr - 0.001) : mmr;

        let liquidationPrice = 0;
        let bankruptcyPrice = 0;
        let lossPercent = 0;

        if (positionType === "long") {
            bankruptcyPrice = entry * (1 - 1 / lev);
            liquidationPrice = entry * (1 - 1 / lev + effectiveMmr);
            lossPercent = ((entry - liquidationPrice) / entry) * 100;
        } else {
            bankruptcyPrice = entry * (1 + 1 / lev);
            liquidationPrice = entry * (1 + 1 / lev - effectiveMmr);
            lossPercent = ((liquidationPrice - entry) / entry) * 100;
        }

        let warning = "";
        if (lev >= 20) {
            warning = "고배율 구간입니다. 작은 변동에도 청산될 수 있습니다.";
        } else if (lev >= 10) {
            warning = "레버리지가 높습니다. 진입 전 청산 가격을 반드시 확인하세요.";
        }

        return {
            valid: liquidationPrice > 0,
            liquidationPrice,
            bankruptcyPrice,
            lossPercent,
            warning,
        };
    }, [entryPrice, leverage, marginType, positionType, maintenanceMarginRate]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 청산가 조건 입력"
                description="진입 가격, 레버리지, 포지션 방향을 입력하면 예상 청산 가격을 계산합니다."
            >
                <CurrencyToggle value={currency} onChange={setCurrency} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="entryPrice"
                        label="진입 가격"
                        type="number"
                        placeholder={currency === "KRW" ? "예: 100000000" : "예: 70000"}
                        unit={priceUnit}
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
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

                    <label className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-700">증거금 방식</span>
                        <select
                            value={marginType}
                            onChange={(e) => setMarginType(e.target.value as "isolated" | "cross")}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                        >
                            <option value="isolated">격리 (Isolated)</option>
                            <option value="cross">교차 (Cross)</option>
                        </select>
                    </label>
                </div>

                <InputField
                    id="maintenanceMarginRate"
                    label="유지 증거금률"
                    type="number"
                    placeholder="예: 0.5"
                    unit="%"
                    value={maintenanceMarginRate}
                    onChange={(e) => setMaintenanceMarginRate(e.target.value)}
                />

                <p className="text-sm leading-relaxed text-slate-500">
                    선택한 통화 단위에 맞춰 직접 입력하세요. KRW/USDT 토글은 환율 변환 기능이 아니라
                    계산 기준 통화를 선택하는 기능입니다.
                </p>
            </CalculatorCard>

            <ResultCard
                title="예상 청산 결과"
                emptyMessage="진입 가격과 레버리지를 입력하면 청산 가격이 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label="예상 청산 가격"
                    value={formatNumber(result.liquidationPrice)}
                    unit={priceUnit}
                    tone="negative"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="파산 가격(이론값)"
                        value={formatNumber(result.bankruptcyPrice)}
                        unit={priceUnit}
                    />
                    <ResultDetail
                        label="진입가 대비 변동 폭"
                        value={formatNumber(result.lossPercent)}
                        unit="%"
                    />
                </div>

                {result.warning ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {result.warning}
                    </div>
                ) : null}
            </ResultCard>
        </CalculatorLayout>
    );
}