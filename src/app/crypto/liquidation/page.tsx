import type { Metadata } from "next";
import CryptoLiquidationCalculator from "@/components/calculator/CryptoLiquidationCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-liquidation-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/liquidation");

export default function CryptoLiquidationPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/liquidation" />
            <CryptoLiquidationCalculator />
            <section className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">계산식과 실제 거래소 청산가의 차이</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-800">
                                <th className="px-3 py-3 font-semibold">구분</th>
                                <th className="px-3 py-3 font-semibold">이 계산기에 반영</th>
                                <th className="px-3 py-3 font-semibold">실제 거래소에서 추가되는 조건</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr><th className="px-3 py-3 font-medium text-slate-800">증거금 방식</th><td className="px-3 py-3">격리마진 기준</td><td className="px-3 py-3">교차마진은 가용 잔고와 다른 포지션 손익까지 반영</td></tr>
                            <tr><th className="px-3 py-3 font-medium text-slate-800">청산 판단 가격</th><td className="px-3 py-3">진입가 중심의 근사 계산</td><td className="px-3 py-3">마크 가격이 청산 조건에 도달했는지 판단</td></tr>
                            <tr><th className="px-3 py-3 font-medium text-slate-800">유지증거금</th><td className="px-3 py-3">입력한 단일 비율</td><td className="px-3 py-3">종목·계약·포지션 규모별 위험한도 등급</td></tr>
                            <tr><th className="px-3 py-3 font-medium text-slate-800">비용과 증거금</th><td className="px-3 py-3">미반영</td><td className="px-3 py-3">종료 수수료, 펀딩비, 추가 증거금과 유지증거금 차감</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <strong className="block">실전 확인 순서</strong>
                    <p className="mt-1">계산기로 청산 거리를 비교한 뒤, 거래소 주문 화면에서 증거금 방식·현재 유지증거금률·마크 가격·예상 청산가를 확인하세요. 최종 실행 기준은 계산기의 근사값이 아니라 거래소가 현재 계정 조건으로 표시한 값입니다.</p>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900">공식 참고 자료</h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                        <li><a className="font-medium text-blue-700 underline underline-offset-2" href="https://www.bybit.com/en/help-center/article/Liquidation-Price-Calculation-under-Isolated-Mode-Unified-Trading-Account" target="_blank" rel="noopener noreferrer">Bybit 격리마진 청산가 계산 공식</a> — 마크 가격, 유지증거금과 종료 수수료를 반영한 계약별 산식을 설명합니다.</li>
                        <li><a className="font-medium text-blue-700 underline underline-offset-2" href="https://www.bybit.com/en/help-center/article/?id=000001053&amp;language=en_US" target="_blank" rel="noopener noreferrer">Bybit 격리마진과 교차마진 안내</a> — 교차마진에서 가용 잔고와 다른 포지션이 청산 조건에 미치는 영향을 설명합니다.</li>
                        <li><a className="font-medium text-blue-700 underline underline-offset-2" href="https://www.bybit.com/en/help-center/article/Funding-fee-calculation" target="_blank" rel="noopener noreferrer">Bybit 펀딩비 계산 안내</a> — 펀딩비가 포지션 증거금에서 차감될 때 청산 위험이 변할 수 있음을 설명합니다.</li>
                    </ul>
                </div>
            </section>
        </CalculatorPageTemplate>
    );
}
