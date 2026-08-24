/**
 * src/lib/montecarlo/stats.ts
 * 역할: 정렬·백분위·분포 요약. 도메인 의미를 모른다.
 *
 * 백분위 정의를 **두 가지로 나누어 고정**한다. 목적이 다르기 때문이다.
 *  1) 보고용(bands·terminal·depletion): 선형 보간(R type 7).
 *     인접 순서통계량 사이를 잇는 연속 추정치라 표시가 매끄럽다.
 *  2) 역산용(affine.ts): 최근접 순위(ceil). "목표 확률을 만족하는 최소 납입액"은
 *     보간값이 아니라 실제로 그 확률을 달성하는 값이어야 한다.
 */

import type { Distribution, Percentiles } from "./types";

/** 오름차순 정렬된 배열에서 p 분위수(0~1). R type 7 선형 보간. */
export function quantileSorted(sorted: Float64Array, len: number, p: number): number {
  if (len <= 0) return Number.NaN;
  if (len === 1) return sorted[0];
  const h = (len - 1) * Math.min(1, Math.max(0, p));
  const lo = Math.floor(h);
  const hi = Math.min(lo + 1, len - 1);
  return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo]);
}

export function percentilesFromSorted(sorted: Float64Array, len: number): Percentiles {
  return {
    p5: quantileSorted(sorted, len, 0.05),
    p10: quantileSorted(sorted, len, 0.1),
    p25: quantileSorted(sorted, len, 0.25),
    p50: quantileSorted(sorted, len, 0.5),
    p75: quantileSorted(sorted, len, 0.75),
    p90: quantileSorted(sorted, len, 0.9),
    p95: quantileSorted(sorted, len, 0.95),
  };
}

/**
 * 분포 요약.
 * mean 은 참고용이다 — Student's t 충격에서 exp 의 기댓값이 발산해
 * 표본 평균이 극단 경로 몇 개에 좌우된다. 화면에서 강조하지 않는다.
 */
export function distributionFromSorted(sorted: Float64Array, len: number): Distribution {
  if (len <= 0) {
    const nan = Number.NaN;
    return {
      min: nan, max: nan, mean: nan,
      p5: nan, p10: nan, p25: nan, p50: nan, p75: nan, p90: nan, p95: nan,
    };
  }
  // Kahan 합 — 10,000개 이상에서 단순 합의 누적 오차를 줄인다.
  let sum = 0;
  let comp = 0;
  for (let i = 0; i < len; i++) {
    const y = sorted[i] - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return {
    ...percentilesFromSorted(sorted, len),
    min: sorted[0],
    max: sorted[len - 1],
    mean: sum / len,
  };
}
