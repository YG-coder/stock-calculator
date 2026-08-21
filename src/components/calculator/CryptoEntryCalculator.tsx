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

/** 손익비 목표가 표에 표시할 비율 (엑셀 1:1.1 ~ 1:10 기준) */
const RR_STEPS = [1.1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** 복리 시뮬레이션 회차 */
const SIM_ROUNDS = 10;

function formatNumber(value: number, maximumFractionDigits = 4) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(value);
}

/** 표 안에서 자릿수를 고정해 세로 정렬을 맞추기 위한 포맷터 */
function formatFixed(value: number, digits = 2) {
    if (!Number.isFinite(value)) return (0).toFixed(digits);
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
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

        const empty = {
            valid: false as const,
            lossPercent: 0,
            leverage: 0,
            riskAmount: 0,
            positionSize: 0,
            takeProfitPrice: 0,
            risk: 0,
            rr: 0,
            seedValue: 0,
            rrTable: [] as { ratio: number; price: number; profit: number }[],
            winSeries: [] as number[],
            lossSeries: [] as number[],
        };

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
            risk >= 100 ||
            stop >= entry
        ) {
            return empty;
        }

        const lossPercent = ((entry - stop) / entry) * 100;
        const leverage = lossPercent > 0 ? 100 / lossPercent : 0;
        const riskAmount = seedValue * (risk / 100);
        const positionSize = leverage * riskAmount;
        const takeProfitPrice = entry + (entry - stop) * rr;

        // 손익비별 목표가 (엑셀 E2:N3) + 현재 입력한 손익비를 정렬 위치에 병합
        const ratios = Array.from(new Set([...RR_STEPS, rr])).sort((a, b) => a - b);
        const rrTable = ratios.map((ratio) => ({
            ratio,
            price: entry + (entry - stop) * ratio,
            profit: riskAmount * ratio,
        }));

        // 연속 익절 / 연속 손절 복리 시뮬레이션 (엑셀 E11:I21)
        const winSeries: number[] = [];
        const lossSeries: number[] = [];
        let win = seedValue;
        let loss = seedValue;
        for (let i = 0; i < SIM_ROUNDS; i += 1) {
            win = win + win * (risk / 100) * rr;
            loss = loss * (1 - risk / 100);
            winSeries.push(win);
            lossSeries.push(loss);
        }

        return {
            valid: true as const,
            lossPercent,
            leverage,
            riskAmount,
            positionSize,
            takeProfitPrice,
            risk,
            rr,
            seedValue,
            rrTable,
            winSeries,
            lossSeries,
        };
    }, [entryPrice, stopPrice, seed, riskPercent, rewardRatio]);

    return (
        <CalculatorLayout>
            <CalculatorCard
                title="코인 100배 진입 계산기"
                description="진입가, 손절가, 시드, 리스크 비율, 손익비를 입력하면 손절폭 기준 이론 배율, 주문 금액, 익절가를 계산할 수 있습니다."
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
                    손절폭을 기준으로 이론 배율과 주문 금액을 계산하는 방식이며, 손절가가 진입가보다
                    낮은 롱(매수) 포지션 기준입니다.
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
                        label="이론 배율"
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

                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    이론 배율은 손절폭(%)으로 100을 나눈 값으로, 손절 시 시드 대비 손실이 입력한 리스크
                    비율과 같아지는 최대 배율입니다. 거래소가 지원하는 최대 배율을 넘을 수 있고 수수료·
                    슬리피지가 반영되지 않으므로, 실제 진입은 이보다 낮은 배율을 사용하세요.
                </p>
            </ResultCard>

            {result.valid ? (
                <CalculatorCard
                    title="손익비별 목표가"
                    description="같은 손절폭에서 손익비를 1:1.1부터 1:10까지 잡았을 때의 목표가와 예상 수익입니다. 현재 입력한 손익비 행은 강조 표시됩니다."
                >
                    <div className="-mx-2 overflow-x-auto">
                        <table className="w-full min-w-[420px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="px-2 py-2 font-medium">손익비</th>
                                    <th className="px-2 py-2 text-right font-medium">목표가 ({moneyUnit})</th>
                                    <th className="px-2 py-2 text-right font-medium">예상 수익 ({moneyUnit})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.rrTable.map((row) => {
                                    const isCurrent = Math.abs(row.ratio - result.rr) < 1e-9;
                                    return (
                                        <tr
                                            key={row.ratio}
                                            className={`border-b border-slate-100 last:border-0 ${isCurrent ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                                                }`}
                                        >
                                            <td className="px-2 py-2">1 : {row.ratio}</td>
                                            <td className="px-2 py-2 text-right tabular-nums">
                                                {formatNumber(row.price)}
                                            </td>
                                            <td className="px-2 py-2 text-right tabular-nums text-red-600">
                                                +{formatFixed(row.profit)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                        예상 수익은 리스크 금액({formatFixed(result.riskAmount)} {moneyUnit}) × 손익비로,
                        위에서 계산된 주문 명목가치로 진입했을 때 기준입니다.
                    </p>
                </CalculatorCard>
            ) : null}

            {result.valid ? (
                <CalculatorCard
                    title="연속 익절 / 연속 손절 시뮬레이션"
                    description={`매 회차 시드의 ${formatNumber(result.risk, 2)}%를 리스크로 잡고 손익비 1:${formatNumber(result.rr, 2)}로 거래했을 때, 10회 연속 익절한 경우와 10회 연속 손절한 경우의 시드 변화입니다.`}
                >
                    <div className="-mx-2 overflow-x-auto">
                        <table className="w-full min-w-[420px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="px-2 py-2 font-medium">회차</th>
                                    <th className="px-2 py-2 text-right font-medium">연속 익절 시 시드</th>
                                    <th className="px-2 py-2 text-right font-medium">연속 손절 시 시드</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100 text-slate-500">
                                    <td className="px-2 py-2">첫 시드</td>
                                    <td className="px-2 py-2 text-right tabular-nums">
                                        {formatFixed(result.seedValue)}
                                    </td>
                                    <td className="px-2 py-2 text-right tabular-nums">
                                        {formatFixed(result.seedValue)}
                                    </td>
                                </tr>
                                {result.winSeries.map((winValue, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-100 last:border-0 text-slate-700"
                                    >
                                        <td className="px-2 py-2">{index + 1}회</td>
                                        <td className="px-2 py-2 text-right tabular-nums text-red-600">
                                            {formatFixed(winValue)}
                                        </td>
                                        <td className="px-2 py-2 text-right tabular-nums text-blue-600">
                                            {formatFixed(result.lossSeries[index])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                        매 회차 불어난(혹은 줄어든) 시드를 전액 재투자한다고 가정한 복리 계산이며, 수수료와
                        펀딩비는 반영되지 않았습니다. 실제 매매는 연승과 연패가 섞이므로 참고용 수치로만
                        보세요.
                    </p>
                </CalculatorCard>
            ) : null}
        </CalculatorLayout>
    );
}
