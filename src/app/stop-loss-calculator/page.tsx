import { buildMetadata } from "@/lib/metadata";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";
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

export const metadata = buildMetadata({
    title: "주식 손절가 계산기",
    description:
        "매수가, 보유 수량, 손절 비율을 입력하면 손절가와 예상 손실 금액을 빠르게 계산할 수 있는 손절가 계산기입니다.",
    path: "/stop-loss-calculator",
    keywords: [
        "손절가 계산기",
        "주식 손절가 계산",
        "손절 계산기",
        "손실 금액 계산",
        "stop loss calculator",
    ],
});

export default function StopLossCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge="리스크 관리"
                title="주식 손절가 계산기"
                description="매수가와 손절 비율을 기준으로 손절 기준 가격과 예상 손실 금액을 계산하는 도구입니다. 리스크를 미리 파악하고 투자 전략을 세워보세요."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <StopLossCalculator />

                <SectionCard>
                    <Article title="주식 손절가 계산기란?">
                        <p>
                            <strong>주식 손절가 계산기</strong>는 특정 매수가에서 정해진 손절 비율을 적용했을 때,
                            실제로 매도해야 하는 가격(손절가)과 예상 손실 금액을 계산하는 도구입니다.
                        </p>
                        <p>
                            손절이란 더 이상의 손실을 막기 위해 미리 정해둔 가격에서 보유 주식을 매도하는 전략입니다.
                            감정에 흔들리지 않고 규칙에 따라 손절 기준을 미리 정해두는 것이 투자 리스크 관리의 핵심입니다.
                        </p>
                    </Article>

                    <Article title="손절가 계산 공식">
                        <p>손절가는 매수가에서 손절 비율만큼 하락한 가격입니다.</p>
                        <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                            <div className="mx-auto max-w-3xl text-center font-mono font-bold text-slate-800">
                                <div className="break-keep text-sm leading-relaxed sm:text-base md:text-lg">
                                    손절가 = 매수가 × (1 − 손절 비율 ÷ 100)
                                </div>
                                <div className="mt-2 break-keep text-sm leading-relaxed sm:text-base md:text-lg">
                                    예상 손실 = (매수가 − 손절가) × 보유 수량
                                </div>
                            </div>
                        </div>
                        <p>
                            예를 들어 10,000원에 100주를 샀고 손절 비율이 5%라면, 손절가는 9,500원이며
                            예상 손실 금액은 50,000원입니다. 이 수치를 미리 파악해두면 투자 전 리스크를 명확히 인식할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="손절 기준 설정이 중요한 이유">
                        <p>
                            많은 투자자들이 손절 기준 없이 투자에 나섰다가 큰 손실을 경험합니다.
                            손절 기준을 사전에 정해두면 심리적인 흔들림 없이 규칙에 따라 행동할 수 있어
                            전체 계좌의 손실을 일정 수준 이하로 제한할 수 있습니다.
                        </p>
                        <p>
                            일반적으로 개별 종목 손절 기준은 매수가 대비 5~10% 손실 구간에서 설정하는 경우가 많습니다.
                            다만 이는 개인의 리스크 허용 범위와 투자 전략에 따라 달라질 수 있습니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
                    <FaqItem
                        question="손절 비율은 몇 퍼센트가 적당한가요?"
                        answer="정해진 답은 없습니다. 본인의 투자 성향과 종목 변동성에 따라 다릅니다. 일반적으로 5~10% 범위에서 설정하는 경우가 많지만, 고변동성 종목이라면 더 넓게 설정할 수도 있습니다."
                    />
                    <FaqItem
                        question="손절가를 지키지 않으면 어떻게 되나요?"
                        answer="손절 기준을 어기면 손실이 예상보다 훨씬 커질 수 있습니다. '조금만 기다리면 오르겠지'라는 심리는 많은 투자자들이 경험하는 함정입니다. 미리 정한 기준을 기계적으로 지키는 습관이 장기적으로 계좌를 지킵니다."
                    />
                    <FaqItem
                        question="손절 후 다시 반등하면 어떻게 하나요?"
                        answer="손절 후 주가가 반등하는 경우도 있습니다. 하지만 그것은 결과론적 판단입니다. 손절은 최악의 경우를 막기 위한 보험과 같습니다. 반등이 있더라도 손절 기준을 지키는 것이 전체 포트폴리오 관리에는 유리합니다."
                    />
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/profit-calculator",
                            title: "주식 수익률 계산기",
                            desc: "매수가 대비 현재 수익률 확인",
                        },
                        {
                            href: "/risk-reward-calculator",
                            title: "손익비 계산기",
                            desc: "기대 수익 대비 손실 비율 계산",
                        },
                        {
                            href: "/position-size-calculator",
                            title: "포지션 사이즈 계산기",
                            desc: "허용 손실 기준 매수 수량 계산",
                        },
                    ]}
                />

                <Disclaimer />

                <SeoContent
                    title="주식 손절가 계산기"
                    intro="손절가 계산기는 투자 시 가장 중요한 리스크 관리 도구 중 하나입니다. 매수가에서 일정 비율만큼 하락했을 때 실제로 어느 가격에서 매도해야 하는지, 그리고 그때 발생하는 예상 손실 금액이 얼마인지를 미리 파악할 수 있습니다."
                    body="주식 투자에서 수익을 내는 것만큼 손실을 제한하는 것도 중요합니다. 체계적인 손절 기준을 통해 감정적인 투자 결정을 최소화하고, 장기적으로 안정적인 수익 구조를 만들 수 있습니다."
                    formula="손절가 = 매수가 × (1 − 손절 비율 / 100) | 예상 손실 = (매수가 − 손절가) × 수량"
                    formulaNote="수수료는 포함되지 않으며, 실제 손실은 거래 수수료에 따라 달라질 수 있습니다."
                    whenToUse="신규 종목을 매수하기 전에 손절 기준을 미리 계산해두거나, 이미 보유 중인 종목에 대해 허용 손실 한도를 재설정할 때 활용하면 좋습니다. 특히 변동성이 큰 장세에서 리스크를 명확히 정의하는 데 유용합니다."
                    example="예시: 삼성전자를 70,000원에 50주 매수, 손절 비율 7% 설정 → 손절가 65,100원, 예상 손실 245,000원. 이를 미리 파악하면 투자 전 감내 가능한 리스크인지 판단할 수 있습니다."
                    caution="본 계산기의 결과는 참고용이며 실제 투자 손익과 다를 수 있습니다. 수수료, 세금, 슬리피지 등은 별도로 고려해야 합니다."
                    relatedLinks={[
                        { href: "/profit-calculator", label: "주식 수익률 계산기" },
                        { href: "/risk-reward-calculator", label: "손익비 계산기" },
                        { href: "/break-even-calculator", label: "본전 회복 계산기" },
                        { href: "/target-price-calculator", label: "목표가 계산기" },
                    ]}
                />

                <InternalLinks currentPath="/stop-loss-calculator" />
            </div>
        </main>
    );
}
