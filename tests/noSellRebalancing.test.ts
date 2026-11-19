import { describe, expect, it } from "vitest";
import { allocateWithoutSelling, totalWeightDeviation } from "@/lib/noSellRebalancing";

describe("allocateWithoutSelling", () => {
  it.each([
    { budget: 10_001, weights: [0.5, 0.5, 0], expected: [5_001, 5_000, 0] },
    { budget: 1, weights: [0.3, 0.3, 0.4], expected: [0, 0, 1] },
    { budget: 2, weights: [0.3, 0.3, 0.4], expected: [1, 0, 1] },
    { budget: 0, weights: [0.5, 0.5, 0], expected: [0, 0, 0] },
  ])("예산 $budget 원의 잔여분을 배정하고 같은 매수액으로 잔액·비중을 계산한다", ({ budget, weights, expected }) => {
    const assets = weights.map((targetWeight, i) => ({ name: String(i), currentValue: targetWeight * 20_000, targetWeight }));
    const rows = allocateWithoutSelling(assets, budget);
    expect(rows.map(row => row.buyAmount)).toEqual(expected);
    expect(rows.reduce((sum, row) => sum + row.buyAmount, 0)).toBe(budget);
    rows.forEach((row, i) => {
      expect(row.finalValue).toBe(assets[i].currentValue + expected[i]);
      expect(row.finalWeight).toBeCloseTo(row.finalValue / (20_000 + budget), 14);
    });
  });

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

  it.each([
    { budget: "100.50", expected: ["50.3", "50.2"] },
    { budget: "9007199254740993", expected: ["4,503,599,627,370,497", "4,503,599,627,370,496"] },
  ])("소수 예산과 큰 정수 예산도 입력한 단위까지 표시한다: $budget", ({ budget, expected }) => {
    const assets = ["A", "B"].map(name => ({ name, currentValue: "0", targetPercent: "50" }));
    const rows = allocateWithoutSelling(assets, budget);
    expect(rows.map(row => row.buyAmountText)).toEqual(expected);
    expect(rows.map(row => row.finalValueText)).toEqual(expected);
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
