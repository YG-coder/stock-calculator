import { buildDcaInput, type DcaFormValues } from "@/lib/dca";
import type { SimulationInput } from "@/lib/montecarlo/types";

export interface GoalProbabilityValues extends DcaFormValues {
  targetAmount: number;
  targetProbabilityPercent: number;
  /** 화면에서 입력한 목표 퍼센트 문자열. 있으면 엔진이 이 값으로 필요 성공 경로 수를 정확히 계산한다. */
  targetProbabilityPercentText?: string;
}

export function buildGoalProbabilityInput(values: GoalProbabilityValues): SimulationInput {
  return {
    ...buildDcaInput(values),
    goal: {
      kind: "terminal-target",
      targetAmount: values.targetAmount,
      targetProbability: values.targetProbabilityPercent / 100,
      ...(values.targetProbabilityPercentText === undefined ? {} : { targetProbabilityPercentText: values.targetProbabilityPercentText }),
    },
  };
}
