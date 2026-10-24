"use client";
import { formatGrouped, fromBigInt, fromInt, mul, requiredNumberExact, sign, toFixedExact, type Exact } from "@/lib/exactDecimal";

import { useMemo, useState } from "react";
import {
  calculateStockTransactionTaxExact,
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
import CommaBreaks from "@/components/calculator/CommaBreaks";

// 기존 Intl 0자리 표시 그대로. 세액은 이미 원 단위로 내림한 정수, 차감 후 금액은 정확값을 표시 단계에서만 반올림한다.
const formatWon = (value: bigint | Exact) =>
  formatGrouped(typeof value === "bigint" ? fromBigInt(value) : value, 0);

export default function StockTransactionTaxCalculator() {
  const [market, setMarket] = useState<StockMarket>("kospi");
  const [saleAmount, setSaleAmount] = useState("");

  // requiredNumber와 같은 계약으로 매도금액 입력 십진값을 정확히 읽는다(큰 금액도 Number로 먼저 바꾸지 않음).
  const result = useMemo(() => {
    const amount = requiredNumberExact(saleAmount);
    const valid = saleAmount.trim() !== "" && amount !== null && sign(amount) > 0;
    return valid ? calculateStockTransactionTaxExact(amount, market) : null;
  }, [saleAmount, market]);
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
            {/* 긴 금액이 좁은 화면에서 카드 밖으로 넘치지 않게 쉼표 뒤 줄바꿈(글자 크기·숫자·단위 그대로) */}
            <CommaBreaks>
              <ResultHighlight label="예상 세금 합계" value={formatWon(result.totalTax)} unit="원" tone="negative" />
            </CommaBreaks>
            <div className="grid gap-4 sm:grid-cols-2">
              <CommaBreaks>
                <ResultDetail label="증권거래세" value={formatWon(result.transactionTax)} unit="원" />
                <ResultDetail label="농어촌특별세" value={formatWon(result.ruralTax)} unit="원" />
                <ResultDetail label="합산 세율" value={toFixedExact(mul(result.totalRate, fromInt(100)), 2)} unit="%" />
                <ResultDetail label="세금 차감 후 금액" value={formatWon(result.netProceeds)} unit="원" />
              </CommaBreaks>
            </div>
          </>
        )}
      </ResultCard>
    </CalculatorLayout>
  );
}
