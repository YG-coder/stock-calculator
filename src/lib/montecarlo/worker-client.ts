/**
 * src/lib/montecarlo/worker-client.ts
 * 역할: Worker 수명주기, 메시지 프로토콜, 취소. **React 를 모른다.**
 *       클라이언트만 따로 테스트할 수 있도록 훅과 분리했다.
 *
 * Worker 미지원·초기화 실패 시 메인 스레드 동기 실행으로 폴백하되,
 * UI 가 오래 멈추지 않도록 경로 수를 낮춘다.
 */

import { runSimulation } from "./engine";
import { SimulationInputError } from "./validate";
import type {
  SimulationInput,
  SimulationResult,
  ValidationIssue,
  WorkerResponse,
} from "./types";

/** 폴백(메인 스레드) 실행에서의 경로 수 상한. */
export const FALLBACK_MAX_PATHS = 2_000;

export interface RunHandlers {
  onProgress?: (completed: number, total: number) => void;
  onResult?: (result: SimulationResult) => void;
  onCancelled?: () => void;
  onError?: (message: string, issues?: ValidationIssue[]) => void;
}

export interface MonteCarloClient {
  readonly mode: "worker" | "main-thread";
  /** 새 실행을 시작하고 요청 id 를 돌려준다. 이전 실행은 자동 취소된다. */
  run(input: SimulationInput, handlers: RunHandlers): string;
  cancel(): void;
  terminate(): void;
}

let requestCounter = 0;
const nextId = (): string => `mc-${++requestCounter}`;

export function createMonteCarloClient(): MonteCarloClient {
  let worker: Worker | null = null;
  let mode: "worker" | "main-thread" = "main-thread";

  if (typeof Worker !== "undefined") {
    try {
      worker = new Worker(new URL("../../workers/montecarlo.worker.ts", import.meta.url), {
        type: "module",
      });
      mode = "worker";
    } catch {
      worker = null;
      mode = "main-thread";
    }
  }

  let currentId: string | null = null;
  let handlers: RunHandlers = {};

  if (worker) {
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (!message || message.type === "pong") return;
      // 오래된 요청의 결과는 버린다.
      if (message.id !== currentId) return;

      switch (message.type) {
        case "progress":
          handlers.onProgress?.(message.completed, message.total);
          break;
        case "result":
          currentId = null;
          handlers.onResult?.(message.result);
          break;
        case "cancelled":
          currentId = null;
          handlers.onCancelled?.();
          break;
        case "error":
          currentId = null;
          handlers.onError?.(message.message, message.issues);
          break;
      }
    };
    worker.onerror = (event: ErrorEvent) => {
      handlers.onError?.(event.message || "Worker 오류가 발생했습니다.");
      currentId = null;
    };
  }

  return {
    get mode() {
      return mode;
    },

    run(input: SimulationInput, nextHandlers: RunHandlers): string {
      const id = nextId();
      handlers = nextHandlers;

      if (worker) {
        if (currentId) worker.postMessage({ type: "cancel", id: currentId });
        currentId = id;
        worker.postMessage({ type: "run", id, input });
        return id;
      }

      // ---- 폴백: 메인 스레드 동기 실행 ----
      currentId = id;
      const capped: SimulationInput =
        input.paths > FALLBACK_MAX_PATHS ? { ...input, paths: FALLBACK_MAX_PATHS } : input;
      try {
        const result = runSimulation(capped, {
          onProgress: (completed, total) => nextHandlers.onProgress?.(completed, total),
        });
        if (currentId !== id) return id;
        currentId = null;
        if (capped.paths !== input.paths) {
          result.meta.warnings.push(
            `이 브라우저에서는 Web Worker 를 쓸 수 없어 경로 수를 ${FALLBACK_MAX_PATHS.toLocaleString()}개로 낮춰 실행했습니다.`
          );
        }
        nextHandlers.onResult?.(result);
      } catch (error) {
        currentId = null;
        if (error instanceof SimulationInputError) {
          nextHandlers.onError?.(error.message, error.issues);
        } else {
          nextHandlers.onError?.((error as Error)?.message ?? "알 수 없는 오류");
        }
      }
      return id;
    },

    cancel(): void {
      if (worker && currentId) {
        worker.postMessage({ type: "cancel", id: currentId });
      }
      currentId = null;
    },

    terminate(): void {
      currentId = null;
      handlers = {};
      worker?.terminate();
      worker = null;
    },
  };
}
