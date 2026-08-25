import type { Metadata } from "next";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-funding-fee-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/funding-fee");

export default function CryptoFundingFeePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/funding-fee" />
            <CryptoFundingFeeCalculator />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 펀딩비 계산기에 대해 더 알아보기</h2>
                <p>코인 펀딩비 계산기는 암호화폐 선물 거래에서 포지션 규모와 펀딩비율, 지급 횟수를 기준으로 예상 펀딩비를 계산하는 도구입니다. 펀딩 주기는 8시간인 상품이 흔하지만 상품마다 다르고 1시간·4시간으로 운영되거나 시장 상황에 따라 변경될 수 있으므로, 거래 전 해당 상품의 최신 펀딩 주기를 확인하세요.</p>
                <h3 className="text-base font-semibold text-slate-800">이 계산기가 필요한 이유</h3>
                <p>선물 포지션을 며칠 이상 유지할 경우 펀딩비가 누적되어 수익률에 큰 영향을 줍니다. 특히 고레버리지 포지션에서는 명목가치가 크기 때문에 펀딩비 부담도 커지는데, 이를 미리 계산해두면 단기 트레이딩이 유리한지 장기 보유가 유리한지 판단하는 데 도움이 됩니다.</p>
                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>장기 선물 포지션 보유 시 펀딩비가 수익에 얼마나 영향을 미치는지 파악할 때 사용합니다. 특히 고레버리지 포지션을 며칠간 유지할 경우 펀딩비 누적 부담을 미리 계산하세요.</p>
                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>예시: 포지션 1,000만 원, 펀딩비율 0.01% → 1회당 1,000원. 8시간 주기 상품이라면 하루 3회, 한 달 약 90회로 약 90,000원이 됩니다. 주기가 다른 상품은 횟수를 그에 맞게 입력해야 합니다.</p>
                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>본 계산기의 결과는 참고용이며 실제 투자 결과를 보장하지 않습니다. 수수료, 세금, 시장 상황 등을 반드시 고려하세요.</p>
            </section>
        </CalculatorPageTemplate>
    );
}
