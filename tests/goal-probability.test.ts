import { describe, expect, it } from "vitest";
import { buildGoalProbabilityInput, type GoalProbabilityValues } from "@/lib/goal-probability";
import { runSimulation } from "@/lib/montecarlo";

const base: GoalProbabilityValues = { seed: 7, paths: 1000, years: 10, initialBalance: 0, monthlyAmount: 100_000, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0, timing: "end", inflationIndexed: false, reportBasis: "nominal", targetAmount: 24_000_000, targetProbabilityPercent: 80 };
describe("목표달성확률 공개 계산기", () => {
  it("목표 계약을 엔진 입력으로 변환한다", () => expect(buildGoalProbabilityInput(base).goal).toEqual({ kind: "terminal-target", targetAmount: 24_000_000, targetProbability: 0.8 }));
  it("변동성 0에서 필요한 월 투자금을 정확히 역산한다", () => {
    const result = runSimulation(buildGoalProbabilityInput(base));
    expect(result.goal?.successProbability).toBe(0);
    expect(result.goal?.inversion?.requiredMonthlyAmount).toBeCloseTo(200_000, 8);
    expect(result.goal?.inversion?.successProbabilityAt).toBe(1);
  });
  it("현재 납입액이 목표를 넘으면 성공 비율이 100%다", () => {
    const result = runSimulation(buildGoalProbabilityInput({ ...base, monthlyAmount: 250_000 }));
    expect(result.goal?.successProbability).toBe(1);
  });
});

