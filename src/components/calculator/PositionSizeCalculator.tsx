"use client";

import { Fragment, cloneElement, useMemo, useState, type ReactElement, type ReactNode } from "react";
import {
  EXACT_ZERO,
  compare,
  div,
  formatGrouped,
  fromBigInt,
  fromInt,
  isPositive,
  mul,
  parsePositiveExact,
  sub,
  toFixedExact,
  type Exact,
} from "@/lib/exactDecimal";
import { affordableQuantity, recommendedQuantity } from "@/lib/positionSize";
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

/**
 * 긴 숫자의 쉼표 뒤에 줄바꿈 기회(<wbr>)만 넣는다. 글자·쉼표·자릿수는 그대로라 화면 텍스트는 같다.
 * 좁은 화면에서 큰 금액이 카드 밖으로 넘치지 않고 세 자리 묶음 단위로 줄바꿈되게 한다.
 */
function withCommaBreaks(text: string): ReactNode {
  const parts = text.split(",");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <>
          ,<wbr />
        </>
      ) : null}
    </Fragment>
  ));
}

/** 결과 항목의 값은 형식화된 문자열 그대로 넘기고, 화면에 그릴 때만 쉼표 뒤 줄바꿈 기회를 넣는다. */
function CommaBreaks({ children }: { children: ReactElement<{ value: ReactNode }> }) {
  const { value } = children.props;
  return typeof value === "string" ? cloneElement(children, { value: withCommaBreaks(value) }) : children;
}

export default function PositionSizeCalculator() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [totalCapital, setTotalCapital] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const moneyUnit = currency === "KRW" ? "원" : "USD";
  const moneyDigits = currency === "KRW" ? 0 : 2;
  // 입력 십진값으로 정확히 계산한 값을 기존 Intl 규칙(0에서 먼 쪽 반올림·쉼표)으로 표시 단계에서 한 번만 반올림한다.
  const formatMoney = (value: Exact) => formatGrouped(value, moneyDigits);
  // 수량은 bigint 그대로 쉼표만 넣는다(Number로 바꾸지 않음).
  const formatCount = (value: bigint) => formatGrouped(fromBigInt(value), 0);

  const result = useMemo(() => {
    const capital = parsePositiveExact(totalCapital);
    const risk = parsePositiveExact(riskPercent);
    const entry = parsePositiveExact(entryPrice);
    const stop = parsePositiveExact(stopLossPrice);

    if (!isPositive(capital) || !isPositive(risk) || !isPositive(entry) || !isPositive(stop) || compare(stop, entry) >= 0) {
      return {
        valid: false,
        capital: EXACT_ZERO,
        maxLoss: EXACT_ZERO,
        recommendQty: BigInt(0),
        positionSize: EXACT_ZERO,
        capitalTakeup: EXACT_ZERO,
        actualLoss: EXACT_ZERO,
        actualLossRate: EXACT_ZERO,
        affordableQty: BigInt(0),
        exceedsCapital: false,
      };
    }

    // 모든 값은 입력 십진값의 정확한 유리수(중간 반올림 없음)
    const maxLoss = mul(capital, div(risk, fromInt(100)));
    const lossPerShare = sub(entry, stop);
    const recommendQty = recommendedQuantity(capital, risk, entry, stop);
    const qty = fromBigInt(recommendQty);
    const positionSize = mul(qty, entry);
    const capitalTakeup = mul(div(positionSize, capital), fromInt(100));
    // 수량을 내림 처리한 뒤의 실제 손실액 (허용 리스크 금액과 다를 수 있다)
    const actualLoss = mul(qty, lossPerShare);
    const actualLossRate = mul(div(actualLoss, capital), fromInt(100));
    // 자본금 안에서 실제로 매수 가능한 최대 수량
    const affordableQty = affordableQuantity(capital, entry);

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
      exceedsCapital: compare(positionSize, capital) > 0,
    };
  }, [totalCapital, riskPercent, entryPrice, stopLossPrice]);

  return (
    <CalculatorLayout>
      <div className="space-y-6">
        <CalculatorCard
          title="1. 자금 및 리스크 정보"
          description="총 자본금과 1회 매매 허용 리스크를 입력하세요."
        >
          <CurrencyToggle
            value={currency}
            onChange={setCurrency}
            options={["KRW", "USD"] as const}
          />
          <InputField
            id="totalCapital"
            label="총 투자 자본금"
            type="number"
            placeholder={currency === "KRW" ? "예: 10000000" : "예: 10000"}
            unit={moneyUnit}
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
            placeholder={currency === "KRW" ? "예: 50000" : "예: 50"}
            unit={moneyUnit}
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
          <InputField
            id="stopLossPrice"
            label="손절 라인"
            type="number"
            placeholder={currency === "KRW" ? "예: 48000" : "예: 48"}
            unit={moneyUnit}
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
        {/* 긴 금액이 좁은 화면에서 카드 밖으로 넘치지 않게: 쉼표 뒤 줄바꿈, 그래도 길면 글자 단위 줄바꿈(글자 크기·숫자·단위 그대로) */}
        <CommaBreaks>
          <ResultHighlight
            label="권장 매수 금액 (포지션 크기)"
            value={formatMoney(result.positionSize)}
            unit={moneyUnit}
            tone="positive"
            className="wrap-anywhere"
          />
        </CommaBreaks>
        <div className="grid gap-4 sm:grid-cols-2">
          <CommaBreaks>
            <ResultDetail
              label="권장 매수 수량"
              value={formatCount(result.recommendQty)}
              unit="주"
              className="wrap-anywhere"
            />
          </CommaBreaks>
          <ResultDetail
            label="총 자본 대비 비중"
            value={toFixedExact(result.capitalTakeup, 1)}
            unit="%"
            className="wrap-anywhere"
          />
        </div>
        {result.recommendQty === BigInt(0) ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm mt-2 wrap-anywhere"
          >
            <p className="text-sm font-medium text-amber-900 leading-relaxed">
              허용 리스크 금액({formatMoney(result.maxLoss)} {moneyUnit})이 1주당 손실보다 작아
              이 조건에서는 매수할 수 있는 수량이 없습니다. 손절 폭을 좁히거나 허용 리스크를
              높여야 합니다.
            </p>
          </div>
        ) : result.exceedsCapital ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm mt-2 wrap-anywhere"
          >
            <p className="text-sm font-semibold text-amber-900 leading-relaxed">
              손절 폭이 좁아 권장 수량이 총 자본금을 초과합니다.
            </p>
            <p className="mt-2 text-sm text-amber-900 leading-relaxed">
              리스크 한도만 보면 {formatCount(result.recommendQty)}주이지만, 자본금{" "}
              {formatMoney(result.capital)} {moneyUnit}로 실제 매수 가능한 최대 수량은{" "}
              <strong>{formatCount(result.affordableQty)}주</strong>입니다. 미수·신용을
              쓰지 않는다면 손절 폭을 넓히거나 허용 리스크를 낮춰 다시 계산하세요.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 shadow-sm mt-2 wrap-anywhere">
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              손절가 도달 시 계좌 총 손실액은 최대{" "}
              <strong className="text-blue-600">
                -{formatMoney(result.actualLoss)} {moneyUnit} ({toFixedExact(result.actualLossRate, 2)}%)
              </strong>
              으로 제한됩니다.
            </p>
          </div>
        )}
      </ResultCard>
    </CalculatorLayout>
  );
}
