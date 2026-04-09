import { Metadata } from "next";
import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
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
  title: "포지션 사이즈 계산기 | 허용 손실 기준 매수 수량 계산",
  description:
    "총 투자금, 허용 손실률, 진입가와 손절가를 기준으로 적절한 매수 수량과 투자 금액을 계산하는 포지션 사이즈 계산기입니다.",
  keywords: [
    "포지션 사이즈 계산기",
    "매수 수량 계산",
    "자금 관리",
    "리스크 관리",
    "position size calculator",
  ],
  openGraph: {
    title: "포지션 사이즈 계산기 | 허용 손실 기준 매수 수량 계산",
    description:
      "허용 가능한 손실 범위를 기준으로 적절한 매수 수량과 투자 금액을 계산하세요. 자금 관리와 리스크 통제를 위한 필수 도구입니다.",
    type: "website",
  },
};

export default function PositionSizeCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader
        badge="자금 관리"
        title="포지션 사이즈 계산기"
        description="포지션 사이즈 계산기는 총 투자금과 허용 손실률, 진입가와 손절가를 기준으로 적절한 매수 수량과 투자 금액을 계산하는 도구입니다. 허용 가능한 손실 범위 안에서 자금 관리를 체계적으로 할 수 있습니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <PositionSizeCalculator />

        <SectionCard>
          <Article title="포지션 사이즈 계산기의 중요성">
            <p>
              <strong>포지션 사이즈 계산기</strong>는 한 번의 거래에서 허용 가능한 손실 범위 안에서 적절한 매수 수량과 투자 금액을 계산하는 자금 관리 도구입니다.
              계좌 리스크를 일정하게 유지하면 손실 구간에서도 계좌를 보호할 수 있고, 장기적으로 안정적인 투자 전략을 유지하는 데 도움이 됩니다.
            </p>
            <p>
              많은 투자자들이 진입 시점만 고민하고 매수 수량은 감으로 정하지만, 실제로는 자금 관리가 수익률보다 더 중요합니다.
              포지션 사이즈를 일정하게 유지하면 손실 구간에서도 계좌를 보호할 수 있고, 장기적으로 안정적인 전략을 운영할 수 있습니다.
            </p>
          </Article>

          <Article title="포지션 사이즈 계산 방법 (개념)">
            <p>
              포지션 사이즈는 일반적으로 <strong>허용 가능한 총 손실 금액</strong>을
              <strong> 1주당 손실 금액</strong>으로 나누어 계산합니다.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                허용 총 손실 금액 ÷ (진입가 - 손절가)
              </p>
            </div>
            <p>
              예를 들어 총 자본이 1,000만원이고 1회 거래에서 2%만 잃겠다고 정했다면 허용 손실 금액은 20만원입니다.
              이 상태에서 진입가와 손절가 차이가 2,000원이라면, 20만원 ÷ 2,000원 = 100주가 권장 매수 수량이 됩니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem
            question="포지션 사이즈는 왜 중요한가요?"
            answer="포지션 사이즈는 계좌 전체 손실을 통제하는 핵심 요소입니다. 같은 종목이라도 매수 수량이 과도하면 한 번의 손실이 계좌에 큰 타격을 줄 수 있습니다."
          />
          <FaqItem
            question="허용 손실률은 몇 퍼센트가 적당한가요?"
            answer="일반적으로 1~2%를 많이 사용합니다. 보수적인 투자자는 더 낮게 설정하기도 하며, 자신의 투자 성향과 전략에 맞게 조정하는 것이 좋습니다."
          />
          <FaqItem
            question="손절가를 정하지 않으면 포지션 사이즈를 계산할 수 없나요?"
            answer="정확한 포지션 사이즈 계산을 위해서는 손절가가 필요합니다. 손절가가 없으면 1주당 손실 금액을 계산할 수 없기 때문입니다."
          />
        </FaqSection>

        <RelatedCalculators
          links={[
            {
              href: "/risk-reward-calculator",
              title: "손익비 계산기",
              desc: "리스크 대비 기대 수익 비율과 전략 효율 분석",
            },
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
          ]}
        />

        <Disclaimer />
      </div>
    </main>
  );
}