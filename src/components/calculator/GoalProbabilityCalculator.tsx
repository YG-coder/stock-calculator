"use client";

import { useCallback, useMemo, useState } from "react";
import { AdvancedPanel, CalculatorCard, CalculatorLayout, InputEffectNote, InputField, PercentileNote, ResultCard, ResultDetail, ResultHighlight, ResultNote, SelectField } from "@/components/ui/Shared";
import { useMonteCarlo } from "@/hooks/useMonteCarlo";
import { buildGoalProbabilityInput, type GoalProbabilityValues } from "@/lib/goal-probability";
import { probabilityForContribution, requiredForProbability, type RequiredContributions } from "@/lib/montecarlo";

type Fields = Record<"seed" | "paths" | "years" | "initialBalance" | "monthlyAmount" | "expectedReturn" | "volatility" | "inflation" | "targetAmount" | "targetProbability", string> & { reportBasis: "nominal" | "real" };
const INITIAL: Fields = { seed: "", paths: "", years: "", initialBalance: "", monthlyAmount: "", expectedReturn: "", volatility: "", inflation: "", targetAmount: "", targetProbability: "", reportBasis: "real" };
const won = (v: number) => Number.isFinite(v) ? new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.ceil(v)) : "-";
const pct = (v: number) => Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "-";

