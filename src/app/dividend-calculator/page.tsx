import { Metadata } from "next";
import DividendCalculator from "@/components/calculator/DividendCalculator";
import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";

export const metadata: Metadata = {
    title: "배당 수익 계산기 | 세전·세후 배당금 및 배당수익률 계산",
    description:
        "보유 주식 수와 1주당 배당금을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 배당 수익 계산기입니다. 국내 주식과 미국 주식 배당을 쉽게 비교할 수 있습니다.",
    keywords: [
        "배당 수익 계산기",
        "배당 계산기",
        "배당수익률 계산기",
        "세후 배당금",
        "미국 주식 배당",
        "국내 주식 배당",
    ],
    openGraph: {
        title: "배당 수익 계산기 | 세전·세후 배당금 및 배당수익률 계산",
        description:
            "국내 주식과 미국 주식의 세전·세후 배당금과 배당수익률을 간편하게 계산해보세요. 장기 투자와 배당 투자 전략에 필요한 핵심 도구입니다.",
        type: "website",
    },
};

export default function DividendCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge="현금 흐름 분석"
                title="배당 수익 계산기"
                description="배당 수익 계산기는 보유 주식 수와 1주당 배당금을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 도구입니다. 국내 주식과 미국 주식의 배당 수익을 비교하며 장기 투자 전략을 세울 수 있습니다."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <DividendCalculator />

                <SectionCard>
                    <Article title="배당 수익 계산기의 중요성">
                        <p>
                            <strong>배당 수익 계산기</strong>는 보유 주식 수와 1주당 배당금을 기준으로 실제 받을 수 있는
                            배당금을 계산하는 도구입니다. 단순히 배당금 총액만 보는 것이 아니라,
                            세금 차감 전후의 금액과 배당수익률까지 함께 확인할 수 있다는 점이 중요합니다.
                        </p>
                        <p>
                            특히 국내 주식과 미국 주식은 배당세 구조가 다르기 때문에,
                            세전 수익과 세후 실수령액을 분리해서 보는 것이 장기 배당 투자 전략에 큰 도움이 됩니다.
                            배당주 투자자는 이 계산기를 통해 종목별 현금 흐름과 실제 수익 구조를 더 정확히 판단할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="배당 수익 계산 방법 (기본 개념)">
                        <p>
                            배당금은 일반적으로 <strong>보유 주식 수 × 1주당 배당금</strong>으로 계산합니다.
                            여기에 국가별 세율을 반영하면 세후 배당금을 확인할 수 있습니다.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                            <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                                세전 배당금 = 보유 수량 × 1주당 배당금
                                <br />
                                세후 배당금 = 세전 배당금 - 세금
                            </p>
                        </div>
                        <p>
                            예를 들어 100주를 보유하고 있고 1주당 배당금이 1,500원이라면 세전 배당금은 150,000원입니다.
                            여기에 국내 주식은 15.4%, 미국 주식은 일반적으로 15% 원천징수를 반영하여
                            실제 실수령 배당금을 계산할 수 있습니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
                    <FaqItem
                        question="세후 배당금은 어떻게 계산되나요?"
                        answer="세전 배당금에 국가별 배당소득세를 적용하여 계산합니다. 국내 주식은 일반적으로 15.4%, 미국 주식은 W-8BEN 제출 기준 15% 원천징수를 적용합니다."
                    />
                    <FaqItem
                        question="배당수익률은 무엇인가요?"
                        answer="배당수익률은 투자금 대비 배당금이 얼마나 되는지를 보여주는 지표입니다. 단순 배당금 규모보다 효율적인 배당 투자를 판단하는 데 더 중요한 기준이 됩니다."
                    />
                    <FaqItem
                        question="국내 주식과 미국 주식 배당은 왜 따로 봐야 하나요?"
                        answer="세율 구조와 실수령액이 다르기 때문입니다. 같은 배당금이라도 국가별 세금 차이로 인해 실제 수익률이 달라질 수 있습니다."
                    />
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/profit-calculator",
                            title: "주식 수익률 계산기",
                            desc: "배당 외 가격 상승 기준 실제 수익률 확인",
                        },
                        {
                            href: "/target-price-calculator",
                            title: "주식 목표가 계산기",
                            desc: "목표 수익률 기준 매도 가격 설정",
                        },
                        {
                            href: "/average-price-calculator",
                            title: "물타기 평단가 계산기",
                            desc: "추가 매수 후 평균 매입 단가 계산",
                        },
                    ]}
                />

                <Disclaimer />
            </div>
        </main>
    );
}