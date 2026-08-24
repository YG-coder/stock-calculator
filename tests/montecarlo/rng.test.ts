import { describe, expect, it } from "vitest";
import {
  createNormalShock,
  createRng,
  createStudentTShock,
  SHOCK_TRUNCATION,
} from "@/lib/montecarlo/rng";

function moments(values: number[]) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const varSum = values.reduce((a, b) => a + (b - mean) * (b - mean), 0);
  return { mean, std: Math.sqrt(varSum / (n - 1)) };
}

describe("rng — 결정론", () => {
  it("같은 시드는 같은 수열을 만든다", () => {
    const a = createRng(12345);
    const b = createRng(12345);
    for (let i = 0; i < 1000; i++) expect(a.nextUint32()).toBe(b.nextUint32());
  });

  it("다른 시드는 다른 수열을 만든다", () => {
    const a = createRng(1);
    const b = createRng(2);
    let same = 0;
    for (let i = 0; i < 1000; i++) if (a.nextUint32() === b.nextUint32()) same++;
    expect(same).toBeLessThan(5);
  });

  it("시드 0 도 퇴화하지 않는다", () => {
    const r = createRng(0);
    const vals = new Set<number>();
    for (let i = 0; i < 100; i++) vals.add(r.nextUint32());
    expect(vals.size).toBe(100);
  });

  it("nextFloat 는 (0,1) 개구간이다", () => {
    const r = createRng(7);
    for (let i = 0; i < 200_000; i++) {
      const v = r.nextFloat();
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("rng — 분포 적합성 (고정 시드)", () => {
  it("균등난수의 평균·분산이 이론값에 근접", () => {
    const r = createRng(20260824);
    const xs: number[] = [];
    for (let i = 0; i < 200_000; i++) xs.push(r.nextFloat());
    const { mean, std } = moments(xs);
    expect(mean).toBeCloseTo(0.5, 2);
    expect(std).toBeCloseTo(Math.sqrt(1 / 12), 2);
  });

  it("정규난수의 평균 0, 표준편차 1", () => {
    const r = createRng(4242);
    const xs: number[] = [];
    for (let i = 0; i < 200_000; i++) xs.push(r.nextNormal());
    const { mean, std } = moments(xs);
    expect(Math.abs(mean)).toBeLessThan(0.01);
    expect(std).toBeGreaterThan(0.99);
    expect(std).toBeLessThan(1.01);
  });

  it("정규 충격은 표준편차 1 (절단 영향 무시 가능)", () => {
    const shock = createNormalShock(createRng(99));
    const xs: number[] = [];
    for (let i = 0; i < 200_000; i++) xs.push(shock.next());
    const { std } = moments(xs);
    expect(std).toBeGreaterThan(0.98);
    expect(std).toBeLessThan(1.02);
  });
});

describe("rng — Student's t 분산 보정", () => {
  it("df=6 충격의 표본 표준편차가 1 근처다 (보정 누락 시 약 1.22)", () => {
    const shock = createStudentTShock(createRng(31337), 6);
    const xs: number[] = [];
    for (let i = 0; i < 400_000; i++) xs.push(shock.next());
    const { mean, std } = moments(xs);
    expect(Math.abs(mean)).toBeLessThan(0.02);
    // 계약: 절단으로 표본 σ 가 최대 0.4% 작을 수 있다. 허용 오차 2%.
    expect(std).toBeGreaterThan(0.98);
    expect(std).toBeLessThan(1.02);
    // 보정을 빼먹으면 1.2247 이 되므로 위 범위로 확실히 구분된다.
  });

  it("절단은 |z| <= 8 을 보장하고 횟수를 센다", () => {
    const shock = createStudentTShock(createRng(5), 6);
    for (let i = 0; i < 300_000; i++) {
      expect(Math.abs(shock.next())).toBeLessThanOrEqual(SHOCK_TRUNCATION);
    }
    // 이론적으로 1억 표본당 약 6,500회 → 30만 표본이면 대개 0~수 회.
    expect(shock.truncated).toBeLessThan(50);
  });

  it("df <= 2 는 거부한다 (분산이 존재하지 않음)", () => {
    expect(() => createStudentTShock(createRng(1), 2)).toThrow();
    expect(() => createStudentTShock(createRng(1), 1.5)).toThrow();
  });

  it("홀수 df 도 (Marsaglia–Tsang 경로) 분산 1 을 지킨다", () => {
    const shock = createStudentTShock(createRng(777), 7);
    const xs: number[] = [];
    for (let i = 0; i < 200_000; i++) xs.push(shock.next());
    const { std } = moments(xs);
    expect(std).toBeGreaterThan(0.97);
    expect(std).toBeLessThan(1.03);
  });
});
