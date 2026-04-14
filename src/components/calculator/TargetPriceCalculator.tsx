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

export default function TargetPriceCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [buyPrice, setBuyPrice] = useState("");
  const [targetRate, setTargetRate] = useState("");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const rate = parsePositive(targetRate);

    if (buy <= 0 || rate <= 0) {
      return {
        valid: false,
        targetPrice: 0,
        expectedProfitPerShare: 0,
      };
    }

    const targetPrice = buy * (1 + rate / 100);
    const expectedProfitPerShare = targetPrice - buy;

    return {
      valid: true,
      targetPrice,
      expectedProfitPerShare,
    };
  }, [buyPrice, targetRate]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="목표 수익 입력"
            description="매수가와 목표 수익률을 입력하면 목표 가격을 계산할 수 있습니다."
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
              id="targetRate"
              label="목표 수익률"
              type="number"
              placeholder="예: 15"
              unit="%"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
          />

          <p className="text-sm text-slate-500">
            원하는 목표 수익률을 입력하면 목표가가 자동 계산됩니다.
          </p>
        </CalculatorCard>

        <ResultCard
            title="목표가 계산 결과"
            emptyMessage="값을 입력하면 결과가 표시됩니다."
            isValid={result.valid}
        >
          <ResultHighlight
              label="목표 가격"
              value={formatNumber(result.targetPrice)}
              unit={moneyUnit}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="주당 예상 수익"
                value={formatNumber(result.expectedProfitPerShare)}
                unit={moneyUnit}
            />
            <ResultDetail
                label="목표 수익률"
                value={targetRate || "0"}
                unit="%"
            />
          </div>
        </ResultCard>
      </CalculatorLayout>
  );
}