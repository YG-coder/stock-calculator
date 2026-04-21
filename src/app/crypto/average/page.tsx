import type { Metadata } from "next";
import CryptoAverageCalculator from "@/components/calculator/CryptoAverageCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-average-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoAveragePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoAverageCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 물타기 계산기에 대해 더 알아보기</h2>
                <p>코인 물타기 계산기는 암호화폐를 여러 가격대에서 나누어 매수한 경우 평균 매입 단가를 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>코인 가격이 하락할 때 추가 매수를 고려하는 경우, 물타기 후 새로운 평단가와 손익분기점을 미리 계산해두면 전략 수립에 도움이 됩니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 1차 BTC 5,000만 원에 0.1개, 2차 4,000만 원에 0.1개 → 총 0.2개, 총 900만 원 → 평단가 4,500만 원.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}