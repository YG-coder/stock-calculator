import { Metadata } from "next";
import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";
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
  title: "손익비 계산기 | 리스크 대비 수익 비율 분석",
  description:
    "투자에서 중요한 손익비(리스크 대비 수익 비율)를 계산해보세요. 목표 수익과 허용 손실을 입력하면 전략의 기대값과 필요 승률을 확인할 수 있습니다.",
  keywords: [
    "손익비 계산기",
    "리스크 대비 수익",
    "RRR 계산",
    "트레이딩 전략",
    "risk reward ratio",
  ],
  openGraph: {
    title: "손익비 계산기 | 리스크 대비 수익 분석",
    description:
      "손익비를 계산하고 전략의 승률을 확인하세요. 수익보다 중요한 리스크 관리를 위한 필수 도구입니다.",
    type: "website",
  },
};

export default function RiskRewardCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader
        badge="전략 검증"
        title="손익비 계산기"
        description="손익비 계산기는 예상 수익과 감수 손실을 비교하여 리스크 대비 수익 비율을 분석하는 도구입니다. 투자 전략의 기대값과 필요 승률을 확인할 수 있습니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <RiskRewardCalculator />

        <SectionCard>
          <Article title="손익비 계산기의 중요성">
            <p>
              <strong>손익비 계산기</strong>는 기대 수익과 감수 손실을 비교하여 전략의 효율성을 판단하는 도구입니다.
              손익비가 높을수록 낮은 승률에서도 수익을 낼 수 있어 트레이딩 전략 설계에 중요합니다.
            </p>
            <p>
              예를 들어 손익비가 1:2라면 한 번의 손실을 두 번의 수익으로 보완할 수 있는 구조가 됩니다.
              손익비를 미리 계산해두면 진입 전부터 전략의 효율성을 검증할 수 있어, 감이 아닌 기준으로 매매 결정을 내리는 데 도움이 됩니다.
            </p>
          </Article>

          <Article title="손익비 계산 방법 (수식)">
            <p>손익비는 다음과 같이 계산됩니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                기대 수익 ÷ 감수 손실
              </p>
            </div>
            <p>
              예를 들어 10% 손실을 감수하고 20% 수익을 기대한다면,
              손익비는 <strong>1:2</strong>가 됩니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem
            question="손익비는 높을수록 좋은가요?"
            answer="일반적으로 손익비가 높을수록 유리하지만, 실제로는 승률과 함께 고려해야 합니다. 손익비와 승률의 균형이 중요합니다."
          />
          <FaqItem
            question="손익비만 좋으면 무조건 수익이 나나요?"
            answer="아닙니다. 손익비가 좋아도 승률이 너무 낮으면 손실이 발생할 수 있습니다. 두 요소를 함께 분석해야 합니다."
          />
          <FaqItem
            question="손절가와 함께 설정해야 하나요?"
            answer="네, 손익비는 손절가와 목표가를 함께 설정해야 의미가 있습니다. 두 기준을 동시에 관리하는 것이 중요합니다."
          />
        </FaqSection>

        <RelatedCalculators
          links={[
            {
              href: "/stop-loss-calculator",
              title: "주식 손절가 계산기",
              desc: "손실 제한을 위한 손절 기준 가격 계산",
            },
            {
              href: "/target-price-calculator",
              title: "주식 목표가 계산기",
              desc: "목표 수익률 기준 매도 가격 설정",
            },
            {
              href: "/position-size-calculator",
              title: "포지션 사이즈 계산기",
              desc: "허용 손실 기준 투자 금액 계산",
            },
          ]}
        />

        <Disclaimer />
      </div>
    </main>
  );
}