import type { Metadata } from "next";
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
        "배당 수익 계산기로 보유 주식의 세전·세후 배당금과 배당수익률을 계산하세요. 국내 주식과 미국 주식의 배당 세율을 반영해 예상 배당 수익을 확인할 수 있습니다.",
    keywords: [
        "배당 수익 계산기",
        "배당 계산기",
        "배당수익률 계산기",
        "배당금 계산",
        "세후 배당금 계산",
        "미국 주식 배당 세금",
        "국내 주식 배당소득세",
    ],
    openGraph: {
        title: "배당 수익 계산기 | 세전·세후 배당금 자동 계산",
        description:
            "국내 주식과 미국 주식의 배당금을 기준으로 세전·세후 배당금과 배당수익률을 간편하게 계산할 수 있는 투자 계산기입니다.",
        type: "website",
    },
};

export default function DividendCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge="필수 금융 계산기"
                title="배당 수익 계산기"
                description="보유 주식의 주가, 수량, 1주당 배당금을 입력하면 예상 배당금과 배당수익률을 쉽게 계산할 수 있습니다. 국내 주식과 미국 주식의 세율 차이를 반영해 세후 기준으로도 확인해보세요."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <DividendCalculator />

                <SectionCard>
                    <Article title="배당 수익 계산기가 필요한 이유">
                        <p>
                            배당 투자에서는 단순히 배당금 액수만 보는 것이 아니라,
                            현재 주가와 보유 수량을 기준으로 실제 배당수익률이 얼마인지 함께 확인하는 것이 중요합니다.
                            같은 배당금이라도 매수 단가와 세후 수령액에 따라 실제 투자 효율은 달라질 수 있습니다.
                        </p>
                        <p>
                            특히 국내 주식과 미국 주식은 배당 세율 구조가 다르기 때문에,
                            세전 기준 숫자만 보고 판단하면 예상보다 실제 수령액이 작아질 수 있습니다.
                            배당 계산기를 활용하면 세후 기준 예상 현금흐름을 보다 현실적으로 파악할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="배당 수익 계산 방법">
                        <p>배당 계산은 보통 다음 순서로 진행됩니다.</p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                            <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                                총 투자금 = 주가 × 보유 수량
                                <br />
                                세전 배당금 = 1주당 배당금 × 보유 수량
                                <br />
                                세후 배당금 = 세전 배당금 × (1 - 세율)
                                <br />
                                세후 배당수익률 = 세후 배당금 ÷ 총 투자금 × 100
                            </p>
                        </div>
                        <p>
                            예를 들어 1주당 배당금이 높더라도 현재 주가가 이미 많이 오른 상태라면 배당수익률은 낮아질 수 있습니다.
                            따라서 배당 투자에서는 배당금과 함께 배당수익률을 같이 보는 습관이 중요합니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
                    <FaqItem
                        question="국내 주식과 미국 주식의 배당 세율은 어떻게 다른가요?"
                        answer="이 계산기는 국내 주식은 배당소득세 15.4%, 미국 주식은 일반적인 W-8BEN 제출 기준 15%를 적용합니다. 실제 세율은 계좌 및 세무 상황에 따라 달라질 수 있습니다."
                    />
                    <FaqItem
                        question="세후 배당금이 왜 중요한가요?"
                        answer="실제로 계좌에 입금되는 금액은 세전 배당금이 아니라 세금 차감 후 금액이기 때문입니다. 세후 기준으로 봐야 현실적인 현금흐름을 판단할 수 있습니다."
                    />
                    <FaqItem
                        question="배당수익률이 높으면 무조건 좋은 주식인가요?"
                        answer="아닙니다. 배당수익률이 높아도 주가 하락이나 실적 악화가 동반될 수 있습니다. 배당수익률은 참고 지표로 활용하고, 기업의 실적과 재무 상태도 함께 확인하는 것이 좋습니다."
                    />
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/profit-calculator",
                            title: "수익률 계산기",
                            desc: "매수 대비 현재 손익과 수익률 확인",
                        },
                        {
                            href: "/target-price-calculator",
                            title: "목표가 계산기",
                            desc: "원하는 수익률에 필요한 매도 가격 계산",
                        },
                    ]}
                />

                <Disclaimer />
            </div>
        </main>
    );
}