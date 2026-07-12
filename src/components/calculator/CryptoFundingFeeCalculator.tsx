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

export default function CryptoFundingFeeCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [positionSize, setPositionSize] = useState("");
    const [fundingRate, setFundingRate] = useState("");
    const [fundingCount, setFundingCount] = useState("1");
    const [positionType, setPositionType] = useState<"long" | "short">("long");

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        const size = Number(positionSize);
        const rate = Number(fundingRate) / 100;
        const count = Number(fundingCount);

        if (
            !Number.isFinite(size) ||
            !Number.isFinite(rate) ||
            !Number.isFinite(count) ||
            size <= 0 ||
            count <= 0
        ) {
            return {
                valid: false,
                oneTimeFee: 0,
                totalFee: 0,
                directionText: "",
            };
        }

        const oneTimeFee = size * rate;
        const totalFee = oneTimeFee * count;

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

        return {
            valid: true,
            oneTimeFee,
            totalFee,
            directionText,
        };
    }, [positionSize, fundingRate, fundingCount, positionType]);

    const tone =
        result.totalFee > 0 ? "negative" : result.totalFee < 0 ? "positive" : "default";

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
                    label="총 예상 펀딩비"
                    value={formatNumber(result.totalFee)}
                    unit={moneyUnit}
                    tone={tone}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ResultDetail
                        label="1회당 펀딩비"
                        value={formatNumber(result.oneTimeFee)}
                        unit={moneyUnit}
                    />
                    <ResultDetail
                        label="누적 펀딩비"
                        value={formatNumber(result.totalFee)}
                        unit={moneyUnit}
                    />
                </div>

                {result.directionText ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                        {result.directionText}
                    </div>
                ) : null}
            </ResultCard>
        </CalculatorLayout>
    );
}