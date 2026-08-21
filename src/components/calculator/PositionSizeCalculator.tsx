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
      return {
        valid: false,
        capital: 0,
        maxLoss: 0,
        recommendQty: 0,
        positionSize: 0,
        capitalTakeup: 0,
        actualLoss: 0,
        actualLossRate: 0,
        affordableQty: 0,
        exceedsCapital: false,
      };
    }

    const maxLoss = capital * (risk / 100);
    const lossPerShare = entry - stop;
    const recommendQty = Math.floor(maxLoss / lossPerShare);
    const positionSize = recommendQty * entry;
    const capitalTakeup = (positionSize / capital) * 100;
    // 수량을 내림 처리한 뒤의 실제 손실액 (허용 리스크 금액과 다를 수 있다)
    const actualLoss = recommendQty * lossPerShare;
    const actualLossRate = (actualLoss / capital) * 100;
    // 자본금 안에서 실제로 매수 가능한 최대 수량
    const affordableQty = Math.floor(capital / entry);

    return {
      valid: true,
      capital,
      maxLoss,
      recommendQty,
      positionSize,
      capitalTakeup,
      actualLoss,
      actualLossRate,
      affordableQty,
      exceedsCapital: positionSize > capital,
    };
  }, [totalCapital, riskPercent, entryPrice, stopLossPrice]);

  return (
    <CalculatorLayout>
      <div className="space-y-6">
        <CalculatorCard
          title="1. 자금 및 리스크 정보"
          description="총 자본금과 1회 매매 허용 리스크를 입력하세요."
        >
          <InputField
            id="totalCapital"
            label="총 투자 자본금"
            type="number"
            placeholder="예: 10000000"
            unit="원"
            value={totalCapital}
            onChange={(e) => setTotalCapital(e.target.value)}
          />
          <InputField
            id="riskPercent"
            label="1회 허용 리스크 (1~2% 권장)"
            type="number"
            placeholder="예: 2"
            unit="%"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
          />
        </CalculatorCard>

        <CalculatorCard
          title="2. 매매 셋업"
          description="진입 가격과 손절 라인을 입력하세요."
        >
          <InputField
            id="entryPrice"
            label="진입 가격"
            type="number"
            placeholder="예: 50000"
            unit="원"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
          <InputField
            id="stopLossPrice"
            label="손절 라인"
            type="number"
            placeholder="예: 48000"
            unit="원"
            value={stopLossPrice}
            onChange={(e) => setStopLossPrice(e.target.value)}
          />
        </CalculatorCard>
      </div>

      <ResultCard
        title="포지션 사이즈 결과"
        emptyMessage="모든 값을 올바르게 입력하시면\n권장 투자 수량과 금액이 계산됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="권장 매수 금액 (포지션 크기)"
          value={formatNumber(result.positionSize)}
          unit="원"
          tone="positive"
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
        {result.recommendQty === 0 ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm mt-2"
          >
            <p className="text-sm font-medium text-amber-900 leading-relaxed">
              허용 리스크 금액({formatNumber(result.maxLoss)}원)이 1주당 손실보다 작아
              이 조건에서는 매수할 수 있는 수량이 없습니다. 손절 폭을 좁히거나 허용 리스크를
              높여야 합니다.
            </p>
          </div>
        ) : result.exceedsCapital ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm mt-2"
          >
            <p className="text-sm font-semibold text-amber-900 leading-relaxed">
              손절 폭이 좁아 권장 수량이 총 자본금을 초과합니다.
            </p>
            <p className="mt-2 text-sm text-amber-900 leading-relaxed">
              리스크 한도만 보면 {formatNumber(result.recommendQty)}주이지만, 자본금{" "}
              {formatNumber(result.capital)}원으로 실제 매수 가능한 최대 수량은{" "}
              <strong>{formatNumber(result.affordableQty)}주</strong>입니다. 미수·신용을
              쓰지 않는다면 손절 폭을 넓히거나 허용 리스크를 낮춰 다시 계산하세요.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 shadow-sm mt-2">
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              손절가 도달 시 계좌 총 손실액은 최대{" "}
              <strong className="text-blue-600">
                -{formatNumber(result.actualLoss)}원 ({result.actualLossRate.toFixed(2)}%)
              </strong>
              으로 제한됩니다.
            </p>
          </div>
        )}
      </ResultCard>
    </CalculatorLayout>
  );
}