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

export default function StopLossCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");

  const [buyPrice, setBuyPrice] = useState("10000");
  const [lossPercent, setLossPercent] = useState("10");
  const [quantity, setQuantity] = useState("10");

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  const result = useMemo(() => {
    const buy = Number(buyPrice);
    const loss = Number(lossPercent);
    const qty = Number(quantity);

    if (
      !Number.isFinite(buy) ||
      !Number.isFinite(loss) ||
      !Number.isFinite(qty) ||
      buy <= 0 ||
      loss <= 0 ||
      loss >= 100 ||
      qty <= 0
    ) {
      return {
        valid: false,
        stopLossPrice: 0,
        lossAmountPerShare: 0,
        totalLossAmount: 0,
        stopLossRate: 0,
      };
    }

    const stopLossPrice = buy * (1 - loss / 100);
    const lossAmountPerShare = buy - stopLossPrice;
    const totalLossAmount = lossAmountPerShare * qty;
    const stopLossRate = loss;

    return {
      valid: true,
      stopLossPrice,
      lossAmountPerShare,
      totalLossAmount,
      stopLossRate,
    };
  }, [buyPrice, lossPercent, quantity]);

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="주식 손절가 계산기"
        description="매수가, 손실 제한 비율, 수량을 입력하면 손절 기준 가격과 예상 손실 금액을 계산할 수 있습니다."
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
            placeholder={currency === "KRW" ? "예: 10000" : "예: 100"}
            unit={moneyUnit}
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
          />
          <InputField
            id="lossPercent"
            label="허용 손실 비율"
            type="number"
            placeholder="예: 10"
            unit="%"
            value={lossPercent}
            onChange={(e) => setLossPercent(e.target.value)}
          />
        </div>

        <InputField
          id="quantity"
          label="보유 수량"
          type="number"
          placeholder="예: 10"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <p className="text-sm leading-relaxed text-slate-500">
          KRW / USD 토글은 환율 자동 변환 기능이 아니라 계산 기준 통화를 선택하는 기능입니다.
          국내주식은 원화, 미국주식은 달러 기준으로 입력하면 됩니다.
        </p>
      </CalculatorCard>

      <ResultCard
        title="손절가 계산 결과"
        emptyMessage="매수가, 손실 제한 비율, 수량을 입력하면 결과가 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="손절 기준 가격"
          value={formatNumber(result.stopLossPrice)}
          unit={moneyUnit}
          tone="negative"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail
            label="주당 예상 손실"
            value={formatNumber(result.lossAmountPerShare)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="총 예상 손실"
            value={formatNumber(result.totalLossAmount)}
            unit={moneyUnit}
          />
          <ResultDetail
            label="설정 손실 비율"
            value={formatNumber(result.stopLossRate)}
            unit="%"
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}