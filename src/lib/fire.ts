import type { SimulationInput, SimulationResult } from "@/lib/montecarlo/types";

export interface FireValues {
  seed: number; paths: number; currentAge: number; retirementAge: number; planToAge: number;
  currentAssets: number; monthlyContribution: number; monthlyExpenses: number;
  expectedReturnPercent: number; volatilityPercent: number; inflationPercent: number;
}

export type FireField =
  | "seed" | "paths" | "currentAge" | "retirementAge" | "planToAge" | "currentAssets"
  | "monthlyContribution" | "monthlyExpenses" | "expectedReturn" | "volatility" | "inflation";

/** 화면 입력 원문. 빈칸("")과 직접 입력한 "0"을 구분하기 위해 문자열 그대로 받는다. */
export type FireFields = Record<FireField, string>;

export const FIRE_FIELD_LABELS: Record<FireField, string> = {
  seed: "결과 재현 번호",
  paths: "경로 수",
  currentAge: "현재 나이",
  retirementAge: "은퇴 목표 나이",
  planToAge: "계획 종료 나이",
  currentAssets: "현재 투자자산",
  monthlyContribution: "은퇴 전 월 투자금",
  monthlyExpenses: "현재 기준 월 생활비",
  expectedReturn: "연평균 수익률",
  volatility: "변동성",
  inflation: "연 물가상승률",
};

/** 빈칸이면 계산하지 않는 항목. 결과 재현 번호(seed)만 선택 입력이다. */
export const FIRE_REQUIRED_FIELDS: FireField[] = [
  "currentAge", "retirementAge", "planToAge", "currentAssets", "monthlyContribution",
  "monthlyExpenses", "expectedReturn", "volatility", "inflation", "paths",
];

export type FireParseResult =
  | { ok: true; values: FireValues; missingFields: []; errors: [] }
  | { ok: false; values: null; missingFields: FireField[]; errors: string[] };

const NON_NEGATIVE_MESSAGES: Partial<Record<FireField, string>> = {
  currentAssets: "현재 투자자산은 0원 이상이어야 합니다.",
  monthlyContribution: "은퇴 전 월 투자금은 0원 이상이어야 합니다. 이 계산기는 은퇴 전 인출을 지원하지 않습니다.",
  monthlyExpenses: "현재 기준 월 생활비는 0원 이상이어야 합니다. 생활비는 인출액이라 음수를 넣으면 입금으로 계산됩니다.",
  currentAge: "현재 나이는 0세 이상이어야 합니다.",
};

/**
 * FIRE 화면 입력 검증.
 *
 * Number("") === 0 이라 그대로 두면 빈칸이 자산·생활비·수익률 0 으로 조용히 계산되어
 * 성공률 100% 같은 정상 결과처럼 보인다. 필수 항목이 비어 있으면 계산하지 않고,
 * 사용자가 0 을 직접 입력한 경우에만 0 으로 계산한다.
 * 수익률·변동성·물가 범위와 기간 상한은 엔진 검증(validateInput)이 이어서 안내한다.
 */
export function parseFireFields(fields: FireFields): FireParseResult {
  const isBlank = (key: FireField) => fields[key].trim() === "";
  const missingFields = FIRE_REQUIRED_FIELDS.filter(isBlank);
  const errors: string[] = [];
  const num = (key: FireField) => (isBlank(key) ? Number.NaN : Number(fields[key]));

  for (const key of Object.keys(FIRE_FIELD_LABELS) as FireField[]) {
    if (!isBlank(key) && !Number.isFinite(Number(fields[key]))) {
      errors.push(`${FIRE_FIELD_LABELS[key]}에 숫자를 입력하세요.`);
    }
  }
  for (const [key, message] of Object.entries(NON_NEGATIVE_MESSAGES) as [FireField, string][]) {
    if (num(key) < 0) errors.push(message);
  }

  const current = num("currentAge");
  const retirement = num("retirementAge");
  const planTo = num("planToAge");
  if (Number.isFinite(current) && Number.isFinite(retirement) && retirement <= current) {
    errors.push("은퇴 나이는 현재 나이보다 커야 합니다.");
  } else if (Number.isFinite(retirement) && Number.isFinite(planTo) && planTo <= retirement) {
    errors.push("계획 종료 나이는 은퇴 나이보다 커야 합니다.");
  }

  if (missingFields.length > 0 || errors.length > 0) {
    return { ok: false, values: null, missingFields, errors };
  }

  return {
    ok: true,
    missingFields: [],
    errors: [],
    values: {
      seed: isBlank("seed") ? 0 : Number(fields.seed),
      paths: Number(fields.paths),
      currentAge: current,
      retirementAge: retirement,
      planToAge: planTo,
      currentAssets: Number(fields.currentAssets),
      monthlyContribution: Number(fields.monthlyContribution),
      monthlyExpenses: Number(fields.monthlyExpenses),
      expectedReturnPercent: Number(fields.expectedReturn),
      volatilityPercent: Number(fields.volatility),
      inflationPercent: Number(fields.inflation),
    },
  };
}

