/**
 * Shared utility functions to replace duplicated logic across calculator components.
 */

/**
 * Formats a number cleanly to a localized string without floating decimals.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Parses and strictly enforces a positive number from string input.
 * Replaces both parsePositive and clampPositiveNumber logic.
 */
export function parsePositive(value: string | number): number {
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * 코인 가격(청산가·파산가·평균 단가) 표시용.
 *
 * 1 이상은 기존처럼 소수 둘째 자리까지 표시한다. 1 미만의 저가 코인은 소수 둘째 자리에서
 * 반올림하면 0.000905 같은 양수 가격이 0 으로 보이므로, 유효숫자 4자리로 표시한다.
 * 계산값 자체는 바꾸지 않고 표시 정밀도만 조정한다.
 */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const abs = Math.abs(value);
  const options: Intl.NumberFormatOptions =
    abs > 0 && abs < 1
      ? { maximumSignificantDigits: 4 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  return new Intl.NumberFormat("ko-KR", options).format(value);
}

/**
 * 0~1 비율을 퍼센트 숫자 문자열로 바꾼다. 화면 입력(퍼센트 ÷ 100)으로 만든 비율을 다시 표시할 때 쓴다.
 *
 * 0.58 * 100 이 57.99999999999999 로 보이는 부동소수점 오차는 없애되, 입력 정밀도는 줄이지 않는다.
 * 소수 자릿수를 0부터 늘려 가며 "그 퍼센트 ÷ 100 이 원래 비율과 정확히 같아지는" 가장 짧은 표기를 고른다.
 * 그래서 99.99999% 가 100% 로, 0.00001% 가 0% 로 반올림되지 않고, 계산에 쓴 값과 표시가 일치한다.
 * 0.58 → "58", 0.575 → "57.5", 0.9999999 → "99.99999", 0.0000001 → "0.00001" (지수 표기 없음).
 */
export function formatPercentFromRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return "-";
  const percent = ratio * 100;
  for (let digits = 0; digits <= 20; digits += 1) {
    const text = percent.toFixed(digits);
    if (Number(text) / 100 === ratio) return text;
  }
  // 퍼센트 입력에서 나오지 않은 비율(왕복이 맞는 표기가 없음): 줄이지 않고 가장 긴 표기를 쓴다.
  return percent.toFixed(20).replace(/\.?0+$/, "");
}
