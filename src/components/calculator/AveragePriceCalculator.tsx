"use client";

import { useMemo, useRef, useState } from "react";
import { parsePositive } from "@/lib/number";
import {
  CalculatorLayout,
  CalculatorCard,
  ResultCard,
  ResultHighlight,
  ResultDetail,
  InputField,
} from "@/components/ui/Shared";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";

type Currency = "KRW" | "USD";

type BuyRow = {
  id: number;
  price: string;
  quantity: string;
};

const MAX_ROWS = 10;

export default function AveragePriceCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [rows, setRows] = useState<BuyRow[]>([
    { id: 1, price: "", quantity: "" },
    { id: 2, price: "", quantity: "" },
  ]);
  const [currentPrice, setCurrentPrice] = useState("");
  const nextId = useRef(3);

  const moneyUnit = currency === "KRW" ? "원" : "USD";

  // 통화별 소수점 처리: USD는 소수점 2자리까지, KRW는 정수 표기
  const priceDigits = currency === "USD" ? 2 : 0;
  const fmtMoney = (v: number) => {
    if (!Number.isFinite(v)) return "-";
    return new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: priceDigits,
    }).format(v);
  };
  // 수량은 소수점 매매(예: 0.5주)를 고려해 소수점 4자리까지 표기
  const fmtQty = (v: number) => {
    if (!Number.isFinite(v)) return "-";
    return new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 4,
    }).format(v);
  };

  const updateRow = (id: number, field: "price" | "quantity", value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => {
      if (prev.length >= MAX_ROWS) return prev;
      const id = nextId.current;
      nextId.current += 1;
      return [...prev, { id, price: "", quantity: "" }];
    });
  };

  const removeRow = (id: number) => {
    setRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)
    );
  };

  const resetRows = () => {
    setRows([
      { id: 1, price: "", quantity: "" },
      { id: 2, price: "", quantity: "" },
    ]);
    setCurrentPrice("");
    nextId.current = 3;
  };

  const result = useMemo(() => {
    let totalQuantity = 0;
    let totalAmount = 0;
    let validCount = 0;
    let firstValidPrice = 0; // 첫 번째 '유효한' 매수가 (물타기/불타기 판정 기준)

    for (const row of rows) {
      const p = parsePositive(row.price);
      const q = parsePositive(row.quantity);
      if (p > 0 && q > 0) {
        totalQuantity += q;
        totalAmount += p * q;
        validCount += 1;
        if (firstValidPrice === 0) firstValidPrice = p;
      }
    }

    if (validCount === 0 || totalQuantity <= 0) {
      return {
        valid: false,
        averagePrice: 0,
        totalQuantity: 0,
        totalAmount: 0,
        firstPrice: 0,
        buyCount: 0,
        hasCurrent: false,
        evalAmount: 0,
        profit: 0,
        profitRate: 0,
      };
    }

    const averagePrice = totalAmount / totalQuantity;

    // 현재가(선택 입력) 기준 평가손익
    const cp = parsePositive(currentPrice);
    const hasCurrent = cp > 0;
    const evalAmount = hasCurrent ? cp * totalQuantity : 0;
    const profit = hasCurrent ? evalAmount - totalAmount : 0;
    const profitRate =
      hasCurrent && totalAmount > 0 ? (profit / totalAmount) * 100 : 0;

    return {
      valid: true,
      averagePrice,
      totalQuantity,
      totalAmount,
      firstPrice: firstValidPrice,
      buyCount: validCount,
      hasCurrent,
      evalAmount,
      profit,
      profitRate,
    };
  }, [rows, currentPrice]);

  // 평단가 방향 안내 (물타기 = 평단 하락 / 불타기 = 평단 상승)
  const directionNote =
    result.valid && result.firstPrice > 0
      ? result.averagePrice < result.firstPrice
        ? { text: "평단가 하락 · 물타기 효과", tone: "down" as const }
        : result.averagePrice > result.firstPrice
          ? { text: "평단가 상승 · 불타기", tone: "up" as const }
          : { text: "평단가 변동 없음", tone: "flat" as const }
      : null;

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="매수 정보 입력"
        description="1차 매수 외에도 추가 매수를 여러 번 입력할 수 있습니다. 물타기(하락 매수)와 불타기(상승 매수) 모두 계산됩니다."
      >
        <CurrencyToggle
          value={currency}
          onChange={setCurrency}
          options={["KRW", "USD"] as const}
        />
        <p className="-mt-2 text-xs text-slate-400">
          통화를 바꿔도 입력값은 자동 환산되지 않습니다. 선택한 통화 기준으로 값을 입력하세요.
        </p>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  {index === 0 ? "1차 매수 (기존 보유)" : `${index + 1}차 매수`}
                </span>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                    aria-label={`${index + 1}차 매수 삭제`}
                  >
                    삭제
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  id={`price-${row.id}`}
                  label={`매수가 (${moneyUnit})`}
                  type="number"
                  placeholder={currency === "KRW" ? "예: 50000" : "예: 50"}
                  unit={moneyUnit}
                  value={row.price}
                  onChange={(e) => updateRow(row.id, "price", e.target.value)}
                />
                <InputField
                  id={`qty-${row.id}`}
                  label="수량"
                  type="number"
                  placeholder="예: 10"
                  unit="주"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= MAX_ROWS}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + 추가 매수 입력
          </button>
          <button
            type="button"
            onClick={resetRows}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            초기화
          </button>
          {rows.length >= MAX_ROWS ? (
            <span className="self-center text-xs text-slate-400">
              최대 {MAX_ROWS}회까지 입력할 수 있습니다.
            </span>
          ) : null}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <InputField
            id="currentPrice"
            label={`현재가 (선택 · ${moneyUnit})`}
            type="number"
            placeholder={currency === "KRW" ? "예: 47000" : "예: 47"}
            unit={moneyUnit}
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
          />
          <p className="mt-2 text-sm text-slate-500">
            현재가를 입력하면 평가손익과 수익률도 함께 계산됩니다.
          </p>
        </div>
      </CalculatorCard>

      <ResultCard
        title="평단가 계산 결과"
        emptyMessage="매수가와 수량을 입력하면 결과가 표시됩니다."
        isValid={result.valid}
      >
        <ResultHighlight
          label="평균 단가"
          value={fmtMoney(result.averagePrice)}
          unit={moneyUnit}
        />

        {directionNote ? (
          <p
            className={`mt-3 text-sm font-semibold ${
              directionNote.tone === "down"
                ? "text-blue-600"
                : directionNote.tone === "up"
                  ? "text-red-600"
                  : "text-slate-500"
            }`}
          >
            {directionNote.text}
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ResultDetail
            label="총 보유 수량"
            value={fmtQty(result.totalQuantity)}
            unit="주"
          />
          <ResultDetail
            label="총 매수 금액"
            value={fmtMoney(result.totalAmount)}
            unit={moneyUnit}
          />
          <ResultDetail label="매수 횟수" value={result.buyCount} unit="회" />
        </div>

        {result.hasCurrent ? (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <ResultHighlight
              label="평가 손익"
              value={`${result.profit >= 0 ? "+" : ""}${fmtMoney(result.profit)}`}
              unit={moneyUnit}
              tone={result.profit >= 0 ? "positive" : "negative"}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ResultDetail
                label="수익률"
                value={`${result.profitRate >= 0 ? "+" : ""}${result.profitRate.toFixed(2)}`}
                unit="%"
              />
              <ResultDetail
                label="평가 금액"
                value={fmtMoney(result.evalAmount)}
                unit={moneyUnit}
              />
            </div>
          </div>
        ) : null}
      </ResultCard>
    </CalculatorLayout>
  );
}
