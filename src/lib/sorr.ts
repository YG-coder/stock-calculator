import type { SimulationInput, SimulationResult } from "@/lib/montecarlo/types";

export interface SorrResult {
  balances: number[];
  terminal: number;
  depletedYear: number | null;
}

function validateSorrInput(initial: number, monthlyWithdrawal: number, inflation: number, returns: number[]) {
  if (!Number.isFinite(initial) || initial <= 0) throw new Error("초기 자산은 0보다 큰 숫자여야 합니다.");
  if (!Number.isFinite(monthlyWithdrawal) || monthlyWithdrawal < 0) throw new Error("월 인출액은 0 이상이어야 합니다.");
  if (!Number.isFinite(inflation) || inflation <= -1) throw new Error("물가상승률은 -100%보다 커야 합니다.");
  if (returns.length < 2 || returns.some((value) => !Number.isFinite(value) || value <= -1)) {
    throw new Error("연 수익률은 -100%보다 큰 숫자 2개 이상이어야 합니다.");
  }
}

export function parseAnnualReturns(text: string): number[] {
  const tokens = text.split(/[,\s]+/).filter(Boolean);
  if (tokens.length < 2) throw new Error("연 수익률은 숫자 2개 이상이어야 합니다.");
  const values = tokens.map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= -100)) {
    throw new Error("연 수익률은 -100%보다 큰 숫자만 입력해야 합니다.");
  }
  return values.map((value) => value / 100);
}

export function simulateSorr(initial: number, monthlyWithdrawal: number, inflation: number, returns: number[]): SorrResult {
  validateSorrInput(initial, monthlyWithdrawal, inflation, returns);
  let balance = initial;
  const balances = [balance];
  let depletedYear: number | null = null;
  for (let year = 0; year < returns.length; year++) {
    const annualWithdrawal = monthlyWithdrawal * 12 * Math.pow(1 + inflation, year);
    balance -= annualWithdrawal;
    if (balance <= 0) {
      balance = 0;
      depletedYear = year + 1;
      balances.push(0);
      for (let y = year + 1; y < returns.length; y++) balances.push(0);
      break;
    }
    balance *= 1 + returns[year];
    if (balance <= 0) {
      balance = 0;
      depletedYear = year + 1;
    }
    balances.push(balance);
    if (depletedYear) {
      for (let y = year + 1; y < returns.length; y++) balances.push(0);
      break;
    }
  }
  return { balances, terminal: balance, depletedYear };
}

export interface SorrSimulationValues {
  seed: number; paths: number; years: number; initialAssets: number; monthlyWithdrawal: number;
  expectedReturnPercent: number; volatilityPercent: number; inflationPercent: number;
}

export function buildSorrSimulationInput(values: SorrSimulationValues): SimulationInput {
  return {
    seed: values.seed, paths: values.paths, months: Math.round(values.years * 12), initialBalance: values.initialAssets,
    cashFlow: { monthlyAmount: -values.monthlyWithdrawal, timing: "start", inflationIndexed: true },
    returns: { kind: "parametric", expectedReturn: values.expectedReturnPercent / 100, volatility: values.volatilityPercent / 100 },
    inflationRate: values.inflationPercent / 100, reportBasis: "real",
  };
}

export function sorrSurvivalRate(result: SimulationResult): number {
  return 1 - (result.depletion?.rate ?? 0);
}
