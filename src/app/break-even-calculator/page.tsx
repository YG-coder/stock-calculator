import { Metadata } from "next";
import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
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
  title: "본전 회복 계산기 | 손실 복구 필요 상승률 계산",
  description:
    "손실 상태에서 본전으로 돌아가기 위해 몇 퍼센트 상승해야 하는지 계산해보세요. 손실 구간에서 필요한 상승률을 정확히 확인할 수 있습니다.",
  keywords: [
    "본전 회복 계산기",
    "손실 복구",
    "주식 손실 계산",
    "손실 상승률",
    "break even calculator",
  ],
  openGraph: {
    title: "본전 회복 계산기 | 손실 복구 상승률 계산",
    description:
      "손실이 발생하면 회복이 얼마나 어려운지 확인하세요. 필요한 상승률을 계산해주는 투자 필수 도구입니다.",
    type: "website",
  },
};

export default function BreakEvenCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader
        badge="리스크 관리"
        title="본전 회복 계산기"
        description="본전 회복 계산기는 현재 손실률을 기준으로 원금을 회복하기 위해 필요한 상승률을 계산하는 도구입니다. 손실이 커질수록 회복이 얼마나 어려운지 확인할 수 있습니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <BreakEvenCalculator />

        <SectionCard>
          <Article title="본전 회복 계산기의 중요성">
            <p>
              <strong>본전 회복 계산기</strong>는 손실 상태에서 원금을 회복하기 위해 필요한 상승률을 계산하는 도구입니다.
              손실이 커질수록 필요한 상승률은 더 크게 증가하기 때문에 리스크 관리에 필수적인 지표입니다.
            </p>
            <p>
              예를 들어 -50% 손실이 발생하면 단순히 50% 상승이 아니라 <strong>100% 상승</strong>이 필요합니다.
              이 계산기를 통해 손실 구간에서 필요한 회복 상승률을 정확히 인지하고,
              물타기나 손절 전략을 보다 현실적으로 판단할 수 있습니다.
            </p>
          </Article>

          <Article title="계산 방법 (수식)">
            <p>본전 회복에 필요한 상승률은 다음 공식으로 계산됩니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                (1 ÷ (1 - 손실률)) - 1
              </p>
            </div>
            <p>
              예를 들어 -30% 손실이 발생했다면,
              <code>(1 ÷ 0.7) - 1 ≈ 42.86%</code>의 상승이 필요합니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem
            question="손실이 커질수록 회복이 더 어려운 이유는?"
            answer="손실은 기준 금액이 줄어들기 때문에 동일한 퍼센트 상승으로는 원금을 회복할 수 없습니다. 손실이 클수록 필요한 상승률은 더 크게 증가합니다."
          />
          <FaqItem
            question="물타기를 하면 회복이 쉬워지나요?"
            answer="평단가를 낮추면 회복에 필요한 상승률은 줄어들 수 있지만, 추가 자금 투입이 필요하므로 반드시 리스크를 함께 고려해야 합니다."
          />
          <FaqItem
            question="손절과 병행해야 하나요?"
            answer="네, 본전 회복 가능성을 고려하되 손절 기준을 함께 설정하는 것이 리스크 관리 측면에서 중요합니다."
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
      </div>
    </main>
  );
}