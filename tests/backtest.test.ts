import { describe, expect, it } from "vitest";
import { parseMonthlyReturns, runRollingBacktest } from "@/lib/backtest";

describe("rolling backtest", () => {
  it("붙여넣은 퍼센트 수익률을 파싱한다", () => expect(parseMonthlyReturns("1, -2 3\n4")).toEqual([0.01, -0.02, 0.03, 0.04]));

  it("가능한 모든 연속 시작 구간을 계산한다", () => {
    const result = runRollingBacktest({ returns: [0.1, 0, -0.1, 0.2], horizonMonths: 2, initialAmount: 100, monthlyAmount: 0 });
    expect(result.scenarios).toHaveLength(3);
    expect(result.scenarios[0].terminalValue).toBeCloseTo(110);
    expect(result.scenarios[1].terminalValue).toBeCloseTo(90);
    expect(result.scenarios[2].terminalValue).toBeCloseTo(108);
    expect(result.worst.startIndex).toBe(1);
  });

  it("월 납입은 각 월 수익률 적용 전에 더한다", () => {
    const result = runRollingBacktest({ returns: [0.1, 0.1], horizonMonths: 2, initialAmount: 0, monthlyAmount: 100 });
    expect(result.scenarios[0].terminalValue).toBeCloseTo(231);
    expect(result.scenarios[0].totalContributed).toBe(200);
  });

  it("불충분하거나 불가능한 자료를 거부한다", () => {
    expect(() => runRollingBacktest({ returns: [0], horizonMonths: 2, initialAmount: 1, monthlyAmount: 0 })).toThrow("개월 수 이하");
    expect(() => runRollingBacktest({ returns: [-1], horizonMonths: 1, initialAmount: 1, monthlyAmount: 0 })).toThrow("-100%");
  });
});
