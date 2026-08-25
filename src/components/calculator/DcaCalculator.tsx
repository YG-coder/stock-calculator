"use client";

import { useCallback, useMemo, useState } from "react";
import { AdvancedPanel, CalculatorCard, CalculatorLayout, GettingStarted, InputEffectNote, InputField, PercentileNote, ResultCard, ResultDetail, ResultHighlight, ResultNote, SelectField } from "@/components/ui/Shared";
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
      <GettingStarted
        what="매달 일정 금액을 오래 투자했을 때 돈이 얼마나 불어날지 계산합니다. 일반 복리 계산기와 다른 점은 하나의 숫자가 아니라 결과의 범위를 보여준다는 것입니다. 실제 시장은 매년 같은 수익률이 나지 않기 때문입니다."
        input="지금 있는 돈, 매달 넣을 돈, 몇 년 동안 할지 — 이 세 가지가 핵심입니다. 나머지는 얼마나 벌 거라고 가정할지와 얼마나 출렁일 거라고 가정할지입니다."
        read="가운데 큰 숫자가 중간 결과입니다. 만들어본 미래를 좋은 순서로 줄 세웠을 때 딱 가운데 있는 값입니다. 아래 보수적인 경우와 좋은 경우는 그 범위의 양쪽 끝 부근이며 최저·최고 금액이 아닙니다."
        example="초기 투자금 1,000만 원 · 월 50만 원 · 20년 · 수익률 7 · 변동성 15"
      />
      <CalculatorCard title="적립식 투자 조건" description="초기 자산과 월 투자금, 기간, 수익률 가정을 입력해 여러 시장 경로에서 장기 결과의 범위를 확인합니다.">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="dca-initial" label="초기 투자금" type="number" value={fields.initialBalance} onChange={(e) => set("initialBalance", e.target.value)} unit="원" placeholder="예: 10000000" />
          <InputField id="dca-monthly" label="월 투자금" type="number" value={fields.monthlyAmount} onChange={(e) => set("monthlyAmount", e.target.value)} unit="원" placeholder="예: 500000" />
          <InputField id="dca-years" label="투자 기간" type="number" value={fields.years} onChange={(e) => set("years", e.target.value)} unit="년" placeholder="예: 20" />
          <InputField id="dca-return" label="연평균 수익률 (CAGR)" type="number" value={fields.expectedReturn} onChange={(e) => set("expectedReturn", e.target.value)} unit="%" placeholder="예: 7" hint="이 투자가 1년에 평균 몇 %씩 불어난다고 가정할지 정합니다." help="예를 들어 7을 넣으면 ‘매년 7%씩 복리로 불어난다고 치고’ 계산합니다. 매년 정확히 7%가 난다는 뜻이 아니라 긴 기간의 평균이 7%라는 가정입니다.\n\n이 값을 올리면 예상 결과가 전체적으로 커집니다. 실제 수익률은 알 수 없으므로 값을 바꿔가며 결과가 얼마나 달라지는지 보는 용도로 쓰는 편이 낫습니다." />
          <InputField id="dca-volatility" label="수익률이 흔들리는 정도 (변동성)" type="number" value={fields.volatility} onChange={(e) => set("volatility", e.target.value)} unit="%" placeholder="예: 15" hint="수익률이 해마다 얼마나 출렁이는지 정합니다. 이 값이 이 계산기의 핵심입니다." help="0을 넣으면 매년 똑같은 수익률이 나서 일반 복리 계산기와 결과가 같아집니다. 15를 넣으면 어떤 해는 크게 오르고 어떤 해는 떨어지는 상황을 만들어 계산합니다. 그래서 결과가 하나의 숫자가 아니라 범위로 나옵니다.\n\n이 값을 올리면 결과의 폭이 넓어집니다. 좋은 쪽 결과도 커지지만 나쁜 쪽은 더 나빠지고 목표를 넘지 못할 가능성도 함께 커집니다." />
          <InputField id="dca-inflation" label="연 물가상승률" type="number" value={fields.inflation} onChange={(e) => set("inflation", e.target.value)} unit="%" placeholder="예: 2" hint="물가가 매년 얼마나 오른다고 볼지 정합니다." help="20년 뒤의 1억 원은 지금의 1억 원과 가치가 다릅니다. 이 값을 넣으면 결과를 지금 돈으로 치면 얼마인지로 바꿔 보여줍니다.\n\n한국은행의 중기 물가안정목표는 연 2%입니다. 실제 상승률은 시기에 따라 이보다 높을 수 있으니 값을 올려서도 확인해 보세요. 이 값을 올리면 물가를 반영한 결과가 작아집니다." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="dca-timing" label="납입 시점" value={fields.timing} onChange={(e) => set("timing", e.target.value as Fields["timing"])}><option value="end">매월 말</option><option value="start">매월 초</option></SelectField>
          <SelectField id="dca-basis" label="결과 기준" value={fields.reportBasis} onChange={(e) => set("reportBasis", e.target.value as Fields["reportBasis"])}><option value="real">현재 가치(실질)</option><option value="nominal">미래 금액(명목)</option></SelectField>
        </div>
        <p className="text-sm leading-relaxed text-slate-500">매달 투자금을 월초에 넣는지 월말에 넣는지 고릅니다. 결과를 오늘 돈 가치로 볼지, 미래에 찍히는 금액 그대로 볼지 고릅니다. 잘 모르겠으면 기본값 그대로 두셔도 됩니다.</p>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={fields.inflationIndexed} onChange={(e) => set("inflationIndexed", e.target.checked)} /> 매년 월 투자금을 물가상승률만큼 증액
        </label>

        <AdvancedPanel>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField id="dca-paths" label="가상 미래를 몇 번 만들지 (경로 수)" type="number" value={fields.paths} onChange={(e) => set("paths", e.target.value)} unit="개" placeholder="예: 10000" hint="서로 다른 미래를 몇 개 만들어볼지 정합니다." help="이 계산기는 미래를 하나만 예측하지 않고 서로 다른 미래를 수천~수만 개 만들어 결과가 어떻게 퍼지는지를 봅니다. 숫자를 늘리면 결과가 더 안정적이지만 계산이 오래 걸립니다." />
            <InputField id="dca-seed" label="같은 결과를 다시 만드는 번호 (시드)" type="number" value={fields.seed} onChange={(e) => set("seed", e.target.value)} placeholder="예: 20260824" grouping={false} hint="같은 번호를 넣으면 언제 계산해도 똑같은 결과가 나옵니다." help="결과를 캡처해두거나 남에게 보여줄 때 이 번호가 같으면 상대도 똑같은 화면을 볼 수 있습니다. 신경 쓰지 않아도 되는 값입니다." />
          </div>
        </AdvancedPanel>

        <InputEffectNote />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">시뮬레이션 실행</button>
          <button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:opacity-40">취소</button>
        </div>
        {status === "running" ? <div className="h-2 overflow-hidden rounded bg-slate-200"><div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPct}%` }} /></div> : null}
        {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((issue) => <p key={`${issue.field}-${issue.message}`}>{issue.field}: {issue.message}</p>) ?? error.message}</div> : null}
      </CalculatorCard>

      {result ? <>
        <CalculatorCard title="적립식 투자 시뮬레이션 결과" description={`${result.meta.pathsRun.toLocaleString("ko-KR")}개 경로 · ${result.meta.months / 12}년 · 시드 ${result.meta.seed}`}>
          <ResultHighlight label="중간 결과 (최종 자산 중앙값)" value={won(result.terminal.p50)} unit="원" />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail label="보수적인 경우 (하위 10%)" value={won(result.terminal.p10)} unit="원" />
            <ResultDetail label="좋은 경우 (상위 10%)" value={won(result.terminal.p90)} unit="원" />
            <ResultDetail label={result.input.reportBasis === "real" ? "납입 원금(각 납입 시점 현재가치)" : "명목 납입 원금"} value={won(principal)} unit="원" />
            <ResultDetail label="표시 기준" value={result.input.reportBasis === "real" ? "현재 가치" : "미래 금액"} />
          </div>
          <ResultNote><PercentileNote /></ResultNote>
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
