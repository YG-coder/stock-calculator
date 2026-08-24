/**
 * src/lib/montecarlo/affine.ts
 * 역할: 아핀 분해 계수(A, B)로부터 목표 역산. 시뮬레이션을 돌리지 않는다.
 *
 * 한 경로의 월 수익 배수를 고정하면 종말자산은 납입 수준 c 에 대해 아핀이다.
 *
 *   W_T(c) = A_j + c · B_j
 *     A_j : 초기자산 + 일시금(overrides) 이 만기까지 불어난 값 — c 와 무관
 *     B_j : 월 1원 납입이 만기까지 누적된 값 — 현금흐름 "형상"에만 의존
 *
 * 따라서 경로 j 는 c ≥ c_j = (W* − A_j)/B_j 일 때 성공한다 (B_j > 0).
 * 성공확률은 {c_j} 의 경험적 CDF 이고, 목표 확률 p 의 최소 납입액은 그 p 분위수다.
 *
 * ⚠ 분위수 방향 — p 분위수이지 1−p 가 아니다. 90% 목표면 c_j 의 90번째 백분위수를 쓴다.
 *   뒤집혀도 그럴듯한 숫자가 나오므로 눈으로는 잡히지 않는다. 테스트로 잡는다.
 *
 * ⚠ 선형성 전제 — 잔액이 0 에 클램프되거나 경로 의존 규칙(리밸런싱·실현과세)이
 *   들어가면 깨진다. 엔진이 clamped 를 감지하면 A/B 를 아예 만들지 않는다.
 */

export interface RequiredContributions {
  /** B_j > 0 인 경로들의 필요 납입액. 오름차순 정렬. */
  sorted: Float64Array;
  /** B_j <= 0 이라 c 와 무관하게 성패가 고정된 경로 수. */
  fixedCount: number;
  /** 그중 A_j >= W* 로 이미 성공인 경로 수. */
  fixedSuccesses: number;
  /** 전체 경로 수. */
  totalPaths: number;
}

/**
 * @param targetNominal 목표 금액. A·B 와 같은 **명목** 기준이어야 한다.
 */
export function buildRequiredContributions(
  A: Float64Array,
  B: Float64Array,
  targetNominal: number
): RequiredContributions {
  const n = A.length;
  const buf = new Float64Array(n);
  let k = 0;
  let fixedCount = 0;
  let fixedSuccesses = 0;

  for (let j = 0; j < n; j++) {
    const b = B[j];
    if (b > 0) {
      buf[k++] = (targetNominal - A[j]) / b;
    } else {
      fixedCount++;
      if (A[j] >= targetNominal) fixedSuccesses++;
    }
  }
  const sorted = buf.subarray(0, k);
  sorted.sort();
  return { sorted, fixedCount, fixedSuccesses, totalPaths: n };
}

/**
 * 납입액 c 에서의 성공확률. 정렬 배열 위 이진 탐색 O(log N).
 * 재시뮬레이션 없음 — 슬라이더가 실시간으로 움직일 수 있는 이유다.
 */
export function probabilityForContribution(rc: RequiredContributions, c: number): number {
  if (rc.totalPaths === 0) return Number.NaN;
  return (countLessOrEqual(rc.sorted, c) + rc.fixedSuccesses) / rc.totalPaths;
}

/** sorted 에서 value 이하인 원소 개수. */
export function countLessOrEqual(sorted: Float64Array, value: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * 목표 확률 p 를 만족하는 **최소** 월 납입액.
 *
 * 고정 경로가 없을 때는 계약 문서와 같은 식이 된다: 인덱스 ceil(p·N) − 1.
 * 고정 경로가 있으면 그만큼 필요한 순위가 줄어든다.
 *   필요 성공 수 k = ceil(p·N) − fixedSuccesses
 *   k ≤ 0            → 납입 없이도 목표 확률 달성 (0 반환)
 *   k > sorted.length → 어떤 납입액으로도 도달 불가 (null 반환)
 */
export function requiredForProbability(
  rc: RequiredContributions,
  p: number
): number | null {
  const n = rc.totalPaths;
  if (n === 0) return null;
  if (p <= 0) return 0;
  const need = Math.ceil(p * n) - rc.fixedSuccesses;
  if (need <= 0) return 0;
  if (need > rc.sorted.length) return null;
  const c = rc.sorted[need - 1];
  return c > 0 ? c : 0;
}
