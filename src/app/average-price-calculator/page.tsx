import { Metadata } from "next";
import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
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
  title: "주식 평단가 계산기 | 물타기 후 평균단가 자동 계산",
  description:
    "주식 매수 후 물타기를 할 때 평균 매입 단가(평단가)가 어떻게 변하는지 쉽게 계산해보세요. 추가 매수 가격과 수량만 입력하면 평균 단가를 즉시 확인할 수 있습니다.",
  keywords: [
    "주식 평단가 계산기",
    "물타기 계산기",
    "주식 평균단가",
    "stock average price calculator",
    "추가매수 평단",
  ],
  openGraph: {
    title: "주식 평단가 계산기 | 물타기 후 평균단가 자동 계산",
    description:
      "물타기 전후의 평단가와 투자금을 정확히 계산해보세요. 주식 초보자도 쉽게 사용할 수 있는 필수 금융 계산기입니다.",
    type: "website",
  },
};

export default function AveragePriceCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader
        badge="필수 금융 계산기"
        title="주식 평단가 계산기"
        description="기존 주식을 보유한 상태에서 추가 매수를 할 때 평균 매입 단가(평단가)가 어떻게 변하는지 계산할 수 있습니다. 추가 매수 전 예상 평단을 확인하면 보다 신중하게 매매 전략을 세우는 데 도움이 됩니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <AveragePriceCalculator />

        <SectionCard>
          <Article title="주식 물타기와 평단가 계산의 중요성">
            <p>
              물타기란 보유 중인 주식의 가격이 하락했을 때 추가 매수를 통해 평균 매입 단가를 낮추는 방법입니다.
              평단가가 낮아지면 주가가 일정 수준만 반등해도 손익분기점에 도달할 가능성이 높아집니다.
            </p>
            <p>
              다만 물타기는 추가 자금이 들어가는 전략이기 때문에, 무조건 유리한 방식은 아닙니다.
              현재 보유 수량과 추가 매수 가격을 기준으로 새로운 평균 단가를 미리 계산해보고,
              손절 기준과 목표가를 함께 검토하는 것이 중요합니다.
            </p>
          </Article>

          <Article title="평단가 계산 방법은?">
            <p>평단가는 총 매수 금액을 총 보유 수량으로 나누어 계산합니다.</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                (기존 매수가 × 기존 수량) + (추가 매수가 × 추가 수량)
                <br />
                ─────────────────────────
                <br />
                (기존 수량 + 추가 수량)
              </p>
            </div>
            <p>
              여러 번 나누어 매수한 경우 단순 평균이 아니라 매수 금액 비중까지 반영해야 정확한 평균 단가를 구할 수 있습니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem
            question="물타기를 하면 평단가가 항상 낮아지나요?"
            answer="기존 매입가보다 낮은 가격에 추가 매수하면 일반적으로 평균 단가는 낮아집니다. 반대로 더 높은 가격에 추가 매수하면 평균 단가는 높아질 수 있습니다."
          />
          <FaqItem
            question="평단가 계산 결과에 수수료나 세금이 포함되나요?"
            answer="보통 평단가 계산기는 매수가와 수량 기준으로 평균 단가를 계산합니다. 실제 손익 계산에서는 수수료와 세금을 별도로 고려하는 것이 좋습니다."
          />
          <FaqItem
            question="평단가 계산이 왜 중요한가요?"
            answer="현재 손익 상태를 정확히 파악하고, 목표가나 손절가를 정할 때 기준이 되기 때문입니다. 분할 매수 전략을 사용할수록 평단가 확인이 중요합니다."
          />
        </FaqSection>

        <RelatedCalculators
          links={[
            {
              href: "/profit-calculator",
              title: "수익률 계산기",
              desc: "새로운 평단 기준으로 예상 수익률 확인",
            },
            {
              href: "/stop-loss-calculator",
              title: "손절가 계산기",
              desc: "리스크 관리를 위한 손절 기준 계산",
            },
          ]}
        />

        <Disclaimer />
      </div>
    </main>
  );
}