import { describe, expect, it } from "vitest";
import { buildDcaInput, nominalContributions, nominalContributionsFromInput, type DcaFormValues } from "@/lib/dca";

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
});
