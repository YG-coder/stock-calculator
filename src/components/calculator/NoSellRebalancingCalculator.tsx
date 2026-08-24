"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, CalculatorLayout, InputField, ResultDetail, ResultHighlight } from "@/components/ui/Shared";
import { allocateWithoutSelling, type RebalancingAsset, totalWeightDeviation } from "@/lib/noSellRebalancing";

type AssetInput = { name: string; currentValue: string; targetWeight: string };
const won = (value: number) => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);
const initialAssets: AssetInput[] = [
  { name: "국내주식", currentValue: "50000000", targetWeight: "40" },
  { name: "해외주식", currentValue: "30000000", targetWeight: "40" },
  { name: "채권·현금", currentValue: "20000000", targetWeight: "20" },
];

export default function NoSellRebalancingCalculator() {
  const [assets, setAssets] = useState(initialAssets);
  const [contribution, setContribution] = useState("10000000");
  const parsed = useMemo(() => assets.map<RebalancingAsset>((asset) => ({ name: asset.name, currentValue: Number(asset.currentValue), targetWeight: Number(asset.targetWeight) / 100 })), [assets]);
  const weightSum = parsed.reduce((sum, asset) => sum + asset.targetWeight, 0);
  const result = useMemo(() => {
    try { return allocateWithoutSelling(parsed, Number(contribution)); } catch { return null; }
  }, [parsed, contribution]);
  const update = (index: number, key: keyof AssetInput, value: string) => setAssets((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const beforeDeviation = result?.reduce((sum, row) => sum + Math.abs(row.currentWeight - row.targetWeight), 0) ?? 0;
  const afterDeviation = result ? totalWeightDeviation(result) : 0;

  return <CalculatorLayout>
    <CalculatorCard title="보유 자산과 목표 비중" description="매도하지 않고 새 투자금만 배분합니다. 목표 비중의 합은 100%여야 합니다.">
      <div className="space-y-5">{assets.map((asset, index) => <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
        <label className="space-y-2 text-sm font-semibold text-slate-700">자산명<input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal" value={asset.name} onChange={(event) => update(index, "name", event.target.value)} /></label>
        <InputField id={`asset-value-${index}`} label="현재 평가금액" type="number" value={asset.currentValue} onChange={(event) => update(index, "currentValue", event.target.value)} unit="원" />
        <InputField id={`asset-weight-${index}`} label="목표 비중" type="number" value={asset.targetWeight} onChange={(event) => update(index, "targetWeight", event.target.value)} unit="%" />
      </div>)}</div>
      <div className="grid gap-4 sm:grid-cols-2"><InputField id="rebalancing-contribution" label="새 투자금" type="number" value={contribution} onChange={(event) => setContribution(event.target.value)} unit="원" /><ResultDetail label="목표 비중 합계" value={(weightSum * 100).toFixed(1)} unit="%" /></div>
      {!result ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">평가금액과 투자금은 0 이상, 목표 비중 합계는 100%로 입력해 주세요.</div> : null}
    </CalculatorCard>
    {result ? <>
      <CalculatorCard title="추천 매수 배분"><div className="grid gap-4 sm:grid-cols-2"><ResultHighlight label="새 투자금" value={won(Number(contribution))} unit="원" /><ResultHighlight label="비중 편차 감소" value={((beforeDeviation - afterDeviation) * 100).toFixed(2)} unit="%p" tone="positive" /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-b text-slate-500"><th className="p-2 text-left" scope="col">자산</th><th className="p-2 text-right" scope="col">추천 매수</th><th className="p-2 text-right" scope="col">매수 후 금액</th><th className="p-2 text-right" scope="col">목표 / 매수 후</th></tr></thead><tbody>{result.map((row) => <tr key={row.name} className="border-b border-slate-100"><th className="p-2 text-left font-medium" scope="row">{row.name}</th><td className="p-2 text-right font-semibold text-red-600 tabular-nums">+{won(row.buyAmount)}</td><td className="p-2 text-right tabular-nums">{won(row.finalValue)}</td><td className="p-2 text-right tabular-nums">{(row.targetWeight * 100).toFixed(1)}% / {(row.finalWeight * 100).toFixed(1)}%</td></tr>)}</tbody></table></div>
        <p className="text-xs leading-relaxed text-slate-500">목표보다 부족한 자산의 부족액에 비례해 우선 배분합니다. 투자금이 충분해 부족분을 모두 채우고 남으면 목표 비중대로 배분합니다.</p>
      </CalculatorCard>
      <CalculatorCard title="주의사항"><p className="text-sm leading-relaxed text-slate-600">세금·수수료·최소 주문금액·주식 수량 단위는 반영하지 않습니다. 실제 주문 전 거래 가능 단위에 맞게 금액을 조정하세요.</p></CalculatorCard>
    </> : null}
  </CalculatorLayout>;
}
