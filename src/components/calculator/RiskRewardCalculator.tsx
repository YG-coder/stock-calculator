"use client";

import { useMemo, useState } from "react";
import { formatNumber, parsePositive } from "@/lib/number";
import { CalculatorLayout, CalculatorCard, ResultCard, ResultHighlight, ResultDetail, InputField } from "@/components/ui/Shared";

export default function RiskRewardCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  const result = useMemo(() => {
    const entry = parsePositive(entryPrice);
    const target = parsePositive(targetPrice);
    const stop = parsePositive(stopLossPrice);

    if (entry <= 0 || target <= 0 || stop <= 0 || stop >= entry || target <= entry) {
      return { valid: false, rewardRate: 0, riskRate: 0, rrRatio: 0, winRate: 0 };
    }

    const rewardAmount = target - entry;
    const riskAmount = entry - stop;

    const rewardRate = (rewardAmount / entry) * 100;
    const riskRate = (riskAmount / entry) * 100;

    const rrRatio = rewardAmount / riskAmount;
    const winRate = (1 / (1 + rrRatio)) * 100;

    return {
      valid: true,
      rewardRate,
      riskRate,
      rrRatio,
      winRate
    };
  }, [entryPrice, targetPrice, stopLossPrice]);

  return (
    <CalculatorLayout>
      <CalculatorCard title="가격 정보 입력" description="진입가와 예상 목표가, 손절가를 입력하세요.">
        <InputField id="entryPrice" label="진입 가격 (매수가)" type="number" placeholder="예: 50000" unit="원" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
        <InputField id="targetPrice" label="목표 가격 (익절가)" type="number" placeholder="예: 55000" unit="원" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
        <InputField id="stopLossPrice" label="손절 가격 (손절가)" type="number" placeholder="예: 48000" unit="원" value={stopLossPrice} onChange={e => setStopLossPrice(e.target.value)} />
      </CalculatorCard>

      <ResultCard title="손익비 계산 결과" emptyMessage="올바른 가격(익절가 > 진입가 > 손절가)을\n모두 입력하시면 결과가 계산됩니다." isValid={result.valid}>
        <ResultHighlight
          label="손익비 (Risk : Reward)"
          value={`1 : ${result.rrRatio.toFixed(2)}`}
          unit=""
          isProfit={result.rrRatio >= 2}
          isLoss={result.rrRatio < 1}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultDetail
            label="기대 수익률"
            value={`+${result.rewardRate.toFixed(2)}`}
            unit="%"
            isProfit={true}
          />
          <ResultDetail
            label="예상 손실률"
            value={`-${result.riskRate.toFixed(2)}`}
            unit="%"
            isLoss={true}
          />
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 shadow-sm mt-2">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            현재 셋업의 필요 승률은 <strong className="text-slate-900">{result.winRate.toFixed(1)}%</strong>입니다.
            해당 승률 이상을 유지해야만 장기적으로 계좌가 우상향합니다.
          </p>
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}
