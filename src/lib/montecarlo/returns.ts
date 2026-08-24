/**
 * src/lib/montecarlo/returns.ts
 * 역할: 연 단위 입력(CAGR·변동성) → 월 로그 파라미터 변환의 **유일한 장소**.
 *       그리고 월별 수익 배수를 채우는 ReturnGenerator 구현.
 *
 * 엔진과 테스트는 이미 변환된 μ_m, σ_m 만 본다. 잔액·현금흐름은 알지 못한다.
 *
 * 변환 규칙 (docs/2026-08-21-montecarlo-engine-contract.md §3)
 *   입력 expectedReturn = 연 CAGR(기하평균, 명목, 총수익) — 산술평균이 아니다
 *   입력 volatility     = 연 변동성, **단순수익률 기준**
 *
 *   μ_m = ln(1 + CAGR) / 12                     ← 충격 분포와 무관
 *   σ_m = invertSigmaTable( σ / (1 + CAGR) )    ← 캘리브레이션 테이블 역보간
 *
 * 로그정규 폐형식 σ_log = sqrt(ln(1 + σ²/(1+CAGR)²)) 은 **쓰지 않는다.**
 * 산술평균 드리프트를 전제로 유도된 식이고, t 충격에서는 모멘트 관계가 성립하지 않는다.
 * 실측 오차는 σ 25% 구간에서 +2.65% 로 검증 허용치 2% 를 넘는다.
 */

import type { ReturnAssumption, ReturnSpec } from "./types";
import { createNormalShock, createStudentTShock, type Rng, type ShockSampler } from "./rng";
import {
  SIGMA_M_MAX,
  SIGMA_TABLE_DF,
  SIGMA_TABLE_POINTS,
  SIGMA_TABLE_U,
  sigmaMAt,
} from "./sigma-table";

export const DEFAULT_SHOCK_DF = SIGMA_TABLE_DF;

/** 테이블이 덮는 u = σ/(1+CAGR) 의 상한. 이 값을 넘는 입력은 거부한다. */
export const SIGMA_TABLE_U_MAX = SIGMA_TABLE_U[SIGMA_TABLE_POINTS - 1];

/**
 * u = 연 단순수익률 표준편차 / (1+CAGR) 를 월 로그 표준편차 σ_m 으로 되돌린다.
 * 테이블은 단조증가이므로 이분 탐색 + 선형 보간으로 충분하다(최대 상대오차 5e-6).
 */
export function invertSigmaTable(u: number): number {
  if (!Number.isFinite(u) || u < 0) {
    throw new RangeError(`변동성 비율이 유효하지 않습니다: u=${u}`);
  }
  if (u === 0) return 0;
  if (u > SIGMA_TABLE_U_MAX) {
    throw new RangeError(
      `변동성이 캘리브레이션 범위를 벗어납니다: σ/(1+CAGR)=${u.toFixed(4)} > ${SIGMA_TABLE_U_MAX.toFixed(4)}`
    );
  }
  let lo = 0;
  let hi = SIGMA_TABLE_POINTS - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (SIGMA_TABLE_U[mid] <= u) lo = mid;
    else hi = mid;
  }
  const uLo = SIGMA_TABLE_U[lo];
  const uHi = SIGMA_TABLE_U[hi];
  const frac = uHi === uLo ? 0 : (u - uLo) / (uHi - uLo);
  return sigmaMAt(lo) + frac * (sigmaMAt(hi) - sigmaMAt(lo));
}

export interface MonthlyParams {
  /** 월 로그 드리프트. */
  muM: number;
  /** 월 로그 표준편차. */
  sigmaM: number;
}

/**
 * 연 입력 → 월 파라미터. 프로젝트 전체에서 이 변환은 여기서만 일어난다.
 * @param cagr        연 CAGR(기하평균, 명목). 예: 0.07
 * @param sigmaSimple 연 변동성(단순수익률 기준). 예: 0.15
 */
