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
import { calculateFundingFee, type FundingFlow } from "@/lib/fundingFee";

type Currency = "KRW" | "USDT";

const FLOW_LABELS: Record<FundingFlow, string> = {
    receive: "수령",
    pay: "지급",
    none: "지급·수령 없음",
};

function formatNumber(value: number, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

export default function CryptoFundingFeeCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [positionSize, setPositionSize] = useState("");
    const [fundingRate, setFundingRate] = useState("");
    const [fundingCount, setFundingCount] = useState("");
    const [positionType, setPositionType] = useState<"long" | "short">("long");

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        const calc = calculateFundingFee({ positionSize, fundingRate, fundingCount, positionType });
        if (!calc.valid) {
            return { ...calc, directionText: "" };
        }

        const rate = Number(fundingRate) / 100;

        let directionText = "";
        if (rate > 0) {
            directionText =
                positionType === "long"
                    ? "양(+) 펀딩비 기준으로 롱 포지션은 펀딩비를 지급하고, 숏 포지션은 수령합니다."
                    : "양(+) 펀딩비 기준으로 숏 포지션은 펀딩비를 수령하고, 롱 포지션은 지급합니다.";
        } else if (rate < 0) {
            directionText =
                positionType === "long"
                    ? "음(-) 펀딩비 기준으로 롱 포지션은 펀딩비를 수령하고, 숏 포지션은 지급합니다."
                    : "음(-) 펀딩비 기준으로 숏 포지션은 펀딩비를 지급하고, 롱 포지션은 수령합니다.";
        } else {
            directionText = "펀딩비가 0%이면 지급 또는 수령 금액도 0입니다.";
        }

        return { ...calc, directionText };
    }, [positionSize, fundingRate, fundingCount, positionType]);

    // 순현금흐름 기준: 양수 = 수령(수익 색), 음수 = 지급(비용 색)
    const tone =
        result.netTotal > 0 ? "positive" : result.netTotal < 0 ? "negative" : "default";
    const flowLabel = FLOW_LABELS[result.flow];
    const signed = (value: number) => `${value > 0 ? "+" : ""}${formatNumber(value)}`;

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="펀딩비 계산 조건 입력"
                description="포지션 규모, 펀딩비율, 횟수, 포지션 방향을 입력하면 예상 펀딩비를 계산합니다."
            >
                <CurrencyToggle value={currency} onChange={setCurrency} />

                <InputField
                    id="positionSize"
                    label="포지션 규모"
                    type="number"
                    placeholder={currency === "KRW" ? "예: 5000000" : "예: 5000"}
                    unit={moneyUnit}
                    value={positionSize}
                    onChange={(e) => setPositionSize(e.target.value)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                        id="fundingRate"
                        label="펀딩비율"
                        type="number"
                        placeholder="예: 0.01"
                        unit="%"
                        value={fundingRate}
                        onChange={(e) => setFundingRate(e.target.value)}
                    />
                    <InputField
                        id="fundingCount"
                        label="적용 횟수"
                        type="number"
                        placeholder="예: 3"
                        unit="회"
                        value={fundingCount}
                        onChange={(e) => setFundingCount(e.target.value)}
                    />
                </div>

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

                <p className="text-sm leading-relaxed text-slate-500">
                    KRW / USDT 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
                    선택한 통화 기준으로 직접 값을 입력하세요.
                </p>
            </CalculatorCard>

            <ResultCard
                title="펀딩비 계산 결과"
                emptyMessage="포지션 규모와 펀딩비율을 입력하면 예상 펀딩비가 계산됩니다."
                isValid={result.valid}
            >
                <ResultHighlight
                    label={`총 예상 펀딩비 (${flowLabel})`}
                    value={signed(result.netTotal)}
                    unit={moneyUnit}
                    tone={tone}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="1회당 펀딩비"
                        value={signed(result.netOneTime)}
                        unit={moneyUnit}
                    />
                    <ResultDetail
                        label="누적 펀딩비"
                        value={signed(result.netTotal)}
                        unit={moneyUnit}
                    />
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                    금액은 내 계좌 기준 순현금흐름입니다. 양수(+)는 수령, 음수(−)는 지급입니다.
                </p>

                {result.directionText ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                        {result.directionText}
                    </div>
                ) : null}
            </ResultCard>
        </CalculatorLayout>
    );
}
