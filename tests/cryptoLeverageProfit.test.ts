import { describe, expect, it } from "vitest";
import { calculateLeverageProfit, type LeverageProfitInput } from "@/lib/cryptoLeverageProfit";

// 선형 USDT 계약: 수량 = 증거금 × 레버리지 ÷ 진입가, 종료 수수료 = 수량 × 종료가 × 수수료율
const base: LeverageProfitInput = { entryPrice: 100, exitPrice: 200, margin: 1_000, leverage: 10, feeRatePercent: 0.1, position: "long" };

describe("레버리지 수익 — 종료 수수료는 종료가 기준 (회귀)", () => {
  it("롱 100→200, 증거금 1,000, 10배, 0.1%: 수수료 30, 순손익 9,970, ROE 997%", () => {
    const r = calculateLeverageProfit(base);
    expect(r.valid).toBe(true);
    expect(r.quantity).toBeCloseTo(100, 10);
    expect(r.entryFee).toBeCloseTo(10, 10);
    expect(r.exitFee).toBeCloseTo(20, 10);
    expect(r.totalFee).toBeCloseTo(30, 10);
    expect(r.grossPnl).toBeCloseTo(10_000, 10);
    expect(r.netPnl).toBeCloseTo(9_970, 10);
    expect(r.roe).toBeCloseTo(997, 10);
  });
  it("롱 하락 100→95: 종료 수수료가 진입 수수료보다 작다", () => {
    const r = calculateLeverageProfit({ ...base, exitPrice: 95 });
    expect(r.exitFee).toBeCloseTo(9.5, 10);
    expect(r.totalFee).toBeCloseTo(19.5, 10);
    expect(r.grossPnl).toBeCloseTo(-500, 10);
    expect(r.netPnl).toBeCloseTo(-519.5, 10);
    expect(r.roe).toBeCloseTo(-51.95, 10);
  });
  it("숏 하락 100→80: 이익, 종료 수수료 8", () => {
    const r = calculateLeverageProfit({ ...base, exitPrice: 80, position: "short" });
    expect(r.exitFee).toBeCloseTo(8, 10);
    expect(r.grossPnl).toBeCloseTo(2_000, 10);
    expect(r.netPnl).toBeCloseTo(1_982, 10);
    expect(r.priceChangeRate).toBeCloseTo(20, 10);
  });
  it("숏 상승 100→105: 손실, 종료 수수료 10.5", () => {
    const r = calculateLeverageProfit({ ...base, exitPrice: 105, position: "short" });
    expect(r.exitFee).toBeCloseTo(10.5, 10);
    expect(r.grossPnl).toBeCloseTo(-500, 10);
    expect(r.netPnl).toBeCloseTo(-520.5, 10);
  });
  it("동일 가격이면 롱·숏 모두 수수료만큼 손실이고 진입·종료 수수료가 같다", () => {
    for (const position of ["long", "short"] as const) {
      const r = calculateLeverageProfit({ ...base, exitPrice: 100, position });
      expect(r.entryFee).toBeCloseTo(r.exitFee, 10);
      expect(r.grossPnl).toBe(0);
      expect(r.netPnl).toBeCloseTo(-20, 10);
    }
  });
  it("청산 구간을 넘는 불리한 변동은 경고 대상으로 표시한다", () => {
    expect(calculateLeverageProfit({ ...base, exitPrice: 85 }).beyondLiquidation).toBe(true);
    expect(calculateLeverageProfit({ ...base, exitPrice: 95 }).beyondLiquidation).toBe(false);
  });
  it("잘못된 입력은 계산하지 않는다", () => {
    expect(calculateLeverageProfit({ ...base, entryPrice: 0 }).valid).toBe(false);
    expect(calculateLeverageProfit({ ...base, feeRatePercent: -0.1 }).valid).toBe(false);
    expect(calculateLeverageProfit({ ...base, margin: Number.NaN }).valid).toBe(false);
  });
});
