/**
 * src/lib/montecarlo/rng.ts
 * 역할: 시드 기반 난수와 단위분산 충격(z) 생성. 금융 개념을 모른다.
 *
 * - Math.random() 은 시드를 줄 수 없어 쓰지 않는다.
 * - 생성기: xoshiro128** (32비트 4워드 상태), 시드 확장은 splitmix32.
 *   상태를 int32 로 유지하고 출력에서만 부호를 없앤다. 비트 패턴은 동일하고
 *   불필요한 uint32 변환이 사라져 2배 이상 빠르다(핫 루프에서 지배적인 비용).
 * - 정규난수: Marsaglia polar(Box–Muller 극좌표형). 두 번째 값을 캐시한다.
 * - Student's t: t_v = Z / sqrt(V/v), V ~ chi2(v).
 *   짝수 v 는 지수분포 v/2 개의 합으로 만든다 — 로그 1회로 끝난다.
 * - 단위분산 보정: z = t_v * sqrt((v-2)/v). 이 보정을 빼면 df 6 에서 σ 가 약 1.22배 부푼다.
 * - 수치 안전장치: |z| > 8 이면 재추출하고 횟수를 센다(정합성 경보용).
 */

export const SHOCK_TRUNCATION = 8;

export interface Rng {
  /** 32비트 부호 없는 정수. */
  nextUint32(): number;
  /** (0, 1) 개구간 균등난수. log 에 바로 넣어도 안전하다. */
  nextFloat(): number;
  /** 표준정규 N(0,1). */
  nextNormal(): number;
}

const INV_2_24 = 5.960464477539063e-8;

function rotl(x: number, k: number): number {
  return (x << k) | (x >>> (32 - k));
}

function splitmix32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    t = t ^ (t >>> 15);
    return t >>> 0;
  };
}

/**
 * 시드 하나로 xoshiro128** 상태를 만든다.
 * seed 는 32비트 부호 없는 정수로 해석한다(부동소수·음수도 안전하게 접는다).
 */
export function createRng(seed: number): Rng {
  const normalized = (Math.floor(Math.abs(seed)) % 0x1_0000_0000) >>> 0;
  const mix = splitmix32(normalized === 0 ? 0x9e3779b9 : normalized);

  let s0 = mix() | 0;
  let s1 = mix() | 0;
  let s2 = mix() | 0;
  let s3 = mix() | 0;
  // 전 상태가 0 이면 영원히 0 을 뱉는다. 실질적으로 불가능하지만 막아둔다.
  if ((s0 | s1 | s2 | s3) === 0) s0 = 0x9e3779b9 | 0;

  let hasCachedNormal = false;
  let cachedNormal = 0;

  /** 내부용 — int32 를 그대로 돌려준다(비트 패턴은 uint32 와 동일). */
  const nextInt32 = (): number => {
    const result = Math.imul(rotl(Math.imul(s1, 5), 7), 9);
    const t = s1 << 9;
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = rotl(s3, 11);
    return result;
  };

  const nextUint32 = (): number => nextInt32() >>> 0;

  // (0,1) 개구간: 24비트 해상도 격자의 중점을 쓴다.
  const nextFloat = (): number => ((nextInt32() >>> 8) + 0.5) * INV_2_24;

  const nextNormal = (): number => {
    if (hasCachedNormal) {
      hasCachedNormal = false;
      return cachedNormal;
    }
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = 2 * nextFloat() - 1;
      v = 2 * nextFloat() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const m = Math.sqrt((-2 * Math.log(s)) / s);
    cachedNormal = v * m;
    hasCachedNormal = true;
    return u * m;
  };

  return { nextUint32, nextFloat, nextNormal };
}

/**
 * 단위분산 충격 생성기.
 * truncated 는 |z| > 8 로 재추출한 횟수 — 이론값과 크게 다르면 RNG·보정을 의심한다.
 *
 * fill() 은 한 경로분을 한 번의 호출로 채운다. 월마다 next() 를 부르면
 * 클로저 호출 오버헤드가 난수 생성 자체만큼 커진다(실측 약 +55%).
 */
export interface ShockSampler {
  next(): number;
  fill(out: Float64Array, count: number): void;
  readonly truncated: number;
  readonly label: string;
}

/** next() 를 fill() 하나로 구현해 두 경로가 갈리지 않게 한다. */
function withNext(
  fill: (out: Float64Array, count: number) => void,
  truncatedRef: () => number,
  label: string
): ShockSampler {
  const scratch = new Float64Array(1);
  return {
    next(): number {
      fill(scratch, 1);
      return scratch[0];
    },
    fill,
    get truncated() {
      return truncatedRef();
    },
    label,
  };
}

export function createNormalShock(rng: Rng): ShockSampler {
  let truncated = 0;
  const nextNormal = rng.nextNormal;
  const fill = (out: Float64Array, count: number): void => {
    for (let i = 0; i < count; i++) {
      let z = nextNormal();
      while (z > SHOCK_TRUNCATION || z < -SHOCK_TRUNCATION) {
        truncated++;
        z = nextNormal();
      }
      out[i] = z;
    }
  };
  return withNext(fill, () => truncated, `정규분포 (|z|≤${SHOCK_TRUNCATION} 재추출)`);
}

/**
 * Student's t 충격. df > 2 필수 (df ≤ 2 는 분산이 존재하지 않는다).
 * v1 은 df = 6 전역 고정이며 캘리브레이션 테이블도 df 6 기준이다.
 */
export function createStudentTShock(rng: Rng, df: number): ShockSampler {
  if (!Number.isFinite(df) || df <= 2) {
    throw new RangeError(`Student's t 의 자유도는 2보다 커야 합니다: df=${df}`);
  }
  const scale = Math.sqrt((df - 2) / df); // 단위분산 보정
  const halfDf = df / 2;
  const evenDf = Number.isInteger(halfDf);
  const nextNormal = rng.nextNormal;
  const nextFloat = rng.nextFloat;
  let truncated = 0;

  // 일반 df: Marsaglia–Tsang gamma(shape>1). chi2(df) = 2 * gamma(df/2).
  const gammaMT = (shape: number): number => {
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    for (;;) {
      let x = 0;
      let v = 0;
      do {
        x = nextNormal();
        v = 1 + c * x;
      } while (v <= 0);
      v = v * v * v;
      const u = nextFloat();
      const x2 = x * x;
      if (u < 1 - 0.0331 * x2 * x2) return d * v;
      if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) return d * v;
    }
  };

  const fill = (out: Float64Array, count: number): void => {
    if (evenDf) {
      for (let i = 0; i < count; i++) {
        for (;;) {
          let prod = 1;
          for (let e = 0; e < halfDf; e++) prod *= nextFloat();
          const v = -2 * Math.log(prod); // chi2(df)
          const z = scale * nextNormal() * Math.sqrt(df / v);
          if (z <= SHOCK_TRUNCATION && z >= -SHOCK_TRUNCATION) {
            out[i] = z;
            break;
          }
          truncated++;
        }
      }
      return;
    }
    for (let i = 0; i < count; i++) {
      for (;;) {
        const v = 2 * gammaMT(halfDf);
        const z = scale * nextNormal() * Math.sqrt(df / v);
        if (z <= SHOCK_TRUNCATION && z >= -SHOCK_TRUNCATION) {
          out[i] = z;
          break;
        }
        truncated++;
      }
    }
  };

  return withNext(
    fill,
    () => truncated,
    `Student's t (df ${df}, |z|≤${SHOCK_TRUNCATION} 재추출)`
  );
}
