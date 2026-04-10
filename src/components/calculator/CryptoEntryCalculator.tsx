"use client";

import { useState } from "react";

export default function CryptoEntryCalculator() {
    const [entry, setEntry] = useState(10000);
    const [stop, setStop] = useState(9900);
    const [seed, setSeed] = useState(100);
    const [risk, setRisk] = useState(5);
    const [rr, setRr] = useState(1.5);

    const lossPercent = ((entry - stop) / entry) * 100;
    const leverage = lossPercent !== 0 ? 100 / lossPercent : 0;
    const riskAmount = seed * (risk / 100);
    const positionSize = leverage * riskAmount;
    const takeProfit = entry + (entry - stop) * rr;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold mb-4">100배 진입 계산기</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <input
                    type="number"
                    value={entry}
                    onChange={(e) => setEntry(+e.target.value)}
                    placeholder="진입가"
                    className="p-3 border rounded"
                />
                <input
                    type="number"
                    value={stop}
                    onChange={(e) => setStop(+e.target.value)}
                    placeholder="손절가"
                    className="p-3 border rounded"
                />
                <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(+e.target.value)}
                    placeholder="시드"
                    className="p-3 border rounded"
                />
                <input
                    type="number"
                    value={risk}
                    onChange={(e) => setRisk(+e.target.value)}
                    placeholder="리스크 %"
                    className="p-3 border rounded"
                />
                <input
                    type="number"
                    value={rr}
                    onChange={(e) => setRr(+e.target.value)}
                    placeholder="손익비"
                    className="p-3 border rounded"
                />
            </div>

            <div className="mt-6 space-y-2 text-sm">
                <p>손절폭: {lossPercent.toFixed(2)}%</p>
                <p>권장 배율: {leverage.toFixed(2)}x</p>
                <p>진입 금액 (USDT): {positionSize.toFixed(2)}</p>
                <p>익절가: {takeProfit.toFixed(2)}</p>
            </div>
        </div>
    );
}