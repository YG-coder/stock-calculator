import type { Metadata } from "next";
import CryptoLiquidationCalculator from "@/components/calculator/CryptoLiquidationCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-liquidation-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoLiquidationPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoLiquidationCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 청산가 계산기에 대해 더 알아보기</h2>
                <p>코인 청산가 계산기는 암호화폐 선물 거래에서 레버리지와 진입가를 기준으로 강제 청산이 발생하는 예상 가격을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>레버리지 포지션 진입 전 청산 위험 구간을 미리 파악하고 싶을 때 사용합니다. 청산가와 현재가의 거리를 확인해 안전한 레버리지 배율을 선택하세요.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 진입가 50,000달러, 레버리지 10배 롱 → 청산가 약 45,500달러 (약 -9% 하락 시 청산).</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}