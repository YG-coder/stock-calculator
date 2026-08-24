import { describe, expect, it } from "vitest";
import {
  cholesky,
  validateCorrelationMatrix,
  validateWeights,
} from "@/lib/montecarlo/correlation";

/**
 * 이 유틸은 6단계 다자산 준비물이다. v1 엔진은 호출하지 않는다.
 * 다자산이 들어올 때 필요한 거부 규칙을 지금 고정해 둔다.
 */
describe("상관행렬 검증", () => {
  it("정상 행렬을 통과시킨다", () => {
    expect(validateCorrelationMatrix([[1, 0.2], [0.2, 1]])).toEqual([]);
    expect(validateCorrelationMatrix([[1]])).toEqual([]);
  });

  it("빈 행렬·비정사각을 거부한다", () => {
    expect(validateCorrelationMatrix([]).length).toBeGreaterThan(0);
    expect(validateCorrelationMatrix([[1, 0], [0, 1], [0, 0]]).length).toBeGreaterThan(0);
  });

  it("대각이 1 이 아니면 거부한다", () => {
    const issues = validateCorrelationMatrix([[0.9, 0], [0, 1]]);
    expect(issues.some((i) => i.message.includes("대각"))).toBe(true);
  });

  it("비대칭 행렬을 거부한다", () => {
    const issues = validateCorrelationMatrix([[1, 0.5], [0.3, 1]]);
    expect(issues.some((i) => i.message.includes("대칭"))).toBe(true);
  });

  it("범위를 벗어난 상관계수와 NaN 을 거부한다", () => {
    expect(validateCorrelationMatrix([[1, 1.5], [1.5, 1]]).length).toBeGreaterThan(0);
    expect(validateCorrelationMatrix([[1, Number.NaN], [Number.NaN, 1]]).length).toBeGreaterThan(0);
  });

  it("양의 준정부호가 아닌 행렬을 거부한다", () => {
    // ρ(A,B)=ρ(A,C)=0.9 인데 ρ(B,C)=-0.9 는 물리적으로 불가능하다
    const issues = validateCorrelationMatrix([
      [1, 0.9, 0.9],
      [0.9, 1, -0.9],
      [0.9, -0.9, 1],
    ]);
    expect(issues.some((i) => i.message.includes("양의 준정부호"))).toBe(true);
  });

  it("완전상관(특이) 행렬은 준정부호로 허용한다", () => {
    expect(validateCorrelationMatrix([[1, 1], [1, 1]])).toEqual([]);
  });
});

describe("Cholesky", () => {
  it("L·Lᵀ 가 원 행렬을 복원한다", () => {
    const m = [
      [1, 0.5, 0.3],
      [0.5, 1, 0.2],
      [0.3, 0.2, 1],
    ];
    const L = cholesky(m)!;
    expect(L).not.toBeNull();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += L[i][k] * L[j][k];
        expect(s).toBeCloseTo(m[i][j], 12);
      }
    }
  });

  it("음의 고윳값이 있으면 null", () => {
    expect(cholesky([[1, 2], [2, 1]])).toBeNull();
  });
});

describe("비중 검증", () => {
  it("합이 1 이면 통과", () => {
    expect(validateWeights([0.6, 0.4])).toEqual([]);
  });

  it("합이 1 이 아니면 조용히 정규화하지 않고 알린다", () => {
    const issues = validateWeights([0.6, 0.3]);
    expect(issues[0].message).toContain("합이 1이 아닙니다");
  });

  it("음수 비중과 NaN 을 거부한다", () => {
    expect(validateWeights([-0.1, 1.1]).length).toBeGreaterThan(0);
    expect(validateWeights([Number.NaN, 1]).length).toBeGreaterThan(0);
    expect(validateWeights([]).length).toBeGreaterThan(0);
  });
});
