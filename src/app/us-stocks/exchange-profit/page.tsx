import type { Metadata } from "next";
import USExchangeProfitCalculator from "@/components/calculator/USExchangeProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["us-exchange-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function USExchangeProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <USExchangeProfitCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">환율 반영 수익 계산기에 대해 더 알아보기</h2>
                <p>환율 반영 수익 계산기는 미국 주식 매매 시 매수·매도 시점의 환율 차이까지 반영한 실제 원화 기준 수익과 수익률을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>미국 주식을 매도한 후 주가 변동과 환율 변동이 복합적으로 영향을 준 경우, 실제 원화 기준 수익이 얼마인지 정확히 파악하고 싶을 때 활용합니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 매수가 100달러(환율 1,200원) → 매도가 110달러(환율 1,300원) → 주가 수익률 +10%, 환차익 포함 원화 수익률 약 +19.2%.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}