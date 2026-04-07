"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
import { CalculatorLayout, CalculatorCard, ResultCard, ResultHighlight, ResultDetail, InputField } from "@/components/ui/Shared";

export default function AveragePriceCalculator() {
  const [price1, setPrice1] = useState("");
  const [qty1, setQty1] = useState("");
  const [price2, setPrice2] = useState("");
  const [qty2, setQty2] = useState("");

  const result = useMemo(() => {
    const p1 = parsePositive(price1);
    const q1 = parsePositive(qty1);
    const p2 = parsePositive(price2);
    const q2 = parsePositive(qty2);

    const totalQty = q1 + q2;
    const totalAmount = p1 * q1 + p2 * q2;

    if (totalQty <= 0) {
      return { valid: false, avgPrice: 0, totalQty: 0, totalAmount: 0 };
    }

    const avgPrice = totalAmount / totalQty;

    return {
      valid: true,
      avgPrice,
      totalQty,
      totalAmount,
    };
  }, [price1, qty1, price2, qty2]);

  return (
    <CalculatorLayout>
      <div className="space-y-6">
        <CalculatorCard title="1. 기존 보유" description="기존 매수가와 수량을 입력하세요.">
          <InputField id="price1" label="기존 매수가 (원)" placeholder="예: 50000" unit="원" value={price1} onChange={e => setPrice1(e.target.value)} />
          <InputField id="qty1" label="기존 수량 (주)" placeholder="예: 100" unit="주" value={qty1} onChange={e => setQty1(e.target.value)} />
        </CalculatorCard>
        
        <CalculatorCard title="2. 추가 매수 (물타기)" description="추가로 매수한 내역을 입력하세요.">
          <InputField id="price2" label="추가 매수가 (원)" placeholder="예: 45000" unit="원" value={price2} onChange={e => setPrice2(e.target.value)} />
          <InputField id="qty2" label="추가 수량 (주)" placeholder="예: 50" unit="주" value={qty2} onChange={e => setQty2(e.target.value)} />
        </CalculatorCard>
      </div>

      <ResultCard title="평단가 계산 결과" emptyMessage="좌측에 매수 내역을 입력하시면\n평균 단가가 자동으로 계산됩니다." isValid={result.valid}>
        <ResultHighlight 
          label="최종 평균 단가" 
          value={formatNumber(result.avgPrice)} 
          unit="원" 
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail 
            label="총 보유 수량" 
            value={formatNumber(result.totalQty)} 
            unit="주" 
          />
          <ResultDetail 
            label="총 매수 금액" 
            value={formatNumber(result.totalAmount)} 
            unit="원" 
          />
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}
