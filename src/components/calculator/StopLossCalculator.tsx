"use client";

import { useMemo, useState } from "react";
import { compare, formatRoundedInteger, fromInt, isPositive, mul, div, parsePositiveExact, sub, toFixedExact, type Exact } from "@/lib/exactDecimal";
import {
  CalculatorLayout,
  CalculatorCard,
  ResultCard,
  ResultHighlight,
  ResultDetail,
  InputField,
} from "@/components/ui/Shared";

// 기존 표시 규칙(Math.round 후 쉼표)을 정확한 값에 한 번만 적용한다.
function formatNumber(value: Exact) {
  return formatRoundedInteger(value);
}

export default function StopLossCalculatorPageClient() {
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");

  // 입력이 채워졌는데도 계산이 불가능한 경우, 이유를 화면에 알려주기 위한 상태
  const notice = useMemo(() => {
    const touched =
        buyPrice.trim() !== "" ||
        quantity.trim() !== "" ||
        stopLossPercent.trim() !== "";
    if (!touched) return null;

    const buy = parsePositiveExact(buyPrice);
    const qty = parsePositiveExact(quantity);
    const stopPercent = parsePositiveExact(stopLossPercent);

    if (buyPrice.trim() !== "" && !isPositive(buy)) return "매수가는 0보다 큰 값이어야 합니다.";
    if (quantity.trim() !== "" && !isPositive(qty)) return "보유 수량은 0보다 큰 값이어야 합니다.";
    if (stopLossPercent.trim() !== "" && !isPositive(stopPercent))
      return "손절 비율은 0보다 큰 값이어야 합니다.";
    if (compare(stopPercent, fromInt(100)) >= 0)
      return "손절 비율은 100% 미만이어야 합니다. 100% 이상이면 손절가가 0원 이하가 됩니다.";
    return null;
  }, [buyPrice, quantity, stopLossPercent]);

  const result = useMemo(() => {
    const buy = parsePositiveExact(buyPrice);
    const qty = parsePositiveExact(quantity);
    const stopPercent = parsePositiveExact(stopLossPercent);

    // parsePositiveExact 는 빈칸·음수·숫자가 아닌 값을 0 으로 만들므로 아래 조건에서 함께 걸러진다.
    if (!isPositive(buy) || !isPositive(qty) || !isPositive(stopPercent) || compare(stopPercent, fromInt(100)) >= 0) {
      return null;
    }

    // 입력 십진값으로 정확히 계산하고 표시 단계에서만 반올림한다.
    const stopPrice = mul(buy, sub(fromInt(1), div(stopPercent, fromInt(100))));
    const lossPerShare = sub(buy, stopPrice);
    const totalLoss = mul(lossPerShare, qty);
    const totalBuyAmount = mul(buy, qty);
    const lossRate = mul(div(totalLoss, totalBuyAmount), fromInt(100));

    return {
      stopPrice,
      lossPerShare,
      totalLoss,
      totalBuyAmount,
      lossRate,
    };
  }, [buyPrice, quantity, stopLossPercent]);

  return (
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        <CalculatorLayout>
          <CalculatorCard
              title="입력값"
              description="손절 기준을 정하기 위한 기본 정보를 입력하세요."
          >
            <div className="space-y-5">
              <InputField
                  id="sl-buy-price"
                  label="매수가 (원)"
                  type="number"
                  inputMode="decimal"
                  placeholder="예: 100000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
              />

              <InputField
                  id="sl-quantity"
                  label="보유 수량 (주)"
                  type="number"
                  inputMode="numeric"
                  placeholder="예: 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
              />

              <InputField
                  id="sl-percent"
                  label="손절 비율 (%)"
                  type="number"
                  inputMode="decimal"
                  placeholder="예: 5"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(e.target.value)}
              />
            </div>
          </CalculatorCard>

          <ResultCard title="계산 결과">
            {result ? (
                <div className="space-y-4">
                  <ResultHighlight
                      label="손절가"
                      value={`${formatNumber(result.stopPrice)}원`}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ResultDetail
                        label="1주당 손실 금액"
                        value={`${formatNumber(result.lossPerShare)}원`}
                    />
                    <ResultDetail
                        label="총 손실 금액"
                        value={`${formatNumber(result.totalLoss)}원`}
                    />
                    <ResultDetail
                        label="총 매수 금액"
                        value={`${formatNumber(result.totalBuyAmount)}원`}
                    />
                    <ResultDetail
                        label="총 손실 비율"
                        value={`${toFixedExact(result.lossRate, 2)}%`}
                    />
                  </div>
                </div>
            ) : (
                notice ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900"
                    >
                      {notice}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-relaxed text-slate-500">
                      매수가, 보유 수량, 손절 비율을 입력하면 결과가 바로 표시됩니다.
                    </div>
                )
            )}
          </ResultCard>
        </CalculatorLayout>

      </div>
  );
}