"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, CalculatorLayout, InputField, ResultDetail, ResultHighlight } from "@/components/ui/Shared";
import { parseMonthlyReturns, runRollingBacktest } from "@/lib/backtest";

const won = (value: number) => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);

export default function BacktestLab() {
  const [returnsText, setReturnsText] = useState("");
  const [horizon, setHorizon] = useState("");
  const [initial, setInitial] = useState("");
  const [monthly, setMonthly] = useState("");
  const calculated = useMemo(() => {
    try { const returns = parseMonthlyReturns(returnsText); return { returns, result: runRollingBacktest({ returns, horizonMonths: Number(horizon), initialAmount: Number(initial), monthlyAmount: Number(monthly) }), error: "" }; }
    catch (error) { return { returns: parseMonthlyReturns(returnsText), result: null, error: error instanceof Error ? error.message : "입력값을 확인해 주세요." }; }
  }, [returnsText, horizon, initial, monthly]);
  const hasInput = returnsText !== "" || horizon !== "" || initial !== "" || monthly !== "";

  return <CalculatorLayout>
    <CalculatorCard title="월별 수익률 자료" description="시간순 월 수익률을 % 단위로 붙여넣으세요. 기본 숫자는 사용법 확인용 가상 예시이며 실제 시장 자료가 아닙니다.">
      <label className="block space-y-2 text-sm font-semibold text-slate-700">월별 수익률(%, 쉼표·공백·줄바꿈 구분)<textarea className="min-h-36 w-full rounded-2xl border border-slate-300 p-4 font-mono font-normal" value={returnsText} onChange={(event) => setReturnsText(event.target.value)} placeholder="예: 2.1, -1.2, 3.4, 0.8" /></label>
      <div className="grid gap-4 sm:grid-cols-3"><InputField id="lab-horizon" label="투자기간" type="number" value={horizon} onChange={(event) => setHorizon(event.target.value)} unit="개월" placeholder="예: 12" /><InputField id="lab-initial" label="초기 투자금" type="number" value={initial} onChange={(event) => setInitial(event.target.value)} unit="원" placeholder="예: 10000000" /><InputField id="lab-monthly" label="월 투자금" type="number" value={monthly} onChange={(event) => setMonthly(event.target.value)} unit="원" placeholder="예: 500000" /></div>
      <ResultDetail label="인식한 자료" value={String(calculated.returns.length)} unit="개월" />
      {hasInput && !calculated.result ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{calculated.error}</div> : null}
    </CalculatorCard>
    {calculated.result ? <><CalculatorCard title="롤링 백테스트 결과"><div className="grid gap-4 sm:grid-cols-3"><ResultHighlight label="최악 구간 최종금액" value={won(calculated.result.worst.terminalValue)} unit="원" tone="negative" /><ResultHighlight label="평균 최종금액" value={won(calculated.result.average)} unit="원" /><ResultHighlight label="최선 구간 최종금액" value={won(calculated.result.best.terminalValue)} unit="원" tone="positive" /></div><ResultDetail label="검사한 시작 구간" value={String(calculated.result.scenarios.length)} unit="개" /><ResultDetail label="납입원금 이상 구간" value={(calculated.result.positiveRate * 100).toFixed(1)} unit="%" /><ResultDetail label="최악 구간 위치" value={`${calculated.result.worst.startIndex + 1}~${calculated.result.worst.endIndex + 1}번째 자료`} /><p className="text-xs leading-relaxed text-slate-500">자료 안에서 투자 시작점을 한 달씩 이동하며 같은 투자기간을 모두 검사합니다. 월 투자금은 각 월 수익률 적용 직전에 납입하는 것으로 계산합니다.</p></CalculatorCard><CalculatorCard className="min-w-0" title="시작 구간별 결과"><div className="overflow-x-auto"><table className="w-full min-w-[420px] text-sm"><thead><tr className="border-b text-slate-500"><th className="p-2 text-left" scope="col">자료 위치</th><th className="p-2 text-right" scope="col">최종금액</th><th className="p-2 text-right" scope="col">납입 대비</th></tr></thead><tbody>{calculated.result.scenarios.map((row) => <tr key={row.startIndex} className="border-b border-slate-100"><td className="p-2">{row.startIndex + 1}~{row.endIndex + 1}</td><td className="p-2 text-right tabular-nums">{won(row.terminalValue)}원</td><td className={`p-2 text-right tabular-nums ${row.returnRate >= 0 ? "text-red-600" : "text-blue-600"}`}>{(row.returnRate * 100).toFixed(2)}%</td></tr>)}</tbody></table></div></CalculatorCard><CalculatorCard title="해석 주의"><p className="text-sm leading-relaxed text-slate-600">이 결과는 입력 자료 안의 과거 구간 반복 계산이지 미래 확률 예측이 아닙니다. 배당·세금·수수료·환율·생존자 편향과 자료 누락 여부를 직접 확인해야 합니다.</p></CalculatorCard></> : null}
  </CalculatorLayout>;
}
