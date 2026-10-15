"use client";

/**
 * src/hooks/useMonteCarlo.ts
 * 역할: Worker 생성·종료, 디바운스, 진행률, 취소, 상태. **수식을 모른다.**
 *
 * - Worker 인스턴스는 훅 수명 동안 재사용한다. 실행마다 새로 만들면 초기화 비용이
 *   계산 시간을 넘긴다.
 * - 입력 변경 시 reset으로 이전 결과·경고와 진행 중인 요청을 함께 지운다.
 * - 언마운트 시 Worker 를 정리한다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createMonteCarloClient,
  type MonteCarloClient,
} from "@/lib/montecarlo/worker-client";
import type { SimulationInput, SimulationResult, ValidationIssue } from "@/lib/montecarlo/types";

export type MonteCarloStatus = "idle" | "running" | "done" | "cancelled" | "error";

export interface UseMonteCarloState {
  status: MonteCarloStatus;
  result: SimulationResult | null;
  progress: { completed: number; total: number } | null;
  error: { message: string; issues?: ValidationIssue[] } | null;
  mode: "worker" | "main-thread" | "pending";
  run: (input: SimulationInput) => void;
  cancel: () => void;
  reset: () => void;
}

export function useMonteCarlo(debounceMs = 300): UseMonteCarloState {
  const clientRef = useRef<MonteCarloClient | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const generationRef = useRef(0);

  const [status, setStatus] = useState<MonteCarloStatus>("idle");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<{ message: string; issues?: ValidationIssue[] } | null>(null);
  const [mode, setMode] = useState<"worker" | "main-thread" | "pending">("pending");

  // Worker 는 첫 실행 시점에 만든다. 이펙트 본문에서 setState 를 부르지 않기 위함이며,
  // 화면을 열기만 하고 실행하지 않는 경우 Worker 를 띄우지 않는 이점도 있다.
  const ensureClient = useCallback((): MonteCarloClient => {
    if (!clientRef.current) {
      const client = createMonteCarloClient();
      clientRef.current = client;
      setMode(client.mode);
    }
    return clientRef.current;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      clientRef.current?.terminate();
      clientRef.current = null;
    };
  }, []);

  const run = useCallback(
    (input: SimulationInput) => {
      const generation = ++generationRef.current;
      if (timerRef.current) clearTimeout(timerRef.current);
      setStatus("running");
      setError(null);
      setProgress({ completed: 0, total: input.paths });

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current || generation !== generationRef.current) return;
        const client = ensureClient();
        client.run(input, {
          onProgress: (completed, total) => {
            if (mountedRef.current && generation === generationRef.current) setProgress({ completed, total });
          },
          onResult: (next) => {
            if (!mountedRef.current || generation !== generationRef.current) return;
            setResult(next);
            setProgress({ completed: next.meta.pathsRun, total: next.meta.pathsRun });
            setStatus("done");
          },
          onCancelled: () => {
            if (mountedRef.current && generation === generationRef.current) setStatus("cancelled");
          },
          onError: (message, issues) => {
            if (!mountedRef.current || generation !== generationRef.current) return;
            setError({ message, issues });
            setStatus("error");
          },
        });
      }, debounceMs);
    },
    [debounceMs, ensureClient]
  );

  const cancel = useCallback(() => {
    generationRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    clientRef.current?.cancel();
    setStatus("cancelled");
  }, []);

  const reset = useCallback(() => {
    generationRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    clientRef.current?.cancel();
    setResult(null); setError(null); setProgress(null); setStatus("idle");
  }, []);

  return { status, result, progress, error, mode, run, cancel, reset };
}
