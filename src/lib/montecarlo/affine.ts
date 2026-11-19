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

import { compare, div, floor, fromBigInt, fromInt, mul, parseNumberExact } from "@/lib/exactDecimal";
import { normalizePercentInput } from "@/lib/number";

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
 * 목표 달성에 필요한 **최소 성공 경로 수**. 목표가 어떤 형태로 왔는지에 따라 두 함수로 나눈다.
 *
 * 부동소수 한 가지 식으로는 둘 다 맞출 수 없다.
 *  - ceil(p·n): 0.56 × 10000 = 5600.000000000001 → 5,601 (56% 에 한 경로를 더 요구)
 *  - k / n ≥ p 를 화면 입력에 적용: 56.7 ÷ 100 = 0.5670000000000001 인데 5670 ÷ 10000 = 0.567 → 5,671
 *  - ÷ 100 뒤에 십진 목표를 복원: 56.7 과 56.70000000000001 은 서로 다른 입력인데 ÷ 100 하면 같은 숫자가 되어
 *    구분할 수 없다(뒤의 목표에 5,670개만 요구하게 된다).
 * 일정한 오차를 빼거나 자릿수를 정해 반올림하는 방식은 가까운 두 목표를 합치므로 쓰지 않는다.
 *
 * 1) requiredSuccessCountForPercent — 사용자가 입력한 **퍼센트 문자열**이 있을 때.
 *    k = ceil(퍼센트 × n ÷ 100) 을 문자열에서 읽은 정확한 유리수(BigInt)로 계산한다. 자릿수 손실이 없다.
 *    n 은 실제 실행한 경로 수다(Worker 10,000경로든 대체 실행 2,000경로든 같은 규칙).
 * 2) requiredSuccessCount — 숫자 비율을 직접 받을 때(내부 호출: 민감도 표의 0.5·0.7·0.8·0.9 등).
 *    엔진과 probabilityForContribution 이 성공확률을 (성공 수 ÷ 경로 수)로 보고하므로, 같은 식으로
 *    "k 개 성공 시 보고되는 확률이 p 이상인가"를 k / n ≥ p 로 판정한다. 엔진이 보고한 비율(예: 1 ÷ 300)을
 *    그대로 목표로 넣으면 그 성공 수(1)가 나온다.
 * 목표가 100% 를 넘으면 n 보다 큰 값을 돌려준다(도달 불가).
 */
export function requiredSuccessCountForPercent(percentText: string, n: number): number | null {
  const normalized = normalizePercentInput(percentText);
  const percent = normalized === null ? null : parseNumberExact(normalized);
  if (percent === null) return null;
  const exact = div(mul(percent, fromInt(n)), fromInt(100));
  const whole = floor(exact);
  const isInteger = compare(fromBigInt(whole), exact) === 0;
  return Number(whole) + (isInteger ? 0 : 1);
}

export function requiredSuccessCount(p: number, n: number): number {
  let k = Math.ceil(p * n);
  while (k > 0 && (k - 1) / n >= p) k -= 1;
  while (k <= n && k / n < p) k += 1;
  return k;
}

/**
 * 목표 확률 p 를 만족하는 **최소** 월 납입액.
 *
 * 고정 경로가 없을 때는 필요 성공 수 번째로 작은 필요 납입액이다(대개 인덱스 ceil(p·N) − 1).
 * 고정 경로가 있으면 그만큼 필요한 순위가 줄어든다.
 *   필요 성공 수 k = (퍼센트 문자열이 있으면 requiredSuccessCountForPercent, 없으면 requiredSuccessCount) − fixedSuccesses
 *
 * @param percentText 사용자가 입력한 목표 퍼센트 문자열. 있으면 p 대신 이 값으로 필요 성공 수를 정한다.
 *   k ≤ 0            → 납입 없이도 목표 확률 달성 (0 반환)
 *   k > sorted.length → 어떤 납입액으로도 도달 불가 (null 반환)
 */
export function requiredForProbability(
  rc: RequiredContributions,
  p: number,
  percentText?: string
): number | null {
  const n = rc.totalPaths;
  if (n === 0) return null;
  if (p <= 0) return 0;
  const fromText = percentText === undefined ? null : requiredSuccessCountForPercent(percentText, n);
  const need = (fromText ?? requiredSuccessCount(p, n)) - rc.fixedSuccesses;
  if (need <= 0) return 0;
  if (need > rc.sorted.length) return null;
  const c = rc.sorted[need - 1];
  return c > 0 ? c : 0;
}
