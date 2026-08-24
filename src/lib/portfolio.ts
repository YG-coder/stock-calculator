import { validateCorrelationMatrix, validateWeights } from "@/lib/montecarlo/correlation";

export type PortfolioAsset = { name: string; weight: number; expectedReturn: number; volatility: number };

export function calculatePortfolio(assets: PortfolioAsset[], correlations: number[][]) {
  if (assets.length < 2 || correlations.length !== assets.length) throw new Error("자산과 상관행렬 크기를 확인해 주세요.");
  const weightIssues = validateWeights(assets.map((asset) => asset.weight));
  const correlationIssues = validateCorrelationMatrix(correlations);
  if (weightIssues.length || correlationIssues.length) throw new Error([...weightIssues, ...correlationIssues][0].message);
  if (assets.some((asset) => !asset.name.trim() || asset.expectedReturn <= -1 || asset.volatility < 0 || !Number.isFinite(asset.expectedReturn) || !Number.isFinite(asset.volatility))) throw new Error("자산 가정값을 확인해 주세요.");

  const expectedReturn = assets.reduce((sum, asset) => sum + asset.weight * asset.expectedReturn, 0);
  let variance = 0;
  for (let i = 0; i < assets.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      variance += assets[i].weight * assets[j].weight * assets[i].volatility * assets[j].volatility * correlations[i][j];
    }
  }
  const volatility = Math.sqrt(Math.max(variance, 0));
  const weightedVolatility = assets.reduce((sum, asset) => sum + asset.weight * asset.volatility, 0);
  return { expectedReturn, volatility, variance, diversificationBenefit: weightedVolatility - volatility };
}
