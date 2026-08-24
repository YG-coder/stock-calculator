import { describe, expect, it } from "vitest";
import {
  distributionFromSorted,
  percentilesFromSorted,
  quantileSorted,
} from "@/lib/montecarlo/stats";

describe("백분위 (R type 7 선형 보간)", () => {
  const s = Float64Array.from([10, 20, 30, 40, 50]);

  it("경계와 중앙값", () => {
    expect(quantileSorted(s, 5, 0)).toBe(10);
    expect(quantileSorted(s, 5, 1)).toBe(50);
    expect(quantileSorted(s, 5, 0.5)).toBe(30);
  });

  it("보간이 선형이다", () => {
    expect(quantileSorted(s, 5, 0.25)).toBeCloseTo(20, 12);
    expect(quantileSorted(s, 5, 0.125)).toBeCloseTo(15, 12);
  });

  it("범위 밖 p 는 잘라낸다", () => {
    expect(quantileSorted(s, 5, -1)).toBe(10);
    expect(quantileSorted(s, 5, 2)).toBe(50);
  });

  it("길이 0·1 처리", () => {
    expect(Number.isNaN(quantileSorted(new Float64Array(0), 0, 0.5))).toBe(true);
    expect(quantileSorted(Float64Array.from([7]), 1, 0.9)).toBe(7);
  });

  it("7개 백분위가 단조 증가한다", () => {
    const p = percentilesFromSorted(s, 5);
    const vals = [p.p5, p.p10, p.p25, p.p50, p.p75, p.p90, p.p95];
    for (let i = 1; i < vals.length; i++) expect(vals[i]).toBeGreaterThanOrEqual(vals[i - 1]);
  });

  it("분포 요약이 min·max·mean 을 채운다", () => {
    const d = distributionFromSorted(s, 5);
    expect(d.min).toBe(10);
    expect(d.max).toBe(50);
    expect(d.mean).toBeCloseTo(30, 12);
  });

  it("빈 분포는 NaN 으로 명시한다 (0 으로 치환하지 않는다)", () => {
    const d = distributionFromSorted(new Float64Array(0), 0);
    expect(Number.isNaN(d.p50)).toBe(true);
    expect(Number.isNaN(d.mean)).toBe(true);
  });
});
