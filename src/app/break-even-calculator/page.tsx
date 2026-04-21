import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
import { buildMetadata } from "@/lib/metadata";
import SeoContent from "@/components/seo/SeoContent";
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

export const metadata = buildMetadata({
  title: "본전 회복 계산기",
  description:
      "현재 손실률을 기준으로 원금을 회복하기 위해 필요한 상승률을 계산할 수 있는 본전 회복 계산기입니다.",
  path: "/break-even-calculator",
  keywords: [
    "본전 회복 계산기",
    "손실 회복 계산",
    "본전 계산기",
    "손실률 회복",
    "break even calculator",
  ],
});

export default function BreakEvenCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="리스크 관리"
            title="본전 회복 계산기"
            description="본전 회복 계산기는 현재 손실률을 기준으로 원금을 회복하기 위해 필요한 상승률을 계산하는 도구입니다. 손실이 커질수록 회복이 얼마나 어려워지는지 직관적으로 확인할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <BreakEvenCalculator />

          <SectionCard>
            <Article title="본전 회복 계산기란?">
              <p>
                <strong>본전 회복 계산기</strong>는 손실 상태의 자산이 다시 원금으로
                돌아가기 위해 몇 퍼센트 상승해야 하는지 계산하는 도구입니다. 많은
                투자자가 -20% 손실이면 +20%만 오르면 본전이라고 착각하지만 실제로는
                그렇지 않습니다.
              </p>
              <p>
                손실이 발생하면 기준이 되는 자산 규모가 줄어들기 때문에, 같은 퍼센트
                상승으로는 원금 회복이 되지 않습니다. 손실이 커질수록 회복에 필요한
                상승률은 급격히 커집니다.
              </p>
            </Article>

            <Article title="본전 회복 계산 공식">
              <p>필요한 상승률 계산은 아래 원리로 접근합니다.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  (1 ÷ (1 - 손실률)) - 1
                </p>
              </div>
              <p>
                예를 들어 손실률이 -30%라면 원금을 회복하기 위해 약
                <strong> 42.86%</strong> 상승이 필요합니다. 손실이 -50%라면
                회복에는 <strong>100%</strong> 상승이 필요합니다.
              </p>
            </Article>

            <Article title="왜 꼭 확인해야 하나?">
              <p>
                이 계산기는 손절의 중요성을 직관적으로 보여줍니다. 손실을 방치할수록
                회복 난도가 커지기 때문에, 초기에 손실을 관리하는 것이 장기적으로 훨씬
                중요합니다.
              </p>
              <p>
                본전 회복 계산기는 평단가 계산기, 손절가 계산기와 함께 보면 더 효과적입니다.
              </p>
            </Article>
          </SectionCard>

          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="왜 -20% 손실은 +20% 상승으로 회복되지 않나요?"
                answer="손실이 난 뒤에는 원금보다 줄어든 금액이 기준이 되기 때문입니다. 그래서 같은 퍼센트 상승으로는 원금에 도달하지 못합니다."
            />
            <FaqItem
                question="물타기를 하면 회복이 쉬워지나요?"
                answer="평단가를 낮추는 효과는 있지만 추가 자금이 투입되므로 리스크도 함께 커질 수 있습니다. 단순히 본전 회복만 보고 판단하면 안 됩니다."
            />
            <FaqItem
                question="장기 투자자에게도 필요한 계산기인가요?"
                answer="네. 장기 투자자도 큰 손실 구간에 들어가면 회복까지 오랜 시간이 걸릴 수 있으므로 손실 관리 감각을 익히는 데 도움이 됩니다."
            />
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

          <SeoContent
              title="본전 회복 계산기"
              intro="본전 회복 계산기는 현재 손실 상태에서 원금을 회복하기 위해 주가가 얼마나 상승해야 하는지 계산하는 도구입니다. 손실 후 회복에 필요한 상승률이 손실률보다 훨씬 높다는 것을 시각적으로 확인할 수 있습니다."
              body="예를 들어 50% 손실을 입으면 원금 회복에는 100% 상승이 필요합니다. 이 비대칭성을 이해하면 손절의 중요성과 리스크 관리의 필요성이 더욱 명확해집니다."
              formula="회복 필요 상승률 = (1 ÷ (1 − 손실률)) − 1 × 100"
              formulaNote="예: 손실 30% → 회복 필요 상승률 = (1 ÷ 0.7) − 1 = 약 42.86%"
              whenToUse="현재 손실 중인 종목을 계속 보유할지 손절할지 결정할 때, 또는 추가 매수(물타기) 후 회복 조건을 파악하고 싶을 때 활용하세요."
              example="예시: 10,000원에 매수 후 현재가 7,000원 → 손실률 30%. 원금 회복을 위해서는 현재가 대비 42.86% 상승(10,000원 도달)이 필요합니다."
              caution="회복 상승률이 높을수록 장기간 보유가 필요할 수 있으며, 그동안 기회비용이 발생합니다. 객관적인 판단 기준으로만 활용하세요."
              relatedLinks={[
                  { href: "/profit-calculator", label: "수익률 계산기" },
                  { href: "/stop-loss-calculator", label: "손절가 계산기" },
                  { href: "/average-price-calculator", label: "평단가 계산기" },
                  { href: "/risk-reward-calculator", label: "손익비 계산기" },
              ]}
          />

          <InternalLinks currentPath="/break-even-calculator" />
        </div>
      </main>
  );
}