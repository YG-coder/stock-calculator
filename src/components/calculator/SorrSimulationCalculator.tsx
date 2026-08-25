"use client";

import { useCallback, useMemo, useState } from "react";
import { AdvancedPanel, CalculatorCard, CalculatorLayout, GettingStarted, InputEffectNote, InputField, PercentileNote, ResultCard, ResultDetail, ResultHighlight, ResultNote } from "@/components/ui/Shared";
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
import { buildSorrSimulationInput, sorrSurvivalRate, type SorrSimulationValues } from "@/lib/sorr";

type Fields = Record<"seed" | "paths" | "years" | "initialAssets" | "monthlyWithdrawal" | "expectedReturn" | "volatility" | "inflation", string>;
const initialFields: Fields = { seed: "", paths: "", years: "", initialAssets: "", monthlyWithdrawal: "", expectedReturn: "", volatility: "", inflation: "" };
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
      <GettingStarted
        what="은퇴 초반의 하락장이 정기적으로 생활비를 꺼내 쓰는 자산에 얼마나 큰 영향을 주는지 계산합니다."
        input="은퇴 시작 자산, 매달 생활비, 사용할 기간과 수익률이 오르내리는 정도를 입력하세요."
        read="자산이 끝까지 남은 경우의 비율과 소진 시점을 확인하세요. 같은 평균수익률도 발생 순서에 따라 결과가 달라질 수 있습니다."
        example="은퇴 자산 5억 원 · 월 생활비 200만 원 · 30년 · 연평균 수익률 7% · 흔들림 정도 15%"
      />
    <CalculatorCard title="월 인출 생존확률 조건" description="월초 생활비 인출과 월별 수익률 경로를 확률 시뮬레이션으로 계산합니다. 아래 정순·역순 비교와 별개의 분석입니다.">
      <div className="grid gap-4 sm:grid-cols-2"><InputField id="sorr-mc-assets" label="은퇴 시작 자산" type="number" value={fields.initialAssets} onChange={(event) => set("initialAssets", event.target.value)} unit="원" placeholder="예: 1000000000" /><InputField id="sorr-mc-withdrawal" label="현재 기준 월 생활비" type="number" value={fields.monthlyWithdrawal} onChange={(event) => set("monthlyWithdrawal", event.target.value)} unit="원" placeholder="예: 3000000" /><InputField id="sorr-mc-years" label="인출 기간" type="number" value={fields.years} onChange={(event) => set("years", event.target.value)} unit="년" placeholder="예: 30" /><InputField id="sorr-mc-return" label="연평균 수익률 (CAGR)" type="number" value={fields.expectedReturn} onChange={(event) => set("expectedReturn", event.target.value)} unit="%" placeholder="예: 7" hint="이 투자가 1년에 평균 몇 %씩 불어난다고 가정할지 정합니다." help="예를 들어 7을 넣으면 ‘매년 7%씩 복리로 불어난다고 치고’ 계산합니다. 매년 정확히 7%가 난다는 뜻이 아니라 긴 기간의 평균이 7%라는 가정입니다.\n\n이 값을 올리면 예상 결과가 전체적으로 커집니다. 실제 수익률은 알 수 없으므로 값을 바꿔가며 결과가 얼마나 달라지는지 보는 용도로 쓰는 편이 낫습니다." /><InputField id="sorr-mc-volatility" label="수익률이 흔들리는 정도 (변동성)" type="number" value={fields.volatility} onChange={(event) => set("volatility", event.target.value)} unit="%" placeholder="예: 15" hint="수익률이 해마다 얼마나 출렁이는지 정합니다. 이 값이 이 계산기의 핵심입니다." help="0을 넣으면 매년 똑같은 수익률이 나서 일반 복리 계산기와 결과가 같아집니다. 15를 넣으면 어떤 해는 크게 오르고 어떤 해는 떨어지는 상황을 만들어 계산합니다. 그래서 결과가 하나의 숫자가 아니라 범위로 나옵니다.\n\n이 값을 올리면 결과의 폭이 넓어집니다. 좋은 쪽 결과도 커지지만 나쁜 쪽은 더 나빠지고 목표를 넘지 못할 가능성도 함께 커집니다." /><InputField id="sorr-mc-inflation" label="연 물가상승률" type="number" value={fields.inflation} onChange={(event) => set("inflation", event.target.value)} unit="%" placeholder="예: 2" hint="물가가 매년 얼마나 오른다고 볼지 정합니다." help="20년 뒤의 1억 원은 지금의 1억 원과 가치가 다릅니다. 이 값을 넣으면 결과를 지금 돈으로 치면 얼마인지로 바꿔 보여줍니다.\n\n한국은행의 중기 물가안정목표는 연 2%입니다. 실제 상승률은 시기에 따라 이보다 높을 수 있으니 값을 올려서도 확인해 보세요. 이 값을 올리면 물가를 반영한 결과가 작아집니다." /></div>
      {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((issue) => <p key={`${issue.field}-${issue.message}`}>{issue.field}: {issue.message}</p>) ?? error.message}</div> : null}
      <div className="flex gap-3"><button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">월 인출 시뮬레이션</button><button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold disabled:opacity-40">취소</button></div>
      {status === "running" ? <div className="h-2 rounded bg-slate-200"><div className="h-full bg-slate-900" style={{ width: `${progressPercent}%` }} /></div> : null}
    
      <AdvancedPanel>
        <div className="grid gap-4 sm:grid-cols-2"><InputField id="sorr-mc-paths" label="가상 미래를 몇 번 만들지 (경로 수)" type="number" value={fields.paths} onChange={(event) => set("paths", event.target.value)} unit="개" placeholder="예: 10000" hint="서로 다른 미래를 몇 개 만들어볼지 정합니다." help="이 계산기는 미래를 하나만 예측하지 않고 서로 다른 미래를 수천~수만 개 만들어 결과가 어떻게 퍼지는지를 봅니다. 숫자를 늘리면 결과가 더 안정적이지만 계산이 오래 걸립니다." /><InputField id="sorr-mc-seed" label="같은 결과를 다시 만드는 번호 (시드)" type="number" value={fields.seed} onChange={(event) => set("seed", event.target.value)} placeholder="예: 20260824" grouping={false} hint="같은 번호를 넣으면 언제 계산해도 똑같은 결과가 나옵니다." help="결과를 캡처해두거나 남에게 보여줄 때 이 번호가 같으면 상대도 똑같은 화면을 볼 수 있습니다. 신경 쓰지 않아도 되는 값입니다." /></div>
      </AdvancedPanel>
      <InputEffectNote />
      </CalculatorCard>
    {result ? <><CalculatorCard title="월 인출 시뮬레이션 결과" description={`${result.meta.pathsRun.toLocaleString("ko-KR")}개 경로 · ${result.input.months / 12}년`}><ResultHighlight label="기간 종료까지 자산이 소진되지 않은 경로" value={percent(survival)} tone={survival >= 0.8 ? "positive" : "negative"} /><div className="grid gap-4 sm:grid-cols-2"><ResultDetail label="중간 결과 (중앙값, 현재 가치)" value={won(result.terminal.p50)} unit="원" /><ResultDetail label="보수적인 경우 (하위 10%, 현재 가치)" value={won(result.terminal.p10)} unit="원" /><ResultDetail label="소진 경로 비율" value={percent(result.depletion?.rate ?? 0)} /><ResultDetail label="소진 경로 중앙 소진 시점" value={result.depletion ? `${(result.depletion.percentiles.p50 / 12).toFixed(1)}년` : "기간 내 미소진"} /></div><ResultNote><PercentileNote /></ResultNote></CalculatorCard><CalculatorCard title="가정과 주의사항"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>생활비는 매월 초 인출하고 매년 물가상승률만큼 증가합니다.</li>{result.meta.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></CalculatorCard></> : <ResultCard title="월 인출 시뮬레이션 결과" isValid={false} emptyMessage="값을 입력하고 시뮬레이션을 실행하면 결과가 표시됩니다." />}
  </CalculatorLayout>;
}
