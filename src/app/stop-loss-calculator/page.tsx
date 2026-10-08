import { buildMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
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
import GuideLinks from "@/components/seo/GuideLinks";

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

const FAQ_ITEMS = [
  { question: "손절 비율은 어떤 기준으로 입력하나요?", answer: "이 계산기는 적정 손절 비율을 추천하지 않습니다. 본인이 정한 매수가 대비 하락률을 0% 초과, 100% 미만으로 입력하면 기준 가격과 예상 손실을 계산합니다." },
  { question: "손절 비율과 계좌 전체의 손실 비율은 같은가요?", answer: "아니요. 입력한 손절 비율은 해당 종목의 매수 금액 기준입니다. 예를 들어 계좌 1,000만 원 중 200만 원을 투자하고 손절 비율을 5%로 정하면, 거래 비용을 제외한 예상 손실은 10만 원으로 계좌의 1%입니다." },
  { question: "계산한 손절가에 도달하면 자동으로 매도되나요?", answer: "아니요. 이 계산기는 기준 가격만 표시하며 주문을 실행하지 않습니다. 주문 여부와 조건은 이용 중인 증권사에서 별도로 설정해야 하며, 실제 체결 가격은 계산한 손절가와 다를 수 있습니다." },
  { question: "실제 수수료와 세금도 반영되나요?", answer: "아니요. 예상 손실은 (매수가 − 손절가) × 보유 수량으로 계산합니다. 거래 수수료, 세금, 체결 가격 차이는 포함되지 않으므로 실제 손실 금액과 다를 수 있습니다." },
];


export default function StopLossCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title="주식 손절가 계산기"
            description="매수가, 보유 수량, 손절 비율을 입력하면 손절가와 예상 손실 금액을 빠르게 계산할 수 있는 손절가 계산기입니다."
            path="/stop-loss-calculator"
            faqs={FAQ_ITEMS}
        />
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
                            사용자가 정한 기준 가격(손절가)과 그 가격에서의 예상 손실 금액을 계산하는 도구입니다.
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
                            손절 비율과 보유 수량을 함께 계산하면 해당 종목에서 예상되는 손실 금액을
                            계좌 전체 규모와 비교할 수 있습니다. 같은 손절 비율이라도 투자한 금액에 따라
                            계좌에 미치는 영향은 달라집니다.
                        </p>
                        <p>
                            이 계산기는 입력한 비율에 따른 가격과 손실을 보여 줍니다. 적정 손절 비율을
                            정해 주거나 손실 한도를 보장하지 않으며, 실제 체결 가격과 거래 비용에 따라
                            손실 금액이 달라질 수 있습니다.
                        </p>
                    </Article>
                </SectionCard>

                <GuideLinks slugs={["stop-loss-ratio"]} />

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
