import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
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
  title: "주식 평단가 계산기",
  description:
      "주식 매수 후 물타기를 할 때 평균 매입 단가(평단가)가 어떻게 변하는지 쉽게 계산해보세요. 추가 매수 가격과 수량만 입력하면 평균 단가를 즉시 확인할 수 있습니다.",
  path: "/average-price-calculator",
  keywords: [
    "주식 평단가 계산기",
    "물타기 계산기",
    "주식 평균단가",
    "stock average price calculator",
    "추가매수 평단",
  ],
});

export default function AveragePriceCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="필수 투자 계산기"
            title="주식 평단가 계산기"
            description="추가 매수 후 평균 매입 단가가 어떻게 바뀌는지 계산할 수 있는 주식 평단가 계산기입니다. 물타기 이후 새로운 평단가를 빠르게 확인할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <AveragePriceCalculator />

          <SectionCard>
            <Article title="주식 평단가 계산기란?">
              <p>
                <strong>주식 평단가 계산기</strong>는 여러 가격대에서 나누어 매수한
                주식의 평균 매입 단가를 계산하는 도구입니다. 투자자는 보통 한 번에
                모든 물량을 매수하지 않고, 가격이 하락할 때 추가 매수하거나 분할
                매수를 진행하는 경우가 많습니다.
              </p>
              <p>
                이때 최종적으로 내가 얼마에 사들인 것으로 봐야 하는지 정확히 알아야
                이후 수익률, 손절가, 목표가 계산이 가능합니다. 평단가를 제대로 알지
                못하면 수익인지 손실인지 판단이 흐려질 수 있습니다.
              </p>
            </Article>

            <Article title="평단가 계산 공식">
              <p>평균 매입 단가는 아래 방식으로 계산합니다.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center my-6">
                <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                  총 매수 금액 ÷ 총 보유 수량
                </p>
              </div>
              <p>
                예를 들어 10주를 10,000원에 사고, 추가로 10주를 8,000원에 샀다면
                총 매수 금액은 180,000원이고 총 수량은 20주이므로 평균 단가는
                9,000원이 됩니다.
              </p>
            </Article>

            <Article title="평단가 계산이 중요한 이유">
              <p>
                평단가는 단순 참고 숫자가 아니라, 현재 수익률을 계산하는 기준점입니다.
                추가 매수 후 평단가가 내려가면 같은 현재가에서도 손익 구조가 크게
                달라질 수 있습니다.
              </p>
              <p>
                다만 물타기는 평단가를 낮출 수 있지만 동시에 투자 금액을 더 투입하는
                전략이므로 종목의 펀더멘털이나 리스크를 충분히 고려한 뒤 결정하는 것이
                좋습니다.
              </p>
            </Article>
          </SectionCard>

          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="물타기 후 수익률은 어떻게 확인하나요?"
                answer="먼저 이 계산기로 새 평단가를 구한 뒤, 수익률 계산기에서 해당 평단가를 매수가로 입력하면 됩니다."
            />
            <FaqItem
                question="평단가가 낮아지면 무조건 좋은 건가요?"
                answer="아닙니다. 평단가가 낮아져도 추가 자금이 투입된 것이므로 종목 리스크가 커질 수 있습니다. 단순히 평균가만 보고 판단하면 안 됩니다."
            />
            <FaqItem
                question="수수료는 포함되나요?"
                answer="기본 계산은 매수 단가와 수량 기준입니다. 실제 평단가는 거래 수수료까지 포함하면 약간 달라질 수 있습니다."
            />
          </FaqSection>

          <RelatedCalculators
              links={[
                {
                  href: "/profit-calculator",
                  title: "주식 수익률 계산기",
                  desc: "현재가 기준 실제 수익률 확인",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한 가격 계산",
                },
                {
                  href: "/break-even-calculator",
                  title: "본전 회복 계산기",
                  desc: "손실 후 회복에 필요한 상승률 계산",
                },
              ]}
          />

          <Disclaimer />

          {/* 🔥 SEO 강화 블록 */}
          <SeoContent
              title="평단가 계산기"
              description="주식 평단가 계산기는 여러 번 나누어 매수한 경우 평균 매입 단가를 계산하는 도구입니다."
              formula="총 매수금액 / 총 수량"
          />

          {/* 🔥 내부 링크 */}
          <InternalLinks />
        </div>
      </main>
  );
}