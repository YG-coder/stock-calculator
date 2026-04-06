"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BuyRow = {
  id: number;
  price: string;
  quantity: string;
};

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function parsePositive(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

export default function Page() {
  const [rows, setRows] = useState<BuyRow[]>([
    { id: 1, price: "", quantity: "" },
    { id: 2, price: "", quantity: "" },
  ]);
  const [currentPrice, setCurrentPrice] = useState("");

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        price: "",
        quantity: "",
      },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== id);
    });
  };

  const updateRow = (
    id: number,
    field: "price" | "quantity",
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const result = useMemo(() => {
    const parsedRows = rows.map((row) => ({
      id: row.id,
      price: parsePositive(row.price),
      quantity: parsePositive(row.quantity),
    }));

    const validRows = parsedRows.filter((row) => row.price > 0 && row.quantity > 0);

    const totalQty = validRows.reduce((sum, row) => sum + row.quantity, 0);
    const totalBuyAmount = validRows.reduce(
      (sum, row) => sum + row.price * row.quantity,
      0
    );

    const current = parsePositive(currentPrice);

    if (validRows.length === 0 || totalQty <= 0) {
      return {
        valid: false,
        validRowsCount: 0,
        totalQty: 0,
        avgPrice: 0,
        totalBuyAmount: 0,
        evalAmount: 0,
        profitAmount: 0,
        profitRate: 0,
      };
    }

    const avgPrice = totalBuyAmount / totalQty;
    const evalAmount = current > 0 ? current * totalQty : 0;
    const profitAmount = current > 0 ? evalAmount - totalBuyAmount : 0;
    const profitRate =
      current > 0 && totalBuyAmount > 0
        ? (profitAmount / totalBuyAmount) * 100
        : 0;

    return {
      valid: true,
      validRowsCount: validRows.length,
      totalQty,
      avgPrice,
      totalBuyAmount,
      evalAmount,
      profitAmount,
      profitRate,
    };
  }, [rows, currentPrice]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <section className="mb-10">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            주식 계산기
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            주식 평단가 계산기
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            여러 번 나눠 매수한 가격과 수량을 입력하면 평균 단가(평단가)를 자동으로
            계산할 수 있습니다. 1차, 2차만이 아니라 3차, 4차, 그 이상 추가 매수한
            경우에도 실제 평균 매입 단가를 빠르게 확인할 수 있습니다.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            현재가까지 입력하면 평가금액, 평가손익, 수익률도 함께 계산할 수 있어
            추가 매수 전후 리스크를 판단하는 데 도움이 됩니다.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">매수 정보 입력</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  여러 번 매수한 내역을 추가하면서 평균 단가를 계산할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={addRow}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                + 매수 추가
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800">
                      {index + 1}차 매수
                    </h3>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="text-sm font-medium text-red-600 transition hover:text-red-500"
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`price-${row.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        매수 가격
                      </label>
                      <input
                        id={`price-${row.id}`}
                        type="number"
                        min="0"
                        placeholder="예: 70000"
                        value={row.price}
                        onChange={(e) =>
                          updateRow(row.id, "price", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`quantity-${row.id}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        매수 수량
                      </label>
                      <input
                        id={`quantity-${row.id}`}
                        type="number"
                        min="0"
                        placeholder="예: 10"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, "quantity", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label
                htmlFor="currentPrice"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                현재가 (선택)
              </label>
              <input
                id="currentPrice"
                type="number"
                min="0"
                placeholder="예: 68000"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              />
              <p className="mt-2 text-xs text-slate-500">
                현재가를 입력하면 평가손익과 수익률까지 함께 계산됩니다.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">계산 결과</h2>

            {!result.valid ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500">
                최소 1개 이상의 매수 가격과 수량을 입력하면 평균 단가가 계산됩니다.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-500">평균 단가</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {formatNumber(result.avgPrice)}원
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">입력된 매수 횟수</p>
                    <p className="mt-1 text-xl font-semibold">
                      {formatNumber(result.validRowsCount)}회
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">총 보유 수량</p>
                    <p className="mt-1 text-xl font-semibold">
                      {formatNumber(result.totalQty)}주
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">총 매수 금액</p>
                    <p className="mt-1 text-xl font-semibold">
                      {formatNumber(result.totalBuyAmount)}원
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <p className="text-sm text-slate-500">평가 금액</p>
                    <p className="mt-1 text-xl font-semibold">
                      {currentPrice
                        ? `${formatNumber(result.evalAmount)}원`
                        : "현재가 입력 시 계산"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5 sm:col-span-2">
                    <p className="text-sm text-slate-500">평가 손익 / 수익률</p>
                    <p className="mt-1 text-xl font-semibold">
                      {currentPrice
                        ? `${formatNumber(result.profitAmount)}원 (${result.profitRate.toFixed(
                            2
                          )}%)`
                        : "현재가 입력 시 계산"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 text-slate-50">
                  <p className="text-sm text-slate-300">요약</p>
                  <p className="mt-2 text-sm leading-6">
                    총 {formatNumber(result.validRowsCount)}번 나눠 매수한 결과 평균
                    단가는 {formatNumber(result.avgPrice)}원입니다.
                    {currentPrice && (
                      <>
                        {" "}
                        현재가 기준 평가손익은 {formatNumber(result.profitAmount)}원,
                        수익률은 {result.profitRate.toFixed(2)}%입니다.
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
            <h2 className="text-2xl font-semibold">평단가 계산이 왜 중요한가?</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                평단가는 추가 매수 이후 내가 실제로 어느 가격대에 물려 있는지 보여주는
                핵심 숫자입니다. 단순히 “매수가를 낮췄다”가 아니라, 어느 정도 가격이
                올라야 본전인지 정확하게 계산해야 현실적인 대응이 가능합니다.
              </p>
              <p>
                특히 하락 중인 종목을 여러 번 나눠 매수할 때는 평균 단가만 보고 안심하면
                위험할 수 있습니다. 평단은 낮아졌지만 보유 금액이 커져 손실 폭이 더 커질
                수도 있기 때문입니다.
              </p>
              <p>
                따라서 추가 매수 전에는 평단가 계산기를 활용해 평균 단가, 총 투자금,
                예상 손익 구조를 먼저 확인하는 것이 좋습니다.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold">물타기 전에 꼭 확인할 것</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                물타기는 평균 단가를 낮추는 데는 도움이 되지만, 항상 좋은 선택은 아닙니다.
                종목의 추세가 계속 약하면 평단가가 낮아져도 손실은 더 커질 수 있습니다.
              </p>
              <p>
                그래서 추가 매수 전에는 “평단이 얼마나 내려가는지”뿐 아니라 “총 투자금이
                얼마나 커지는지”도 함께 봐야 합니다. 계좌에서 허용 가능한 리스크 범위를
                넘는다면 물타기보다 손절이 더 나은 판단일 수도 있습니다.
              </p>
              <p>
                즉, 평단가 계산기는 단순 계산이 아니라 추가 매수의 위험을 체크하는 도구로
                써야 의미가 있습니다.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold">주식 초보자가 자주 하는 평단 실수</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-7">
              <p>
                가장 흔한 실수는 평단만 낮아지면 괜찮아졌다고 착각하는 것입니다. 실제로는
                보유 수량과 총 투자금이 함께 늘어나기 때문에, 작은 반등으로는 본전에 오지
                못하는 경우도 많습니다.
              </p>
              <p>
                또 하나는 계획 없이 여러 번 물타기를 반복하는 행동입니다. 몇 퍼센트
                하락할 때마다 추가 매수를 할지, 어느 구간에서 중단할지 기준이 없으면
                계좌 전체가 한 종목에 묶일 수 있습니다.
              </p>
              <p>
                평단 계산은 반드시 손절 기준, 총 투자금, 반등 목표가와 함께 봐야 실제
                매매에 도움이 됩니다.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold">자주 묻는 질문 (FAQ)</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">평단가는 어떻게 계산하나요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                총 매수 금액을 총 보유 수량으로 나누면 됩니다. 이 계산기는 여러 번의
                매수 가격과 수량을 입력하면 자동으로 평균 단가를 계산합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">물타기를 하면 무조건 유리한가요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                아닙니다. 평단은 낮아질 수 있지만 총 투자금이 커지기 때문에 리스크도
                함께 증가합니다. 종목 추세가 약하면 손실을 더 키울 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">현재가를 입력하면 무엇을 알 수 있나요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                현재가를 입력하면 평가 금액, 평가 손익, 수익률까지 함께 계산할 수 있어
                지금 상태에서 수익 중인지 손실 중인지 빠르게 확인할 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">평단 계산기만 보면 충분한가요?</h3>
              <p className="mt-2 text-slate-600 leading-7">
                아닙니다. 평단가는 참고 지표일 뿐이고, 손절 기준과 총 투자금, 추가 매수
                계획까지 함께 고려해야 실제 매매에서 도움이 됩니다.
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
              href="/stop-loss-calculator"
              className="rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-slate-50"
            >
              손절가 계산기
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