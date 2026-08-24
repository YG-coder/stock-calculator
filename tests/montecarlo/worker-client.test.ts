import { describe, expect, it } from "vitest";
import {
  createMonteCarloClient,
  FALLBACK_MAX_PATHS,
} from "@/lib/montecarlo/worker-client";
import type { SimulationInput, SimulationResult, ValidationIssue } from "@/lib/montecarlo/types";

/**
 * Node 환경에는 Worker 가 없으므로 클라이언트가 메인 스레드 폴백으로 떨어진다.
 * 이 테스트는 그 폴백 경로(경로 수 상한, 오류 전달)를 검증한다.
 * Worker 경로 자체는 브라우저에서 dev 검증 화면(/dev/montecarlo)으로 확인한다.
 */
function input(over: Partial<SimulationInput> = {}): SimulationInput {
  return {
    seed: 1,
    paths: 10_000,
    months: 120,
    initialBalance: 1_000_000,
    cashFlow: { monthlyAmount: 100_000, timing: "end", inflationIndexed: false },
    returns: { kind: "parametric", expectedReturn: 0.07, volatility: 0.15 },
    inflationRate: 0,
    reportBasis: "nominal",
    ...over,
  };
}

describe("worker-client 폴백", () => {
  it("Worker 가 없으면 메인 스레드 모드가 된다", () => {
    const client = createMonteCarloClient();
    expect(client.mode).toBe("main-thread");
    client.terminate();
  });

  it("폴백에서는 경로 수를 낮추고 그 사실을 경고로 알린다", () => {
    const client = createMonteCarloClient();
    let result: SimulationResult | null = null;
    client.run(input(), { onResult: (r) => (result = r) });
    client.terminate();
    const r = result as SimulationResult | null;
    expect(r).not.toBeNull();
    expect(r!.meta.pathsRun).toBe(FALLBACK_MAX_PATHS);
    expect(r!.meta.warnings.join(" ")).toContain("경로 수를");
  });

  it("진행률 콜백이 호출된다", () => {
    const client = createMonteCarloClient();
    const seen: number[] = [];
    client.run(input({ paths: 1_000 }), { onProgress: (c) => seen.push(c) });
    client.terminate();
    expect(seen.length).toBeGreaterThan(1);
    expect(seen[seen.length - 1]).toBe(1_000);
  });

  it("입력 오류를 필드별 사유와 함께 전달한다", () => {
    const client = createMonteCarloClient();
    let issues: ValidationIssue[] | undefined;
    let message = "";
    client.run(input({ months: 0 }), {
      onError: (m, i) => {
        message = m;
        issues = i;
      },
    });
    client.terminate();
    expect(message).toContain("기간");
    expect(issues?.map((i) => i.field)).toContain("months");
  });
});
