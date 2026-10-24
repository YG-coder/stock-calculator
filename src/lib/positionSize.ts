/**
 * 포지션 사이즈의 정수 수량(내림)을 입력 십진값 그대로 정확히 계산한다.
 *
 * 이진 부동소수로 `Math.floor(최대손실 / 1주당손실)`을 계산하면 몫이 정확히 정수인 경계
 * (예: 자본 100, 리스크 1%, 진입 10.3, 손절 10.2 → 10주)에서 9.999…가 되어 1주가 빠진다.
 * 결과는 bigint로 돌려준다. Number로 바꾸면 2^53을 넘는 수량(예: 9,007,199,254,740,993주)이 1주씩 틀어진다.
 * 입력은 exactDecimal.parsePositiveExact로 읽은 0보다 큰 값이라고 가정한다.
 */
import { div, floor, fromInt, isPositive, mul, sub, type Exact } from "@/lib/exactDecimal";

/** 리스크 기준 권장 수량: floor(자본 × 리스크% ÷ 100 ÷ (진입가 − 손절가)) */
export function recommendedQuantity(capital: Exact, riskPercent: Exact, entry: Exact, stop: Exact): bigint {
  const lossPerShare = sub(entry, stop);
  if (!isPositive(lossPerShare)) return BigInt(0);
  return floor(div(mul(capital, div(riskPercent, fromInt(100))), lossPerShare));
}

/** 자본금으로 살 수 있는 최대 수량: floor(자본 ÷ 진입가) */
export function affordableQuantity(capital: Exact, entry: Exact): bigint {
  if (!isPositive(entry)) return BigInt(0);
  return floor(div(capital, entry));
}
