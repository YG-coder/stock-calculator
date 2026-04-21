import type { Metadata } from "next";
import CryptoProfitCalculator from "@/components/calculator/CryptoProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoProfitCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 수익 계산기에 대해 더 알아보기</h2>
                <p>코인 수익 계산기는 암호화폐 매수가와 매도가를 입력하면 레버리지 없이 현물 거래에서 발생한 순수익과 수익률을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>비트코인, 이더리움 등 현물 코인 거래 후 실제 수익금을 확인하거나, 매도 목표가를 설정할 때 활용합니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 비트코인 5,000만 원에 0.1개 매수 → 매도가 6,000만 원 → 수익 100만 원, 수익률 +20%.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}