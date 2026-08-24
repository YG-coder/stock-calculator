"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorCard, CalculatorLayout, InputField, ResultDetail, ResultHighlight } from "@/components/ui/Shared";
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
import { buildSorrSimulationInput, sorrSurvivalRate, type SorrSimulationValues } from "@/lib/sorr";

type Fields = Record<"seed" | "paths" | "years" | "initialAssets" | "monthlyWithdrawal" | "expectedReturn" | "volatility" | "inflation", string>;
const initialFields: Fields = { seed: "20260824", paths: "10000", years: "30", initialAssets: "1000000000", monthlyWithdrawal: "3000000", expectedReturn: "7", volatility: "15", inflation: "2" };
const won = (value: number) => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function SorrSimulationCalculator() {
  const [fields, setFields] = useState(initialFields);
  const { status, result, progress, error, run, cancel } = useMonteCarlo(0);
  const set = useCallback((key: keyof Fields, value: string) => setFields((previous) => ({ ...previous, [key]: value })), []);
  const values = useMemo<SorrSimulationValues>(() => ({ seed: Number(fields.seed), paths: Number(fields.paths), years: Number(fields.years), initialAssets: Number(fields.initialAssets), monthlyWithdrawal: Number(fields.monthlyWithdrawal), expectedReturnPercent: Number(fields.expectedReturn), volatilityPercent: Number(fields.volatility), inflationPercent: Number(fields.inflation) }), [fields]);
  const start = useCallback(() => run(buildSorrSimulationInput(values)), [run, values]);
  const progressPercent = progress?.total ? progress.completed / progress.total * 100 : 0;
  const survival = result ? sorrSurvivalRate(result) : 0;

  return <CalculatorLayout>
    <CalculatorCard title="월 인출 생존확률 조건" description="월초 생활비 인출과 월별 수익률 경로를 MonteCarloEngine으로 계산합니다. 아래 정순·역순 비교와 별개의 확률 분석입니다.">
      <div className="grid gap-4 sm:grid-cols-2"><InputField id="sorr-mc-assets" label="은퇴 시작 자산" type="number" value={fields.initialAssets} onChange={(event) => set("initialAssets", event.target.value)} unit="원" /><InputField id="sorr-mc-withdrawal" label="현재 기준 월 생활비" type="number" value={fields.monthlyWithdrawal} onChange={(event) => set("monthlyWithdrawal", event.target.value)} unit="원" /><InputField id="sorr-mc-years" label="인출 기간" type="number" value={fields.years} onChange={(event) => set("years", event.target.value)} unit="년" /><InputField id="sorr-mc-return" label="연 기대수익률(CAGR)" type="number" value={fields.expectedReturn} onChange={(event) => set("expectedReturn", event.target.value)} unit="%" /><InputField id="sorr-mc-volatility" label="연 변동성" type="number" value={fields.volatility} onChange={(event) => set("volatility", event.target.value)} unit="%" /><InputField id="sorr-mc-inflation" label="연 물가상승률" type="number" value={fields.inflation} onChange={(event) => set("inflation", event.target.value)} unit="%" /><InputField id="sorr-mc-paths" label="경로 수" type="number" value={fields.paths} onChange={(event) => set("paths", event.target.value)} unit="개" /><InputField id="sorr-mc-seed" label="재현 시드" type="number" value={fields.seed} onChange={(event) => set("seed", event.target.value)} /></div>
      {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((issue) => <p key={`${issue.field}-${issue.message}`}>{issue.field}: {issue.message}</p>) ?? error.message}</div> : null}
      <div className="flex gap-3"><button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">월 인출 시뮬레이션</button><button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold disabled:opacity-40">취소</button></div>
      {status === "running" ? <div className="h-2 rounded bg-slate-200"><div className="h-full bg-slate-900" style={{ width: `${progressPercent}%` }} /></div> : null}
    </CalculatorCard>
    {result ? <><CalculatorCard title="월 인출 시뮬레이션 결과" description={`${result.meta.pathsRun.toLocaleString("ko-KR")}개 경로 · ${result.input.months / 12}년`}><ResultHighlight label="기간 종료까지 자산이 소진되지 않은 경로" value={percent(survival)} tone={survival >= 0.8 ? "positive" : "negative"} /><div className="grid gap-4 sm:grid-cols-2"><ResultDetail label="최종 자산 중앙값(현재 가치)" value={won(result.terminal.p50)} unit="원" /><ResultDetail label="최종 자산 P10(현재 가치)" value={won(result.terminal.p10)} unit="원" /><ResultDetail label="소진 경로 비율" value={percent(result.depletion?.rate ?? 0)} /><ResultDetail label="소진 경로 중앙 소진 시점" value={result.depletion ? `${(result.depletion.percentiles.p50 / 12).toFixed(1)}년` : "기간 내 미소진"} /></div></CalculatorCard><CalculatorCard title="가정과 주의사항"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>생활비는 매월 초 인출하고 매년 물가상승률만큼 증가합니다.</li>{result.meta.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></CalculatorCard></> : null}
  </CalculatorLayout>;
}
