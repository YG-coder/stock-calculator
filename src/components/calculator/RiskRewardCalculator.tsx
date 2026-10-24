"use client";

import { useMemo, useState } from "react";
import { EXACT_ZERO, add, div, formatGrouped, fromInt, isPositive, mul, parsePositiveExact, sub, toFixedExact, type Exact } from "@/lib/exactDecimal";
import {
  CalculatorLayout,
  CalculatorCard,
  ResultCard,
  ResultHighlight,
  ResultDetail,
  InputField,
} from "@/components/ui/Shared";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";

type Currency = "KRW" | "USD";

export default function RiskRewardCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  // 통화별 표시 정밀도: USD는 소수점 2자리, KRW는 정수.
  // 공용 formatNumber()를 바꾸지 않고 컴포넌트 단위로만 처리.
  const priceDigits = currency === "USD" ? 2 : 0;
  // 입력 십진값으로 정확히 계산한 값을 기존 Intl 규칙(0에서 먼 쪽 반올림)으로 한 번만 반올림해 표시한다.
  const fmtMoney = (v: Exact) => formatGrouped(v, priceDigits);

  const result = useMemo(() => {
    const entry = parsePositiveExact(entryPrice);
    const stop = parsePositiveExact(stopPrice);
    const target = parsePositiveExact(targetPrice);
    const invalid = {
      valid: false,
      riskAmount: EXACT_ZERO,
      rewardAmount: EXACT_ZERO,
      riskRewardRatio: EXACT_ZERO,
      breakevenWinRate: EXACT_ZERO,
    };

    if (!isPositive(entry) || !isPositive(stop) || !isPositive(target)) {
      return invalid;
    }

    // 입력 십진값으로 정확히 계산하고 표시 단계에서만 반올림한다.
    const riskAmount = sub(entry, stop);
    const rewardAmount = sub(target, entry);

    if (!isPositive(riskAmount) || !isPositive(rewardAmount)) {
      return invalid;
    }

    const riskRewardRatio = div(rewardAmount, riskAmount);
    // 손익분기 승률 = 1 ÷ (1 + 손익비) × 100. 이 승률을 넘어야 장기 기대값이 (+).
    const breakevenWinRate = mul(div(fromInt(1), add(fromInt(1), riskRewardRatio)), fromInt(100));

    return {
      valid: true,
      riskAmount,
      rewardAmount,
      riskRewardRatio,
      breakevenWinRate,
    };
  }, [entryPrice, stopPrice, targetPrice]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="진입/손절/목표가 입력"
            description="진입가, 손절가, 목표가를 입력하면 손익비와 손익분기 승률을 계산할 수 있습니다."
        >
          <CurrencyToggle
              value={currency}
              onChange={setCurrency}
              options={["KRW", "USD"] as const}
          />

          <InputField
              id="entryPrice"
              label={`진입가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 50000" : "예: 50"}
              unit={moneyUnit}
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
          />
          <InputField
              id="stopPrice"
              label={`손절가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 47000" : "예: 47"}
              unit={moneyUnit}
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
          />
          <InputField
              id="targetPrice"
              label={`목표가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 56000" : "예: 56"}
              unit={moneyUnit}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
          />

          <p className="text-sm text-slate-500">
            손절가는 진입가보다 낮아야 하고, 목표가는 진입가보다 높아야 합니다.
          </p>
        </CalculatorCard>

        <ResultCard
            title="손익비 계산 결과"
            emptyMessage="값을 입력하면 결과가 표시됩니다."
            isValid={result.valid}
        >
          <ResultHighlight
              label="손익비"
              value={toFixedExact(result.riskRewardRatio, 2)}
              unit="R"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="리스크 금액"
                value={fmtMoney(result.riskAmount)}
                unit={moneyUnit}
            />
            <ResultDetail
                label="보상 금액"
                value={fmtMoney(result.rewardAmount)}
                unit={moneyUnit}
            />
            <ResultDetail
                label="손익분기 승률"
                value={toFixedExact(result.breakevenWinRate, 1)}
                unit="%"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            실제 승률이 손익분기 승률(<span className="font-semibold text-slate-700">{toFixedExact(result.breakevenWinRate, 1)}%</span>)을 넘어야 장기적으로 기대값이 플러스가 됩니다.
          </p>
        </ResultCard>
      </CalculatorLayout>
  );
}
