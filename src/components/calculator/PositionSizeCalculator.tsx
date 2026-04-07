"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
import { CalculatorLayout, CalculatorCard, ResultCard, ResultHighlight, ResultDetail, InputField } from "@/components/ui/Shared";

export default function PositionSizeCalculator() {
  const [totalCapital, setTotalCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  const result = useMemo(() => {
    const capital = parsePositive(totalCapital);
    const risk = parsePositive(riskPercent);
    const entry = parsePositive(entryPrice);
    const stop = parsePositive(stopLossPrice);

    if (!capital || !risk || !entry || !stop || stop >= entry) {
      return { valid: false, maxLoss: 0, recommendQty: 0, positionSize: 0, capitalTakeup: 0 };
    }

    const maxLoss = capital * (risk / 100);
    const lossPerShare = entry - stop;
    const recommendQty = Math.floor(maxLoss / lossPerShare);
    const positionSize = recommendQty * entry;
    const capitalTakeup = (positionSize / capital) * 100;

    return {
      valid: true,
      maxLoss,
      recommendQty,
      positionSize,
      capitalTakeup
    };
  }, [totalCapital, riskPercent, entryPrice, stopLossPrice]);

  return (
    <CalculatorLayout>
      <div className="space-y-6">
        <CalculatorCard title="1. 자금 및 리스크 정보" description="총 자본금과 1회 매매 허용 리스크를 입력하세요.">
          <InputField id="totalCapital" label="총 투자 자본금" placeholder="예: 10000000" unit="원" value={totalCapital} onChange={e => setTotalCapital(e.target.value)} />
          <InputField id="riskPercent" label="1회 허용 리스크 (1~2% 권장)" placeholder="예: 2" unit="%" value={riskPercent} onChange={e => setRiskPercent(e.target.value)} />
        </CalculatorCard>

        <CalculatorCard title="2. 매매 셋업" description="진입 가격과 손절 라인을 입력하세요.">
          <InputField id="entryPrice" label="진입 가격" placeholder="예: 50000" unit="원" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
          <InputField id="stopLossPrice" label="손절 라인" placeholder="예: 48000" unit="원" value={stopLossPrice} onChange={e => setStopLossPrice(e.target.value)} />
        </CalculatorCard>
      </div>

      <ResultCard title="포지션 사이즈 결과" emptyMessage="모든 값을 올바르게 입력하시면\n권장 투자 수량과 금액이 계산됩니다." isValid={result.valid}>
        <ResultHighlight 
          label="권장 매수 금액 (포지션 크기)" 
          value={formatNumber(result.positionSize)} 
          unit="원" 
          isProfit={true}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail 
            label="권장 매수 수량" 
            value={formatNumber(result.recommendQty)} 
            unit="주" 
          />
          <ResultDetail 
            label="총 자본 대비 비중" 
            value={result.capitalTakeup.toFixed(1)} 
            unit="%" 
          />
        </div>
        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 shadow-sm mt-2">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            손절가 도달 시 계좌 총 손실액은 정확히 <strong className="text-blue-600">-{formatNumber(result.maxLoss)}원 ({riskPercent}%)</strong>으로 제한됩니다.
          </p>
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}
