import { buildDcaInput, type DcaFormValues } from "@/lib/dca";
import type { SimulationInput } from "@/lib/montecarlo/types";

export interface GoalProbabilityValues extends DcaFormValues {
  targetAmount: number;
  targetProbabilityPercent: number;
}

export function buildGoalProbabilityInput(values: GoalProbabilityValues): SimulationInput {
  return {
    ...buildDcaInput(values),
    goal: {
      kind: "terminal-target",
      targetAmount: values.targetAmount,
      targetProbability: values.targetProbabilityPercent / 100,
    },
  };
}
