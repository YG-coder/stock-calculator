"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorCard, CalculatorLayout, InputField, ResultCard, ResultDetail, ResultHighlight, SelectField } from "@/components/ui/Shared";
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
import { buildDcaInput, contributionsFromInput, type DcaFormValues } from "@/lib/dca";
import type { PercentileBand } from "@/lib/montecarlo/types";

type Fields = Record<"seed" | "paths" | "years" | "initialBalance" | "monthlyAmount" | "expectedReturn" | "volatility" | "inflation", string> & {
  timing: "start" | "end";
  inflationIndexed: boolean;
  reportBasis: "nominal" | "real";
};

const INITIAL: Fields = {
  seed: "",
  paths: "",
  years: "",
  initialBalance: "",
  monthlyAmount: "",
  expectedReturn: "",
  volatility: "",
  inflation: "",
  timing: "end",
  inflationIndexed: false,
  reportBasis: "real",
};

const won = (value: number) => Number.isFinite(value)
  ? new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value)
  : "-";

function FanChart({ bands }: { bands: PercentileBand[] }) {
  const width = 800;
  const height = 300;
  const pad = 76;
  const max = Math.max(...bands.map((b) => b.p90), 1);
  const x = (index: number) => pad + (index / Math.max(1, bands.length - 1)) * (width - pad * 2);
  const y = (value: number) => height - pad - (value / max) * (height - pad * 2);
  const polygon = (upper: keyof PercentileBand, lower: keyof PercentileBand) => [
    ...bands.map((b, i) => `${x(i)},${y(Number(b[upper]))}`),
    ...bands.map((b, i) => `${x(bands.length - 1 - i)},${y(Number(bands[bands.length - 1 - i][lower]))}`),
  ].join(" ");
  const median = bands.map((b, i) => `${x(i)},${y(b.p50)}`).join(" ");
  const axisLabel = (value: number) => value >= 100_000_000 ? `${(value / 100_000_000).toFixed(1)}억` : value >= 10_000 ? `${Math.round(value / 10_000).toLocaleString("ko-KR")}만` : Math.round(value).toLocaleString("ko-KR");
  const yTicks = [0, max / 2, max];

  return (
    <div className="overflow-x-auto" role="img" aria-label="투자 기간별 자산 분포 팬 차트">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-hidden="true">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#cbd5e1" />
        {yTicks.map((tick) => <g key={tick}><line x1={pad} y1={y(tick)} x2={width - pad} y2={y(tick)} stroke="#e2e8f0" /><text x={pad - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#64748b">{axisLabel(tick)}원</text></g>)}
        <polygon points={polygon("p90", "p10")} fill="#dbeafe" />
        <polygon points={polygon("p75", "p25")} fill="#93c5fd" />
        <polyline points={median} fill="none" stroke="#0f172a" strokeWidth="3" />
        {bands.map((b, i) => i % Math.max(1, Math.ceil(bands.length / 5)) === 0 || i === bands.length - 1 ? (
          <text key={b.month} x={x(i)} y={height - 10} textAnchor="middle" fontSize="13" fill="#64748b">{Math.round(b.month / 12)}년</text>
        ) : null)}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
        <span><i className="mr-1 inline-block h-3 w-3 bg-blue-100" />10~90 백분위</span>
        <span><i className="mr-1 inline-block h-3 w-3 bg-blue-300" />25~75 백분위</span>
        <span><i className="mr-1 inline-block h-0.5 w-4 bg-slate-900 align-middle" />중앙값</span>
      </div>
    </div>
  );
}

export default function DcaCalculator() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const { status, result, progress, error, run, cancel } = useMonteCarlo(0);
  const set = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => setFields((prev) => ({ ...prev, [key]: value })), []);

  const values = useMemo<DcaFormValues>(() => ({
    seed: Number(fields.seed), paths: Number(fields.paths), years: Number(fields.years),
    initialBalance: Number(fields.initialBalance), monthlyAmount: Number(fields.monthlyAmount),
    expectedReturnPercent: Number(fields.expectedReturn), volatilityPercent: Number(fields.volatility),
    inflationPercent: Number(fields.inflation), timing: fields.timing,
    inflationIndexed: fields.inflationIndexed, reportBasis: fields.reportBasis,
  }), [fields]);

  const start = useCallback(() => run(buildDcaInput(values)), [run, values]);
  const progressPct = progress && progress.total ? progress.completed / progress.total * 100 : 0;
  const principal = result ? contributionsFromInput(result.input) : 0;

  return (
    <CalculatorLayout>
      <CalculatorCard title="적립식 투자 조건" description="초기 자산과 월 투자금, 기간, 수익률 가정을 입력해 여러 시장 경로에서 장기 결과의 범위를 확인합니다.">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="dca-initial" label="초기 투자금" type="number" value={fields.initialBalance} onChange={(e) => set("initialBalance", e.target.value)} unit="원" placeholder="예: 10000000" />
          <InputField id="dca-monthly" label="월 투자금" type="number" value={fields.monthlyAmount} onChange={(e) => set("monthlyAmount", e.target.value)} unit="원" placeholder="예: 500000" />
          <InputField id="dca-years" label="투자 기간" type="number" value={fields.years} onChange={(e) => set("years", e.target.value)} unit="년" placeholder="예: 20" />
          <InputField id="dca-return" label="연 기대수익률(CAGR)" type="number" value={fields.expectedReturn} onChange={(e) => set("expectedReturn", e.target.value)} unit="%" placeholder="예: 7" />
          <InputField id="dca-volatility" label="연 변동성" type="number" value={fields.volatility} onChange={(e) => set("volatility", e.target.value)} unit="%" placeholder="예: 15" />
          <InputField id="dca-inflation" label="연 물가상승률" type="number" value={fields.inflation} onChange={(e) => set("inflation", e.target.value)} unit="%" placeholder="예: 2" />
          <InputField id="dca-paths" label="시뮬레이션 경로 수" type="number" value={fields.paths} onChange={(e) => set("paths", e.target.value)} unit="개" placeholder="예: 10000" />
          <InputField id="dca-seed" label="재현 시드" type="number" value={fields.seed} onChange={(e) => set("seed", e.target.value)} placeholder="예: 20260824" grouping={false} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="dca-timing" label="납입 시점" value={fields.timing} onChange={(e) => set("timing", e.target.value as Fields["timing"])}><option value="end">매월 말</option><option value="start">매월 초</option></SelectField>
          <SelectField id="dca-basis" label="결과 기준" value={fields.reportBasis} onChange={(e) => set("reportBasis", e.target.value as Fields["reportBasis"])}><option value="real">현재 가치(실질)</option><option value="nominal">미래 금액(명목)</option></SelectField>
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={fields.inflationIndexed} onChange={(e) => set("inflationIndexed", e.target.checked)} /> 매년 월 투자금을 물가상승률만큼 증액
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">시뮬레이션 실행</button>
          <button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:opacity-40">취소</button>
        </div>
        {status === "running" ? <div className="h-2 overflow-hidden rounded bg-slate-200"><div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPct}%` }} /></div> : null}
        {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((issue) => <p key={`${issue.field}-${issue.message}`}>{issue.field}: {issue.message}</p>) ?? error.message}</div> : null}
      </CalculatorCard>

      {result ? <>
        <CalculatorCard title="적립식 투자 시뮬레이션 결과" description={`${result.meta.pathsRun.toLocaleString("ko-KR")}개 경로 · ${result.meta.months / 12}년 · 시드 ${result.meta.seed}`}>
          <ResultHighlight label="최종 자산 중앙값" value={won(result.terminal.p50)} unit="원" />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail label="보수적 범위(P10)" value={won(result.terminal.p10)} unit="원" />
            <ResultDetail label="낙관적 범위(P90)" value={won(result.terminal.p90)} unit="원" />
            <ResultDetail label={result.input.reportBasis === "real" ? "납입 원금(각 납입 시점 현재가치)" : "명목 납입 원금"} value={won(principal)} unit="원" />
            <ResultDetail label="표시 기준" value={result.input.reportBasis === "real" ? "현재 가치" : "미래 금액"} />
          </div>
          <p className="text-xs leading-relaxed text-slate-500">P10은 결과의 하위 10% 지점이며 최저값이나 손실 한도가 아닙니다. 평균값은 두꺼운 꼬리 분포에서 불안정해 강조하지 않습니다.</p>
        </CalculatorCard>
        <CalculatorCard className="min-w-0" title="기간별 자산 분포" description="진한 선은 중앙값, 음영은 각 시점의 시뮬레이션 분포 범위입니다."><FanChart bands={result.bands} /></CalculatorCard>
        <CalculatorCard title="가정과 주의사항">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            <li>연 기대수익률은 산술평균이 아닌 명목 총수익 CAGR 가정입니다.</li>
            <li>월별 수익률은 독립적인 Student&apos;s t 충격을 사용하며 시장 국면 전환과 변동성 군집은 반영하지 않습니다.</li>
            {result.meta.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </CalculatorCard>
      </> : <ResultCard title="적립식 투자 시뮬레이션 결과" isValid={false} emptyMessage="값을 입력하고 시뮬레이션을 실행하면 결과가 표시됩니다." />}
    </CalculatorLayout>
  );
}
