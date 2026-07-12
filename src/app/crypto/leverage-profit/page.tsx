import type { Metadata } from "next";
import CryptoLeverageProfitCalculator from "@/components/calculator/CryptoLeverageProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-leverage-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoLeverageProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/leverage-profit" />
            <CryptoLeverageProfitCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 레버리지 수익 계산기에 대해 더 알아보기</h2>
                <p>코인 레버리지 수익 계산기는 선물 거래에서 레버리지를 사용한 롱 또는 숏 포지션의 예상 수익과 ROE(자기자본이익률)를 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">이 계산기가 필요한 이유</h3>
                <p>레버리지 거래에서는 작은 가격 변동이 큰 수익으로 이어지지만, 반대로 손실도 같은 비율로 확대됩니다. 진입 전 예상 수익과 ROE를 시나리오별로 미리 확인해두면 목표가 설정과 손절가 설정이 더 합리적이 됩니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>레버리지 포지션 진입 전 수익 시나리오를 미리 계산하거나, 목표 수익률 달성에 필요한 가격 변동폭을 파악할 때 사용합니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 진입가 50,000달러, 레버리지 5배 롱, 목표가 55,000달러 → 가격 변동 +10%, ROE +50%.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}