"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, CalculatorLayout, InputField, ResultCard, ResultDetail, ResultHighlight } from "@/components/ui/Shared";
import { calculatePortfolio, type PortfolioAsset } from "@/lib/portfolio";

type AssetInput = { name: string; weight: string; expectedReturn: string; volatility: string };
const defaults: AssetInput[] = [
  { name: "주식", weight: "", expectedReturn: "", volatility: "" },
  { name: "채권", weight: "", expectedReturn: "", volatility: "" },
  { name: "현금", weight: "", expectedReturn: "", volatility: "" },
];

export default function PortfolioCalculator() {
  const [assets, setAssets] = useState(defaults);
  const [correlations, setCorrelations] = useState(["", "", ""]);
  const parsed = useMemo<PortfolioAsset[]>(() => assets.map((asset) => ({ name: asset.name, weight: Number(asset.weight) / 100, expectedReturn: Number(asset.expectedReturn) / 100, volatility: Number(asset.volatility) / 100 })), [assets]);
  const matrix = useMemo(() => [[1, Number(correlations[0]), Number(correlations[1])], [Number(correlations[0]), 1, Number(correlations[2])], [Number(correlations[1]), Number(correlations[2]), 1]], [correlations]);
  const calculated = useMemo(() => { try { return { result: calculatePortfolio(parsed, matrix), error: "" }; } catch (error) { return { result: null, error: error instanceof Error ? error.message : "입력값을 확인해 주세요." }; } }, [parsed, matrix]);
  const hasInput = assets.some((asset) => asset.weight !== "" || asset.expectedReturn !== "" || asset.volatility !== "") || correlations.some((value) => value !== "");
  const updateAsset = (index: number, key: keyof AssetInput, value: string) => setAssets((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const updateCorrelation = (index: number, value: string) => setCorrelations((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));

  return <CalculatorLayout>
    <CalculatorCard title="자산별 가정" description="직접 입력한 기대수익률·변동성·상관계수로 계산합니다. 기본값은 예시일 뿐 시장 전망이나 추천값이 아닙니다.">
      {assets.map((asset, index) => <div key={index} className="grid gap-3 border-b border-slate-100 pb-5 last:border-0 sm:grid-cols-2 lg:grid-cols-4">
        <InputField id={`portfolio-name-${index}`} label="자산명" value={asset.name} onChange={(event) => updateAsset(index, "name", event.target.value)} placeholder={index === 0 ? "예: 주식" : index === 1 ? "예: 채권" : "예: 현금"} />
        <InputField id={`portfolio-weight-${index}`} label="비중" type="number" value={asset.weight} onChange={(event) => updateAsset(index, "weight", event.target.value)} unit="%" placeholder={`예: ${[60, 30, 10][index]}`} />
        <InputField id={`portfolio-return-${index}`} label="연 기대수익률" type="number" value={asset.expectedReturn} onChange={(event) => updateAsset(index, "expectedReturn", event.target.value)} unit="%" placeholder={`예: ${[8, 3, 2][index]}`} />
        <InputField id={`portfolio-volatility-${index}`} label="연 변동성" type="number" value={asset.volatility} onChange={(event) => updateAsset(index, "volatility", event.target.value)} unit="%" placeholder={`예: ${[20, 8, 1][index]}`} />
      </div>)}
      <div className="grid gap-4 sm:grid-cols-3"><InputField id="correlation-01" label={`${assets[0].name}–${assets[1].name} 상관계수`} type="number" value={correlations[0]} onChange={(event) => updateCorrelation(0, event.target.value)} placeholder="예: 0.2" hint="두 자산이 같이 움직이는 정도입니다. 낮을수록 분산효과가 커집니다." help="1이면 항상 같은 방향, 0이면 서로 무관, -1이면 반대 방향으로 움직인다는 뜻입니다. 이 값이 낮을수록 전체 변동성이 줄어듭니다.\n\n정확한 값은 자산별 과거 데이터로 추정해야 합니다. 화면의 예시는 계산 방식을 보여주기 위한 값이며 권장값이 아닙니다." /><InputField id="correlation-02" label={`${assets[0].name}–${assets[2].name} 상관계수`} type="number" value={correlations[1]} onChange={(event) => updateCorrelation(1, event.target.value)} placeholder="예: 0" /><InputField id="correlation-12" label={`${assets[1].name}–${assets[2].name} 상관계수`} type="number" value={correlations[2]} onChange={(event) => updateCorrelation(2, event.target.value)} placeholder="예: 0.1" /></div>
      {hasInput && !calculated.result ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{calculated.error}</div> : null}
    </CalculatorCard>
    {calculated.result ? <><CalculatorCard title="포트폴리오 분석 결과"><div className="grid gap-4 sm:grid-cols-2"><ResultHighlight label="연 기대수익률" value={(calculated.result.expectedReturn * 100).toFixed(2)} unit="%" tone="positive" /><ResultHighlight label="연 변동성" value={(calculated.result.volatility * 100).toFixed(2)} unit="%" /></div><ResultDetail label="상관관계를 무시한 가중 변동성" value={((calculated.result.volatility + calculated.result.diversificationBenefit) * 100).toFixed(2)} unit="%" /><ResultDetail label="분산투자 변동성 감소분" value={(calculated.result.diversificationBenefit * 100).toFixed(2)} unit="%p" /><p className="text-xs leading-relaxed text-slate-500">변동성은 공분산 공식 √(wᵀΣw)로 계산합니다. 기대수익률과 변동성은 같은 기간·통화·빈도의 자료로 추정해야 비교가 의미 있습니다.</p></CalculatorCard><CalculatorCard title="주의사항"><p className="text-sm leading-relaxed text-slate-600">과거 자료로 추정한 수익률·변동성·상관관계는 미래에 달라질 수 있습니다. 세금·수수료·환율·리밸런싱 비용은 포함하지 않습니다.</p></CalculatorCard></> : <ResultCard title="포트폴리오 분석 결과" isValid={false} emptyMessage="자산 비중과 가정값을 입력하면 결과가 표시됩니다." />}
  </CalculatorLayout>;
}
