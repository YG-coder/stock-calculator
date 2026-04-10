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
        description="주식 평단가 계산기는 추가 매수(물타기) 후 평균 매입 단가가 어떻게 달라지는지 계산하는 도구입니다. 예상 평단가를 미리 확인하면 손익분기점과 매매 전략을 더 정확하게 판단할 수 있습니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <AveragePriceCalculator />

        <SectionCard>
          <Article title="주식 물타기와 평단가 계산의 중요성">
            <p>
              <strong>주식 평단가 계산기</strong>는 여러 번 나눠 매수한 주식의 평균 매입 단가를 계산하는 도구입니다.
              물타기 전략을 사용할 때 추가 매수 후 예상 평단가를 미리 확인하면, 손익분기점까지 필요한 반등 폭과 이후 매매 전략을 더 현실적으로 판단할 수 있습니다.
            </p>
            <p>
              다만 물타기는 추가 자금이 들어가는 전략이기 때문에, 무조건 유리한 방식은 아닙니다.
              현재 보유 수량과 추가 매수 가격을 기준으로 새로운 평균 단가를 미리 계산해보고,
              손절 기준과 목표가를 함께 검토하는 것이 중요합니다.
            </p>
          </Article>

          <Article title="평단가 계산 방법은?">
            <p>평단가는 총 매수 금액을 총 보유 수량으로 나누어 계산합니다.</p>
            <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="mx-auto max-w-md text-center font-mono font-bold text-slate-800">
                <div className="break-keep text-base leading-relaxed sm:text-lg">
                  (기존 매수가 × 기존 수량) + (추가 매수가 × 추가 수량)
                </div>
                <div className="my-3 border-t-2 border-slate-700" />
                <div className="break-keep text-base leading-relaxed sm:text-lg">
                  (기존 수량 + 추가 수량)
                </div>
              </div>
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
              title: "주식 수익률 계산기",
              desc: "새로운 평단가 기준으로 예상 수익률과 손익 확인",
            },
            {
              href: "/stop-loss-calculator",
              title: "주식 손절가 계산기",
              desc: "리스크 관리를 위한 손절 기준 가격 계산",
            },
          ]}
        />

        <Disclaimer />
      </div>
    </main>
  );
}