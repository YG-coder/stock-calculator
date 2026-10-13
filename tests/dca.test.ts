import { describe, expect, it } from "vitest";
import { buildDcaInput, contributionsFromInput, nominalContributions, nominalContributionsFromInput, type DcaFormValues } from "@/lib/dca";
import { runSimulation } from "@/lib/montecarlo";

const base: DcaFormValues = { seed: 1, paths: 10000, years: 20, initialBalance: 10_000_000, monthlyAmount: 500_000, expectedReturnPercent: 7, volatilityPercent: 15, inflationPercent: 2, timing: "end", inflationIndexed: false, reportBasis: "real" };

describe("DCA 공개 계산기 입력 변환", () => {
  it("화면의 퍼센트와 연 단위를 엔진 계약으로 변환한다", () => {
    expect(buildDcaInput(base)).toMatchObject({ months: 240, initialBalance: 10_000_000, returns: { expectedReturn: 0.07, volatility: 0.15 }, inflationRate: 0.02, reportBasis: "real" });
  });
  it("물가 미연동 명목 납입 원금을 계산한다", () => expect(nominalContributions(base)).toBe(130_000_000));
  it("물가 연동 납입액을 연 단위로 증액한다", () => {
    const oneYear = { ...base, years: 2, initialBalance: 0, monthlyAmount: 100, inflationIndexed: true, inflationPercent: 10 };
    expect(nominalContributions(oneYear)).toBeCloseTo(2520, 8);
  });
  it("화면 입력이 바뀌어도 실행 당시 엔진 입력에서 납입 원금을 재현한다", () => {
    expect(nominalContributionsFromInput(buildDcaInput(base))).toBe(130_000_000);
  });
  it("실질 표시에서 월말 납입은 납입 시점(1~12개월 말)으로 할인한다", () => {
    // base.timing === "end" — 첫 납입은 1개월 말, 마지막 납입은 12개월 말에 들어간다.
    const input = buildDcaInput({ ...base, years: 1, initialBalance: 0, monthlyAmount: 100, inflationPercent: 12 });
    const expected = Array.from({ length: 12 }, (_, i) => 100 / Math.pow(1.12, (i + 1) / 12)).reduce((sum, value) => sum + value, 0);
    expect(contributionsFromInput(input)).toBeCloseTo(expected, 10);
  });
  it("실질 표시에서 월초 납입은 납입 시점(0~11개월 초)으로 할인한다", () => {
    const input = buildDcaInput({ ...base, timing: "start", years: 1, initialBalance: 0, monthlyAmount: 100, inflationPercent: 12 });
    const expected = Array.from({ length: 12 }, (_, month) => 100 / Math.pow(1.12, month / 12)).reduce((sum, value) => sum + value, 0);
    expect(contributionsFromInput(input)).toBeCloseTo(expected, 10);
  });
});

describe("DCA 납입금 현재가치 회귀 (수익률 = 물가일 때 실질 손익 0)", () => {
  // 월 배수 g = 1.12^(1/12). 월말 납입 12회의 현재가치 = 1,000,000 × (1 − 1/1.12) ÷ (g − 1) — 반복 합이 아닌 닫힌 식으로 독립 계산.
  const g = Math.pow(1.12, 1 / 12);
  const closedForm = 1_000_000 * (1 - 1 / 1.12) / (g - 1);
  const values: DcaFormValues = { seed: 1, paths: 10, years: 1, initialBalance: 0, monthlyAmount: 1_000_000, expectedReturnPercent: 12, volatilityPercent: 0, inflationPercent: 12, timing: "end", inflationIndexed: false, reportBasis: "real" };

  it("월말 납입: 납입금 현재가치와 최종 자산이 모두 약 11,291,516원이고 실질 손익은 0원", () => {
    const input = buildDcaInput(values);
    const principal = contributionsFromInput(input);
    const terminal = runSimulation(input).terminal.p50;
    expect(Math.round(principal)).toBe(11_291_516);
    expect(principal).toBeCloseTo(closedForm, 4);
    expect(Math.round(terminal)).toBe(11_291_516);
    expect(Math.round(terminal - principal)).toBe(0);
  });
  it("월초 납입도 엔진 결과와 현재가치 원금이 일치한다", () => {
    const input = buildDcaInput({ ...values, timing: "start" });
    const principal = contributionsFromInput(input);
    const terminal = runSimulation(input).terminal.p50;
    expect(principal).toBeCloseTo(closedForm * g, 4);
    expect(Math.round(terminal - principal)).toBe(0);
  });
  it("명목 표시는 납입 시점과 무관하게 단순 합계다", () => {
    expect(contributionsFromInput(buildDcaInput(values), "nominal")).toBe(12_000_000);
  });
});
