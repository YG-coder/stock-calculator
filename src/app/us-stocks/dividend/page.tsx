import type { Metadata } from "next";
import SourceNote from "@/components/ui/SourceNote";
import { US_DIVIDEND_WITHHOLDING, FINANCIAL_INCOME_THRESHOLD, TAX_BASIS_YEAR, TAX_REVIEWED_AT } from "@/lib/taxRates";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["us-dividend-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/us-stocks/dividend");

export default function USDividendPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/us-stocks/dividend" />
            <USDividendCalculator />

            <SourceNote
                basisYear={TAX_BASIS_YEAR}
                reviewedAt={TAX_REVIEWED_AT}
                applied={[
                    { label: "미국 현지 원천징수", value: `${US_DIVIDEND_WITHHOLDING.rateDisplay} (${US_DIVIDEND_WITHHOLDING.rateBreakdown})` },
                    { label: "금융소득종합과세 기준", value: `연 ${FINANCIAL_INCOME_THRESHOLD.amountDisplay}` },
                ]}
                conditions={[
                    US_DIVIDEND_WITHHOLDING.note,
                    "계산 결과의 '세후'는 미국 현지 원천징수 후 금액입니다. 국내 최종 세부담과 같은 개념이 아닙니다.",
                    "연간 배당 전체에 하나의 환율을 적용합니다. 실제 분기 배당은 지급 시점마다 환율이 다릅니다.",
                    "월 배당은 연 배당을 12로 나눈 평균값입니다. 분기 지급 종목은 해당 월에 그 금액이 들어오지 않습니다.",
                ]}
                sources={US_DIVIDEND_WITHHOLDING.sources}
            />
            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">미국주식 배당 계산기에 대해 더 알아보기</h2>
                <p>미국주식 배당 계산기는 미국 배당주의 주당 배당금, 주가, 보유 수량을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 도구입니다.</p>
                <h3 className="text-base font-semibold text-slate-800">이 계산기가 필요한 이유</h3>
                <p>미국주식 배당은 한국과 달리 분기 배당이 일반적이고 원천징수세(15%)가 자동으로 차감됩니다. 세전·세후 금액을 함께 계산해두면 실제 통장에 들어오는 배당 수입을 정확히 파악할 수 있어, 배당 투자 포트폴리오 설계에 도움이 됩니다.</p>
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