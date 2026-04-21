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

          {/* 🔥 SEO 강화 블록 */}
          <SeoContent
              title="리스크 보상 비율 계산기"
              description="손실 대비 기대 수익을 비교하여 투자 효율성을 판단하는 계산기입니다."
              formula="기대 수익 / 예상 손실"
          />

          {/* 🔥 내부 링크 */}
          <InternalLinks />
        </div>
      </main>
  );
}