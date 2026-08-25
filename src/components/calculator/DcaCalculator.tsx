"use client";

import { useCallback, useMemo, useState } from "react";
import { AdvancedPanel, CalculatorCard, CalculatorLayout, InputField, PercentileNote, ResultCard, ResultDetail, ResultHighlight, ResultNote, SelectField } from "@/components/ui/Shared";
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

const EXAMPLE_ASSUMPTIONS = {
  expectedReturn: "7",
  volatility: "15",
  inflation: "2",
} as const;

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
  const medianGain = result ? result.terminal.p50 - principal : 0;
  const applyExampleAssumptions = useCallback(() => {
    setFields((prev) => ({ ...prev, ...EXAMPLE_ASSUMPTIONS }));
  }, []);

  return (
    <CalculatorLayout>
      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5 md:p-6">
        <p className="text-sm font-semibold text-blue-900">처음 사용하시나요?</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">세 단계만 입력하면 예상 금액의 범위를 볼 수 있어요.</h2>
        <ol className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-700 sm:grid-cols-3">
          <li className="rounded-2xl bg-white p-4"><strong className="block text-slate-900">1. 투자 계획</strong>지금 가진 돈, 매달 넣을 돈, 투자 기간을 적습니다.</li>
          <li className="rounded-2xl bg-white p-4"><strong className="block text-slate-900">2. 계산 가정</strong>잘 모르겠다면 예시 가정을 버튼으로 채웁니다.</li>
          <li className="rounded-2xl bg-white p-4"><strong className="block text-slate-900">3. 결과 확인</strong>좋지 않은 경우부터 좋은 경우까지 범위를 봅니다.</li>
        </ol>
      </section>
      <CalculatorCard title="1. 나의 투자 계획" description="내가 실제로 투자할 금액과 기간만 입력하세요.">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="dca-initial" label="지금 투자할 금액" type="number" value={fields.initialBalance} onChange={(e) => set("initialBalance", e.target.value)} unit="원" placeholder="예: 10000000" />
          <InputField id="dca-monthly" label="매달 투자할 금액" type="number" value={fields.monthlyAmount} onChange={(e) => set("monthlyAmount", e.target.value)} unit="원" placeholder="예: 500000" />
          <InputField id="dca-years" label="얼마 동안 투자하나요?" type="number" value={fields.years} onChange={(e) => set("years", e.target.value)} unit="년" placeholder="예: 20" />
        </div>
      </CalculatorCard>

      <CalculatorCard title="2. 미래를 계산할 때 사용할 가정" description="미래 수익은 알 수 없으므로 하나의 정답 대신 입력한 가정에 따른 여러 결과를 보여드립니다.">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex md:items-center md:justify-between md:gap-5">
          <div>
            <p className="font-semibold text-slate-900">수익률과 흔들림 정도를 모르시나요?</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">예시 가정은 연평균 수익률 7%, 흔들림 정도 15%, 물가상승률 2%입니다. 사용법을 익히기 위한 값이며 시장 전망이나 추천 수익률이 아닙니다.</p>
          </div>
          <button type="button" onClick={applyExampleAssumptions} className="mt-3 min-h-11 shrink-0 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 md:mt-0">예시 가정 채우기</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="dca-return" label="1년에 평균 얼마나 불어난다고 볼까요?" type="number" value={fields.expectedReturn} onChange={(e) => set("expectedReturn", e.target.value)} unit="%" placeholder="예: 7" hint="장기간의 연평균 복리 수익률 가정입니다." help="전문 용어로 CAGR이라고 합니다. 예를 들어 7을 넣으면 긴 기간에 걸쳐 1년에 평균 7%씩 복리로 불어난다고 가정합니다. 매년 정확히 7%가 난다는 뜻은 아닙니다.\n\n값을 높이면 계산 결과도 커집니다. 미래 수익률은 알 수 없으므로 여러 값으로 비교해 보세요." />
          <InputField id="dca-volatility" label="해마다 얼마나 크게 오르내린다고 볼까요?" type="number" value={fields.volatility} onChange={(e) => set("volatility", e.target.value)} unit="%" placeholder="예: 15" hint="숫자가 클수록 해마다 수익률이 더 크게 흔들립니다." help="전문 용어로 변동성이라고 합니다. 0을 넣으면 매년 같은 수익률로 계산되어 일반 복리 계산기와 비슷해집니다.\n\n값을 높이면 좋은 경우와 좋지 않은 경우의 차이가 커집니다. 예상 손실의 한도를 뜻하지는 않습니다." />
          <InputField id="dca-inflation" label="물가가 1년에 얼마나 오른다고 볼까요?" type="number" value={fields.inflation} onChange={(e) => set("inflation", e.target.value)} unit="%" placeholder="예: 2" hint="미래 금액을 오늘의 돈 가치로 바꿀 때 사용합니다." help="물가가 오르면 같은 금액으로 살 수 있는 것이 줄어듭니다. 현재 가치로 결과를 볼 때 이 값을 반영합니다.\n\n한국은행의 물가안정목표 2%는 계산 예시로 사용할 수 있지만 실제 물가는 시기마다 달라집니다." />
        </div>

        <AdvancedPanel>
          <p className="text-sm leading-relaxed text-slate-500">아래 항목은 특별한 이유가 없다면 그대로 두셔도 됩니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField id="dca-timing" label="매달 투자하는 시점" value={fields.timing} onChange={(e) => set("timing", e.target.value as Fields["timing"])}><option value="end">매월 말</option><option value="start">매월 초</option></SelectField>
            <SelectField id="dca-basis" label="결과 금액의 기준" value={fields.reportBasis} onChange={(e) => set("reportBasis", e.target.value as Fields["reportBasis"])}><option value="real">오늘의 돈 가치로 보기</option><option value="nominal">미래에 표시될 금액으로 보기</option></SelectField>
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={fields.inflationIndexed} onChange={(e) => set("inflationIndexed", e.target.checked)} /> 매년 투자 금액을 물가상승률만큼 늘리기</label>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField id="dca-paths" label="가상 미래를 몇 번 만들지 (경로 수)" type="number" value={fields.paths} onChange={(e) => set("paths", e.target.value)} unit="개" placeholder="예: 10000" hint="서로 다른 미래를 몇 개 만들어볼지 정합니다." help="이 계산기는 미래를 하나만 예측하지 않고 서로 다른 미래를 수천~수만 개 만들어 결과가 어떻게 퍼지는지를 봅니다. 숫자를 늘리면 결과가 더 안정적이지만 계산이 오래 걸립니다." />
            <InputField id="dca-seed" label="같은 결과를 다시 만드는 번호 (시드)" type="number" value={fields.seed} onChange={(e) => set("seed", e.target.value)} placeholder="예: 20260824" grouping={false} hint="같은 번호를 넣으면 언제 계산해도 똑같은 결과가 나옵니다." help="결과를 캡처해두거나 남에게 보여줄 때 이 번호가 같으면 상대도 똑같은 화면을 볼 수 있습니다. 신경 쓰지 않아도 되는 값입니다." />
          </div>
        </AdvancedPanel>

        <p className="text-sm leading-relaxed text-slate-500">수익률을 높이면 전체 결과가 커지고, 오르내림 정도를 높이면 좋지 않은 경우와 좋은 경우의 차이가 커집니다. 기간이 길어지면 복리 효과와 불확실성이 함께 커집니다.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">예상 금액 범위 계산하기</button>
          <button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:opacity-40">취소</button>
        </div>
        {status === "running" ? <div className="h-2 overflow-hidden rounded bg-slate-200"><div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPct}%` }} /></div> : null}
        {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((issue) => <p key={`${issue.field}-${issue.message}`}>{issue.field}: {issue.message}</p>) ?? error.message}</div> : null}
      </CalculatorCard>

      {result ? <>
        <CalculatorCard title="3. 계산 결과" description={`${result.meta.months / 12}년 동안 가능한 미래를 ${result.meta.pathsRun.toLocaleString("ko-KR")}번 만들어 비교한 결과입니다.`}>
          <div className="rounded-2xl bg-blue-50 p-5 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">가운데 결과는 약 {won(result.terminal.p50)}원입니다.</p>
            <p className="mt-2">입력한 돈의 합계 {won(principal)}원보다 {medianGain >= 0 ? `${won(medianGain)}원 많은` : `${won(Math.abs(medianGain))}원 적은`} 금액입니다. 시장 상황이 좋지 않았던 경우에는 약 {won(result.terminal.p10)}원, 좋았던 경우에는 약 {won(result.terminal.p90)}원이었습니다.</p>
          </div>
          <ResultHighlight label="가운데 결과" value={won(result.terminal.p50)} unit="원" />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultDetail label="보수적인 경우 (하위 10%)" value={won(result.terminal.p10)} unit="원" />
            <ResultDetail label="좋은 경우 (상위 10%)" value={won(result.terminal.p90)} unit="원" />
            <ResultDetail label={result.input.reportBasis === "real" ? "투자한 돈의 현재 가치 합계" : "투자한 돈의 합계"} value={won(principal)} unit="원" />
            <ResultDetail label="금액을 보는 기준" value={result.input.reportBasis === "real" ? "오늘의 돈 가치" : "미래에 표시될 금액"} />
          </div>
          <ResultNote><p>같은 결과를 다시 보려면 고급 설정의 시드에 <strong>{result.meta.seed}</strong>를 입력하세요.</p><PercentileNote /></ResultNote>
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
