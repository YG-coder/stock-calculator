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

export default function AveragePriceCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [firstPrice, setFirstPrice] = useState("");
  const [firstQuantity, setFirstQuantity] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [secondQuantity, setSecondQuantity] = useState("");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const p1 = parsePositive(firstPrice);
    const q1 = parsePositive(firstQuantity);
    const p2 = parsePositive(secondPrice);
    const q2 = parsePositive(secondQuantity);

    if (p1 <= 0 || q1 <= 0 || p2 <= 0 || q2 <= 0) {
      return {
        valid: false,
        averagePrice: 0,
        totalQuantity: 0,
        totalAmount: 0,
      };
    }

    const totalQuantity = q1 + q2;
    const totalAmount = p1 * q1 + p2 * q2;
    const averagePrice = totalAmount / totalQuantity;

    return {
      valid: true,
      averagePrice,
      totalQuantity,
      totalAmount,
    };
  }, [firstPrice, firstQuantity, secondPrice, secondQuantity]);

  return (
      <CalculatorLayout>
        <CalculatorCard
            title="매수 정보 입력"
            description="기존 매수와 추가 매수 가격, 수량을 입력하면 평균 단가를 계산할 수 있습니다."
        >
          <CurrencyToggle
              value={currency}
              onChange={setCurrency}
              options={["KRW", "USD"] as const}
          />

          <InputField
              id="firstPrice"
              label={`1차 매수가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 50000" : "예: 50"}
              unit={moneyUnit}
              value={firstPrice}
              onChange={(e) => setFirstPrice(e.target.value)}
          />
          <InputField
              id="firstQuantity"
              label="1차 매수 수량"
              type="number"
              placeholder="예: 10"
              unit="주"
              value={firstQuantity}
              onChange={(e) => setFirstQuantity(e.target.value)}
          />
          <InputField
              id="secondPrice"
              label={`추가 매수가 (${moneyUnit})`}
              type="number"
              placeholder={currency === "KRW" ? "예: 40000" : "예: 40"}
              unit={moneyUnit}
              value={secondPrice}
              onChange={(e) => setSecondPrice(e.target.value)}
          />
          <InputField
              id="secondQuantity"
              label="추가 매수 수량"
              type="number"
              placeholder="예: 10"
              unit="주"
              value={secondQuantity}
              onChange={(e) => setSecondQuantity(e.target.value)}
          />

          <p className="text-sm text-slate-500">
            값을 입력하면 평균 단가가 자동으로 계산됩니다.
          </p>
        </CalculatorCard>

        <ResultCard
            title="평단가 계산 결과"
            emptyMessage="값을 입력하면 결과가 표시됩니다."
            isValid={result.valid}
        >
          <ResultHighlight
              label="평균 단가"
              value={formatNumber(result.averagePrice)}
              unit={moneyUnit}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail
                label="총 보유 수량"
                value={formatNumber(result.totalQuantity)}
                unit="주"
            />
            <ResultDetail
                label="총 매수 금액"
                value={formatNumber(result.totalAmount)}
                unit={moneyUnit}
            />
          </div>
        </ResultCard>
      </CalculatorLayout>
  );
}