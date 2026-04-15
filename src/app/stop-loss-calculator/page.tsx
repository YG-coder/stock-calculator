// src/app/stop-loss-calculator/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  PageHeader,
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

export default function StopLossCalculatorPage() {
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");

  const result = useMemo(() => {
    const buy = Number(buyPrice);
    const qty = Number(quantity);
    const stopPercent = Number(stopLossPercent);

    if (!buy || !qty || !stopPercent) {
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
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <PageHeader
            badge="리스크 관리"
            title="손절가 계산기"
            description="매수가, 수량, 손절 비율을 입력하면 손절가와 예상 손실 금액을 빠르게 계산할 수 있습니다."
        />

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

            <ResultCard
                title="계산 결과"
                description="입력한 손절 비율 기준으로 예상 손절가와 손실 규모를 보여줍니다."
            >
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
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-relaxed text-slate-500">
                    매수가, 보유 수량, 손절 비율을 입력하면 결과가 바로 표시됩니다.
                  </div>
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
                  큰 중소형주, 테마주, 단기 매매에서는 손절 기준을 사전에 정하는
                  습관이 매우 중요합니다.
                </p>
              </Article>
            </SectionCard>

            <SectionCard>
              <Article title="손절 기준은 어떻게 잡아야 하나">
                <p className="mt-2">
                  손절 기준은 사람마다 다르지만, 일반적으로는 자신의 매매 스타일과
                  감당 가능한 손실 범위를 기준으로 정하는 것이 좋습니다. 단기
                  매매자는 3~5% 수준의 짧은 손절을 선호할 수 있고, 중기 보유자는 더
                  넓은 기준을 잡기도 합니다. 중요한 것은 손절 비율 자체보다도, 한 번
                  정한 원칙을 일관되게 지키는 것입니다.
                </p>
                <p className="mt-3">
                  또한 손절가는 단순 퍼센트 기준 외에도 지지선 이탈, 전일 저가 이탈,
                  거래량 급감, 추세선 붕괴 같은 기술적 기준과 함께 보는 것이 좋습니다.
                  이 계산기는 퍼센트 기준 손절가를 빠르게 계산하는 도구이므로, 실제
                  매매에서는 차트와 함께 보조적으로 활용하는 것이 가장 현실적입니다.
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
                      정답은 없지만, 단기 매매는 보통 3~5%, 스윙 관점은 5~10% 안에서
                      많이 설정합니다. 다만 종목 변동성과 본인의 투자 성향에 따라
                      달라질 수 있습니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Q2. 손절가는 무조건 지켜야 하나요?
                    </h3>
                    <p className="mt-2 text-slate-600">
                      손절 기준을 정했다면 특별한 이유가 없는 한 지키는 편이 좋습니다.
                      기준이 자꾸 흔들리면 손실이 커질 가능성이 높아집니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Q3. 이 계산 결과는 실제 수수료와 세금까지 반영하나요?
                    </h3>
                    <p className="mt-2 text-slate-600">
                      현재 계산기는 기본 손절가와 손실 금액을 단순 계산한 참고용
                      결과입니다. 실제 매매에서는 증권사 수수료, 세금, 체결 가격
                      차이 등이 발생할 수 있습니다.
                    </p>
                  </div>
                </div>
              </Article>
            </SectionCard>
          </div>
        </div>
      </main>
  );
}