import type { Metadata } from "next";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-entry-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoEntryPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoEntryCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 100배 진입 계산기에 대해 더 알아보기</h2>
                <p>코인 100배 진입 계산기는 목표 수익 배율과 자금 규모를 기반으로 권장 레버리지 배율과 포지션 진입 금액을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>고수익을 목표로 선물 진입 전략을 세울 때 사용합니다. 목표 수익 배율에 맞는 레버리지 배율과 주문 금액을 계산해 무리한 진입을 방지합니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 자금 100만 원, 목표 수익 배율 5배 → 권장 레버리지 및 주문 금액 자동 계산.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}