describe("목표 확률의 최소 월 투자금 — 필요한 성공 경로 수 (회귀: 56% 에 5,601개 요구)", () => {
  // 목표 1억, 초기 1,000만, 10년, 7%/15%/물가 2%, 현재가치, 월말·고정 납입, 10,000경로, 재현 번호 1
  // 화면과 같은 경로: 퍼센트 문자열 → Number(문자열) ÷ 100 과 문자열을 함께 엔진에 넘긴다.
  const scenario = (monthlyAmount: number, percentText: string, paths = 10_000): GoalProbabilityValues => ({
    seed: 1, paths, years: 10, initialBalance: 10_000_000, monthlyAmount, expectedReturnPercent: 7, volatilityPercent: 15, inflationPercent: 2,
    timing: "end", inflationIndexed: false, reportBasis: "real", targetAmount: 100_000_000, targetProbabilityPercent: Number(percentText), targetProbabilityPercentText: percentText,
  });
  /** 그 월 투자금으로 엔진을 다시 실행해 센 성공 경로 수 — 역산 함수를 거치지 않는 독립 확인 */
  const successes = (monthlyAmount: number, paths = 10_000) => Math.round((runSimulation(buildGoalProbabilityInput(scenario(monthlyAmount, "56", paths))).goal?.successProbability ?? Number.NaN) * paths);
  const inversionOf = (percentText: string, paths = 10_000) => runSimulation(buildGoalProbabilityInput(scenario(500_000, percentText, paths))).goal?.inversion;
  /** 화면 표시와 같은 원 단위 올림 */
  const shown = (percentText: string, paths = 10_000) => Math.ceil(inversionOf(percentText, paths)?.requiredMonthlyAmount ?? Number.NaN);

  it("56%: 5,600개 성공으로 충분 — 623,006원이면 달성, 1원 적으면 미달", () => {
    expect(successes(623_006)).toBe(5_600);
    expect(successes(623_005)).toBe(5_599);
    expect(shown("56")).toBe(623_006);
  });
  it("56.00001%: 5,601개 성공이 필요 — 56% 와 합쳐지지 않는다", () => {
    expect(shown("56.00001")).toBe(623_052);
    expect(successes(623_052)).toBeGreaterThanOrEqual(5_601);
    expect(successes(623_051)).toBeLessThan(5_601);
  });
  it("56.7%: 5,670개 성공으로 충분 — 627,298원이면 달성, 1원 적으면 미달 (회귀: 56.7 ÷ 100 = 0.5670000000000001)", () => {
    expect(successes(627_298)).toBe(5_670);
    expect(successes(627_297)).toBe(5_669);
    expect(shown("56.7")).toBe(627_298);
  });
  it("56.70001%: 5,671개 성공이 필요 — 627,394원, 1원 적으면 미달", () => {
    expect(shown("56.70001")).toBe(627_394);
    expect(successes(627_394)).toBeGreaterThanOrEqual(5_671);
    expect(successes(627_393)).toBeLessThan(5_671);
  });
  it("56.70000000000001%: ÷ 100 하면 56.7% 와 같은 숫자지만 5,671개가 필요 — 627,394원 (회귀: 627,298원 제시)", () => {
    // 전제: 두 입력은 다른 숫자인데 엔진에 넘기는 비율은 같다
    expect(Number("56.70000000000001")).not.toBe(56.7);
    expect(Number("56.70000000000001") / 100).toBe(56.7 / 100);
    expect(shown("56.70000000000001")).toBe(627_394);
    expect(successes(627_393)).toBe(5_670); // 정확히 56.7% — 입력한 목표에는 못 미친다
    expect(shown("56.7")).toBe(627_298); // 같은 비율이어도 56.7 입력은 그대로 5,670개
  });
  it("제시 금액에서의 성공 경로 수가 목표에 필요한 수와 같다(정수로 비교)", () => {
    // [목표 퍼센트, 10,000경로에서 필요한 성공 수 — 퍼센트 × 100 을 올림한 정수]
    for (const [percent, need] of [["56", 5_600], ["56.00001", 5_601], ["56.7", 5_670], ["56.70001", 5_671], ["56.70000000000001", 5_671], ["7", 700], ["29", 2_900], ["58", 5_800], ["80", 8_000], ["33.33", 3_333], ["33.335", 3_334]] as const) {
      expect(Math.round((inversionOf(percent)?.successProbabilityAt ?? Number.NaN) * 10_000), `${percent}%`).toBe(need);
    }
  });
  it("대체 실행의 2,000경로에도 같은 규칙: 필요 성공 수는 실제 실행 경로 수로 정한다", () => {
    // 56.7% × 2,000 = 1,134개, 56.70000000000001% 는 1,135개, 56.74% × 2,000 = 1,134.8 → 1,135개
    for (const [percent, need] of [["56.7", 1_134], ["56.70000000000001", 1_135], ["56.74", 1_135], ["56.75", 1_135], ["56", 1_120]] as const) {
      const inversion = inversionOf(percent, 2_000);
      const amount = Math.ceil(inversion?.requiredMonthlyAmount ?? Number.NaN);
      expect(Math.round((inversion?.successProbabilityAt ?? Number.NaN) * 2_000), `${percent}%`).toBe(need);
      expect(successes(amount, 2_000), `${percent}% 제시 금액`).toBeGreaterThanOrEqual(need);
      expect(successes(amount - 1, 2_000), `${percent}% 1원 적게`).toBeLessThan(need);
    }
  });
  it("퍼센트 문자열 없이 숫자 비율만 넘기면 (성공 수 ÷ 경로 수)와 직접 비교한다", () => {
    const withoutText = (targetProbability: number) => {
      const input = buildGoalProbabilityInput({ ...scenario(500_000, "50"), targetProbabilityPercentText: undefined });
      return runSimulation({ ...input, goal: { ...input.goal!, targetProbability } }).goal?.inversion;
    };
    expect(Math.round((withoutText(0.56)?.successProbabilityAt ?? Number.NaN) * 10_000)).toBe(5_600);
    // 엔진이 보고하는 비율을 그대로 목표로 넣으면 그 성공 수가 나온다
    expect(Math.round((withoutText(5_670 / 10_000)?.successProbabilityAt ?? Number.NaN) * 10_000)).toBe(5_670);
    expect(Math.round((withoutText(5_671 / 10_000)?.successProbabilityAt ?? Number.NaN) * 10_000)).toBe(5_671);
  });
  it("퍼센트 문자열이 목표 확률과 다르거나 숫자가 아니면 입력을 거부한다", () => {
    const input = buildGoalProbabilityInput(scenario(500_000, "56.7"));
    expect(() => runSimulation({ ...input, goal: { ...input.goal!, targetProbabilityPercentText: "80" } })).toThrow(/일치하지 않습니다/);
    expect(() => runSimulation({ ...input, goal: { ...input.goal!, targetProbabilityPercentText: "1e-5" } })).toThrow(/숫자와 소수점/);
    // 문자열만 넘기면(숫자 비율 생략) 역산 없이 끝나지 않고 거부한다 — 잘못된 문자열이든 정상 문자열이든
    for (const text of ["abc", "56.7"]) {
      expect(() => runSimulation({ ...input, goal: { kind: "terminal-target", targetAmount: 100_000_000, targetProbabilityPercentText: text } })).toThrow("목표 비율을 확인할 수 없습니다. 목표 비율을 다시 입력해 주세요.");
    }
    // 둘 다 없으면 기존처럼 역산 없이 성공확률만 계산한다
    expect(runSimulation({ ...input, goal: { kind: "terminal-target", targetAmount: 100_000_000 } }).goal?.inversion).toBeUndefined();
    expect(buildGoalProbabilityInput(scenario(500_000, "56.7")).goal).toEqual({ kind: "terminal-target", targetAmount: 100_000_000, targetProbability: 56.7 / 100, targetProbabilityPercentText: "56.7" });
  });
});
