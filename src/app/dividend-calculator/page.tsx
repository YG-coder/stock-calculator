import DividendCalculator from "@/components/calculator/DividendCalculator";
import { buildMetadata } from "@/lib/metadata";
import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";

export const metadata = buildMetadata({
    title: "배당 수익 계산기",
    description:
        "보유 주식 수와 1주당 배당금을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 배당 수익 계산기입니다. 국내 주식과 미국 주식 배당을 쉽게 비교할 수 있습니다.",
    path: "/dividend-calculator",
    keywords: [
        "배당 수익 계산기",
        "배당 계산기",
        "배당수익률 계산기",
        "세후 배당금",
        "미국 주식 배당",
        "국내 주식 배당",
    ],
});

export default function DividendCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge="현금 흐름 분석"
                title="배당 수익 계산기"
                description="배당 수익 계산기는 보유 주식 수와 1주당 배당금을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 도구입니다. 배당 투자 전략을 세울 때 실수령액을 빠르게 확인할 수 있습니다."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <DividendCalculator />

                <SectionCard>
                    <Article title="배당 수익 계산기란?">
                        <p>
                            <strong>배당 수익 계산기</strong>는 보유 종목이 실제로 얼마의 현금
                            흐름을 만들어 주는지 확인하기 위한 도구입니다. 단순히 배당금이 많아
                            보인다고 좋은 종목인 것은 아니며, 투자금 대비 배당금이 어느 정도인지
                            함께 보는 것이 중요합니다.
                        </p>
                        <p>
                            특히 국내 주식과 미국 주식은 세금 구조가 다르기 때문에 세전 금액만
                            보면 실제 수익을 과대평가할 수 있습니다. 따라서 배당 투자자는 세전
                            금액, 세후 실수령액, 배당수익률을 함께 확인하는 습관이 필요합니다.
                        </p>
                    </Article>

                    <Article title="배당금 계산 방법">
                        <p>배당금의 기본 계산 방식은 아래와 같습니다.</p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                            <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                                세전 배당금 = 보유 수량 × 1주당 배당금
                                <br />
                                세후 배당금 = 세전 배당금 - 세금
                            </p>
                        </div>
                        <p>
                            예를 들어 100주를 보유하고 있고 1주당 배당금이 1,500원이라면 세전
                            배당금은 150,000원입니다. 여기에 국가별 세율을 반영하면 실제 수령
                            가능한 배당금을 계산할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="배당수익률을 함께 보는 이유">
                        <p>
                            같은 100만 원의 배당금을 받더라도 투자 원금이 1천만 원인지, 1억
                            원인지에 따라 투자 효율은 크게 다릅니다. 이때 중요한 지표가 바로
                            배당수익률입니다. 배당수익률은 투자금 대비 배당금의 비율을 뜻하며,
                            장기 현금 흐름 투자에서 핵심 기준이 됩니다.
                        </p>
                        <p>
                            배당만 보고 종목을 선택하기보다, 배당 성향, 배당 지속 가능성,
                            실적 추이, 주가 변동성까지 함께 고려하는 것이 좋습니다. 이 계산기는
                            그런 판단을 시작하기 위한 기본 수치 확인용 도구로 활용하면 좋습니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
                    <FaqItem
                        question="세후 배당금은 어떻게 계산되나요?"
                        answer="세전 배당금에 국가별 배당소득세를 반영해 계산합니다. 실제 세율은 국가, 계좌 유형, 제출 서류 등에 따라 달라질 수 있습니다."
                    />
                    <FaqItem
                        question="배당수익률이 높으면 무조건 좋은 종목인가요?"
                        answer="아닙니다. 일시적으로 주가가 급락해 배당수익률이 높아 보일 수도 있으므로, 배당 안정성과 기업 실적을 함께 확인해야 합니다."
                    />
                    <FaqItem
                        question="미국 주식 배당도 계산할 수 있나요?"
                        answer="네. 미국 주식도 보유 수량과 1주당 배당금이 있다면 세전·세후 배당금과 배당수익률을 계산하는 데 활용할 수 있습니다."
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