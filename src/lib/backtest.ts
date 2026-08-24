export type BacktestScenario = { startIndex: number; endIndex: number; terminalValue: number; totalContributed: number; returnRate: number };

export function parseMonthlyReturns(text: string): number[] {
  return text.split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean).map(Number).map((value) => value / 100);
}

export function runRollingBacktest(input: { returns: number[]; horizonMonths: number; initialAmount: number; monthlyAmount: number }) {
  const { returns, horizonMonths, initialAmount, monthlyAmount } = input;
  if (!Number.isInteger(horizonMonths) || horizonMonths < 1 || horizonMonths > returns.length) throw new Error("투자기간은 수익률 자료의 개월 수 이하여야 합니다.");
  if (!Number.isFinite(initialAmount) || initialAmount < 0 || !Number.isFinite(monthlyAmount) || monthlyAmount < 0 || initialAmount + monthlyAmount <= 0) throw new Error("투자금은 0 이상이며 둘 중 하나는 양수여야 합니다.");
  if (returns.some((value) => !Number.isFinite(value) || value <= -1)) throw new Error("월 수익률은 -100%보다 큰 숫자여야 합니다.");

  const totalContributed = initialAmount + monthlyAmount * horizonMonths;
  const scenarios: BacktestScenario[] = [];
  for (let start = 0; start <= returns.length - horizonMonths; start++) {
    let balance = initialAmount;
    for (let month = 0; month < horizonMonths; month++) balance = (balance + monthlyAmount) * (1 + returns[start + month]);
    scenarios.push({ startIndex: start, endIndex: start + horizonMonths - 1, terminalValue: balance, totalContributed, returnRate: balance / totalContributed - 1 });
  }
  const sorted = [...scenarios].sort((a, b) => a.terminalValue - b.terminalValue);
  const average = scenarios.reduce((sum, item) => sum + item.terminalValue, 0) / scenarios.length;
  return { scenarios, worst: sorted[0], best: sorted.at(-1)!, average, positiveRate: scenarios.filter((item) => item.terminalValue >= item.totalContributed).length / scenarios.length };
}
