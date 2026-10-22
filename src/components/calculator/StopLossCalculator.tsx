"use client";

import { useMemo, useState } from "react";
import { parsePositive } from "@/lib/number";
import {
  CalculatorLayout,
  CalculatorCard,
  ResultCard,
  ResultHighlight,
  ResultDetail,
  InputField,
} from "@/components/ui/Shared";

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR").format(Math.round(value));
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

    const buy = parsePositive(buyPrice);
    const qty = parsePositive(quantity);
    const stopPercent = parsePositive(stopLossPercent);

    if (buyPrice.trim() !== "" && !buy) return "매수가는 0보다 큰 값이어야 합니다.";
    if (quantity.trim() !== "" && !qty) return "보유 수량은 0보다 큰 값이어야 합니다.";
    if (stopLossPercent.trim() !== "" && !stopPercent)
      return "손절 비율은 0보다 큰 값이어야 합니다.";
    if (stopPercent >= 100)
      return "손절 비율은 100% 미만이어야 합니다. 100% 이상이면 손절가가 0원 이하가 됩니다.";
    return null;
  }, [buyPrice, quantity, stopLossPercent]);

  const result = useMemo(() => {
    const buy = parsePositive(buyPrice);
    const qty = parsePositive(quantity);
    const stopPercent = parsePositive(stopLossPercent);

    // parsePositive 는 음수·NaN 을 0 으로 만들므로 아래 조건에서 함께 걸러진다.
    if (!buy || !qty || !stopPercent || stopPercent >= 100) {
      return null;
    }

    const stopPrice = buy * (1 - stopPercent / 100);
    const lossPerShare = buy - stopPrice;
    const totalLoss = lossPerShare * qty;
    const totalBuyAmount = buy * qty;
    const lossRate = totalBuyAmount > 0 ? (totalLoss / totalBuyAmount) * 100 : 0;

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
                        value={`${result.lossRate.toFixed(2)}%`}
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