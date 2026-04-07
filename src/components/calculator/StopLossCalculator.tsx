"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
import { CalculatorLayout, CalculatorCard, ResultCard, ResultHighlight, ResultDetail, InputField } from "@/components/ui/Shared";

export default function StopLossCalculator() {
  const [buyPrice, setBuyPrice] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [quantity, setQuantity] = useState("");

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const percent = parsePositive(stopLossPercent);
    const qty = parsePositive(quantity);

    if (!buy || !percent) {
      return {
        valid: false,
        buy,
        percent,
        qty,
        stopPrice: 0,
        lossPerShare: 0,
        totalLoss: 0,
        totalInvestment: 0,
      };
    }

    const stopPrice = buy * (1 - percent / 100);
    const lossPerShare = buy - stopPrice;
    const totalLoss = qty > 0 ? lossPerShare * qty : 0;
    const totalInvestment = qty > 0 ? buy * qty : 0;

    return {
      valid: true,
      buy,
      percent,
      qty,
      stopPrice,
      lossPerShare,
      totalLoss,
      totalInvestment,
    };
  }, [buyPrice, stopLossPercent, quantity]);

  return (
    <CalculatorLayout>
      <CalculatorCard title="손절 조건 입력" description="매수가와 손절 비율, 수량을 입력하세요.">
        <InputField id="buyPrice" label="매수가 (원)" placeholder="예: 70000" unit="원" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
        <InputField id="stopLossPercent" label="손절 비율 (%)" placeholder="예: 3" unit="%" type="number" value={stopLossPercent} onChange={e => setStopLossPercent(e.target.value)} />
        <InputField id="quantity" label="보유 수량 (주)" placeholder="예: 10" unit="주" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </CalculatorCard>

      <ResultCard title="손절가 계산 결과" emptyMessage="매수가와 손절 비율을 입력하시면\n손절가 및 손실 금액이 계산됩니다." isValid={result.valid}>
        <ResultHighlight 
          label="손절 매도 가격" 
          value={formatNumber(result.stopPrice)} 
          unit="원" 
          isLoss={true} 
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail 
            label="주당 손실 금액" 
            value={`-${formatNumber(result.lossPerShare)}`} 
            unit="원" 
            isLoss={true}
          />
          <ResultDetail 
            label="손절 비율" 
            value={`-${result.percent}`} 
            unit="%" 
            isLoss={true}
          />
          <ResultDetail 
            label="총 손실 금액" 
            value={result.qty > 0 ? `-${formatNumber(result.totalLoss)}` : "-"} 
            unit="원" 
            isLoss={result.qty > 0}
          />
          <ResultDetail 
            label="총 투자금" 
            value={result.qty > 0 ? formatNumber(result.totalInvestment) : "-"} 
            unit="원" 
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}
