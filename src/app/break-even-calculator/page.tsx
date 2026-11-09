import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
import { buildMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import InternalLinks from "@/components/seo/InternalLinks";
import {
  PageHeader,
  SectionCard,
  Article,
  FaqSection,
  FaqItem,
  RelatedCalculators,
  Disclaimer,
} from "@/components/ui/Shared";
import { BREAK_EVEN_LOSS_20, BREAK_EVEN_LOSS_30, BREAK_EVEN_LOSS_50 } from "@/data/stockCalculatorExamples";

const TITLE = "본전 회복 계산기";
const DESCRIPTION =
    "현재 손실률(%)을 넣으면 원금(본전)으로 돌아가기 위해 지금 가격에서 필요한 상승률을 계산합니다. 손실률만으로 계산하는 비율 결과이며, 금액·수수료·세금은 다루지 않습니다.";
const PATH = "/break-even-calculator";

export const metadata = buildMetadata({
  title: `${TITLE} | 손실률별 원금 회복 필요 상승률`,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "본전 회복 계산기",
    "손실 회복 계산",
    "본전 계산기",
    "손실률 회복",
    "break even calculator",
  ],
});

const FAQ_ITEMS = [
  { question: "왜 -20% 손실은 +20% 상승으로 회복되지 않나요?", answer: "손실이 난 뒤에는 원금보다 줄어든 금액이 기준이 되기 때문입니다. 그래서 같은 퍼센트 상승으로는 원금에 도달하지 못합니다." },
  { question: "물타기를 하면 회복이 쉬워지나요?", answer: "평단가를 낮추는 효과는 있지만 추가 자금이 투입되므로 리스크도 함께 커질 수 있습니다. 단순히 본전 회복만 보고 판단하면 안 됩니다." },
  { question: "장기 투자자에게도 필요한 계산기인가요?", answer: "네. 장기 투자자도 큰 손실 구간에 들어가면 회복까지 오랜 시간이 걸릴 수 있으므로 손실 관리 감각을 익히는 데 도움이 됩니다." },
];

const rate = (c: { expected: Record<string, string> }) => c.expected["본전 회복 요구 상승률"].replace(/^\+/, "");

export default function BreakEvenCalculatorPage() {
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
            description="현재 손실률을 기준으로 원금을 회복하기 위해 필요한 상승률을 계산하는 도구입니다. 손실이 커질수록 회복이 얼마나 어려워지는지 직관적으로 확인할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <BreakEvenCalculator />

          <SectionCard>
            <Article title="본전 회복 상승률 계산 방법">
              <p>
                많은 투자자가 -20% 손실이면 +20%만 오르면 본전이라고 생각하지만, 손실이 발생하면
                기준이 되는 자산 규모가 줄어들기 때문에 같은 퍼센트 상승으로는 원금 회복이 되지
                않습니다. 손실이 커질수록 회복에 필요한 상승률은 급격히 커집니다.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  필요 상승률(%) = (1 ÷ (1 − 손실률) − 1) × 100
                </p>
              </div>
              <p>
                예를 들어 손실률이 {BREAK_EVEN_LOSS_20.inputs.lossRate}%라면 원금 회복에
                <strong> {rate(BREAK_EVEN_LOSS_20)}%</strong>, {BREAK_EVEN_LOSS_30.inputs.lossRate}%라면
                <strong> {rate(BREAK_EVEN_LOSS_30)}%</strong>, {BREAK_EVEN_LOSS_50.inputs.lossRate}%라면
                <strong> {rate(BREAK_EVEN_LOSS_50)}%</strong> 상승이 필요합니다. 10,000원에 산 주식이 7,000원이 되면(손실률 30%)
                다시 10,000원이 되기까지 현재가 대비 {rate(BREAK_EVEN_LOSS_30)}%가 올라야 한다는 뜻입니다.
              </p>
            </Article>

            <Article title="왜 꼭 확인해야 하나?">
              <p>
                이 계산기는 손절의 중요성을 직관적으로 보여줍니다. 손실을 방치할수록
                회복 난도가 커지기 때문에, 초기에 손실을 관리하는 것이 장기적으로 훨씬
                중요합니다. 회복에 필요한 상승률이 높을수록 보유 기간이 길어질 수 있고, 그동안 기회비용이 생깁니다.
              </p>
              <p>
                본전 회복 계산기는 평단가 계산기, 손절가 계산기와 함께 보면 더 효과적입니다.
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
                  href: "/average-price-calculator",
                  title: "물타기 평단가 계산기",
                  desc: "추가 매수 후 평균 매입 단가 계산",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한 기준 가격 설정",
                },
                {
                  href: "/profit-calculator",
                  title: "주식 수익률 계산기",
                  desc: "현재가 기준 실제 수익률 확인",
                },
              ]}
          />

          <Disclaimer />

          <InternalLinks currentPath={PATH} />
        </div>
      </main>
  );
}
