import type { Metadata } from "next";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
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
import InternalLinks from "@/components/seo/InternalLinks";
import GuideLinks from "@/components/seo/GuideLinks";
import { COMPOUND_BASIC, COMPOUND_TEN_YEARS } from "@/data/stockCalculatorExamples";

const config = calculatorPages["compound-interest-calculator"];
const A = COMPOUND_TEN_YEARS;
const B = COMPOUND_BASIC;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export const metadata: Metadata = withPageMetadata(config.metadata, "/compound-interest-calculator");

const FAQ_ITEMS = [
  { question: "복리와 단리의 차이는 무엇인가요?", answer: "단리는 원금에만 이자가 붙지만, 복리는 원금과 누적된 이익에 다시 이익이 붙습니다. 투자 기간이 길어질수록 복리 효과가 훨씬 크게 나타납니다." },
  { question: "매월 추가 투자금도 반영되나요?", answer: "네, 매월 말에 일정 금액을 추가 납입하는 조건으로 계산합니다. 월 수익률은 입력한 연 수익률을 12로 나누며, 월복리를 적용합니다." },
  { question: "예상 수익률은 실제 수익을 보장하나요?", answer: "아니요. 계산 결과는 입력한 가정에 따른 시뮬레이션이며, 실제 투자 성과는 시장 상황에 따라 다를 수 있습니다. 참고용으로만 활용하세요." },
];


export default function CompoundInterestCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd config={config} path="/compound-interest-calculator" faqs={FAQ_ITEMS} />
            <PageHeader
                badge={config.badge}
                title={config.title}
                description={config.headerDescription}
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <CompoundInterestCalculator />

                <SectionCard>
                    <Article title="복리 계산 방법">
                        <p>
                            단리와 달리 복리는 발생한 수익에 다시 수익이 붙는 구조라서, 시간이 지날수록 차이가 커집니다.
                            이 계산기는 월복리와 매월 말 납입을 기준으로 계산합니다. 월 수익률은 입력한 연 수익률을 12로 나눈 값이며,
                            기간은 투자 연수 × 12개월입니다.
                        </p>
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
                        <p>수익률이 0%이면 최종 금액은 초기 투자금 + 월 추가 투자금 × 투자 개월 수입니다.</p>
                        <p>
                            예를 들어 {won(A.inputs.initial)}원을 초기 투자하고 매월 {won(A.inputs.monthly)}원씩 {A.inputs.years}년간 연 {A.inputs.rate}%로
                            투자하면 총 투자금은 {A.expected["총 투자금"]}원이지만, 최종 자산은 월복리 효과로 <strong>{A.expected["최종 자산"]}원</strong>이
                            되어 총 수익은 {A.expected["총 수익"]}원입니다.
                        </p>
                        <p>
                            기간을 늘리면 차이가 더 커집니다. 초기 {won(B.inputs.initial)}원, 매월 {won(B.inputs.monthly)}원, 연 {B.inputs.rate}%로 {B.inputs.years}년이면
                            총 투자금 {B.expected["총 투자금"]}원에 대해 최종 자산 <strong>{B.expected["최종 자산"]}원</strong>, 총 수익 {B.expected["총 수익"]}원입니다.
                            세금·수수료·물가 상승은 반영하지 않은 값이며, 수익률은 입력한 가정입니다.
                        </p>
                    </Article>

                    <Article title="복리 효과와 장기 투자의 관계">
                        <p>
                            복리 효과는 투자 기간이 길수록 더 강력해집니다. ‘72의 법칙’에 따르면
                            연 수익률 7%로 투자하면 약 10년 후 원금이 2배가 됩니다.
                            같은 원금을 20년 유지하면 4배, 30년이면 약 8배에 달합니다.
                        </p>
                        <p>
                            이 때문에 투자는 빨리 시작할수록 유리합니다. 매월 납입금을 꾸준히 유지하는
                            습관이 최종 금액을 결정짓는 핵심 요소입니다.
                        </p>
                    </Article>
                </SectionCard>

                <GuideLinks slugs={["compound-investing"]} />

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

                <InternalLinks currentPath="/compound-interest-calculator" />
            </div>
        </main>
    );
}
