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

export default function ProfitCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const current = parsePositive(currentPrice);
    const qty = parsePositive(quantity);

    if (buy <= 0 || current <= 0 || qty <= 0) {
      return { valid: false, profitRate: 0, profitAmount: 0, evalAmount: 0 };
    }

    const profitRate = ((current - buy) / buy) * 100;
    const profitAmount = (current - buy) * qty;
    const evalAmount = current * qty;

    return {
      valid: true,
      profitRate,
      profitAmount,
      evalAmount,
    };
  }, [buyPrice, currentPrice, quantity]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="단가 및 수량 입력"
            description="매수가와 현재가, 보유 수량을 입력하면 수익률과 평가 손익을 계산할 수 있습니다."
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
              id="currentPrice"
              label={`현재가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 55000" : "예: 55"}
              unit={moneyUnit}
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
          />
          <InputField
              id="quantity"
              label="수량 (주)"
              type="number"
              placeholder="예: 100"
              unit="주"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
          />

          <p className="text-sm text-slate-500">
            값을 입력하면 자동으로 계산됩니다.
          </p>
        </CalculatorCard>

        <ResultCard
            title="수익률 계산 결과"
            emptyMessage="값을 입력하면 결과가 표시됩니다."
            isValid={result.valid}
        >
          <ResultHighlight
              label="예상 수익률"
              value={`${result.profitRate > 0 ? "+" : ""}${result.profitRate.toFixed(2)}`}
              unit="%"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="평가 손익"
                value={`${result.profitAmount > 0 ? "+" : ""}${formatNumber(result.profitAmount)}`}
                unit={moneyUnit}
            />
            <ResultDetail
                label="평가 금액"
                value={formatNumber(result.evalAmount)}
                unit={moneyUnit}
            />
          </div>
        </ResultCard>
      </CalculatorLayout>
  );
}