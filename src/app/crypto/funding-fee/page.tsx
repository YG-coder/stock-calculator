import type { Metadata } from "next";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-funding-fee-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoFundingFeePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoFundingFeeCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 펀딩비 계산기에 대해 더 알아보기</h2>
                <p>코인 펀딩비 계산기는 암호화폐 선물 거래에서 포지션 규모와 펀딩비율을 기준으로 8시간마다 발생하는 예상 펀딩비를 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>장기 선물 포지션 보유 시 펀딩비가 수익에 얼마나 영향을 미치는지 파악할 때 사용합니다. 특히 고레버리지 포지션을 며칠간 유지할 경우 펀딩비 누적 부담을 미리 계산하세요.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 포지션 1,000만 원, 펀딩비율 0.01% → 8시간마다 1,000원, 하루 3,000원, 한 달 약 90,000원의 펀딩비 발생.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}