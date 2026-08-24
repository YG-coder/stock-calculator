"use client";

/**
 * src/components/dev/MonteCarloLab.tsx
 * 역할: MonteCarloEngine 검증용 **개발 전용** 화면. 공개 계산기가 아니다.
 *
 * 공개 사이트 메뉴·sitemap·SEO 에 연결하지 않는다. 미완성 도구가 검색되거나
 * 애드센스 심사 대상에 포함되지 않아야 한다. 라우트 자체가 프로덕션 빌드에서 404 다.
 */

import { useCallback, useMemo, useState } from "react";
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
import { DEFAULT_INFLATION } from "@/lib/montecarlo/presets";
import type { SimulationInput } from "@/lib/montecarlo/types";

const won = (v: number) =>
  Number.isFinite(v) ? new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(v) : "-";
const pct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(2)}%` : "-");

type Fields = {
  seed: string;
  paths: string;
  years: string;
  initialBalance: string;
  monthlyAmount: string;
  timing: "start" | "end";
  inflationIndexed: boolean;
  cagr: string;
  volatility: string;
  inflation: string;
  reportBasis: "nominal" | "real";
  useGoal: boolean;
  targetAmount: string;
  targetProbability: string;
};

const INITIAL: Fields = {
  seed: "20260824",
  paths: "10000",
  years: "20",
  initialBalance: "10000000",
  monthlyAmount: "500000",
  timing: "end",
  inflationIndexed: true,
  cagr: "7",
  volatility: "15",
  inflation: String(DEFAULT_INFLATION.value * 100),
  reportBasis: "real",
  useGoal: true,
  targetAmount: "500000000",
  targetProbability: "80",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none";

export default function MonteCarloLab() {
  const [f, setF] = useState<Fields>(INITIAL);
  const { status, result, progress, error, mode, run, cancel } = useMonteCarlo(150);

  const set = useCallback(
    <K extends keyof Fields>(key: K, value: Fields[K]) => setF((prev) => ({ ...prev, [key]: value })),
    []
  );

  const buildInput = useCallback(
    (seed: number): SimulationInput => ({
      seed,
      paths: Number(f.paths),
      months: Math.round(Number(f.years) * 12),
      initialBalance: Number(f.initialBalance),
      cashFlow: {
        monthlyAmount: Number(f.monthlyAmount),
        timing: f.timing,
        inflationIndexed: f.inflationIndexed,
      },
      returns: {
        kind: "parametric",
        expectedReturn: Number(f.cagr) / 100,
        volatility: Number(f.volatility) / 100,
      },
      inflationRate: Number(f.inflation) / 100,
      reportBasis: f.reportBasis,
      goal: f.useGoal
        ? {
            kind: "terminal-target",
            targetAmount: Number(f.targetAmount),
            targetProbability: Number(f.targetProbability) / 100,
          }
        : undefined,
    }),
    [f]
  );

  const start = useCallback(() => run(buildInput(Number(f.seed))), [buildInput, f.seed, run]);
  const startNewSeed = useCallback(() => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    set("seed", String(seed));
    run(buildInput(seed));
  }, [buildInput, run, set]);

  const percent = useMemo(
    () => (progress && progress.total > 0 ? (progress.completed / progress.total) * 100 : 0),
    [progress]
  );

  const terminal = result?.terminal;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="rounded-lg border border-amber-300 bg-amber-50 p-4">
        <h1 className="text-lg font-bold text-amber-900">MonteCarloEngine 검증 화면 (개발 전용)</h1>
        <p className="mt-1 text-sm text-amber-800">
          공개 계산기가 아닙니다. 프로덕션 빌드에서는 이 라우트가 존재하지 않습니다.
          실행 모드: <strong>{mode}</strong>
        </p>
      </header>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <Row label="시드">
          <input className={inputClass} value={f.seed} onChange={(e) => set("seed", e.target.value)} />
        </Row>
        <Row label="경로 수">
          <input className={inputClass} value={f.paths} onChange={(e) => set("paths", e.target.value)} />
        </Row>
        <Row label="기간(년)">
          <input className={inputClass} value={f.years} onChange={(e) => set("years", e.target.value)} />
        </Row>
        <Row label="초기 자산(원)">
          <input
            className={inputClass}
            value={f.initialBalance}
            onChange={(e) => set("initialBalance", e.target.value)}
          />
        </Row>
        <Row label="월 현금흐름(원, 음수=인출)">
          <input
            className={inputClass}
            value={f.monthlyAmount}
            onChange={(e) => set("monthlyAmount", e.target.value)}
          />
        </Row>
        <Row label="적용 시점">
          <select
            className={inputClass}
            value={f.timing}
            onChange={(e) => set("timing", e.target.value as "start" | "end")}
          >
            <option value="end">기말 (end)</option>
            <option value="start">기초 (start)</option>
          </select>
        </Row>
        <Row label="기대수익률 CAGR(%, 연복리·명목)">
          <input className={inputClass} value={f.cagr} onChange={(e) => set("cagr", e.target.value)} />
        </Row>
        <Row label="변동성(%, 단순수익률 기준)">
          <input
            className={inputClass}
            value={f.volatility}
            onChange={(e) => set("volatility", e.target.value)}
          />
        </Row>
        <Row label="물가상승률(%)">
          <input
            className={inputClass}
            value={f.inflation}
            onChange={(e) => set("inflation", e.target.value)}
          />
        </Row>
        <Row label="표시 기준">
          <select
            className={inputClass}
            value={f.reportBasis}
            onChange={(e) => set("reportBasis", e.target.value as "nominal" | "real")}
          >
            <option value="real">실질</option>
            <option value="nominal">명목</option>
          </select>
        </Row>
        <Row label="목표 금액(원)">
          <input
            className={inputClass}
            value={f.targetAmount}
            onChange={(e) => set("targetAmount", e.target.value)}
            disabled={!f.useGoal}
          />
        </Row>
        <Row label="목표 확률(%)">
          <input
            className={inputClass}
            value={f.targetProbability}
            onChange={(e) => set("targetProbability", e.target.value)}
            disabled={!f.useGoal}
          />
        </Row>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={f.inflationIndexed}
            onChange={(e) => set("inflationIndexed", e.target.checked)}
          />
          적립액 물가 연동
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={f.useGoal}
            onChange={(e) => set("useGoal", e.target.checked)}
          />
          목표 사용 (terminal-target)
        </label>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={start}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          실행 (동일 시드)
        </button>
        <button
          type="button"
          onClick={startNewSeed}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          새 시드로 실행
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={status !== "running"}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          취소
        </button>
        <span className="text-sm text-slate-500">상태: {status}</span>
      </section>

      {status === "running" && (
        <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
          <div className="h-full bg-slate-800 transition-all" style={{ width: `${percent}%` }} />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">입력 오류</p>
          <ul className="mt-2 list-disc pl-5">
            {(error.issues ?? []).map((i) => (
              <li key={`${i.field}-${i.message}`}>
                <code>{i.field}</code> — {i.message}
              </li>
            ))}
          </ul>
          {!error.issues && <p className="mt-2">{error.message}</p>}
        </div>
      )}

      {result && terminal && (
        <section className="flex flex-col gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-base font-bold text-slate-900">최종 자산 분포 ({result.input.reportBasis === "real" ? "실질" : "명목"})</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {([
                  ["p5", terminal.p5],
                  ["p10", terminal.p10],
                  ["p25", terminal.p25],
                  ["p50 (중앙값)", terminal.p50],
                  ["p75", terminal.p75],
                  ["p90", terminal.p90],
                  ["p95", terminal.p95],
                ] as const).map(([label, value]) => (
                  <tr key={label} className={label.startsWith("p50") ? "font-bold" : ""}>
                    <td className="py-1 text-slate-600">{label}</td>
                    <td className="py-1 text-right tabular-nums text-slate-900">{won(value)}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-400">
              평균({won(terminal.mean)}원)은 두꺼운 꼬리에서 불안정하므로 참고용입니다.
            </p>
          </div>

          {result.goal && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
              <h2 className="text-base font-bold text-slate-900">목표</h2>
              <p className="mt-2 text-slate-700">
                이 가정에서 <strong>{pct(result.goal.successProbability)}</strong> 시나리오가 목표를 달성합니다.
              </p>
              {result.goal.inversion && (
                <p className="mt-1 text-slate-700">
                  목표 확률을 맞추려면 월 <strong>{won(result.goal.inversion.requiredMonthlyAmount)}원</strong>
                  {" "}(방식: {result.goal.inversion.method}, 그 납입액에서의 확률{" "}
                  {pct(result.goal.inversion.successProbabilityAt)}, 고정 경로{" "}
                  {result.goal.inversion.fixedPaths.count}개)
                </p>
              )}
            </div>
          )}

          {result.depletion && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
              <h2 className="text-base font-bold text-slate-900">소진</h2>
              <p className="mt-2 text-slate-700">
                소진 확률 {pct(result.depletion.rate)} · 소진 시점 중앙값{" "}
                {result.depletion.percentiles.p50.toFixed(0)}개월
              </p>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <h2 className="text-base font-bold text-slate-900">가정과 실행 정보</h2>
            <dl className="mt-2 grid gap-1 sm:grid-cols-2">
              <div>가정: {result.assumptions.label}</div>
              <div>충격: {result.assumptions.shockLabel}</div>
              <div>μ_m: {result.assumptions.muM.toFixed(8)}</div>
              <div>σ_m: {result.assumptions.sigmaM.toFixed(8)}</div>
              <div>시드: {result.meta.seed}</div>
              <div>경로 수: {result.meta.pathsRun.toLocaleString()}</div>
              <div>기간: {result.meta.months}개월</div>
              <div>실행 시간: {result.meta.elapsedMs.toFixed(0)}ms</div>
              <div>배치: {result.meta.batches}</div>
              <div>절단 재추출: {result.meta.truncatedShocks}</div>
              <div>클램프: {String(result.meta.clamped)}</div>
              <div>엔진: {result.meta.engineVersion}</div>
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <h2 className="text-base font-bold text-slate-900">경고</h2>
            <ul className="mt-2 list-disc pl-5">
              {result.meta.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