export function toMonthlyParams(cagr: number, sigmaSimple: number): MonthlyParams {
  if (!Number.isFinite(cagr) || cagr <= -1) {
    throw new RangeError(`CAGR 이 유효하지 않습니다: ${cagr}`);
  }
  if (!Number.isFinite(sigmaSimple) || sigmaSimple < 0) {
    throw new RangeError(`변동성이 유효하지 않습니다: ${sigmaSimple}`);
  }
  return {
    muM: Math.log(1 + cagr) / 12,
    sigmaM: invertSigmaTable(sigmaSimple / (1 + cagr)),
  };
}

/** 테이블 상한(σ_m = SIGMA_M_MAX)에서 이 CAGR 이 커버하는 입력 σ 의 최대값. */
export function maxVolatilityFor(cagr: number): number {
  return SIGMA_TABLE_U_MAX * (1 + cagr);
}

export { SIGMA_M_MAX };

/* ============================================================
   ReturnGenerator
   ============================================================ */

/**
 * 월별 수익 **배수**(1 + 수익률)를 채운다.
 *
 * 다자산(6단계)은 `{ kind: "multi-asset", weights, correlations }` 를
 * ReturnSpec 유니온에 추가하고 이 인터페이스의 구현을 하나 더 만드는 것으로 끝난다.
 * 엔진은 ReturnGenerator 만 알므로 수정되지 않는다.
 */
export interface ReturnGenerator {
  /** out[m] = 월 수익 배수. 할당 없이 out 을 재사용한다. */
  fillPath(out: Float64Array, rng: Rng): void;
  describe(): ReturnAssumption;
  /** |z| > 8 로 재추출한 누적 횟수. */
  readonly truncatedShocks: number;
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export function createReturnGenerator(spec: ReturnSpec): ReturnGenerator {
  if (spec.kind === "bootstrap") {
    // 8단계(/lab) 예약. 데이터셋 라이선스가 확정되기 전에는 구현하지 않는다.
    throw new RangeError(
      "bootstrap ReturnGenerator 는 아직 구현되지 않았습니다 (8단계 /lab 백테스트)."
    );
  }

  const { muM, sigmaM } = toMonthlyParams(spec.expectedReturn, spec.volatility);
  const shockSpec = spec.shock ?? { type: "student-t", df: DEFAULT_SHOCK_DF };
  const expMu = Math.exp(muM);

  let sampler: ShockSampler | null = null;
  let boundRng: Rng | null = null;

  const ensure = (rng: Rng): ShockSampler => {
    if (sampler && boundRng === rng) return sampler;
    if (sampler && boundRng !== rng) {
      throw new Error("ReturnGenerator 는 하나의 Rng 인스턴스에만 바인딩됩니다.");
    }
    boundRng = rng;
    sampler =
      shockSpec.type === "normal"
        ? createNormalShock(rng)
        : createStudentTShock(rng, shockSpec.df);
    return sampler;
  };

  return {
    fillPath(out: Float64Array, rng: Rng): void {
      const s = ensure(rng);
      // σ = 0 이면 충격이 소거되어 결정론적으로 (1+CAGR)^(1/12) 가 된다.
      if (sigmaM === 0) {
        out.fill(expMu);
        return;
      }
      // 충격을 한 번의 호출로 채운 뒤 배수로 변환한다. 두 번의 타이트 루프가
      // 월마다 클로저를 호출하는 것보다 크게 빠르다.
      const n = out.length;
      s.fill(out, n);
      for (let m = 0; m < n; m++) {
        out[m] = expMu * Math.exp(sigmaM * out[m]);
      }
    },
    describe(): ReturnAssumption {
      const shockLabel =
        shockSpec.type === "normal"
          ? "정규분포 (|z|≤8 재추출)"
          : `Student's t (df ${shockSpec.df}, |z|≤8 재추출)`;
      return {
        kind: "parametric",
        label: `연 ${pct(spec.expectedReturn)}(CAGR, 명목) · 변동성 ${pct(spec.volatility)}(단순수익률 기준)`,
        shockLabel,
        muM,
        sigmaM,
        returnBasis: "total-return",
      };
    },
    get truncatedShocks() {
      return sampler ? sampler.truncated : 0;
    },
  };
}
