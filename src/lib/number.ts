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
