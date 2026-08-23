import type { Metadata } from "next";
import SourceNote from "@/components/ui/SourceNote";
import { OVERSEAS_STOCK_TAX, TAX_BASIS_YEAR, TAX_REVIEWED_AT } from "@/lib/taxRates";
import OverseasStockTaxCalculator from "@/components/calculator/OverseasStockTaxCalculator";
import { calculatorPages } from "@/lib/calculatorPages";
import { withPageMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";
import SeoContent from "@/components/seo/SeoContent";
import InternalLinks from "@/components/seo/InternalLinks";

const config = calculatorPages["overseas-stock-tax-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/overseas-stock-tax-calculator");

const FAQ_ITEMS = [
  { question: "해외주식 양도소득세는 얼마인가요?", answer: "기본공제 250만 원을 초과한 양도차익에 대해 22%의 세율이 적용됩니다. 예를 들어 수익이 500만 원이면 250만 원에 대해 22%인 55만 원의 세금이 발생합니다." },
  { question: "환차익도 과세 대상인가요?", answer: "네, 해외주식 매매 시 환율 변동으로 발생한 손익도 과세 대상 양도차익에 포함됩니다. 이 계산기는 매수 금액과 매도 금액을 각각 그 시점 환율로 환산한 실제 원화 금액으로 입력받으므로, 환율 변동 효과는 두 금액의 차이에 자동으로 반영됩니다. 따라서 별도로 환차익을 더해 입력할 필요는 없습니다." },
  { question: "국내주식도 같은 방식으로 계산하나요?", answer: "아니요. 일반 개인투자자의 국내주식 매매차익은 현재 비과세입니다. 해외주식은 양도소득세 대상이므로 세금 구조가 다릅니다." },
  { question: "손익 통산은 어떻게 하나요?", answer: "같은 해에 여러 해외주식 종목에서 수익과 손실이 모두 발생했다면, 이를 합산한 순수익에 기본공제를 적용합니다. 예를 들어 A종목 +700만, B종목 -200만이면 합산 수익은 500만 원이 됩니다." },
];


export default function OverseasStockTaxCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd config={config} path="/overseas-stock-tax-calculator" faqs={FAQ_ITEMS} />
            <PageHeader
                badge={config.badge}
                title={config.title}
                description={config.headerDescription}
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <OverseasStockTaxCalculator />

                <SourceNote
                    basisYear={TAX_BASIS_YEAR}
                    reviewedAt={TAX_REVIEWED_AT}
                    applied={[
                        { label: "적용 세율", value: `${OVERSEAS_STOCK_TAX.rateDisplay} (${OVERSEAS_STOCK_TAX.rateBreakdown})` },
                        { label: "기본공제", value: `연 ${OVERSEAS_STOCK_TAX.basicDeductionDisplay} (연 1회, 전 증권사 합산)` },
                        { label: "신고 시기", value: OVERSEAS_STOCK_TAX.filingPeriod },
                    ]}
                    conditions={[
                        "매매 수수료 등 필요경비는 계산에 반영되지 않았습니다. 실제 신고 시에는 차감할 수 있습니다.",
                        "이 계산기는 거래 1건 기준입니다. 실제 과세는 같은 해 전체 손익을 통산한 뒤 기본공제를 적용합니다.",
                        "원화 환산은 세법상 결제일 기준환율을 적용합니다. 체결일 환율이나 우대 환율과는 다를 수 있습니다.",
                        "국내주식 중 양도세 과세 대상(대주주·장외·비상장) 손익과의 통산은 반영되지 않았습니다.",
                    ]}
                    sources={OVERSEAS_STOCK_TAX.sources}
                />

                <SectionCard>
                    <Article title="해외주식 세금 계산기란?">
                        <p>
                            <strong>해외주식 세금 계산기</strong>는 미국 주식 등 해외 주식 매매 시 발생하는
                            양도차익에 대한 예상 세금과 세후 실수익을 계산하는 도구입니다.
                        </p>
                        <p>
                            국내 주식과 달리, 해외 주식은 연간 250만 원의 기본공제를 초과하는 양도차익에
                            대해 22%의 세율이 적용됩니다. 따라서 수익이 클수록 세금 계산이 중요해집니다.
                        </p>
                    </Article>

                    <Article title="해외주식 양도소득세 계산 방법">
                        <p>해외주식 양도세는 다음 순서로 계산합니다.</p>
                        <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                            <div className="mx-auto max-w-3xl text-center font-mono font-bold text-slate-800 space-y-2">
                                <div className="break-keep text-sm leading-relaxed sm:text-base">
                                    입력값 기준 양도차익 = 총 매도 금액 − 총 매수 금액
                                </div>
                                <div className="break-keep text-sm leading-relaxed sm:text-base">
                                    과세 대상 수익 = 양도차익 − 기본공제 250만 원
                                </div>
                                <div className="break-keep text-sm leading-relaxed sm:text-base">
                                    세금 = 과세 대상 수익 × 22%
                                </div>
                            </div>
                        </div>
                        <p>
                            예를 들어 미국 주식에서 500만 원 수익을 냈다면 기본공제 250만 원을 뺀
                            250만 원이 과세 대상이며, 세금은 55만 원입니다. 세후 수익은 445만 원이 됩니다.
                        </p>
                        <p>
                            실제 신고 시에는 증권사 거래내역에 반영된 필요경비와 수수료 등에 따라
                            금액이 달라질 수 있습니다.
                        </p>
                    </Article>

                    <Article title="기본공제와 연간 신고 방법">
                        <p>
                            해외주식 양도소득세는 매년 5월에 종합소득세 신고 기간에 함께 신고합니다.
                            기본공제 250만 원은 1년에 1회 적용되며, 여러 종목에서 발생한 손익을 합산한 뒤
                            공제합니다.
                        </p>
                        <p>
                            손실이 발생한 경우 같은 해 다른 종목의 수익과 합산해 세금을 줄일 수 있습니다.
                            이를 손익 통산이라고 하며, 절세 전략의 핵심입니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
            {FAQ_ITEMS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/profit-calculator",
                            title: "주식 수익률 계산기",
                            desc: "세금 반영 전 수익률과 손익 확인",
                        },
                        {
                            href: "/dividend-calculator",
                            title: "배당 수익 계산기",
                            desc: "배당금과 세후 배당수익률 계산",
                        },
                        {
                            href: "/compound-interest-calculator",
                            title: "복리 계산기",
                            desc: "장기 투자 시 예상 최종 금액 계산",
                        },
                    ]}
                />

                <Disclaimer />

                <SeoContent
                    title="해외주식 세금 계산기"
                    intro="해외주식에 투자할 때는 수익뿐 아니라 세금도 함께 고려해야 합니다. 양도소득세 기본공제 250만 원을 초과하는 수익에 대해 22%의 세율이 적용되므로, 수익 실현 전에 예상 세금을 미리 파악하는 것이 중요합니다."
                    body="특히 연말 절세 전략을 세울 때, 올해 남은 기본공제 한도를 파악하거나 손실 종목을 활용한 손익 통산 계획을 세울 때 이 계산기가 유용합니다."
                    formula="세금 = (양도차익 − 250만 원 기본공제) × 22%"
                    formulaNote="기본공제 250만 원은 연간 1회 적용됩니다. 주민세(2.2%) 포함 시 실효세율은 22%입니다. (국세청 고시 기준, 세법 개정 시 변동될 수 있음)"
                    whenToUse="미국 주식, ETF 등 해외 자산 매도를 검토할 때, 또는 연말 절세를 위해 손익을 통산할 시기를 계획할 때 활용하면 좋습니다. 세후 실수익이 얼마인지 미리 파악하면 더 나은 투자 결정을 내릴 수 있습니다."
                    example="예시: 미국 주식을 매수 1,000만 원, 매도 1,600만 원에 처분 → 양도차익 600만 원, 기본공제 250만 원 차감 후 과세 표준 350만 원 × 22% = 세금 77만 원, 세후 수익 523만 원."
                    caution="본 계산기는 참고용이며 실제 세금은 환율, 거래 수수료, 다른 해외 소득과의 합산 여부에 따라 달라질 수 있습니다. 정확한 세액은 세무사 또는 국세청에 문의하세요."
                    relatedLinks={[
                        { href: "/profit-calculator", label: "주식 수익률 계산기" },
                        { href: "/dividend-calculator", label: "배당 수익 계산기" },
                        { href: "/compound-interest-calculator", label: "복리 계산기" },
                        { href: "/average-price-calculator", label: "평단가 계산기" },
                    ]}
                />

                <InternalLinks currentPath="/overseas-stock-tax-calculator" />
            </div>
        </main>
    );
}
