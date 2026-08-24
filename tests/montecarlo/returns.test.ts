import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/montecarlo/rng";
import {
  createReturnGenerator,
  invertSigmaTable,
  maxVolatilityFor,
  SIGMA_TABLE_U_MAX,
  toMonthlyParams,
} from "@/lib/montecarlo/returns";
import { SIGMA_M_MAX, SIGMA_TABLE_U, sigmaMAt } from "@/lib/montecarlo/sigma-table";

describe("연 → 월 변환 (유일한 변환 지점)", () => {
  it("드리프트는 CAGR 기준이다 — 산술평균이 아니다", () => {
    const { muM } = toMonthlyParams(0.07, 0.15);
    expect(muM).toBeCloseTo(Math.log(1.07) / 12, 15);
    // 12개월 복리하면 정확히 CAGR 이 된다
    expect(Math.exp(muM * 12) - 1).toBeCloseTo(0.07, 12);
  });

  it("캘리브레이션 값이 설계 문서와 일치한다 (σ_m ≈ 0.0399782)", () => {
    const { sigmaM } = toMonthlyParams(0.07, 0.15);
    expect(sigmaM).toBeCloseTo(0.0399782, 6);
  });

  it("로그정규 폐형식과 구분된다 — 그 식은 σ 를 약 0.7% 과대추정한다", () => {
    const { sigmaM } = toMonthlyParams(0.07, 0.15);
    const lognormal = Math.sqrt(Math.log(1 + 0.15 ** 2 / 1.07 ** 2)) / Math.sqrt(12);
    expect(lognormal / sigmaM).toBeGreaterThan(1.005);
    expect(lognormal / sigmaM).toBeLessThan(1.012);
  });

  it("u = σ/(1+CAGR) 가 같으면 CAGR 과 무관하게 σ_m 이 같다", () => {
    const u = 0.15 / 1.07;
    const base = toMonthlyParams(0, u).sigmaM;
    for (const cagr of [0.07, 0.2, 0.5, -0.3]) {
      expect(toMonthlyParams(cagr, u * (1 + cagr)).sigmaM).toBeCloseTo(base, 12);
    }
  });

  it("변동성 0 은 σ_m 0 으로 간다", () => {
    expect(toMonthlyParams(0.07, 0).sigmaM).toBe(0);
  });

  it("테이블 역보간이 정방향과 일관된다", () => {
    for (let i = 0; i < SIGMA_TABLE_U.length; i += 17) {
      expect(invertSigmaTable(SIGMA_TABLE_U[i])).toBeCloseTo(sigmaMAt(i), 12);
    }
  });

  it("테이블 범위를 넘으면 조용히 클램프하지 않고 거부한다", () => {
    expect(() => invertSigmaTable(SIGMA_TABLE_U_MAX * 1.001)).toThrow(RangeError);
    expect(() => invertSigmaTable(Number.NaN)).toThrow(RangeError);
    expect(() => invertSigmaTable(-0.1)).toThrow(RangeError);
    expect(invertSigmaTable(SIGMA_TABLE_U_MAX)).toBeCloseTo(SIGMA_M_MAX, 12);
  });

  it("CAGR 이 음수면 커버 가능한 변동성 상한이 낮아진다", () => {
    expect(maxVolatilityFor(0)).toBeCloseTo(SIGMA_TABLE_U_MAX, 12);
    expect(maxVolatilityFor(-0.5)).toBeLessThan(maxVolatilityFor(0));
    expect(() => toMonthlyParams(-0.5, 0.45)).toThrow(RangeError);
  });
});

describe("ReturnGenerator", () => {
  it("σ = 0 이면 모든 달이 (1+CAGR)^(1/12) 로 고정된다", () => {
    const gen = createReturnGenerator({
      kind: "parametric",
      expectedReturn: 0.07,
      volatility: 0,
    });
    const out = new Float64Array(12);
    gen.fillPath(out, createRng(1));
    const expected = Math.pow(1.07, 1 / 12);
    for (const v of out) expect(v).toBeCloseTo(expected, 15);
    expect(out.reduce((a, b) => a * b, 1)).toBeCloseTo(1.07, 12);
  });

  it("월 로그수익률의 표본 적률이 μ_m·σ_m 과 맞는다", () => {
    const spec = { kind: "parametric" as const, expectedReturn: 0.07, volatility: 0.15 };
    const gen = createReturnGenerator(spec);
    const rng = createRng(20260824);
    const out = new Float64Array(480);
    const logs: number[] = [];
    for (let p = 0; p < 500; p++) {
      gen.fillPath(out, rng);
      for (const v of out) logs.push(Math.log(v));
    }
    const n = logs.length;
    const mean = logs.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(logs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
    const { muM, sigmaM } = toMonthlyParams(0.07, 0.15);
    expect(mean).toBeCloseTo(muM, 3);
    // 계약 허용 오차 2%
    expect(Math.abs(std / sigmaM - 1)).toBeLessThan(0.02);
  });

  it("bootstrap 은 아직 구현되지 않았음을 명시적으로 알린다", () => {
    expect(() =>
      createReturnGenerator({ kind: "bootstrap", datasetId: "x", blockMonths: 12 })
    ).toThrow(/bootstrap/);
  });

  it("describe() 가 실제 사용된 월 파라미터와 라벨을 되돌려준다", () => {
    const gen = createReturnGenerator({
      kind: "parametric",
      expectedReturn: 0.07,
      volatility: 0.15,
    });
    const a = gen.describe();
    expect(a.kind).toBe("parametric");
    expect(a.returnBasis).toBe("total-return");
    expect(a.shockLabel).toContain("df 6");
    expect(a.label).toContain("CAGR");
    expect(a.label).toContain("단순수익률");
    expect(a.sigmaM).toBeCloseTo(0.0399782, 6);
  });
});
