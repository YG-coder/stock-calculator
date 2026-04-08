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

export default function TargetPriceCalculator() {
  const [buyPrice, setBuyPrice] = useState("");
  const [targetRate, setTargetRate] = useState("");

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const rate = Number(targetRate);

    if (buy <= 0 || !Number.isFinite(rate)) {
      return { valid: false, targetPrice: 0, targetAmount: 0 };
    }

    const targetPrice = buy * (1 + rate / 100);
    const targetAmount = targetPrice - buy;

    return {
      valid: true,
      targetPrice,
      targetAmount,
    };
  }, [buyPrice, targetRate]);

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="목표가 입력"
        description="매수하신 가격과 원하는 목표 수익률을 입력하세요."
      >
        <InputField
          id="buyPrice"
          label="매수가 (원)"
          type="number"
          placeholder="예: 50000"
          unit="원"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />
        <InputField
          id="targetRate"
          label="목표 수익률 (%)"
          type="number"
          placeholder="예: 10"
          unit="%"
          value={targetRate}
          onChange={(e) => setTargetRate(e.target.value)}
        />
      </CalculatorCard>

      <ResultCard
        title="목표가 계산 결과"
        emptyMessage="매수가와 목표 수익률을 입력하시면\n목표 매도가가 자동으로 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="목표 매도 가격"
          value={formatNumber(result.targetPrice)}
          unit="원"
          tone="positive"
        />
        <ResultDetail
          label="1주당 목표 이익"
          value={`+${formatNumber(result.targetAmount)}`}
          unit="원"
        />
      </ResultCard>
    </CalculatorLayout>
  );
}