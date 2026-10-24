"use client";
import {
    add,
    compare,
    div,
    formatGrouped,
    formatGroupedFixed,
    fromInt,
    fromNumber,
    mul,
    requiredFiniteNumberExact,
    sign,
    sub,
    toPlainDecimal,
    EXACT_ZERO,
    type Exact,
} from "@/lib/exactDecimal";

import { Fragment, useMemo, useState } from "react";
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

/** 손익비 목표가 표에 표시할 비율 (엑셀 1:1.1 ~ 1:10 기준) */
const RR_STEPS = [1.1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** 손익비 단계의 정확값(코드에 적힌 십진 표기 그대로, 1.1 → 11/10) */
const RR_STEP_VALUES = RR_STEPS.map(fromNumber);

/** 복리 시뮬레이션 회차 */
const SIM_ROUNDS = 10;

/** 두 결과표의 제목. 카드 제목과 가로 스크롤 영역의 접근 가능한 이름에 같이 쓴다. */
const RR_TABLE_TITLE = "손익비별 목표가";
const SIM_TABLE_TITLE = "연속 익절 / 연속 손절 시뮬레이션";

const HUNDRED = fromInt(100);

/** Intl.NumberFormat("ko-KR", { maximumFractionDigits: 4 }) 기준 표시(정확값을 표시할 때 한 번만 반올림) */
function formatNumber(value: Exact, maximumFractionDigits = 4) {
    return formatGrouped(value, maximumFractionDigits);
}

/** 표 안에서 자릿수를 고정해 세로 정렬을 맞추기 위한 포맷터(Intl 최소·최대 소수 자릿수 같음) */
function formatFixed(value: Exact, digits = 2) {
    return formatGroupedFixed(value, digits);
}

type RrRow = { ratio: Exact; label: string; price: Exact; profit: Exact; isCurrent: boolean };

/** 표 셀의 긴 숫자에 쉼표 뒤 줄바꿈 기회(<wbr>)만 넣는다. 글자·자릿수는 그대로라 화면 텍스트는 같다. */
function breakAtCommas(text: string) {
    const parts = text.split(",");
    return parts.map((part, i) => (
        <Fragment key={i}>
            {part}
            {i < parts.length - 1 ? (
                <>
                    ,<wbr />
                </>
            ) : null}
        </Fragment>
    ));
}

export default function CryptoEntryCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [entryPrice, setEntryPrice] = useState("");
    const [stopPrice, setStopPrice] = useState("");
    const [seed, setSeed] = useState("");
    const [riskPercent, setRiskPercent] = useState("");
    const [rewardRatio, setRewardRatio] = useState("");

    const moneyUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        // 입력 십진값 그대로 정확히 계산한다. 유효성·손익비 정렬·현재 행 판정도 반올림 전 정확값으로 한다.
        const entry = requiredFiniteNumberExact(entryPrice);
        const stop = requiredFiniteNumberExact(stopPrice);
        const seedValue = requiredFiniteNumberExact(seed);
        const risk = requiredFiniteNumberExact(riskPercent);
        const rr = requiredFiniteNumberExact(rewardRatio);

        const empty = {
            valid: false as const,
            lossPercent: EXACT_ZERO,
            leverage: EXACT_ZERO,
            riskAmount: EXACT_ZERO,
            positionSize: EXACT_ZERO,
            takeProfitPrice: EXACT_ZERO,
            risk: EXACT_ZERO,
            rr: EXACT_ZERO,
            seedValue: EXACT_ZERO,
            rrTable: [] as RrRow[],
            winSeries: [] as Exact[],
            lossSeries: [] as Exact[],
        };

        if (
            !entry ||
            !stop ||
            !seedValue ||
            !risk ||
            !rr ||
            sign(entry) <= 0 ||
            sign(stop) <= 0 ||
            sign(seedValue) <= 0 ||
            sign(risk) <= 0 ||
            sign(rr) <= 0 ||
            compare(risk, HUNDRED) >= 0 ||
            compare(stop, entry) >= 0
        ) {
            return empty;
        }

        const stopDistance = sub(entry, stop);
        const lossPercent = mul(div(stopDistance, entry), HUNDRED);
        const leverage = sign(lossPercent) > 0 ? div(HUNDRED, lossPercent) : EXACT_ZERO;
        const riskRate = div(risk, HUNDRED);
        const riskAmount = mul(seedValue, riskRate);
        const positionSize = mul(leverage, riskAmount);
        const takeProfitPrice = add(entry, mul(stopDistance, rr));

        // 손익비별 목표가 (엑셀 E2:N3) + 현재 입력한 손익비를 정렬 위치에 병합(같은 값은 한 행)
        const ratios = [...RR_STEP_VALUES, rr]
            .filter((ratio, index, all) => all.findIndex((other) => compare(other, ratio) === 0) === index)
            .sort(compare);
        const rrTable: RrRow[] = ratios.map((ratio) => ({
            ratio,
            label: toPlainDecimal(ratio),
            price: add(entry, mul(stopDistance, ratio)),
            profit: mul(riskAmount, ratio),
            isCurrent: compare(ratio, rr) === 0,
        }));

        // 연속 익절 / 연속 손절 복리 시뮬레이션 (엑셀 E11:I21)
        const winSeries: Exact[] = [];
        const lossSeries: Exact[] = [];
        let win = seedValue;
        let loss = seedValue;
        for (let i = 0; i < SIM_ROUNDS; i += 1) {
            win = add(win, mul(mul(win, riskRate), rr));
            loss = mul(loss, sub(fromInt(1), riskRate));
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
                description="진입가, 손절가, 투자 원금, 리스크 비율, 손익비를 입력하면 손절폭 기준 이론 배율, 주문 금액, 익절가를 계산할 수 있습니다."
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
                        label="투자 원금"
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
                emptyMessage="진입가, 손절가, 투자 원금, 리스크 비율을 입력하면 결과가 계산됩니다."
                isValid={result.valid}
            >
                <CommaBreaks>
                    <ResultHighlight
                        label="주문 명목가치"
                        value={formatNumber(result.positionSize)}
                        unit={moneyUnit}
                        tone="default"
                    />
                </CommaBreaks>

                <div className="grid gap-4 sm:grid-cols-2">
                    <CommaBreaks>
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
                    </CommaBreaks>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    이론 배율은 손절폭(%)으로 100을 나눈 값으로, 손절 시 투자 원금 대비 손실이 입력한 리스크
                    비율과 같아지는 최대 배율입니다. 거래소가 지원하는 최대 배율을 넘을 수 있고 수수료·
                    슬리피지가 반영되지 않으므로, 실제 진입은 이보다 낮은 배율을 사용하세요.
                </p>
            </ResultCard>

            {result.valid ? (
                <CalculatorCard
                    className="min-w-0"
                    title={RR_TABLE_TITLE}
                    description="같은 손절폭에서 손익비를 1:1.1부터 1:10까지 잡았을 때의 목표가와 예상 수익입니다. 현재 입력한 손익비 행은 강조 표시됩니다."
                >
                    {/* 좁은 화면에서 표가 가로로 스크롤되므로 키보드로도 이 영역에 초점을 두고 화살표로 스크롤할 수 있게 한다(기본 Tab 순서). */}
                    <div className="-mx-2 overflow-x-auto" tabIndex={0} role="region" aria-label={RR_TABLE_TITLE}>
                        <table className="w-full min-w-[300px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="px-2 py-2 font-medium">손익비</th>
                                    <th className="px-2 py-2 text-right font-medium">목표가 ({moneyUnit})</th>
                                    <th className="px-2 py-2 text-right font-medium">예상 수익 ({moneyUnit})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.rrTable.map((row) => {
                                    const isCurrent = row.isCurrent;
                                    return (
                                        <tr
                                            key={row.label}
                                            className={`border-b border-slate-100 last:border-0 ${isCurrent ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                                                }`}
                                        >
                                            <td className="px-2 py-2">1 : {row.label}</td>
                                            <td className="px-2 py-2 text-right tabular-nums">
                                                {breakAtCommas(formatNumber(row.price))}
                                            </td>
                                            <td className="px-2 py-2 text-right tabular-nums text-red-600">
                                                {breakAtCommas(`+${formatFixed(row.profit)}`)}
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
                    className="min-w-0"
                    title={SIM_TABLE_TITLE}
                    description={`매 회차 투자 원금의 ${formatNumber(result.risk, 2)}%를 리스크로 잡고 손익비 1:${formatNumber(result.rr, 2)}로 거래했을 때, 10회 연속 익절한 경우와 10회 연속 손절한 경우의 원금 변화입니다.`}
                >
                    <div className="-mx-2 overflow-x-auto" tabIndex={0} role="region" aria-label={SIM_TABLE_TITLE}>
                        <table className="w-full min-w-[300px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="px-2 py-2 font-medium">회차</th>
                                    <th className="px-2 py-2 text-right font-medium">연속 익절 시 원금</th>
                                    <th className="px-2 py-2 text-right font-medium">연속 손절 시 원금</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100 text-slate-500">
                                    <td className="px-2 py-2">첫 투자 원금</td>
                                    <td className="px-2 py-2 text-right tabular-nums">
                                        {breakAtCommas(formatFixed(result.seedValue))}
                                    </td>
                                    <td className="px-2 py-2 text-right tabular-nums">
                                        {breakAtCommas(formatFixed(result.seedValue))}
                                    </td>
                                </tr>
                                {result.winSeries.map((winValue, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-100 last:border-0 text-slate-700"
                                    >
                                        <td className="px-2 py-2">{index + 1}회</td>
                                        <td className="px-2 py-2 text-right tabular-nums text-red-600">
                                            {breakAtCommas(formatFixed(winValue))}
                                        </td>
                                        <td className="px-2 py-2 text-right tabular-nums text-blue-600">
                                            {breakAtCommas(formatFixed(result.lossSeries[index]))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                        매 회차 불어난(혹은 줄어든) 투자 원금을 전액 재투자한다고 가정한 복리 계산이며, 수수료와
                        펀딩비는 반영되지 않았습니다. 실제 매매는 연승과 연패가 섞이므로 참고용 수치로만
                        보세요.
                    </p>
                </CalculatorCard>
            ) : null}
        </CalculatorLayout>
    );
}
