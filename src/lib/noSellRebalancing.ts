import { div, formatGrouped, fromInt, fromNumber, requiredFiniteNumberExact, toNumber, toPlainDecimal, type Exact } from "@/lib/exactDecimal";

export type RebalancingAsset = {
  name: string;
  currentValue: number;
  targetWeight: number;
};

export type RebalancingResult = RebalancingAsset & {
  buyAmount: number;
  finalValue: number;
  currentWeight: number;
  finalWeight: number;
  targetValue: number;
  buyAmountText: string;
  finalValueText: string;
};

type AssetInput = { name: string; currentValue: number | string } & (
  { targetWeight: number } | { targetPercent: string }
);

function amount(value: number | string): Exact {
  const parsed = requiredFiniteNumberExact(String(value));
  if (!parsed || parsed.n < BigInt(0)) throw new Error("금액은 0 이상이어야 합니다.");
  return parsed;
}

function grouped(value: Exact): string {
  // 금액의 분모는 10의 거듭제곱이다. 입력한 소수 원까지 표시한다.
  return formatGrouped(value, value.d.toString().length - 1);
}

export function formatBudget(value: string): string {
  return grouped(amount(value));
}

function commonScale(values: Exact[]) {
  const scale = values.reduce((largest, value) => value.d > largest ? value.d : largest, BigInt(1));
  return { scale, units: values.map(value => value.n * (scale / value.d)) };
}

/** 부족액에 비례한 몫을 내림한 뒤, 나머지가 큰 자산부터 최소 화폐 단위를 하나씩 배정한다. */
function apportion(units: bigint, deficits: bigint[]): bigint[] {
  if (units === BigInt(0)) return deficits.map(() => BigInt(0));
  const sum = deficits.reduce((total, value) => total + value, BigInt(0));
  const numerators = deficits.map(value => units * value);
  const buys = numerators.map(value => value / sum);
  const remaining = units - buys.reduce((total, value) => total + value, BigInt(0));
  const order = numerators.map((value, index) => ({ index, remainder: value % sum }));
  order.sort((a, b) => {
    if (a.remainder === b.remainder) return a.index - b.index;
    return a.remainder > b.remainder ? -1 : 1;
  });
  for (const { index } of order.slice(0, Number(remaining))) buys[index] += BigInt(1);
  return buys;
}

export function allocateWithoutSelling(assets: AssetInput[], contribution: number | string): RebalancingResult[] {
  if (assets.length < 2) throw new Error("자산은 2개 이상이어야 합니다.");
  const ratios = assets.map(asset => "targetPercent" in asset
    ? div(amount(asset.targetPercent), fromInt(100))
    : fromNumber(asset.targetWeight));
  if (assets.some((asset, i) => !asset.name.trim() || ratios[i].n < BigInt(0))) {
    throw new Error("자산 입력값을 확인해 주세요.");
  }
  const weightSum = ratios.reduce((sum, ratio) => sum + toNumber(ratio), 0);
  if (Math.abs(weightSum - 1) > 1e-8) throw new Error("목표 비중의 합은 100%여야 합니다.");

  // 10001.00도 원 단위 예산이다. 실제 소수 금액을 입력한 경우에만 그 자릿수까지 배분한다.
  const budget = amount(toPlainDecimal(amount(contribution)));
  const balances = assets.map(asset => amount(asset.currentValue));
  const { scale, units: [budgetUnits, ...current] } = commonScale([budget, ...balances]);
  const currentTotal = current.reduce((sum, value) => sum + value, BigInt(0));
  const finalTotal = currentTotal + budgetUnits;
  if (finalTotal === BigInt(0)) throw new Error("현재 자산 또는 추가 투자금을 입력해 주세요.");

  const { units: weights } = commonScale(ratios);
  const totalWeight = weights.reduce((sum, value) => sum + value, BigInt(0));
  // 모든 부족액의 분모가 같아서 분자만으로 배분할 수 있다.
  const deficits = current.map((value, i) => {
    const deficit = finalTotal * weights[i] - value * totalWeight;
    return deficit > BigInt(0) ? deficit : BigInt(0);
  });
  const buys = apportion(budget.n, deficits);

  const totalValue = { n: finalTotal, d: scale };
  return assets.map((asset, i) => {
    const buy = { n: buys[i], d: budget.d };
    const finalValue = { n: current[i] + buys[i] * (scale / budget.d), d: scale };
    return {
      name: asset.name,
      targetWeight: toNumber(ratios[i]),
      currentValue: toNumber(balances[i]),
      buyAmount: toNumber(buy),
      finalValue: toNumber(finalValue),
      buyAmountText: grouped(buy),
      finalValueText: grouped(finalValue),
      currentWeight: currentTotal > BigInt(0) ? toNumber({ n: current[i], d: currentTotal }) : 0,
      finalWeight: toNumber({ n: finalValue.n, d: finalTotal }),
      targetValue: toNumber({ n: totalValue.n * weights[i], d: totalValue.d * totalWeight }),
    };
  });
}

export function totalWeightDeviation(rows: Pick<RebalancingResult, "finalWeight" | "targetWeight">[]) {
  return rows.reduce((sum, row) => sum + Math.abs(row.finalWeight - row.targetWeight), 0);
}
