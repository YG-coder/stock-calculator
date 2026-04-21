import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";
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

import SeoContent from "@/components/seo/SeoContent"
import InternalLinks from "@/components/seo/InternalLinks"

export const metadata = buildMetadata({
  title: "손익비 계산기",
  description:
      "투자에서 중요한 손익비(리스크 대비 수익 비율)를 계산해보세요. 목표 수익과 허용 손실을 입력하면 전략의 기대값과 필요 승률을 확인할 수 있습니다.",
  path: "/risk-reward-calculator",
  keywords: [
    "손익비 계산기",
    "리스크 대비 수익",
    "RRR 계산",
    "트레이딩 전략",
    "risk reward ratio",
  ],
});

export default function RiskRewardCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="전략 검증"
            title="손익비 계산기"
            description="손익비 계산기는 예상 수익과 감수 손실을 비교하여 리스크 대비 수익 비율을 분석하는 도구입니다. 투자 전략의 기대값과 필요 승률을 점검하는 데 도움이 됩니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <RiskRewardCalculator />

          <SectionCard>
            <Article title="손익비 계산기란?">
              <p>
                <strong>손익비 계산기</strong>는 한 번의 거래에서 얼마를 잃을 수
                있고, 얼마를 벌 수 있는지를 비교해 전략의 효율을 점검하는 도구입니다.
                승률만 보는 것보다 손실 대비 기대 수익을 함께 보는 것이 중요합니다.
              </p>
              <p>
                예를 들어 손익비가 1:2라면 한 번 잃을 때 두 배를 벌 수 있는 구조라는
                뜻입니다. 이런 구조는 승률이 아주 높지 않아도 장기적으로 유리할 수
                있습니다.
              </p>
            </Article>

            <Article title="손익비 계산 공식">
              <p>기본 공식은 아래와 같습니다.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  기대 수익 ÷ 감수 손실
                </p>
              </div>
              <p>
                예를 들어 손절 기준이 -5%, 목표 수익이 +10%라면 손익비는
                <strong> 1:2</strong>가 됩니다.
              </p>
            </Article>

            <Article title="왜 진입 전에 확인해야 하나?">
              <p>
                손익비를 먼저 계산하면 “오를 것 같다”는 감각 대신 숫자로 전략을 검토할 수 있습니다.
                손익 구조가 지나치게 불리하다면 애초에 진입을 피하는 것이 나을 수 있습니다.
              </p>
              <p>
                손익비는 손절가, 목표가, 포지션 사이즈와 함께 봐야 효과가 큽니다.
              </p>
            </Article>
          </SectionCard>

          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="손익비는 높을수록 무조건 좋은가요?"
                answer="일반적으로 유리하지만 승률도 함께 봐야 합니다. 손익비만 높고 승률이 지나치게 낮으면 실제 성과가 나쁠 수 있습니다."
            />
            <FaqItem
                question="손익비만 좋으면 수익이 보장되나요?"
                answer="아닙니다. 손익비는 전략 구조를 보여주는 지표일 뿐이며, 실제 성과는 승률과 자금 관리까지 함께 고려해야 합니다."
            />
            <FaqItem
                question="손절가와 목표가를 같이 정해야 하나요?"
                answer="네. 손익비는 손절 기준과 목표 수익이 동시에 있어야 의미 있게 계산할 수 있습니다."
            />
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

          <SeoContent
              title="손익비 계산기"
              intro="손익비(Risk/Reward Ratio) 계산기는 하나의 트레이드에서 감수하는 위험 대비 기대하는 수익의 비율을 계산하는 도구입니다. 손익비를 미리 계산해두면 진입 전략의 타당성을 객관적으로 평가할 수 있습니다."
              body="일반적으로 손익비 1:2 이상이면 기대값이 플러스인 전략으로 평가합니다. 같은 승률이라도 손익비가 높을수록 장기적으로 수익을 낼 가능성이 높습니다."
              formula="손익비 = 기대 수익 ÷ 예상 손실 | 손익분기 승률 = 1 ÷ (1 + 손익비) × 100"
              formulaNote="손익분기 승률이란 해당 손익비에서 기대값이 0이 되는 최소 승률입니다. 실제 승률이 이를 초과하면 장기적으로 수익이 납니다."
              whenToUse="새로운 종목에 진입하기 전에 진입가, 손절가, 목표가를 정해두고 손익비를 계산해보세요. 손익비가 낮은 트레이드는 아무리 승률이 높아도 장기적으로 불리합니다."
              example="예시: 진입가 10,000원, 손절가 9,500원(위험 500원), 목표가 11,500원(수익 1,500원) → 손익비 1:3. 이 경우 손익분기 승률은 25%로, 4번 중 1번만 성공해도 수익입니다."
              caution="손익비가 높더라도 실현 가능성을 고려해야 합니다. 지나치게 공격적인 목표가는 달성 확률이 낮아 실제 기대값이 낮을 수 있습니다."
              relatedLinks={[
                  { href: "/stop-loss-calculator", label: "손절가 계산기" },
                  { href: "/target-price-calculator", label: "목표가 계산기" },
                  { href: "/position-size-calculator", label: "포지션 사이즈 계산기" },
                  { href: "/profit-calculator", label: "수익률 계산기" },
              ]}
          />

          <InternalLinks currentPath="/risk-reward-calculator" />
        </div>
      </main>
  );
}