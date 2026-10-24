"use client";
import {
    add,
    compare,
    div,
    formatGrouped,
    formatPriceExact,
    fromInt,
    mul,
    requiredFiniteNumberExact,
    sign,
    sub,
    EXACT_ZERO,
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
import CurrencyToggle from "@/components/calculator/CurrencyToggle";
import CommaBreaks from "@/components/calculator/CommaBreaks";

type Currency = "KRW" | "USDT";

/** Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }) 기준 표시(정확값을 표시할 때 한 번만 반올림) */
function formatNumber(value: Exact, maximumFractionDigits = 2) {
    return formatGrouped(value, maximumFractionDigits);
}

const ONE = fromInt(1);
const HUNDRED = fromInt(100);

export default function CryptoLiquidationCalculator() {
    const [currency, setCurrency] = useState<Currency>("USDT");
    const [entryPrice, setEntryPrice] = useState("");
    const [leverage, setLeverage] = useState("");
    const [marginType, setMarginType] = useState<"isolated" | "cross">("isolated");
    const [positionType, setPositionType] = useState<"long" | "short">("long");
    const [maintenanceMarginRate, setMaintenanceMarginRate] = useState("");

    const priceUnit = currency === "KRW" ? "원" : "USDT";

    const result = useMemo(() => {
        // 입력 십진값 그대로 정확히 계산한다. 유효성·경고 구간·가격 표시 구간도 반올림 전 정확값으로 판정한다.
        const entry = requiredFiniteNumberExact(entryPrice);
        const lev = requiredFiniteNumberExact(leverage);
        const mmrPercent = requiredFiniteNumberExact(maintenanceMarginRate);
        const mmr = mmrPercent ? div(mmrPercent, HUNDRED) : null;

        if (
            !entry ||
            !lev ||
            !mmr ||
            sign(entry) <= 0 ||
            sign(lev) <= 0 ||
            sign(mmr) < 0 ||
            compare(mmr, ONE) >= 0
        ) {
            return {
                valid: false,
                liquidationPrice: EXACT_ZERO,
                bankruptcyPrice: EXACT_ZERO,
                lossPercent: EXACT_ZERO,
                warning: "",
            };
        }

        // 교차/격리 차이는 유지증거금률이 아니라 "청산에 동원되는 증거금"에서 나온다.
        // 교차 마진은 계좌 잔고 전체가 증거금이 되어 청산가가 더 멀어지지만, 그 값은
        // 계좌 잔고를 알아야 계산할 수 있다. 근거 없이 유지증거금률을 깎지 않고
        // 격리 기준으로 계산한 뒤, 교차는 안내 문구로 차이를 알린다.
        const effectiveMmr = mmr;
        const inverseLeverage = div(ONE, lev);

        let liquidationPrice: Exact;
        let bankruptcyPrice: Exact;
        let lossPercent: Exact;

        if (positionType === "long") {
            bankruptcyPrice = mul(entry, sub(ONE, inverseLeverage));
            liquidationPrice = mul(entry, add(sub(ONE, inverseLeverage), effectiveMmr));
            lossPercent = mul(div(sub(entry, liquidationPrice), entry), HUNDRED);
        } else {
            bankruptcyPrice = mul(entry, add(ONE, inverseLeverage));
            liquidationPrice = mul(entry, sub(add(ONE, inverseLeverage), effectiveMmr));
            lossPercent = mul(div(sub(liquidationPrice, entry), entry), HUNDRED);
        }

        let warning = "";
        if (compare(lev, fromInt(20)) >= 0) {
            warning = "고배율 구간입니다. 작은 변동에도 청산될 수 있습니다.";
        } else if (compare(lev, fromInt(10)) >= 0) {
            warning = "레버리지가 높습니다. 진입 전 청산 가격을 반드시 확인하세요.";
        }

        return {
            valid: sign(liquidationPrice) > 0,
            liquidationPrice,
            bankruptcyPrice,
            lossPercent,
            warning,
        };
    }, [entryPrice, leverage, positionType, maintenanceMarginRate]);

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

                {marginType === "cross" ? (
                    <p className="text-sm leading-relaxed text-slate-500">
                        교차 마진은 계좌의 가용 잔고와 다른 포지션의 손익까지 함께 반영하므로 실제
                        청산 가격이 아래 결과보다 멀어지거나 가까워질 수 있습니다. 아래 결과는
                        <strong> 격리 마진 기준의 단순 근사값</strong>이며, 교차 마진의 최종 판단에는
                        거래소 주문 화면의 예상 청산가와 계정 유지증거금률을 확인하세요.
                    </p>
                ) : null}

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
                    최대 레버리지와 유지 증거금률은 거래소·상품·종목·포지션 규모(위험한도 구간)에 따라
                    달라집니다. 이 계산기는 고정값을 제공하지 않으므로, 거래 전 해당 상품의 최신
                    위험한도 표에서 값을 확인해 직접 입력하세요.
                </p>

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
                <CommaBreaks>
                    <ResultHighlight
                        label="격리마진 근사 청산가"
                        value={formatPriceExact(result.liquidationPrice)}
                        unit={priceUnit}
                        tone="negative"
                    />
                </CommaBreaks>

                <div className="grid gap-4 sm:grid-cols-2">
                    <CommaBreaks>
                        <ResultDetail
                            label="파산 가격(이론값)"
                            value={formatPriceExact(result.bankruptcyPrice)}
                            unit={priceUnit}
                        />
                        <ResultDetail
                            label="진입가 대비 변동 폭"
                            value={formatNumber(result.lossPercent)}
                            unit="%"
                        />
                    </CommaBreaks>
                </div>

                {result.warning ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {result.warning}
                    </div>
                ) : null}

                <p className="text-sm leading-relaxed text-slate-500">
                    실제 청산은 거래소의 마크 가격을 기준으로 판단될 수 있으며, 종료 수수료·펀딩비·추가
                    증거금·위험한도 등급에 따라 결과가 달라집니다. 주문 전 거래소에 표시되는 예상
                    청산가를 최종 기준으로 확인하세요.
                </p>
            </ResultCard>
        </CalculatorLayout>
    );
}
