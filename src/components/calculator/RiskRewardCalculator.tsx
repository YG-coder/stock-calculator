"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
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

  const result = useMemo(() => {
    const entry = parsePositive(entryPrice);
    const stop = parsePositive(stopPrice);
    const target = parsePositive(targetPrice);

    if (entry <= 0 || stop <= 0 || target <= 0) {
      return {
        valid: false,
        riskAmount: 0,
        rewardAmount: 0,
        riskRewardRatio: 0,
      };
    }

    const riskAmount = entry - stop;
    const rewardAmount = target - entry;

    if (riskAmount <= 0 || rewardAmount <= 0) {
      return {
        valid: false,
        riskAmount: 0,
        rewardAmount: 0,
        riskRewardRatio: 0,
      };
    }

    const riskRewardRatio = rewardAmount / riskAmount;

    return {
      valid: true,
      riskAmount,
      rewardAmount,
      riskRewardRatio,
    };
  }, [entryPrice, stopPrice, targetPrice]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="진입/손절/목표가 입력"
            description="진입가, 손절가, 목표가를 입력하면 손익비를 계산할 수 있습니다."
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
              value={result.riskRewardRatio.toFixed(2)}
              unit="R"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="리스크 금액"
                value={formatNumber(result.riskAmount)}
                unit={moneyUnit}
            />
            <ResultDetail
                label="보상 금액"
                value={formatNumber(result.rewardAmount)}
                unit={moneyUnit}
            />
          </div>
        </ResultCard>
      </CalculatorLayout>
  );
}