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
};

export function allocateWithoutSelling(
  assets: RebalancingAsset[],
  contribution: number,
): RebalancingResult[] {
  if (assets.length < 2) throw new Error("자산은 2개 이상이어야 합니다.");
  if (!Number.isFinite(contribution) || contribution < 0) throw new Error("추가 투자금은 0 이상이어야 합니다.");
  if (assets.some((asset) => !asset.name.trim() || !Number.isFinite(asset.currentValue) || asset.currentValue < 0 || !Number.isFinite(asset.targetWeight) || asset.targetWeight < 0)) {
    throw new Error("자산 입력값을 확인해 주세요.");
  }

  const weightSum = assets.reduce((sum, asset) => sum + asset.targetWeight, 0);
  if (Math.abs(weightSum - 1) > 1e-8) throw new Error("목표 비중의 합은 100%여야 합니다.");

  const currentTotal = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const finalTotal = currentTotal + contribution;
  if (finalTotal <= 0) throw new Error("현재 자산 또는 추가 투자금을 입력해 주세요.");

  const targetValues = assets.map((asset) => finalTotal * asset.targetWeight);
  const deficits = assets.map((asset, index) => Math.max(0, targetValues[index] - asset.currentValue));
  const deficitSum = deficits.reduce((sum, value) => sum + value, 0);
  let buys: number[];

  if (contribution === 0) {
    buys = assets.map(() => 0);
  } else if (deficitSum >= contribution && deficitSum > 0) {
    buys = deficits.map((deficit) => contribution * deficit / deficitSum);
  } else {
    const leftover = contribution - deficitSum;
    buys = deficits.map((deficit, index) => deficit + leftover * assets[index].targetWeight);
  }

  return assets.map((asset, index) => {
    const finalValue = asset.currentValue + buys[index];
    return {
      ...asset,
      buyAmount: buys[index],
      finalValue,
      currentWeight: currentTotal > 0 ? asset.currentValue / currentTotal : 0,
      finalWeight: finalValue / finalTotal,
      targetValue: targetValues[index],
    };
  });
}

export function totalWeightDeviation(rows: Pick<RebalancingResult, "finalWeight" | "targetWeight">[]) {
  return rows.reduce((sum, row) => sum + Math.abs(row.finalWeight - row.targetWeight), 0);
}
