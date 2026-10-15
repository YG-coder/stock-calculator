export function requiredNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}
