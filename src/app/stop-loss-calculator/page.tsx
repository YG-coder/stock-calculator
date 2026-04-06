"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function clampPositiveNumber(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed;
}

export default function Page() {
  const [buyPrice, setBuyPrice] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");
  const [quantity, setQuantity] = useState("");

  const values = useMemo(() => {
    const buy = clampPositiveNumber(buyPrice);
    const percent = clampPositiveNumber(stopLossPercent);
    const qty = clampPositiveNumber(quantity);

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
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <section className="mb-10">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            주식 계산기
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            주식 손절가 계산기
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            매수가와 손절 비율을 입력하면 손절가, 주당 손실 금액, 총 손실 금액을
            한 번에 계산할 수 있습니다. 손절 기준을 미리 정해두면 감정적인 대응을
            줄이고, 예상 손실 범위를 통제하는 데 도움이 됩니다.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            특히 단타, 스윙, 물타기 판단 전에는 먼저 손절 라인을 계산해두는 습관이
            중요합니다. 이 페이지는 초보자도 바로 사용할 수 있도록 단순하고 빠르게
            설계된 한국어 손절가 계산기입니다.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">손절 조건 입력</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              숫자를 입력하면 결과가 즉시 반영됩니다.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="buyPrice"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  매수가
                </label>
                <input
                  id="buyPrice"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  placeholder="예: 70000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="stopLossPercent"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  손절 비율 (%)
                </label>
                <input
                  id="stopLossPercent"
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="예: 3"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  보유 수량
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="예: 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
                <p className="mt-2 text-xs text-slate-500">
                  수량을 입력하면 총 손실 금액과 총 투자금을 함께 계산합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">계산 결과</h2>

            {!values.valid ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500">
                매수가와 손절 비율을 입력하면 손절가가 바로 계산됩니다. 수량까지
                입력하면 총 손실 금액도 함께 확인할 수 있습니다.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-500">손절가</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {formatNumber(values.stopPrice)}원
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">주당 손실 금액</p>
                    <p className="mt-1 text-xl font-semibold">
                      {formatNumber(values.lossPerShare)}원
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">손절 비율</p>
                    <p className="mt-1 text-xl font-semibold">
                      {values.percent}%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">총 손실 금액</p>
                    <p className="mt-1 text-xl font-semibold">
                      {values.qty > 0
                        ? `${formatNumber(values.totalLoss)}원`
                        : "수량 입력 시 계산"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">총 투자금</p>
                    <p className="mt-1 text-xl font-semibold">
                      {values.qty > 0
                        ? `${formatNumber(values.totalInvestment)}원`
                        : "수량 입력 시 계산"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 text-slate-50">
                  <p className="text-sm text-slate-300">요약</p>
                  <p className="mt-2 text-sm leading-6">
                    매수가 {formatNumber(values.buy)}원에서{" "}
                    {values.percent}% 손절 기준을 적용하면 손절가는{" "}
                    {formatNumber(values.stopPrice)}원입니다.
                    {values.qty > 0 && (
                      <>
                        {" "}
                        보유 수량 {formatNumber(values.qty)}주 기준 예상 총 손실은{" "}
                        {formatNumber(values.totalLoss)}원입니다.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-14 space-y-10">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold">손절가 계산이 왜 중요한가?</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                손절은 수익을 크게 내기 위한 기술이 아니라, 먼저 계좌를 지키기 위한
                기본 원칙입니다. 많은 초보 투자자들이 손절을 하지 못해 작은 손실을
                큰 손실로 키우곤 합니다. 미리 손절가를 정해두면 감정이 개입될 여지를
                줄일 수 있습니다.
              </p>
              <p>
                특히 장중에 급락이 나오는 종목은 순식간에 대응이 늦어질 수 있습니다.
                이럴 때 손절 라인을 사전에 계산해두면 “어디서 정리할지”가 명확해지고,
                흔들리는 구간에서도 기계적으로 판단하기 쉬워집니다.
              </p>
              <p>
                손절가 계산기는 단순한 숫자 도구가 아닙니다. 한 번의 실패가 전체
                계좌를 무너뜨리지 않도록 리스크를 통제하는 습관을 만드는 출발점입니다.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold">손절 비율은 어떻게 정하나?</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                손절 비율은 사람마다 다르지만, 가장 중요한 것은 본인의 매매 스타일과
                종목 변동성에 맞게 정하는 것입니다. 단타는 보통 짧은 손절 기준을,
                스윙은 조금 더 넓은 손절 범위를 쓰는 경우가 많습니다.
              </p>
              <p>
                예를 들어 변동성이 큰 테마주에 너무 짧은 손절 비율을 적용하면 작은
                흔들림에도 자주 잘릴 수 있습니다. 반대로 대형주에 지나치게 넓은 손절
                비율을 적용하면 손실 관리가 느슨해질 수 있습니다.
              </p>
              <p>
                중요한 것은 “몇 퍼센트가 정답인가”보다, 같은 원칙을 반복해서 적용할
                수 있느냐입니다. 기준이 자주 바뀌면 계산기를 써도 실제 매매에서 도움이
                줄어듭니다.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold">주식 초보자가 자주 하는 손절 실수</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                가장 흔한 실수는 손절 기준 없이 진입하는 것입니다. “오르면 좋고,
                떨어지면 버틴다”는 식의 접근은 결국 대응이 늦어지기 쉽습니다. 손절가는
                진입 후가 아니라 진입 전부터 정해져 있어야 합니다.
              </p>
              <p>
                또 다른 실수는 손절을 미루면서 물타기를 먼저 하는 행동입니다. 추가
                매수는 평균 단가를 낮출 수 있지만, 종목이 계속 약세일 경우 손실을 더
                키울 수도 있습니다. 그래서 물타기 전에 먼저 손절 기준부터 계산하는 습관이
                필요합니다.
              </p>
              <p>
                마지막으로 손절 후 바로 다시 진입하는 것도 초보자들이 많이 겪는 문제입니다.
                손절은 실패가 아니라 리스크 관리입니다. 손절한 뒤에는 다시 차분하게
                기준을 점검하고 재진입 여부를 판단하는 것이 좋습니다.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold">자주 묻는 질문 (FAQ)</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">손절가는 몇 퍼센트로 잡아야 하나요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                정답은 없습니다. 단타, 스윙, 장기 투자 여부와 종목 변동성에 따라 달라집니다.
                중요한 것은 한 번 정한 기준을 일관되게 적용하는 것입니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">단타와 스윙의 손절 기준은 다른가요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                보통 다릅니다. 단타는 짧은 손절 기준을 사용하는 경우가 많고, 스윙은
                차트 구조와 추세를 더 넓게 보고 손절 라인을 잡는 편입니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">손절을 안 하면 왜 위험한가요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                작은 손실이 큰 손실로 커질 수 있기 때문입니다. 손절은 수익을 포기하는
                행동이 아니라, 계좌 전체를 지키는 방어 전략입니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">물타기 전에 손절가부터 계산해야 하나요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                그렇습니다. 물타기는 평균 단가를 낮추지만 리스크도 함께 커질 수 있습니다.
                먼저 손절 기준과 허용 손실 범위를 계산한 뒤에 추가 매수를 판단하는 것이 좋습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl bg-slate-100 p-6">
          <h2 className="text-2xl font-semibold">다른 계산기도 준비 중입니다</h2>
          <p className="mt-3 text-slate-600">
            아래 페이지도 순차적으로 추가할 예정입니다.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              href="/average-price-calculator"
              className="rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-slate-50"
            >
              평단가 계산기
            </Link>

            <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-400 shadow-sm">
              수익률 계산기 (준비중)
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-400 shadow-sm">
              물타기 계산기 (준비중)
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}