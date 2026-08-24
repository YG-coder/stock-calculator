/**
 * src/workers/montecarlo.worker.ts
 * 역할: 메시지 처리와 배치 스케줄링. **계산 로직은 0줄** — engine 을 호출할 뿐이다.
 *
 * 왜 배치로 나누는가
 *   동기 루프로는 취소가 동작하지 않는다. Worker 안에서 계산이 CPU 를 붙잡고 도는 동안
 *   Worker 의 이벤트 루프가 멈춰 있어, 메인 스레드가 보낸 cancel 메시지는 큐에 쌓이기만 하고
 *   핸들러가 실행되지 않는다. 루프 안에서 플래그를 아무리 자주 읽어도 값이 갱신되지 않는다.
 *   그래서 한 배치를 돌린 뒤 이벤트 루프에 제어를 돌려준다.
 *
 *   SharedArrayBuffer + Atomics 로 플래그를 공유하는 방법은 쓰지 않는다.
 *   교차 출처 격리(COOP/COEP) 헤더가 필요한데 그러면 애드센스 스크립트 로딩이 깨진다.
 *
 * yield 는 MessageChannel 기반이다. setTimeout(0) 은 중첩 시 4ms 로 클램프되어
 * 배치가 많아지면 무시 못 할 오버헤드가 된다.
 */

import { createRunner } from "@/lib/montecarlo/engine";
import { ENGINE_VERSION } from "@/lib/montecarlo/types";
import { SimulationInputError } from "@/lib/montecarlo/validate";
import type {
  SimulationResult,
  WorkerRequest,
  WorkerResponse,
} from "@/lib/montecarlo/types";

/** DedicatedWorkerGlobalScope 는 dom lib 과 충돌하므로 최소한의 형태만 선언한다. */
interface WorkerScope {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  addEventListener(type: "message", listener: (ev: { data: unknown }) => void): void;
}
const ctx = self as unknown as WorkerScope;

const TARGET_BATCH_MS = 50;
const PROGRESS_INTERVAL_MS = 250;

const cancelled = new Set<string>();
let activeId: string | null = null;

function post(message: WorkerResponse, transfer?: Transferable[]): void {
  ctx.postMessage(message, transfer);
}

/** 결과에 실린 typed array 버퍼를 transfer 목록으로 모은다(중복 제거). */
function collectTransferables(result: SimulationResult): Transferable[] {
  const seen = new Set<ArrayBufferLike>();
  const out: Transferable[] = [];
  const add = (view?: { buffer: ArrayBufferLike } | null) => {
    if (!view) return;
    const buf = view.buffer;
    if (seen.has(buf)) return;
    seen.add(buf);
    out.push(buf as Transferable);
  };
  add(result.samplePaths.months);
  add(result.samplePaths.values);
  add(result.affine?.A);
  add(result.affine?.B);
  add(result.depletion?.byYear);
  add(result.goal?.inversion?.sortedRequired);
  return out;
}

const yieldToEventLoop = (): Promise<void> =>
  new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });

async function execute(id: string, input: unknown): Promise<void> {
  activeId = id;

  let runner;
  try {
    runner = createRunner(input as never);
  } catch (error) {
    if (error instanceof SimulationInputError) {
      post({ type: "error", id, message: error.message, issues: error.issues });
    } else {
      post({ type: "error", id, message: (error as Error)?.message ?? "알 수 없는 오류" });
    }
    if (activeId === id) activeId = null;
    return;
  }

  // 첫 배치는 작게 잡고, 이후 한 배치가 약 50ms 가 되도록 조정한다.
  // 경로당 비용이 기간에 따라 10배 이상 차이나므로 고정 개수는 나쁘다.
  let batch = 200;
  let lastProgress = 0;

  while (!runner.done) {
    if (cancelled.has(id) || activeId !== id) {
      cancelled.delete(id);
      post({ type: "cancelled", id });
      return;
    }
    const started = performance.now();
    try {
      runner.runBatch(batch);
    } catch (error) {
      post({ type: "error", id, message: (error as Error)?.message ?? "계산 중 오류" });
      if (activeId === id) activeId = null;
      return;
    }
    const elapsed = performance.now() - started;
    const scale = TARGET_BATCH_MS / Math.max(elapsed, 0.5);
    batch = Math.min(10_000, Math.max(1, Math.round(batch * Math.min(4, Math.max(0.25, scale)))));

    await yieldToEventLoop();

    const now = performance.now();
    if (now - lastProgress >= PROGRESS_INTERVAL_MS) {
      lastProgress = now;
      post({ type: "progress", id, completed: runner.completed, total: runner.total });
    }
  }

  if (cancelled.has(id) || activeId !== id) {
    cancelled.delete(id);
    post({ type: "cancelled", id });
    return;
  }

  try {
    const result = runner.finish();
    post({ type: "result", id, result }, collectTransferables(result));
  } catch (error) {
    post({ type: "error", id, message: (error as Error)?.message ?? "집계 중 오류" });
  } finally {
    if (activeId === id) activeId = null;
  }
}

ctx.addEventListener("message", (event) => {
  const message = event.data as WorkerRequest;
  if (!message || typeof message !== "object") return;

  switch (message.type) {
    case "ping":
      post({ type: "pong", engineVersion: ENGINE_VERSION });
      break;
    case "cancel":
      cancelled.add(message.id);
      break;
    case "run":
      void execute(message.id, message.input);
      break;
  }
});
