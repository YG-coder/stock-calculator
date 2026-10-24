"use client";

import { useMemo, useState } from "react";
import { compare, div, fromInt, isPositive, mul, parsePositiveExact, sub, toFixedExact, toPlainDecimal } from "@/lib/exactDecimal";
import {
  CalculatorLayout,
  CalculatorCard,
  ResultCard,
  ResultHighlight,
  InputField,
} from "@/components/ui/Shared";

export default function BreakEvenCalculator() {
  const [lossRate, setLossRate] = useState("");

  const result = useMemo(() => {
    const loss = parsePositiveExact(lossRate);

    if (!isPositive(loss) || compare(loss, fromInt(100)) >= 0) {
      return { valid: false, requiredRate: "0.00", loss: "0" };
    }

    // 필요 상승률 = 손실률 ÷ (100 − 손실률) × 100 — 정확한 유리수로 계산하고 표시할 때 toFixed(2) 규칙으로 한 번만 반올림
    const requiredRate = toFixedExact(mul(div(loss, sub(fromInt(100), loss)), fromInt(100)), 2);

    return {
      valid: true,
      requiredRate,
      loss: toPlainDecimal(loss),
    };
  }, [lossRate]);

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="손실률 입력"
        description="현재 마이너스(-)로 표기된 손실률을 입력하세요."
      >
        <InputField
          id="lossRate"
          label="현재 손실률 (%)"
          type="number"
          placeholder="예: 20 (부호 없이 입력)"
          unit="%"
          value={lossRate}
          onChange={(e) => setLossRate(e.target.value)}
          max={99}
        />
      </CalculatorCard>

      <ResultCard
        title="본전 회복 계산 결과"
        emptyMessage="현재 손실률을 입력하시면\n본전을 찾기 위해 필요한 상승률이 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="본전 회복 요구 상승률"
          value={`+${result.requiredRate}`}
          unit="%"
          tone="positive"
        />
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            현재 <strong className="text-blue-600">-{result.loss}%</strong> 손실 상태에서 원금을 회복하려면,
            남은 자금으로 무려{" "}
            <strong className="text-red-600">+{result.requiredRate}%</strong>
            의 수익을 내야 합니다.
          </p>
        </div>
      </ResultCard>
    </CalculatorLayout>
  );
}