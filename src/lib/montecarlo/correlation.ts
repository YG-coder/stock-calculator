/**
 * src/lib/montecarlo/correlation.ts
 * 역할: 상관행렬 검증과 Cholesky 분해. **순수 수학 유틸이며 v1 엔진 경로에서 호출하지 않는다.**
 *
 * 왜 지금 있는가
 *   6단계(무매도 리밸런싱)부터 다자산 `ReturnSpec` 이 들어오면 상관행렬이 계산의 본질이 된다.
 *   그때 필요한 검증 규칙을 미리 고정해 두되, 엔진에는 연결하지 않는다.
 *
 * 왜 v1 에 다자산을 넣지 않는가 (docs/2026-08-22-portfolio-assumptions-design.md §2)
 *   자산별 σ 를 단순 가중합하면 분산효과가 0 이라고 선언하는 것과 같아
 *   60/40 에서 변동성을 최대 19% 과대추정한다. 제대로 하려면 공분산과 그 출처 관리가
 *   따라와야 하므로, v1 은 **포트폴리오 수준 가정**을 1급으로 둔다.
 */

export interface MatrixIssue {
  field: string;
  message: string;
}

/**
 * 상관행렬 검증.
 *  - 정사각 행렬인가
 *  - 대각이 1 인가
 *  - 대칭인가
 *  - 원소가 [-1, 1] 범위이고 유한한가
 *  - 양의 준정부호(PSD)인가 — Cholesky 로 판정
 */
export function validateCorrelationMatrix(
  m: readonly (readonly number[])[],
  tolerance = 1e-9
): MatrixIssue[] {
  const issues: MatrixIssue[] = [];
  const n = m.length;
  if (n === 0) {
    issues.push({ field: "correlations", message: "상관행렬이 비어 있습니다." });
    return issues;
  }
  for (let i = 0; i < n; i++) {
    if (m[i].length !== n) {
      issues.push({ field: `correlations[${i}]`, message: "정사각 행렬이 아닙니다." });
      return issues;
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = m[i][j];
      if (!Number.isFinite(v)) {
        issues.push({ field: `correlations[${i}][${j}]`, message: "유한한 숫자가 아닙니다." });
        continue;
      }
      if (v < -1 - tolerance || v > 1 + tolerance) {
        issues.push({
          field: `correlations[${i}][${j}]`,
          message: "상관계수는 -1과 1 사이여야 합니다.",
        });
      }
      if (i === j && Math.abs(v - 1) > tolerance) {
        issues.push({ field: `correlations[${i}][${i}]`, message: "대각 원소는 1이어야 합니다." });
      }
      if (i !== j && Math.abs(v - m[j][i]) > tolerance) {
        issues.push({
          field: `correlations[${i}][${j}]`,
          message: "행렬이 대칭이 아닙니다.",
        });
      }
    }
  }
  if (issues.length > 0) return issues;

  if (cholesky(m, tolerance) === null) {
    issues.push({
      field: "correlations",
      message:
        "양의 준정부호 행렬이 아닙니다. 상관계수 조합이 물리적으로 불가능합니다(예: ρ(A,B)=ρ(A,C)=0.9, ρ(B,C)=-0.9).",
    });
  }
  return issues;
}

/**
 * 하삼각 Cholesky 분해 L (m = L·Lᵀ). 양의 준정부호가 아니면 null.
 * 준정부호(고윳값 0 포함)를 허용하기 위해 음수 판정에 허용 오차를 둔다.
 */
export function cholesky(
  m: readonly (readonly number[])[],
  tolerance = 1e-9
): number[][] | null {
  const n = m.length;
  const L: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = m[i][j];
      for (let k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
      if (i === j) {
        if (sum < -tolerance) return null;
        L[i][j] = Math.sqrt(Math.max(sum, 0));
      } else {
        if (L[j][j] === 0) {
          if (Math.abs(sum) > tolerance) return null;
          L[i][j] = 0;
        } else {
          L[i][j] = sum / L[j][j];
        }
      }
    }
  }
  return L;
}

/** 비중 검증 — 다자산 입력이 생겼을 때 쓴다. 합이 1이 아니면 조용히 정규화하지 않는다. */
export function validateWeights(weights: readonly number[], tolerance = 1e-6): MatrixIssue[] {
  const issues: MatrixIssue[] = [];
  if (weights.length === 0) {
    issues.push({ field: "weights", message: "비중이 비어 있습니다." });
    return issues;
  }
  let sum = 0;
  weights.forEach((w, i) => {
    if (!Number.isFinite(w)) {
      issues.push({ field: `weights[${i}]`, message: "유한한 숫자가 아닙니다." });
      return;
    }
    if (w < 0) {
      issues.push({ field: `weights[${i}]`, message: "음수 비중(공매도)은 지원하지 않습니다." });
    }
    sum += w;
  });
  if (issues.length === 0 && Math.abs(sum - 1) > tolerance) {
    issues.push({
      field: "weights",
      message: `비중의 합이 1이 아닙니다: ${sum.toFixed(6)}`,
    });
  }
  return issues;
}
