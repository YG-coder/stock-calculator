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
import InternalLinks from "@/components/seo/InternalLinks";
import GuideLinks from "@/components/seo/GuideLinks";
import { STOP_LOSS_BASIC } from "@/data/stockCalculatorExamples";

const TITLE = "주식 손절가 계산기";
const DESCRIPTION =
    "매수가, 보유 수량, 손절 비율(%)을 넣으면 손절 기준 가격과 1주당·총 예상 손실 금액, 총 매수 금액 대비 손실 비율을 계산합니다. 적정 손절 비율을 추천하지 않으며, 수수료·세금과 체결 가격 차이는 반영하지 않습니다.";
const PATH = "/stop-loss-calculator";

export const metadata = buildMetadata({
    title: `${TITLE} | 손절 비율로 손절가·예상 손실 계산`,
    description: DESCRIPTION,
    path: PATH,
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

const EX = STOP_LOSS_BASIC;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function StopLossCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path={PATH}
            faqs={FAQ_ITEMS}
        />
            <PageHeader
                badge="리스크 관리"
                title={TITLE}
                description="매수가, 보유 수량, 손절 비율을 기준으로 손절 기준 가격과 예상 손실 금액을 계산하는 도구입니다. 사용자가 정한 비율에 따른 가격과 손실을 보여 주며, 적정 손절 비율을 추천하지는 않습니다."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <StopLossCalculator />

                <SectionCard>
                    <Article title="손절가 계산 방법">
                        <p>
                            손절이란 더 이상의 손실을 막기 위해 미리 정해 둔 가격에서 보유 주식을 매도하는 것입니다.
                            이 계산기는 매수가에서 손절 비율만큼 하락한 가격(손절가)과 그 가격에서의 예상 손실을 보여 줍니다.
                        </p>
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
                            예를 들어 {won(EX.inputs["sl-buy-price"])}원에 {EX.inputs["sl-quantity"]}주를 샀고 손절 비율이 {EX.inputs["sl-percent"]}%라면
                            손절가는 <strong>{EX.expected["손절가"]}</strong>, 1주당 손실은 {EX.expected["1주당 손실 금액"]}, 예상 손실 금액은
                            <strong> {EX.expected["총 손실 금액"]}</strong>입니다(총 매수 금액 {EX.expected["총 매수 금액"]}의 {EX.expected["총 손실 비율"]}).
                            거래 수수료, 세금, 체결 가격 차이는 포함하지 않은 값입니다.
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

                <InternalLinks currentPath={PATH} />
            </div>
        </main>
    );
}
