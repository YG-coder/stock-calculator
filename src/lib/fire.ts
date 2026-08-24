import type { SimulationInput, SimulationResult } from "@/lib/montecarlo/types";

export interface FireValues {
  seed: number; paths: number; currentAge: number; retirementAge: number; planToAge: number;
  currentAssets: number; monthlyContribution: number; monthlyExpenses: number;
  expectedReturnPercent: number; volatilityPercent: number; inflationPercent: number;
}

export function buildFireInput(v: FireValues): SimulationInput {
  const retirementMonth = Math.round((v.retirementAge - v.currentAge) * 12);
  const months = Math.round((v.planToAge - v.currentAge) * 12);
  return {
    seed: v.seed, paths: v.paths, months, initialBalance: v.currentAssets,
    cashFlow: { monthlyAmount: 0, timing: "end", inflationIndexed: false, phases: [
      { fromMonth: 0, toMonth: retirementMonth, monthlyAmount: v.monthlyContribution, timing: "end", inflationIndexed: false, label: "은퇴 전 적립" },
      { fromMonth: retirementMonth, toMonth: months, monthlyAmount: -v.monthlyExpenses, timing: "start", inflationIndexed: true, label: "은퇴 후 생활비" },
    ] },
    returns: { kind: "parametric", expectedReturn: v.expectedReturnPercent / 100, volatility: v.volatilityPercent / 100 },
    inflationRate: v.inflationPercent / 100, reportBasis: "real",
  };
}

export function fireSuccessRate(result: SimulationResult): number {
  return 1 - (result.depletion?.rate ?? 0);
}
