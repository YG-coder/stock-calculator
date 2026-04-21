import type { Metadata } from "next";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["us-dividend-calculator"];

export const metadata: Metadata = config.metadata;

export default function USDividendPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <USDividendCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">미국주식 배당 계산기에 대해 더 알아보기</h2>
                <p>미국주식 배당 계산기는 미국 배당주의 주당 배당금, 주가, 보유 수량을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>미국 배당주(코카콜라, 리얼티인컴 등)나 배당 ETF(SCHD, VYM 등) 투자를 고려할 때 예상 배당 수입을 미리 계산해두면 투자 결정에 도움이 됩니다.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 주당 배당금 2달러, 주가 50달러, 100주 보유 → 연 배당금 200달러, 배당수익률 4%, 원천징수세 15% 적용 시 세후 170달러.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}