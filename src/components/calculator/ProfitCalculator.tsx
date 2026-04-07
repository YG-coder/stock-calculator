"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
import { CalculatorLayout, CalculatorCard, ResultCard, ResultHighlight, ResultDetail, InputField } from "@/components/ui/Shared";

export default function ProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const current = parsePositive(currentPrice);
    const qty = parsePositive(quantity) || 1;

    if (buy <= 0 || current <= 0) {
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
      <CalculatorCard title="단가 및 수량 입력" description="매수하신 가격과 현재가, 보유 수량을 입력하세요.">
        <InputField id="buyPrice" label="매수가 (원)" placeholder="예: 50000" unit="원" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
        <InputField id="currentPrice" label="현재가 (원)" placeholder="예: 55000" unit="원" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
        <InputField id="quantity" label="수량 (주)" placeholder="예: 100" unit="주" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </CalculatorCard>

      <ResultCard title="수익률 계산 결과" emptyMessage="좌측에 매수가와 현재가를 입력하시면\n수익률이 자동으로 계산됩니다." isValid={result.valid}>
        <ResultHighlight 
          label="예상 수익률" 
          value={`${result.profitRate > 0 ? '+' : ''}${result.profitRate.toFixed(2)}`} 
          unit="%" 
          isProfit={result.profitRate > 0} 
          isLoss={result.profitRate < 0} 
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail 
            label="평가 손익" 
            value={`${result.profitAmount > 0 ? '+' : ''}${formatNumber(result.profitAmount)}`} 
            unit="원" 
            isProfit={result.profitRate > 0} 
            isLoss={result.profitRate < 0} 
          />
          <ResultDetail 
            label="평가 금액" 
            value={formatNumber(result.evalAmount)} 
            unit="원" 
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}
