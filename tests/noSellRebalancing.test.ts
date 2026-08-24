import { describe, expect, it } from "vitest";
import { allocateWithoutSelling, totalWeightDeviation } from "@/lib/noSellRebalancing";

describe("allocateWithoutSelling", () => {
  it("납입금 전액을 부족 자산에만 배분한다", () => {
    const result = allocateWithoutSelling([
      { name: "주식", currentValue: 80, targetWeight: 0.6 },
      { name: "채권", currentValue: 20, targetWeight: 0.4 },
    ], 20);
    expect(result[0].buyAmount).toBeCloseTo(0);
    expect(result[1].buyAmount).toBeCloseTo(20);
    expect(result.reduce((sum, row) => sum + row.buyAmount, 0)).toBeCloseTo(20);
  });

  it("큰 납입금의 잔액도 목표 비중으로 배분한다", () => {
    const result = allocateWithoutSelling([
      { name: "주식", currentValue: 60, targetWeight: 0.6 },
      { name: "채권", currentValue: 40, targetWeight: 0.4 },
    ], 100);
    expect(result.map((row) => row.buyAmount)).toEqual([60, 40]);
    expect(result.every((row) => row.buyAmount >= 0)).toBe(true);
  });

  it("리밸런싱 후 비중 편차가 줄어든다", () => {
    const result = allocateWithoutSelling([
      { name: "국내주식", currentValue: 70, targetWeight: 0.4 },
      { name: "해외주식", currentValue: 20, targetWeight: 0.4 },
      { name: "채권", currentValue: 10, targetWeight: 0.2 },
    ], 50);
    const before = result.reduce((sum, row) => sum + Math.abs(row.currentWeight - row.targetWeight), 0);
    expect(totalWeightDeviation(result)).toBeLessThan(before);
    expect(result.reduce((sum, row) => sum + row.buyAmount, 0)).toBeCloseTo(50);
  });

  it("비중 합이 100%가 아니면 거부한다", () => {
    expect(() => allocateWithoutSelling([
      { name: "A", currentValue: 1, targetWeight: 0.5 },
      { name: "B", currentValue: 1, targetWeight: 0.4 },
    ], 1)).toThrow("100%");
  });
});
