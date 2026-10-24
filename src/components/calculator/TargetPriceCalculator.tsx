"use client";

import { useMemo, useState } from "react";
import { EXACT_ZERO, add, formatGrouped, fromInt, isPositive, mul, div, parsePositiveExact, type Exact } from "@/lib/exactDecimal";
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

  // 통화별 표시 정밀도: USD는 소수점 2자리, KRW는 정수.
  // 공용 formatNumber()를 바꾸지 않고 컴포넌트 단위로만 처리(다른 KRW 계산기 회귀 방지).
  const priceDigits = currency === "USD" ? 2 : 0;
  // 입력 십진값으로 정확히 계산한 값을 기존 Intl 규칙(0에서 먼 쪽 반올림)으로 한 번만 반올림해 표시한다.
  const fmtMoney = (v: Exact) => formatGrouped(v, priceDigits);

  const result = useMemo(() => {
    const buy = parsePositiveExact(buyPrice);
    const rate = parsePositiveExact(targetRate);

    if (!isPositive(buy) || !isPositive(rate)) {
      return {
        valid: false,
        targetPrice: EXACT_ZERO,
        expectedProfitPerShare: EXACT_ZERO,
      };
    }

    // 목표가 = 매수가 × (1 + 수익률 ÷ 100), 주당 수익 = 목표가 − 매수가 (정확한 유리수)
    const expectedProfitPerShare = mul(buy, div(rate, fromInt(100)));
    const targetPrice = add(buy, expectedProfitPerShare);

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
              value={fmtMoney(result.targetPrice)}
              unit={moneyUnit}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="주당 예상 수익"
                value={fmtMoney(result.expectedProfitPerShare)}
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
