"use client";

import { useMemo, useState } from "react";
import {
  calculateStockTransactionTax,
  STOCK_TRANSACTION_TAX_RATES,
  type StockMarket,
} from "@/lib/stockTransactionTax";
import {
  CalculatorCard,
  CalculatorLayout,
  InputField,
  ResultCard,
  ResultDetail,
  ResultHighlight,
  SelectField,
} from "@/components/ui/Shared";

const formatWon = (value: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);

export default function StockTransactionTaxCalculator() {
  const [market, setMarket] = useState<StockMarket>("kospi");
  const [saleAmount, setSaleAmount] = useState("");

  const amount = Number(saleAmount);
  const valid = saleAmount.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const result = useMemo(
    () => (valid ? calculateStockTransactionTax(amount, market) : null),
    [amount, market, valid],
  );
  const rate = STOCK_TRANSACTION_TAX_RATES[market];

  return (
    <CalculatorLayout>
      <CalculatorCard
        title="증권거래세 입력"
        description="주식을 판 금액과 거래 시장을 입력하면 예상 증권거래세를 계산합니다."
      >
        <SelectField
          id="market"
          label="거래 시장"
          value={market}
          onChange={(event) => setMarket(event.target.value as StockMarket)}
        >
          {Object.entries(STOCK_TRANSACTION_TAX_RATES).map(([value, item]) => (
            <option key={value} value={value}>{item.label}</option>
          ))}
        </SelectField>
        <InputField
          id="saleAmount"
          label="총 매도금액"
          type="number"
          placeholder="예: 10000000"
          unit="원"
          value={saleAmount}
          onChange={(event) => setSaleAmount(event.target.value)}
        />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
          {rate.note} 매수금액이나 수익 여부와 관계없이 매도금액을 기준으로 계산합니다.
        </div>
      </CalculatorCard>

      <ResultCard
        title="증권거래세 계산 결과"
        emptyMessage="시장과 매도금액을 입력하면 결과가 표시됩니다."
        isValid={Boolean(result)}
      >
        {result && (
          <>
            <ResultHighlight label="예상 세금 합계" value={formatWon(result.totalTax)} unit="원" tone="negative" />
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultDetail label="증권거래세" value={formatWon(result.transactionTax)} unit="원" />
              <ResultDetail label="농어촌특별세" value={formatWon(result.ruralTax)} unit="원" />
              <ResultDetail label="합산 세율" value={(result.totalRate * 100).toFixed(2)} unit="%" />
              <ResultDetail label="세금 차감 후 금액" value={formatWon(result.netProceeds)} unit="원" />
            </div>
          </>
        )}
      </ResultCard>
    </CalculatorLayout>
  );
}
