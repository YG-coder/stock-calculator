import { describe, expect, it } from "vitest";
import { calculateStockTransactionTax } from "@/lib/stockTransactionTax";

describe("증권거래세 계산", () => {
  it("코스피는 증권거래세와 농어촌특별세를 분리한다", () => {
    const result = calculateStockTransactionTax(10_000_000, "kospi");
    expect(result.transactionTax).toBe(5_000);
    expect(result.ruralTax).toBe(15_000);
    expect(result.totalTax).toBe(20_000);
    expect(result.netProceeds).toBe(9_980_000);
  });

  it("코스피는 세목별 원 미만을 절사한 뒤 합산한다", () => {
    const result = calculateStockTransactionTax(999_999, "kospi");
    expect(result.transactionTax).toBe(499);
    expect(result.ruralTax).toBe(1_499);
    expect(result.totalTax).toBe(1_998);
    expect(result.netProceeds).toBe(998_001);
  });

  it.each([
    ["kosdaq", 20_000],
    ["konex", 10_000],
    ["kotc", 20_000],
    ["unlisted", 35_000],
  ] as const)("%s 시장 세율을 적용한다", (market, expectedTax) => {
    expect(calculateStockTransactionTax(10_000_000, market).totalTax).toBe(expectedTax);
  });

  it("음수 매도금액을 거부한다", () => {
    expect(() => calculateStockTransactionTax(-1, "kospi")).toThrow("매도금액");
  });
});