export default function GoalProbabilityCalculator() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const { status, result, progress, error, run, cancel } = useMonteCarlo(0);
  const set = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => setFields((prev) => ({ ...prev, [key]: value })), []);
  const values = useMemo<GoalProbabilityValues>(() => ({
    seed: Number(fields.seed), paths: Number(fields.paths), years: Number(fields.years), initialBalance: Number(fields.initialBalance), monthlyAmount: Number(fields.monthlyAmount), expectedReturnPercent: Number(fields.expectedReturn), volatilityPercent: Number(fields.volatility), inflationPercent: Number(fields.inflation), timing: "end", inflationIndexed: false, reportBasis: fields.reportBasis, targetAmount: Number(fields.targetAmount), targetProbabilityPercent: Number(fields.targetProbability),
  }), [fields]);
  const start = useCallback(() => run(buildGoalProbabilityInput(values)), [run, values]);
  const inversion = result?.goal?.inversion;
  const required = inversion?.requiredMonthlyAmount;
  const executedMonthly = result?.input.cashFlow.monthlyAmount ?? 0;
  const progressPct = progress && progress.total ? progress.completed / progress.total * 100 : 0;

  const sensitivity = useMemo(() => {
    if (!result || !inversion?.sortedRequired) return [];
    const rc: RequiredContributions = { sorted: inversion.sortedRequired, fixedCount: inversion.fixedPaths.count, fixedSuccesses: inversion.fixedPaths.successes, totalPaths: result.meta.pathsRun };
    return [0.5, 0.7, 0.8, 0.9].map((p) => ({ probability: p, amount: requiredForProbability(rc, p) }));
  }, [inversion, result]);

  return <CalculatorLayout>
    <CalculatorCard title="목표와 투자 조건" description="목표금액과 기간, 현재 월 투자금을 입력하면 달성 시나리오 비율과 원하는 목표 확률에 필요한 최소 월 투자금을 계산합니다.">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField id="goal-target" label="목표 금액" type="number" value={fields.targetAmount} onChange={(e) => set("targetAmount", e.target.value)} unit="원" placeholder="예: 500000000" />
        <InputField id="goal-probability" label="목표 시나리오 비율" type="number" value={fields.targetProbability} onChange={(e) => set("targetProbability", e.target.value)} unit="%" placeholder="예: 80" />
        <InputField id="goal-years" label="목표 기간" type="number" value={fields.years} onChange={(e) => set("years", e.target.value)} unit="년" placeholder="예: 20" />
        <InputField id="goal-initial" label="현재 투자금" type="number" value={fields.initialBalance} onChange={(e) => set("initialBalance", e.target.value)} unit="원" placeholder="예: 10000000" />
        <InputField id="goal-monthly" label="현재 월 투자금" type="number" value={fields.monthlyAmount} onChange={(e) => set("monthlyAmount", e.target.value)} unit="원" placeholder="예: 500000" />
        <InputField id="goal-return" label="연평균 수익률 (CAGR)" type="number" value={fields.expectedReturn} onChange={(e) => set("expectedReturn", e.target.value)} unit="%" placeholder="예: 7" hint="이 투자가 1년에 평균 몇 %씩 불어난다고 가정할지 정합니다." help="예를 들어 7을 넣으면 ‘매년 7%씩 복리로 불어난다고 치고’ 계산합니다. 매년 정확히 7%가 난다는 뜻이 아니라 긴 기간의 평균이 7%라는 가정입니다.\n\n이 값을 올리면 예상 결과가 전체적으로 커집니다. 실제 수익률은 알 수 없으므로 값을 바꿔가며 결과가 얼마나 달라지는지 보는 용도로 쓰는 편이 낫습니다." />
        <InputField id="goal-volatility" label="수익률이 흔들리는 정도 (변동성)" type="number" value={fields.volatility} onChange={(e) => set("volatility", e.target.value)} unit="%" placeholder="예: 15" hint="수익률이 해마다 얼마나 출렁이는지 정합니다. 이 값이 이 계산기의 핵심입니다." help="0을 넣으면 매년 똑같은 수익률이 나서 일반 복리 계산기와 결과가 같아집니다. 15를 넣으면 어떤 해는 크게 오르고 어떤 해는 떨어지는 상황을 만들어 계산합니다. 그래서 결과가 하나의 숫자가 아니라 범위로 나옵니다.\n\n이 값을 올리면 결과의 폭이 넓어집니다. 좋은 쪽 결과도 커지지만 나쁜 쪽은 더 나빠지고 목표를 넘지 못할 가능성도 함께 커집니다." />
        <InputField id="goal-inflation" label="연 물가상승률" type="number" value={fields.inflation} onChange={(e) => set("inflation", e.target.value)} unit="%" placeholder="예: 2" hint="물가가 매년 얼마나 오른다고 볼지 정합니다." help="20년 뒤의 1억 원은 지금의 1억 원과 가치가 다릅니다. 이 값을 넣으면 결과를 지금 돈으로 치면 얼마인지로 바꿔 보여줍니다.\n\n한국은행의 중기 물가안정목표는 연 2%입니다. 실제 상승률은 시기에 따라 이보다 높을 수 있으니 값을 올려서도 확인해 보세요. 이 값을 올리면 물가를 반영한 결과가 작아집니다." />
        
        
      </div>
      <SelectField id="goal-basis" label="목표금액 기준" value={fields.reportBasis} onChange={(e) => set("reportBasis", e.target.value as Fields["reportBasis"])}><option value="real">현재 가치(실질)</option><option value="nominal">미래 금액(명목)</option></SelectField>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={start} disabled={status === "running"} className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">달성 가능성 계산</button><button type="button" onClick={cancel} disabled={status !== "running"} className="min-h-11 rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:opacity-40">취소</button></div>
      {status === "running" ? <div className="h-2 overflow-hidden rounded bg-slate-200"><div className="h-full bg-slate-900" style={{ width: `${progressPct}%` }} /></div> : null}
      {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error.issues?.map((i) => <p key={`${i.field}-${i.message}`}>{i.field}: {i.message}</p>) ?? error.message}</div> : null}
    
      <AdvancedPanel>
        <div className="grid gap-4 sm:grid-cols-2"><InputField id="goal-paths" label="가상 미래를 몇 번 만들지 (경로 수)" type="number" value={fields.paths} onChange={(e) => set("paths", e.target.value)} unit="개" placeholder="예: 10000" hint="서로 다른 미래를 몇 개 만들어볼지 정합니다." help="이 계산기는 미래를 하나만 예측하지 않고 서로 다른 미래를 수천~수만 개 만들어 결과가 어떻게 퍼지는지를 봅니다. 숫자를 늘리면 결과가 더 안정적이지만 계산이 오래 걸립니다." /><InputField id="goal-seed" label="같은 결과를 다시 만드는 번호 (시드)" type="number" value={fields.seed} onChange={(e) => set("seed", e.target.value)} placeholder="예: 20260824" grouping={false} hint="같은 번호를 넣으면 언제 계산해도 똑같은 결과가 나옵니다." help="결과를 캡처해두거나 남에게 보여줄 때 이 번호가 같으면 상대도 똑같은 화면을 볼 수 있습니다. 신경 쓰지 않아도 되는 값입니다." /></div>
      </AdvancedPanel>
      <InputEffectNote />
      </CalculatorCard>

    {result?.goal ? <>
      <CalculatorCard title="목표달성확률 결과" description={`${result.meta.pathsRun.toLocaleString("ko-KR")}개 시나리오 · ${result.meta.months / 12}년 · 시드 ${result.meta.seed}`}>
        <ResultHighlight label="현재 월 투자금의 목표 달성 시나리오 비율" value={pct(result.goal.successProbability)} />
        {required !== undefined ? <div className="grid gap-4 sm:grid-cols-2"><ResultHighlight label={`${(result.input.goal?.targetProbability ?? 0) * 100}% 시나리오 목표에 필요한 월 투자금`} value={won(required)} unit="원" tone="positive" /><ResultHighlight label="현재 대비 월 조정액" value={won(required - executedMonthly)} unit="원" tone={required > executedMonthly ? "negative" : "positive"} /></div> : null}
        <div className="grid gap-4 sm:grid-cols-2"><ResultDetail label="목표 금액" value={won(result.input.goal?.targetAmount ?? 0)} unit="원" /><ResultDetail label="중간 결과 (최종 자산 중앙값)" value={won(result.terminal.p50)} unit="원" /><ResultDetail label="역산 방식" value={inversion?.method === "linear-exact" ? "선형 정확 역산" : "미지원"} /><ResultDetail label="표시 기준" value={result.input.reportBasis === "real" ? "현재 가치" : "미래 금액"} /></div>
        <ResultNote><PercentileNote /><p>“80% 시나리오”는 미래 성공을 80% 보장한다는 뜻이 아니라, 입력한 가정과 시드로 만든 경로 중 목표를 넘은 비율입니다.</p></ResultNote>
      </CalculatorCard>
      {sensitivity.length ? <CalculatorCard className="min-w-0" title="목표 시나리오 비율별 필요 월 투자금" description="같은 시뮬레이션 경로를 재사용하므로 표의 값은 추가 시뮬레이션 없이 계산됩니다."><div className="overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th scope="col" className="px-2 py-2 text-left">목표 비율</th><th scope="col" className="px-2 py-2 text-right">필요 월 투자금</th><th scope="col" className="px-2 py-2 text-right">해당 금액 달성 비율</th></tr></thead><tbody>{sensitivity.map((row) => {
          const inv = result.goal?.inversion; if (!inv?.sortedRequired || row.amount === null) return null;
          const rc: RequiredContributions = { sorted: inv.sortedRequired, fixedCount: inv.fixedPaths.count, fixedSuccesses: inv.fixedPaths.successes, totalPaths: result.meta.pathsRun };
          return <tr key={row.probability} className="border-b border-slate-100 last:border-0"><td className="px-2 py-2">{pct(row.probability)}</td><td className="px-2 py-2 text-right tabular-nums">{won(row.amount)}원</td><td className="px-2 py-2 text-right tabular-nums">{pct(probabilityForContribution(rc, row.amount))}</td></tr>;
        })}</tbody></table></div></CalculatorCard> : null}
      <CalculatorCard title="가정과 주의사항"><ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">{result.meta.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></CalculatorCard>
    </> : <ResultCard title="목표달성확률 결과" isValid={false} emptyMessage="값을 입력하고 계산하면 결과가 표시됩니다." />}
  </CalculatorLayout>;
}