/** 빈 필수 항목 안내 문구. 0 은 직접 입력해야 한다는 점을 함께 알린다. */
export function fireMissingMessage(missingFields: FireField[]): string {
  return `다음 항목을 입력하세요: ${missingFields.map((key) => FIRE_FIELD_LABELS[key]).join(", ")}. 0이 맞다면 0을 직접 입력하세요.`;
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
    // 소수 나이(예: 35.5세 → 은퇴 234개월)면 은퇴 시점이 연 단위 그리드에 없으므로 따로 기록한다.
    recordMonths: [retirementMonth],
  };
}

/** 결과에서 은퇴 시점(적립 구간 종료 월) 밴드를 찾는다. 기록되지 않았으면 undefined. */
export function fireRetirementBand(result: SimulationResult) {
  const retirementMonth = result.input.cashFlow.phases?.[0]?.toMonth;
  if (retirementMonth === undefined) return undefined;
  return result.bands.find((band) => band.month === retirementMonth);
}

export function fireSuccessRate(result: SimulationResult): number {
  return 1 - (result.depletion?.rate ?? 0);
}

/**
 * 실행 입력 비교 키. 결과에 실려 온 `result.input`(그 결과를 계산한 입력)과
 * 현재 화면 입력으로 만든 엔진 입력을 같은 규칙으로 직렬화해 비교한다.
 * 계산에 쓰이는 값만 고정 순서로 담는다(phase label 같은 표시용 값은 제외).
 */
export function fireInputKey(input: SimulationInput): string {
  const r = input.returns;
  return JSON.stringify([
    input.seed, input.paths, input.months, input.initialBalance,
    (input.cashFlow.phases ?? []).map((p) => [p.fromMonth, p.toMonth, p.monthlyAmount, p.timing, p.inflationIndexed]),
    r.kind === "parametric" ? [r.kind, r.expectedReturn, r.volatility] : [r.kind],
    input.inflationRate, input.reportBasis, input.recordMonths ?? [],
  ]);
}

/**
 * 표시 중인 결과가 현재 입력의 결과인지 판정한다.
 *
 * - "current": 현재 입력으로 다시 계산해도 같은 엔진 입력이 된다.
 * - "stale":   입력을 바꿨거나, 필수 입력을 지웠거나, 잘못된 값(음수 등)이 들어 있다.
 *              계산 중에 입력을 바꾼 뒤 늦게 도착한 결과도 그 결과의 input 이 현재 입력과 달라 stale 이다.
 *
 * pathsCap: Web Worker 를 못 쓰는 브라우저의 메인 스레드 폴백은 경로 수를 낮춰 실행하므로
 * (worker-client 의 FALLBACK_MAX_PATHS) 그 상한을 넘겨 받아 같은 규칙으로 비교한다.
 */
export function fireResultState(result: SimulationResult, fields: FireFields, pathsCap?: number): "current" | "stale" {
  const key = fireCurrentInputKey(fields, pathsCap);
  return key !== null && key === fireInputKey(result.input) ? "current" : "stale";
}

/** 현재 화면 입력으로 실행했을 때의 비교 키. 입력이 유효하지 않으면 null. */
export function fireCurrentInputKey(fields: FireFields, pathsCap?: number): string | null {
  const parsed = parseFireFields(fields);
  if (!parsed.ok) return null;
  const input = buildFireInput(parsed.values);
  if (pathsCap !== undefined && input.paths > pathsCap) input.paths = pathsCap;
  return fireInputKey(input);
}

/**
 * 실행 요청 기준 비교 키. 사용자가 요청한 입력 그대로(경로 수 상한 적용 없음) 만든다.
 *
 * "재계산 중" 판정은 실행 요청과 현재 입력을 비교하는 일이라 엔진이 실제로 몇 경로를 돌렸는지와
 * 무관하다. 경로 수 상한(pathsCap)은 완료된 결과(result.input)와 비교할 때만 쓴다.
 * 요청 쪽에 상한을 섞으면 저장한 요청 키(10,000경로)와 현재 키(2,000경로)가 어긋나고,
 * 훅의 mode 도 첫 실행 전에는 "pending" 이라 요청 시점과 실행 중 시점의 상한이 달라질 수 있다.
 */
export function fireRequestKey(fields: FireFields): string | null {
  return fireCurrentInputKey(fields);
}

/** 계산 중이고, 마지막 실행 요청이 현재 입력과 같을 때만 true. 요청 후 입력을 바꾸면 false. */
export function fireIsRecalculating(status: string, submittedKey: string | null, fields: FireFields): boolean {
  if (status !== "running" || submittedKey === null) return false;
  return submittedKey === fireRequestKey(fields);
}

/** 계획 기간 표시. 결과를 계산한 실행 기간(result.input.months)을 넘긴다. 594 → "49년 6개월", 600 → "50년". */
export function formatFirePlanPeriod(months: number): string {
  const total = Math.round(months);
  const years = Math.floor(total / 12);
  const rest = total % 12;
  if (years === 0) return `${rest}개월`;
  return rest === 0 ? `${years}년` : `${years}년 ${rest}개월`;
}
