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
