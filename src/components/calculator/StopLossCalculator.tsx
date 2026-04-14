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

export default function StopLossCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [buyPrice, setBuyPrice] = useState("");
  const [stopLossRate, setStopLossRate] = useState("");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const rate = parsePositive(stopLossRate);

    if (buy <= 0 || rate <= 0 || rate >= 100) {
      return {
        valid: false,
        stopLossPrice: 0,
        lossAmountPerShare: 0,
      };
    }

    const stopLossPrice = buy * (1 - rate / 100);
    const lossAmountPerShare = buy - stopLossPrice;

    return {
      valid: true,
      stopLossPrice,
      lossAmountPerShare,
    };
  }, [buyPrice, stopLossRate]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="손절 기준 입력"
            description="매수가와 손절 비율을 입력하면 손절 가격을 계산할 수 있습니다."
        >
          <CurrencyToggle
              value={currency}
              onChange={setCurrency}
              options={["KRW", "USD"] as const}
          />

          <InputField
              id="buyPrice"
              label={`매수가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 50000" : "예: 50"}
              unit={moneyUnit}
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
          />
          <InputField
              id="stopLossRate"
              label="손절 비율"
              type="number"
              placeholder="예: 10"
              unit="%"
              value={stopLossRate}
              onChange={(e) => setStopLossRate(e.target.value)}
          />

          <p className="text-sm text-slate-500">
            손절 비율은 0보다 크고 100보다 작아야 합니다.
          </p>
        </CalculatorCard>

        <ResultCard
            title="손절가 계산 결과"
            emptyMessage="값을 입력하면 결과가 표시됩니다."
            isValid={result.valid}
        >
          <ResultHighlight
              label="손절 가격"
              value={formatNumber(result.stopLossPrice)}
              unit={moneyUnit}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="주당 손실 금액"
                value={formatNumber(result.lossAmountPerShare)}
                unit={moneyUnit}
            />
            <ResultDetail
                label="설정 손절 비율"
                value={stopLossRate || "0"}
                unit="%"
            />
          </div>
        </ResultCard>
      </CalculatorLayout>
  );
}