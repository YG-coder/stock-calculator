/**
 * src/lib/montecarlo/validate.ts
 * 역할: 시뮬레이션 입력 검증. 조용한 치환을 하지 않는다.
 *
 * 기존 계산기 감사에서 나온 교훈을 그대로 적용한다 —
 * 빈칸·음수·비현실적 값은 0 으로 바꿔 계산하지 말고 **거부하거나 명시적으로 알린다.**
 */

import type { SimulationInput, ValidationIssue } from "./types";
import { SIGMA_TABLE_U_MAX, maxVolatilityFor } from "./returns";

export const LIMITS = {
  paths: { min: 1, max: 50_000 },
  months: { min: 1, max: 720 },
  cagr: { min: -0.5, max: 0.5 },
  volatility: { min: 0, max: 0.45 },
  inflation: { min: -0.1, max: 0.5 },
} as const;

export class SimulationInputError extends Error {
  readonly issues: ValidationIssue[];
  constructor(issues: ValidationIssue[]) {
    super(issues.map((i) => `${i.field}: ${i.message}`).join(" / "));
    this.name = "SimulationInputError";
    this.issues = issues;
  }
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function validateInput(input: SimulationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const bad = (field: string, message: string) => issues.push({ field, message });

  if (!isNum(input.seed)) bad("seed", "시드는 유한한 숫자여야 합니다.");

  if (!isNum(input.paths) || !Number.isInteger(input.paths)) {
    bad("paths", "경로 수는 정수여야 합니다.");
  } else if (input.paths < LIMITS.paths.min || input.paths > LIMITS.paths.max) {
    bad("paths", `경로 수는 ${LIMITS.paths.min}~${LIMITS.paths.max} 범위여야 합니다.`);
  }

  if (!isNum(input.months) || !Number.isInteger(input.months)) {
    bad("months", "기간(개월)은 정수여야 합니다.");
  } else if (input.months < LIMITS.months.min || input.months > LIMITS.months.max) {
    bad("months", `기간은 ${LIMITS.months.min}~${LIMITS.months.max}개월 범위여야 합니다.`);
  }

  if (!isNum(input.initialBalance)) bad("initialBalance", "초기 자산은 유한한 숫자여야 합니다.");
  else if (input.initialBalance < 0) bad("initialBalance", "초기 자산은 0 이상이어야 합니다.");

  if (!isNum(input.inflationRate)) {
    bad("inflationRate", "물가상승률은 유한한 숫자여야 합니다.");
  } else if (
    input.inflationRate <= -1 ||
    input.inflationRate < LIMITS.inflation.min ||
    input.inflationRate > LIMITS.inflation.max
  ) {
    bad(
      "inflationRate",
      `물가상승률은 ${LIMITS.inflation.min * 100}%~${LIMITS.inflation.max * 100}% 범위여야 합니다.`
    );
  }

  if (input.reportBasis !== "nominal" && input.reportBasis !== "real") {
    bad("reportBasis", '표시 기준은 "nominal" 또는 "real" 이어야 합니다.');
  }

  // ---- 현금흐름 ----
  const cf = input.cashFlow;
  if (!cf) {
    bad("cashFlow", "현금흐름 설정이 필요합니다.");
  } else {
    if (!isNum(cf.monthlyAmount)) bad("cashFlow.monthlyAmount", "월 금액은 유한한 숫자여야 합니다.");
    if (cf.timing !== "start" && cf.timing !== "end") {
      bad("cashFlow.timing", '적용 시점은 "start" 또는 "end" 여야 합니다.');
    }
    if (typeof cf.inflationIndexed !== "boolean") {
      bad("cashFlow.inflationIndexed", "물가 연동 여부는 true/false 여야 합니다.");
    }
    const months = isNum(input.months) ? input.months : 0;
    if (cf.fromMonth !== undefined) {
      if (!Number.isInteger(cf.fromMonth) || cf.fromMonth < 0 || cf.fromMonth > months) {
        bad("cashFlow.fromMonth", `시작 월은 0~${months} 범위의 정수여야 합니다.`);
      }
    }
    if (cf.toMonth !== undefined) {
      if (!Number.isInteger(cf.toMonth) || cf.toMonth < 0 || cf.toMonth > months) {
        bad("cashFlow.toMonth", `종료 월은 0~${months} 범위의 정수여야 합니다.`);
      }
    }
    if (
      cf.fromMonth !== undefined &&
      cf.toMonth !== undefined &&
      cf.fromMonth >= cf.toMonth
    ) {
      bad("cashFlow.toMonth", "종료 월은 시작 월보다 커야 합니다(반열림 구간).");
    }
    if (cf.overrides) {
      for (const [key, value] of Object.entries(cf.overrides)) {
        const m = Number(key);
        if (!Number.isInteger(m) || m < 0 || m >= months) {
          bad("cashFlow.overrides", `월 인덱스가 범위를 벗어났습니다: ${key}`);
        }
        if (!isNum(value)) {
          bad("cashFlow.overrides", `${key}월 금액이 유한한 숫자가 아닙니다.`);
        }
      }
    }
    if (cf.phases) {
      if (!Array.isArray(cf.phases) || cf.phases.length === 0) {
        bad("cashFlow.phases", "다단계 현금흐름은 한 개 이상의 구간이 필요합니다.");
      } else {
        const sorted = [...cf.phases].sort((a, b) => a.fromMonth - b.fromMonth);
        sorted.forEach((phase, index) => {
          const field = `cashFlow.phases.${index}`;
          if (!Number.isInteger(phase.fromMonth) || !Number.isInteger(phase.toMonth) || phase.fromMonth < 0 || phase.toMonth > months || phase.fromMonth >= phase.toMonth) bad(field, `구간은 0~${months} 안의 유효한 반열림 범위여야 합니다.`);
          if (!isNum(phase.monthlyAmount)) bad(`${field}.monthlyAmount`, "월 금액은 유한한 숫자여야 합니다.");
          if (phase.timing !== "start" && phase.timing !== "end") bad(`${field}.timing`, '적용 시점은 "start" 또는 "end" 여야 합니다.');
          if (typeof phase.inflationIndexed !== "boolean") bad(`${field}.inflationIndexed`, "물가 연동 여부는 true/false 여야 합니다.");
          if (index > 0 && sorted[index - 1].toMonth > phase.fromMonth) bad("cashFlow.phases", "다단계 현금흐름 구간은 서로 겹칠 수 없습니다.");
        });
      }
      if (cf.monthlyAmount !== 0) {
        bad("cashFlow.monthlyAmount", "다단계 현금흐름(phases)을 사용할 때 monthlyAmount는 0이어야 합니다. 각 구간의 monthlyAmount를 사용하세요.");
      }
    }
  }

  // ---- 수익률 ----
  const r = input.returns;
  if (!r) {
    bad("returns", "수익률 설정이 필요합니다.");
  } else if (r.kind === "bootstrap") {
    bad(
      "returns.kind",
      "bootstrap(과거 데이터 부트스트랩)은 아직 구현되지 않았습니다. 8단계 /lab 백테스트에서 지원 예정입니다."
    );
  } else if (r.kind !== "parametric") {
    bad("returns.kind", "알 수 없는 수익률 생성 방식입니다.");
  } else {
    if (!isNum(r.expectedReturn)) {
      bad("returns.expectedReturn", "기대수익률(CAGR)은 유한한 숫자여야 합니다.");
    } else if (r.expectedReturn < LIMITS.cagr.min || r.expectedReturn > LIMITS.cagr.max) {
      bad(
        "returns.expectedReturn",
        `기대수익률(CAGR)은 ${LIMITS.cagr.min * 100}%~${LIMITS.cagr.max * 100}% 범위여야 합니다.`
      );
    }
    if (!isNum(r.volatility)) {
      bad("returns.volatility", "변동성은 유한한 숫자여야 합니다.");
    } else if (r.volatility < LIMITS.volatility.min || r.volatility > LIMITS.volatility.max) {
      bad(
        "returns.volatility",
        `변동성은 ${LIMITS.volatility.min * 100}%~${LIMITS.volatility.max * 100}% 범위여야 합니다.`
      );
    }
    // 캘리브레이션 테이블은 σ/(1+CAGR) 로 인덱싱된다.
    // 두 값이 각각 범위 안이어도 조합이 테이블을 벗어날 수 있다(특히 CAGR 이 음수일 때).
    if (isNum(r.expectedReturn) && isNum(r.volatility) && r.expectedReturn > -1) {
      const u = r.volatility / (1 + r.expectedReturn);
      if (u > SIGMA_TABLE_U_MAX) {
        bad(
          "returns.volatility",
          `이 기대수익률에서는 변동성 상한이 ${(maxVolatilityFor(r.expectedReturn) * 100).toFixed(1)}% 입니다. ` +
            "캘리브레이션 테이블 범위를 벗어나므로 값을 낮추거나 기대수익률을 올려주세요."
        );
      }
    }
    if (r.shock) {
      if (r.shock.type === "student-t") {
        if (!isNum(r.shock.df) || r.shock.df <= 2) {
          bad("returns.shock.df", "Student's t 자유도는 2보다 커야 합니다.");
        } else if (r.shock.df !== 6) {
          bad(
            "returns.shock.df",
            "v1 캘리브레이션 테이블은 df=6 기준입니다. 다른 값을 쓰려면 테이블을 다시 생성해야 합니다."
          );
        }
      } else if (r.shock.type !== "normal") {
        bad("returns.shock.type", "알 수 없는 충격 분포입니다.");
      }
    }
  }

  // ---- 목표 ----
  const goal = input.goal;
  if (goal) {
    if (goal.kind !== "terminal-target") {
      bad(
        "goal.kind",
        `v1 은 "terminal-target" 만 지원합니다. "${goal.kind}" 는 이후 단계(FIRE·SoRR)에서 구현됩니다.`
      );
    } else if (!isNum(goal.targetAmount)) {
      bad("goal.targetAmount", "목표 금액은 유한한 숫자여야 합니다.");
    } else if (goal.targetAmount < 0) {
      bad("goal.targetAmount", "목표 금액은 0 이상이어야 합니다.");
    }
    if (goal.targetProbability !== undefined) {
      if (!isNum(goal.targetProbability)) {
        bad("goal.targetProbability", "목표 확률은 유한한 숫자여야 합니다.");
      } else if (goal.targetProbability <= 0 || goal.targetProbability >= 1) {
        bad("goal.targetProbability", "목표 확률은 0과 1 사이여야 합니다.");
      }
      if (input.cashFlow?.phases?.length) {
        bad("goal.targetProbability", "다단계 현금흐름의 필요 납입액 역산은 아직 지원하지 않습니다. 단일 현금흐름을 사용하세요.");
      }
    }
  }

  return issues;
}

/** 결과에 동봉할 경고. 계산을 막지는 않지만 화면에 반드시 노출한다. */
export function collectWarnings(input: SimulationInput): string[] {
  const warnings: string[] = [
    "수익률은 배당을 재투자한 총수익 기준입니다. 세금과 거래비용은 반영하지 않았습니다.",
    "성공확률은 입력한 가정에 대한 조건부 확률입니다. 실제 결과를 보장하지 않습니다.",
  ];

  if (input.paths < 1_000) {
    warnings.push("경로 수가 1,000 미만이라 백분위가 불안정할 수 있습니다.");
  }
  if (input.reportBasis === "real" && input.inflationRate === 0) {
    warnings.push("물가상승률이 0이므로 실질 기준과 명목 기준이 같습니다.");
  }
  const hasOverride = Object.values(input.cashFlow?.overrides ?? {}).some((v) => v !== 0);
  const hasPhaseFlow = input.cashFlow?.phases?.some((phase) => phase.monthlyAmount !== 0) ?? false;
  if (
    input.initialBalance === 0 &&
    input.cashFlow?.monthlyAmount === 0 &&
    !hasOverride &&
    !hasPhaseFlow
  ) {
    warnings.push("초기 자산과 현금흐름이 모두 0이라 모든 경로가 0으로 유지됩니다.");
  }
  if (input.returns.kind === "parametric" && input.returns.volatility === 0) {
    warnings.push("변동성이 0이므로 몬테카를로가 아니라 결정론적 복리 계산입니다.");
  }
  return warnings;
}
