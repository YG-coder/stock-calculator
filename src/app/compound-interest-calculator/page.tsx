import type { Metadata } from "next";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
import { calculatorPages } from "@/lib/calculatorPages";
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

const config = calculatorPages["compound-interest-calculator"];

export const metadata: Metadata = config.metadata;

export default function CompoundInterestCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge={config.badge}
                title={config.title}
                description={config.headerDescription}
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <CompoundInterestCalculator />

                <SectionCard>
                    <Article title="복리 계산기란?">
                        <p>
                            <strong>복리 계산기</strong>는 초기 투자금과 매월 추가 납입금이
                            일정 수익률로 복리 성장할 때 최종 예상 금액이 얼마인지 계산하는 도구입니다.
                        </p>
                        <p>
                            단리와 달리 복리는 발생한 수익에 다시 수익이 붙는 구조입니다.
                            시간이 지날수록 이 차이는 기하급수적으로 커지기 때문에,
                            장기 투자자에게 복리 효과를 이해하는 것은 매우 중요합니다.
                        </p>
                    </Article>

                    <Article title="복리 계산 공식">
                        <p>복리 계산의 핵심 공식은 다음과 같습니다.</p>
                        <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                            <div className="mx-auto max-w-3xl text-center font-mono font-bold text-slate-800">
                                <div className="break-keep text-sm leading-relaxed sm:text-base md:text-lg">
                                    최종 금액 = 초기 투자금 × (1 + 월 수익률)^기간(개월)
                                </div>
                                <div className="mt-2 break-keep text-sm leading-relaxed sm:text-base md:text-lg">
                                    + 매월 추가 납입금 × [(1 + 월 수익률)^기간 − 1] ÷ 월 수익률
                                </div>
                            </div>
                        </div>
                        <p>
                            예를 들어 1,000만 원을 초기 투자하고 매월 30만 원씩 10년간 연 7% 수익률로
                            투자했다면, 단순히 원금 + 납입금인 4,600만 원이 아니라 복리 효과로
                            훨씬 더 큰 금액이 됩니다.
                        </p>
                    </Article>

                    <Article title="복리 효과와 장기 투자의 관계">
                        <p>
                            복리 효과는 투자 기간이 길수록 더 강력해집니다. '72의 법칙'에 따르면
                            연 수익률 7%로 투자하면 약 10년 후 원금이 2배가 됩니다.
                            같은 원금을 20년 유지하면 4배, 30년이면 약 8배에 달합니다.
                        </p>
                        <p>
                            이 때문에 투자는 빨리 시작할수록 유리합니다. 매월 납입금을 꾸준히 유지하는
                            습관이 최종 금액을 결정짓는 핵심 요소입니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
                    <FaqItem
                        question="복리와 단리의 차이는 무엇인가요?"
                        answer="단리는 원금에만 이자가 붙지만, 복리는 원금과 누적된 이익에 다시 이익이 붙습니다. 투자 기간이 길어질수록 복리 효과가 훨씬 크게 나타납니다."
                    />
                    <FaqItem
                        question="매월 추가 투자금도 반영되나요?"
                        answer="네, 이 계산기는 매월 일정 금액을 추가 납입하는 조건도 반영해 예상 최종 금액을 계산합니다. 적립식 투자 시뮬레이션에도 활용할 수 있습니다."
                    />
                    <FaqItem
                        question="예상 수익률은 실제 수익을 보장하나요?"
                        answer="아니요. 계산 결과는 입력한 가정에 따른 시뮬레이션이며, 실제 투자 성과는 시장 상황에 따라 다를 수 있습니다. 참고용으로만 활용하세요."
                    />
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/profit-calculator",
                            title: "주식 수익률 계산기",
                            desc: "현재 수익률과 손익을 빠르게 확인",
                        },
                        {
                            href: "/dividend-calculator",
                            title: "배당 수익 계산기",
                            desc: "배당금과 배당수익률 계산",
                        },
                        {
                            href: "/position-size-calculator",
                            title: "포지션 사이즈 계산기",
                            desc: "허용 손실 기준 투자 금액 계산",
                        },
                    ]}
                />

                <Disclaimer />

                <SeoContent
                    title="복리 계산기"
                    intro="복리 계산기는 초기 투자금과 매월 납입금이 일정 수익률로 성장했을 때 최종 금액이 얼마가 되는지 계산합니다. 장기 투자를 계획 중이라면 복리 효과를 반드시 이해하고 활용해야 합니다."
                    body="특히 연금, ETF 적립식 투자, 장기 저축 상품 등을 고려할 때 이 계산기를 사용하면 목표 금액 달성에 필요한 납입금이나 투자 기간을 역산하는 데 도움이 됩니다."
                    formula="최종 금액 = 초기 투자금 × (1 + 월 수익률)^기간 + 월 납입금 × [(1 + 월 수익률)^기간 − 1] / 월 수익률"
                    formulaNote="월 수익률은 연 수익률을 12로 나눈 값입니다. 세금과 수수료는 포함되지 않습니다."
                    whenToUse="은퇴 자금 마련, 자녀 교육비 준비, 목돈 마련 등 장기 재무 목표를 세울 때 활용하면 좋습니다. 원하는 목표 금액을 역산하여 필요한 월 납입금이나 기간을 파악하는 데 유용합니다."
                    example="예시: 초기 투자금 500만 원, 매월 30만 원 납입, 연 수익률 8%, 투자 기간 20년 → 원금 합계 약 7,700만 원 대비 복리 효과로 최종 금액은 약 1억 8천만 원 수준으로 불어납니다."
                    caution="이 계산기는 세금, 수수료, 인플레이션을 반영하지 않습니다. 실제 투자 결과는 시장 상황에 따라 다를 수 있으며, 참고용으로만 활용하세요."
                    relatedLinks={[
                        { href: "/dividend-calculator", label: "배당 수익 계산기" },
                        { href: "/profit-calculator", label: "주식 수익률 계산기" },
                        { href: "/position-size-calculator", label: "포지션 사이즈 계산기" },
                        { href: "/risk-reward-calculator", label: "손익비 계산기" },
                    ]}
                />

                <InternalLinks currentPath="/compound-interest-calculator" />
            </div>
        </main>
    );
}
