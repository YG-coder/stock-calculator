"use client";

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

type Currency = "KRW" | "USD";

function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export default function AveragePriceCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");

  const [currentPrice, setCurrentPrice] = useState("10000");
  const [currentQuantity, setCurrentQuantity] = useState("10");
  const [additionalPrice, setAdditionalPrice] = useState("8000");
  const [additionalQuantity, setAdditionalQuantity] = useState("10");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const currentP = Number(currentPrice);
    const currentQ = Number(currentQuantity);
    const addP = Number(additionalPrice);
    const addQ = Number(additionalQuantity);

    if (
      !Number.isFinite(currentP) ||
      !Number.isFinite(currentQ) ||
      !Number.isFinite(addP) ||
      !Number.isFinite(addQ) ||
      currentP <= 0 ||
      currentQ <= 0 ||
      addP <= 0 ||
      addQ <= 0
    ) {
      return {
        valid: false,
        currentAmount: 0,
        additionalAmount: 0,
        totalAmount: 0,
        totalQuantity: 0,
        averagePrice: 0,
      };
    }

    const currentAmount = currentP * currentQ;
    const additionalAmount = addP * addQ;
    const totalAmount = currentAmount + additionalAmount;
    const totalQuantity = currentQ + addQ;
    const averagePrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0;

    return {
      valid: true,
      currentAmount,
      additionalAmount,
      totalAmount,
      totalQuantity,
      averagePrice,
    };
  }, [currentPrice, currentQuantity, additionalPrice, additionalQuantity]);

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="물타기 평단가 계산기"
        description="기존 매수가와 수량, 추가 매수가와 수량을 입력하면 새로운 평균 매입 단가를 계산할 수 있습니다."
      >
        <CurrencyToggle
          value={currency}
          onChange={setCurrency}
          options={["KRW", "USD"] as const}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="currentPrice"
            label="기존 매수가"
            type="number"
            placeholder={currency === "KRW" ? "예: 10000" : "예: 100"}
            unit={moneyUnit}
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
          />
          <InputField
            id="currentQuantity"
            label="기존 보유 수량"
            type="number"
            placeholder="예: 10"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="additionalPrice"
            label="추가 매수가"
            type="number"
            placeholder={currency === "KRW" ? "예: 8000" : "예: 80"}
            unit={moneyUnit}
            value={additionalPrice}
            onChange={(e) => setAdditionalPrice(e.target.value)}
          />
          <InputField
            id="additionalQuantity"
            label="추가 매수 수량"
            type="number"
            placeholder="예: 10"
            value={additionalQuantity}
            onChange={(e) => setAdditionalQuantity(e.target.value)}
          />
        </div>

        <p className="text-sm leading-relaxed text-slate-500">
          KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
          국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다.
        </p>
      </CalculatorCard>

      <ResultCard
        title="평단가 계산 결과"
        emptyMessage="기존 매수가와 수량, 추가 매수가와 수량을 입력하면 결과가 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="새 평균 매입 단가"
          value={formatNumber(result.averagePrice)}
          unit={moneyUnit}
          tone="default"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail
            label="기존 매수 금액"
            value={formatNumber(result.currentAmount)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="추가 매수 금액"
            value={formatNumber(result.additionalAmount)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="총 매수 금액"
            value={formatNumber(result.totalAmount)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="총 보유 수량"
            value={formatNumber(result.totalQuantity, 4)}
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}