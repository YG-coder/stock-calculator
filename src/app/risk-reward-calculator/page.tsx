import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";
import { buildMetadata } from "@/lib/metadata";
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

import InternalLinks from "@/components/seo/InternalLinks"
import { RISK_REWARD_BASIC } from "@/data/stockCalculatorExamples";

const TITLE = "손익비 계산기";
const DESCRIPTION =
    "진입가, 손절가, 목표가를 넣으면 1주당 리스크 금액과 보상 금액, 손익비(보상 ÷ 리스크, R)와 손익분기 승률을 계산합니다. 승률·기대값은 계산하지 않으며, 수수료·세금은 반영하지 않습니다.";
const PATH = "/risk-reward-calculator";

export const metadata = buildMetadata({
  title: `${TITLE} | 손익비·손익분기 승률 계산`,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "손익비 계산기",
    "리스크 대비 수익",
    "RRR 계산",
    "트레이딩 전략",
    "risk reward ratio",
  ],
});

const FAQ_ITEMS = [
  { question: "손익비는 높을수록 무조건 좋은가요?", answer: "일반적으로 유리하지만 승률도 함께 봐야 합니다. 손익비만 높고 승률이 지나치게 낮으면 실제 성과가 나쁠 수 있습니다." },
  { question: "손익비만 좋으면 수익이 보장되나요?", answer: "아닙니다. 손익비는 전략 구조를 보여주는 지표일 뿐이며, 실제 성과는 승률과 자금 관리까지 함께 고려해야 합니다." },
  { question: "손절가와 목표가를 같이 정해야 하나요?", answer: "네. 손익비는 손절 기준과 목표 수익이 동시에 있어야 의미 있게 계산할 수 있습니다." },
];

const EX = RISK_REWARD_BASIC;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function RiskRewardCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path={PATH}
            faqs={FAQ_ITEMS}
        />
        <PageHeader
            badge="전략 검증"
            title={TITLE}
            description="진입가, 손절가, 목표가를 기준으로 한 번의 거래에서 감수하는 손실과 기대하는 수익을 비교해 손익비와 손익분기 승률을 계산하는 도구입니다. 진입 전에 전략의 손익 구조를 숫자로 점검할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <RiskRewardCalculator />

          <SectionCard>
            <Article title="손익비 계산 방법">
              <p>
                손익비는 한 번의 거래에서 얼마를 잃을 수 있고(진입가 − 손절가), 얼마를 벌 수 있는지(목표가 − 진입가)를
                비교한 값입니다. 승률만 보는 것보다 손실 대비 기대 수익을 함께 보는 것이 중요합니다.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-base sm:text-xl text-slate-800 font-bold tracking-tight">
                  손익비(R) = (목표가 − 진입가) ÷ (진입가 − 손절가)
                </p>
                <p className="mt-2 font-mono text-base sm:text-xl text-slate-800 font-bold tracking-tight">
                  손익분기 승률(%) = 1 ÷ (1 + 손익비) × 100
                </p>
              </div>
              <p>
                예를 들어 진입가 {won(EX.inputs.entryPrice)}원, 손절가 {won(EX.inputs.stopPrice)}원(리스크 {EX.expected["리스크 금액"]}원),
                목표가 {won(EX.inputs.targetPrice)}원(보상 {EX.expected["보상 금액"]}원)이면 손익비는 <strong>{EX.expected["손익비"]}R</strong>이고,
                손익분기 승률은 <strong>{EX.expected["손익분기 승률"]}%</strong>입니다. 손익분기 승률은 손익비가 이 값일 때 손익이 0이 되는
                승률로, 네 번 중 한 번만 목표가에 도달해도 세 번의 손절을 상계한다는 뜻입니다. 수수료·세금은 반영하지 않은 가격 기준 값입니다.
              </p>
            </Article>

            <Article title="왜 진입 전에 확인해야 하나?">
              <p>
                손익비를 먼저 계산하면 “오를 것 같다”는 감각 대신 숫자로 전략을 검토할 수 있습니다.
                손익 구조가 지나치게 불리하다면 애초에 진입을 피하는 것이 나을 수 있습니다. 반대로 손익비가 높더라도
                지나치게 공격적인 목표가는 도달 가능성이 낮을 수 있으므로 실현 가능성을 함께 봐야 합니다.
              </p>
              <p>
                손익비는 손절가, 목표가, 포지션 사이즈와 함께 봐야 효과가 큽니다.
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
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한 기준 가격 계산",
                },
                {
                  href: "/target-price-calculator",
                  title: "주식 목표가 계산기",
                  desc: "목표 수익률 기준 매도 가격 설정",
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
