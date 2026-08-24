/**
 * scripts/gen-sigma-table.mjs
 * 역할: 연 변동성(단순수익률 기준) → 월 로그 표준편차 σ_m 역보간 테이블 생성.
 *
 * 배경 (docs/2026-08-22-montecarlo-implementation-plan.md §2)
 *   월 수익 배수 = exp(μ_m + σ_m·z),  z = t_df·sqrt((df-2)/df), |z| ≤ 8 재추출
 *   M(a)   = E[exp(a·z)]                       ← 절단 분포 위의 1차원 적분
 *   E[1+R] = (1+CAGR)·M(σ_m)^12
 *   Var(R) = (1+CAGR)²·(M(2σ_m)^12 − M(σ_m)^24)
 *   ⇒ u ≡ σ_target/(1+CAGR) = sqrt(M(2σ_m)^12 − M(σ_m)^24)  ← CAGR 이 소거된다
 *
 * 로그정규 폐형식(σ_log = sqrt(ln(1+σ²/(1+CAGR)²)))은 쓰지 않는다.
 * 그 식은 산술평균 드리프트를 전제로 유도됐고 t 충격에서는 모멘트 관계가 깨진다.
 *
 * 재생성:  node scripts/gen-sigma-table.mjs
 * df 나 절단값을 바꾸면 반드시 다시 돌려야 한다.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const DF = 6;
const TRUNC = 8;
const SIGMA_M_MAX = 0.15;
const POINTS = 201; // [0, 0.15] 을 200 등분

// ---------- Gauss–Legendre 노드 ----------
function legendreNodes(n) {
  const x = new Float64Array(n);
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
    let pp = 0;
    for (let iter = 0; iter < 100; iter++) {
      let p0 = 1;
      let p1 = 0;
      for (let j = 0; j < n; j++) {
        const p2 = p1;
        p1 = p0;
        p0 = ((2 * j + 1) * z * p1 - j * p2) / (j + 1);
      }
      pp = (n * (z * p0 - p1)) / (z * z - 1);
      const dz = p0 / pp;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    x[i] = z;
    w[i] = 2 / ((1 - z * z) * pp * pp);
  }
  return { x, w };
}

// ---------- 절단 t 분포 위의 적분 노드 ----------
const k = Math.sqrt((DF - 2) / DF);
const T0 = TRUNC / k;
const PANELS = 80;
const ORDER = 48;
const { x: gx, w: gw } = legendreNodes(ORDER);

// f(t) ∝ (1 + t²/df)^(-(df+1)/2) — 정규화 상수는 M(a) 에서 약분된다.
const tNodes = [];
const wf = [];
for (let p = 0; p < PANELS; p++) {
  const a = (T0 * p) / PANELS;
  const b = (T0 * (p + 1)) / PANELS;
  const half = (b - a) / 2;
  const mid = (a + b) / 2;
  for (let i = 0; i < ORDER; i++) {
    const t = mid + half * gx[i];
    tNodes.push(t);
    wf.push(half * gw[i] * Math.pow(1 + (t * t) / DF, -(DF + 1) / 2));
  }
}
let denom = 0;
for (let i = 0; i < wf.length; i++) denom += wf[i];

/** M(a) = E[exp(a·z)],  z = k·t,  |z| ≤ TRUNC. 대칭이라 cosh 로 접는다. */
function M(a) {
  if (a === 0) return 1;
  let s = 0;
  for (let i = 0; i < wf.length; i++) s += wf[i] * Math.cosh(a * k * tNodes[i]);
  return s / denom;
}

/** 절단 후 z 의 표준편차 — 계약(≈0.99685)과 대조하는 자기검증. */
function truncatedStd() {
  let s = 0;
  for (let i = 0; i < wf.length; i++) {
    const z = k * tNodes[i];
    s += wf[i] * z * z;
  }
  return Math.sqrt(s / denom);
}

/** u(σ_m) = sqrt(M(2σ)^12 − M(σ)^24) — 연 단순수익률 표준편차 / (1+CAGR) */
function u(sigmaM) {
  if (sigmaM === 0) return 0;
  const g = Math.pow(M(2 * sigmaM), 12) - Math.pow(M(sigmaM), 24);
  return Math.sqrt(Math.max(g, 0));
}

const sigmas = new Float64Array(POINTS);
const us = new Float64Array(POINTS);
for (let i = 0; i < POINTS; i++) {
  const s = (SIGMA_M_MAX * i) / (POINTS - 1);
  sigmas[i] = s;
  us[i] = u(s);
}

// 단조성 확인 — 역보간의 전제
for (let i = 1; i < POINTS; i++) {
  if (!(us[i] > us[i - 1])) {
    throw new Error(`u(σ_m) 가 단조증가가 아닙니다: i=${i}`);
  }
}

// 선형 보간 오차 실측 (구간 중점에서)
let maxRel = 0;
for (let i = 0; i < POINTS - 1; i++) {
  const mid = (sigmas[i] + sigmas[i + 1]) / 2;
  const exact = u(mid);
  const lerp = (us[i] + us[i + 1]) / 2;
  maxRel = Math.max(maxRel, Math.abs(lerp - exact) / exact);
}

const fmt = (v) => v.toPrecision(17);
const body = Array.from(us, fmt).join(",\n  ");

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../src/lib/montecarlo/sigma-table.ts");

writeFileSync(
  out,
  `/**
 * src/lib/montecarlo/sigma-table.ts
 * 자동 생성 파일. 직접 편집하지 말 것.
 *   생성: node scripts/gen-sigma-table.mjs
 *
 * df = ${DF}, |z| ≤ ${TRUNC} 재추출 기준.
 * SIGMA_TABLE_U[i] = sqrt(M(2σ)^12 − M(σ)^24),  σ = SIGMA_M_MAX·i/(N−1)
 * 즉 "연 단순수익률 표준편차 / (1+CAGR)" 이다. CAGR 은 소거되어 테이블에 들어가지 않는다.
 *
 * 자기검증값
 *   절단 후 z 표준편차: ${truncatedStd().toFixed(6)} (계약 기대치 0.996850)
 *   구간 중점 선형보간 최대 상대오차: ${maxRel.toExponential(2)}
 */

export const SIGMA_TABLE_DF = ${DF};
export const SIGMA_TABLE_TRUNCATION = ${TRUNC};
export const SIGMA_M_MAX = ${SIGMA_M_MAX};
export const SIGMA_TABLE_POINTS = ${POINTS};

/** i 번째 항목의 σ_m 값. */
export function sigmaMAt(i: number): number {
  return (SIGMA_M_MAX * i) / (SIGMA_TABLE_POINTS - 1);
}

export const SIGMA_TABLE_U: readonly number[] = [
  ${body},
];
`,
  "utf8"
);

console.log(`wrote ${out}`);
console.log(`truncated z std = ${truncatedStd()}`);
console.log(`u(0.15) = ${us[POINTS - 1]}  (= 커버 가능한 σ/(1+CAGR) 상한)`);
console.log(`max linear-interp rel error = ${maxRel.toExponential(3)}`);
