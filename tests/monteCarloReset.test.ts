import { expect, it, vi } from "vitest";
import type { RunHandlers } from "@/lib/montecarlo/worker-client";
import type { UseMonteCarloState } from "@/hooks/useMonteCarlo";
import { uiHarness } from "./uiHarness";
import { buildDcaInput } from "@/lib/dca";
const client=vi.hoisted(()=>({mode:"worker",run:vi.fn(),cancel:vi.fn(),terminate:vi.fn()}));
vi.mock("@/lib/montecarlo/worker-client",()=>({createMonteCarloClient:()=>client}));
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
it("reset clears warning/result and ignores a late callback from prior inputs",()=>{
 vi.useFakeTimers();
 try {
  let current:UseMonteCarloState; const view=uiHarness(()=>{current=useMonteCarlo(0);return null;});
  view.nodes();
  const input=buildDcaInput({seed:1,paths:10,years:1,initialBalance:0,monthlyAmount:0,expectedReturnPercent:0,volatilityPercent:0,inflationPercent:0,timing:"end",inflationIndexed:false,reportBasis:"nominal"});
  current!.run(input);vi.runAllTimers();
  const handlers=client.run.mock.calls.at(-1)![1] as RunHandlers;
  handlers.onError?.("이전 입력 오류");view.nodes();expect(current!.error?.message).toBe("이전 입력 오류");
  current!.reset();view.nodes();expect(current!.error).toBeNull();expect(current!.result).toBeNull();expect(current!.status).toBe("idle");
  handlers.onError?.("늦게 온 오류");view.nodes();expect(current!.error).toBeNull();expect(current!.status).toBe("idle");
 } finally {vi.useRealTimers();}
});
