"use client";

import { useMemo, useState } from "react";
import { parsePositive } from "@/lib/number";
import {
  SectionCard,
  Article,
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
                  label="매수가 (원)"
                  type="number"
                  inputMode="decimal"
                  placeholder="예: 100000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
              />

              <InputField
                  label="보유 수량 (주)"
                  type="number"
                  inputMode="numeric"
                  placeholder="예: 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
              />

              <InputField
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

        <div className="mt-10 space-y-8">
          <SectionCard>
            <Article title="손절가 계산기가 필요한 이유">
              <p className="mt-2">
                손절은 투자에서 손실을 제한하기 위한 가장 기본적인 원칙 중
                하나입니다. 많은 개인 투자자는 종목이 하락할 때 막연히 “조금만 더
                기다리면 오르겠지”라고 생각하다가 손실을 키우는 경우가 많습니다.
                손절가 계산기를 사용하면 매수 시점부터 미리 손절 기준 가격을 정해둘
                수 있어 감정적인 대응을 줄이고, 손실을 일정 범위 안에서 통제하는 데
                도움이 됩니다.
              </p>
              <p className="mt-3">
                예를 들어 손절 비율을 5%로 설정했다면, 현재 종목이 그 가격 아래로
                내려왔을 때 기계적으로 대응할 수 있습니다. 이렇게 하면 한 번의
                실수로 계좌 전체가 흔들리는 상황을 줄일 수 있습니다. 특히 변동성이
                큰 종목이나 단기 매매에서는 손절 기준을 사전에 정하는 습관이 매우
                중요합니다.
              </p>
            </Article>
          </SectionCard>

          <SectionCard>
            <Article title="손절 기준은 어떻게 잡아야 하나">
              <p className="mt-2">
                손절 기준은 사람마다 다르지만, 일반적으로는 자신의 매매 스타일과
                감당 가능한 손실 범위를 기준으로 정하는 것이 좋습니다. 단기
                매매자는 3~5% 수준의 짧은 손절을 선호할 수 있고, 중기 보유자는 더
                넓은 기준을 잡기도 합니다.
              </p>
              <p className="mt-3">
                또한 손절가는 단순 퍼센트 기준 외에도 지지선 이탈, 추세선 붕괴,
                거래량 변화 같은 기술적 기준과 함께 보는 것이 좋습니다. 이 계산기는
                퍼센트 기준 손절가를 빠르게 계산하는 참고용 도구로 활용하면 좋습니다.
              </p>
            </Article>
          </SectionCard>

          <SectionCard>
            <Article title="FAQ">
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Q1. 손절 비율은 몇 퍼센트가 적당한가요?
                  </h3>
                  <p className="mt-2 text-slate-600">
                    정답은 없지만, 단기 매매는 보통 3~5%, 스윙 관점은 5~10%
                    수준에서 많이 설정합니다. 종목 변동성과 투자 성향에 따라 달라질
                    수 있습니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Q2. 손절가는 무조건 지켜야 하나요?
                  </h3>
                  <p className="mt-2 text-slate-600">
                    손절 기준을 정했다면 특별한 이유가 없는 한 지키는 편이 좋습니다.
                    기준이 흔들리면 손실이 더 커질 가능성이 높아집니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Q3. 실제 수수료와 세금도 반영되나요?
                  </h3>
                  <p className="mt-2 text-slate-600">
                    현재 계산기는 기본 손절가와 손실 금액을 단순 계산한 참고용
                    결과입니다. 실제 매매에서는 수수료, 세금, 체결 가격 차이 등이
                    발생할 수 있습니다.
                  </p>
                </div>
              </div>
            </Article>
          </SectionCard>
        </div>
      </div>
  );
}