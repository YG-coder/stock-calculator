/**
 * src/lib/montecarlo/index.ts
 * 공개 API 배럴.
 */

export * from "./types";
export { createRng, createNormalShock, createStudentTShock, SHOCK_TRUNCATION } from "./rng";
export type { Rng, ShockSampler } from "./rng";
export {
  toMonthlyParams,
  invertSigmaTable,
  maxVolatilityFor,
  createReturnGenerator,
  DEFAULT_SHOCK_DF,
  SIGMA_TABLE_U_MAX,
  SIGMA_M_MAX,
} from "./returns";
export type { ReturnGenerator, MonthlyParams } from "./returns";
export { createRunner, runSimulation, SAMPLE_PATH_COUNT } from "./engine";
export { validateInput, collectWarnings, SimulationInputError, LIMITS } from "./validate";
export {
  buildRequiredContributions,
  probabilityForContribution,
  requiredForProbability,
  countLessOrEqual,
} from "./affine";
export type { RequiredContributions } from "./affine";
export { quantileSorted, percentilesFromSorted, distributionFromSorted } from "./stats";
export { validateCorrelationMatrix, validateWeights, cholesky } from "./correlation";
export type { MatrixIssue } from "./correlation";
export { PORTFOLIO_PRESETS, DEFAULT_INFLATION, findPreset } from "./presets";
