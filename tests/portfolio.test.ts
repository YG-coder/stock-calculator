import { describe, expect, it } from "vitest";
import { calculatePortfolio } from "@/lib/portfolio";

describe("calculatePortfolio", () => {
  const assets = [
    { name: "주식", weight: 0.6, expectedReturn: 0.08, volatility: 0.2 },
    { name: "채권", weight: 0.4, expectedReturn: 0.03, volatility: 0.08 },
  ];

  it("가중 기대수익률과 공분산 기반 변동성을 계산한다", () => {
    const result = calculatePortfolio(assets, [[1, 0.2], [0.2, 1]]);
    expect(result.expectedReturn).toBeCloseTo(0.06, 12);
    expect(result.volatility).toBeCloseTo(Math.sqrt(0.6 ** 2 * 0.2 ** 2 + 0.4 ** 2 * 0.08 ** 2 + 2 * 0.6 * 0.4 * 0.2 * 0.2 * 0.08), 12);
    expect(result.diversificationBenefit).toBeGreaterThan(0);
  });

  it("완전상관이면 단순 가중 변동성과 같다", () => {
    const result = calculatePortfolio(assets, [[1, 1], [1, 1]]);
    expect(result.volatility).toBeCloseTo(0.152, 12);
    expect(result.diversificationBenefit).toBeCloseTo(0, 12);
  });

  it("잘못된 비중과 불가능한 상관행렬을 거부한다", () => {
    expect(() => calculatePortfolio([{ ...assets[0], weight: 0.5 }, assets[1]], [[1, 0.2], [0.2, 1]])).toThrow();
    const three = [...assets, { name: "현금", weight: 0, expectedReturn: 0, volatility: 0 }];
    expect(() => calculatePortfolio(three, [[1, 0.9, 0.9], [0.9, 1, -0.9], [0.9, -0.9, 1]])).toThrow("양의 준정부호");
  });
});
