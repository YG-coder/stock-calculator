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

export default function TargetPriceCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [buyPrice, setBuyPrice] = useState("50000");
  const [targetRate, setTargetRate] = useState("15");
  const [quantity, setQuantity] = useState("100");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const buy = Number(buyPrice);
    const rate = Number(targetRate);
    const qty = Number(quantity);

    if (
      !Number.isFinite(buy) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(qty) ||
      buy <= 0 ||
      qty <= 0
    ) {
      return {
        valid: false,
        targetPrice: 0,
        profitPerShare: 0,
        totalProfit: 0,
        targetRate: 0,
      };
    }

    const targetPrice = buy * (1 + rate / 100);
    const profitPerShare = targetPrice - buy;
    const totalProfit = profitPerShare * qty;

    return {
      valid: true,
      targetPrice,
      profitPerShare,
      totalProfit,
      targetRate: rate,
    };
  }, [buyPrice, targetRate, quantity]);

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="주식 목표가 계산기"
        description="매수가와 목표 수익률, 수량을 입력하면 목표 매도 가격과 예상 수익 금액을 계산할 수 있습니다."
      >
        <CurrencyToggle
          value={currency}
          onChange={setCurrency}
          options={["KRW", "USD"] as const}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="buyPrice"
            label="매수가"
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
        </div>

        <InputField
          id="quantity"
          label="수량"
          type="number"
          placeholder="예: 100"
          unit="주"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <p className="text-sm leading-relaxed text-slate-500">
          KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
          국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다.
        </p>
      </CalculatorCard>

      <ResultCard
        title="목표가 계산 결과"
        emptyMessage="매수가와 목표 수익률을 입력하면 목표 매도 가격이 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="목표 매도 가격"
          value={formatNumber(result.targetPrice)}
          unit={moneyUnit}
          tone="positive"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail
            label="1주당 예상 이익"
            value={formatNumber(result.profitPerShare)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="총 예상 수익"
            value={formatNumber(result.totalProfit)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="설정 목표 수익률"
            value={formatNumber(result.targetRate)}
            unit="%"
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}