import type { Basis, SimulationInput } from "@/lib/montecarlo/types";

export interface DcaFormValues {
  seed: number;
  paths: number;
  years: number;
  initialBalance: number;
  monthlyAmount: number;
  expectedReturnPercent: number;
  volatilityPercent: number;
  inflationPercent: number;
  timing: "start" | "end";
  inflationIndexed: boolean;
  reportBasis: Basis;
}

export function buildDcaInput(values: DcaFormValues): SimulationInput {
  return {
    seed: values.seed,
    paths: values.paths,
    months: Math.round(values.years * 12),
    initialBalance: values.initialBalance,
    cashFlow: {
      monthlyAmount: values.monthlyAmount,
      timing: values.timing,
      inflationIndexed: values.inflationIndexed,
    },
    returns: {
      kind: "parametric",
      expectedReturn: values.expectedReturnPercent / 100,
      volatility: values.volatilityPercent / 100,
    },
    inflationRate: values.inflationPercent / 100,
    reportBasis: values.reportBasis,
  };
}

export function nominalContributions(values: DcaFormValues): number {
  return nominalContributionsFromInput(buildDcaInput(values));
}

export function nominalContributionsFromInput(input: SimulationInput): number {
  return contributionsFromInput(input, "nominal");
}

export function contributionsFromInput(input: SimulationInput, basis: Basis = input.reportBasis): number {
  let total = input.initialBalance;
  const { cashFlow, inflationRate, months } = input;
  const fromMonth = cashFlow.fromMonth ?? 0;
  const toMonth = cashFlow.toMonth ?? months;
  for (let month = 0; month < months; month += 1) {
    if (month < fromMonth || month >= toMonth) continue;
    const factor = cashFlow.inflationIndexed
      ? Math.pow(1 + inflationRate, Math.floor(month / 12))
      : 1;
    const contribution = cashFlow.monthlyAmount * factor + (cashFlow.overrides?.[month] ?? 0);
    const discount = basis === "real" ? Math.pow(1 + inflationRate, month / 12) : 1;
    total += contribution / discount;
  }
  return total;
}
