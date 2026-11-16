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
 * 0~1 비율을 퍼센트 숫자 문자열로 바꾼다(요청 당시 입력 문자열이 없을 때의 대체 표기).
 *
 * 0.58 * 100 이 57.99999999999999 로 보이는 부동소수점 오차를 없앤다. 소수 자릿수를 0부터 늘려 가며
 * "그 퍼센트 ÷ 100 이 원래 비율과 정확히 같아지는" 가장 짧은 표기를 고른다(toFixed 한계인 소수 100자리까지).
 * 58 ÷ 100 → "58", 57.5 ÷ 100 → "57.5", 99.99999 ÷ 100 → "99.99999", 1e-23 → "0.000000000000000000001".
 * 그 범위에서도 맞는 표기가 없으면 반올림해 0·100 으로 보이게 하지 않고 숫자의 기본 표기(지수 포함)를 쓴다.
 */
export function formatPercentFromRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return "-";
  const percent = ratio * 100;
  for (let digits = 0; digits <= 100; digits += 1) {
    const text = percent.toFixed(digits);
    if (Number(text) / 100 === ratio) return text;
  }
  return String(percent);
}

/**
 * 사용자가 입력한 퍼센트 문자열을 표시용으로 다듬는다. 값은 바꾸지 않는다(반올림 없음).
 * 앞뒤 공백, 불필요한 앞쪽 0, 소수부 뒤쪽 0만 정리한다: " 058.50 " → "58.5", ".5" → "0.5", "80." → "80".
 * 숫자·소수점으로만 된 양수 표기가 아니면 null.
 */
export function normalizePercentInput(text: string): string | null {
  const trimmed = text.trim();
  if (!/^(\d+\.?\d*|\.\d+)$/.test(trimmed)) return null;
  const [rawInt, rawFraction = ""] = trimmed.split(".");
  const integer = rawInt.replace(/^0+(?=\d)/, "") || "0";
  const fraction = rawFraction.replace(/0+$/, "");
  return fraction ? `${integer}.${fraction}` : integer;
}

/**
 * 결과 라벨에 쓸 목표 퍼센트. 계산을 요청할 때 입력한 문자열이 그 결과의 비율과 정확히 같은 값이면
 * 입력 문자열을 그대로(자릿수 제한 없이) 표시한다. 연결이 맞지 않으면 비율에서 표기를 만든다.
 */
export function percentLabelForRatio(requestedText: string, ratio: number): string {
  const normalized = normalizePercentInput(requestedText);
  if (normalized !== null && Number(normalized) / 100 === ratio) return normalized;
  return formatPercentFromRatio(ratio);
}
