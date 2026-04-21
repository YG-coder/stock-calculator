/**
 * src/app/profit-calculator/page.tsx
 * 역할: 주식 수익률 계산기 페이지 (SEO + 애드센스 최적화 완료)
 */

import ProfitCalculator from "@/components/calculator/ProfitCalculator";
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

import SeoContent from "@/components/seo/SeoContent";
import InternalLinks from "@/components/seo/InternalLinks";

export const metadata = buildMetadata({
  title: "주식 수익률 계산기",
  description:
      "내가 매수한 주식의 현재가 또는 목표가를 입력하면 예상되는 수익률과 1주당 손익을 즉시 계산해주는 주식 수익률 계산기입니다.",
  path: "/profit-calculator",
  keywords: [
    "주식 수익률 계산기",
    "수익률 계산",
    "주식 수익률",
    "profit calculator",
    "예상 수익금",
    "손익 계산기",
  ],
});

export default function ProfitCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="필수 금융 계산기"
            title="주식 수익률 계산기"
            description="주식 수익률 계산기는 매수가와 현재가 또는 목표가를 기준으로 예상 수익률과 손익을 자동 계산하는 도구입니다. 투자 결과를 퍼센트로 빠르게 확인하고 매매 전략을 점검할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          {/* 계산기 */}
          <ProfitCalculator />

          {/* 설명 */}
          <SectionCard>
            <Article title="수익률 계산기 설명">
              <p>
                <strong>주식 수익률 계산기</strong>는 매수가와 현재가 또는 목표가를 기준으로 실제 수익률과 손익을 계산하는 도구입니다.
                주식, ETF, 코인 등 다양한 자산의 투자 성과를 퍼센트와 금액으로 확인할 수 있어 현재 수익 상태를 점검하는 데 도움이 됩니다.
              </p>
              <p>
                수익률 계산은 단순히 현재 수익 상태를 확인하는 데서 끝나지 않습니다.
                목표 수익률에 도달했는지 점검하거나, 손실 구간에서 대응 전략을 세우는 기준으로도 활용할 수 있어
                매수 이후의 의사결정을 더 객관적으로 만드는 데 도움이 됩니다.
              </p>
            </Article>

            <Article title="수익률 계산 방법 (공식)">
              <p>수익률을 구하는 수학적 계산 공식은 다음과 같습니다:</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center my-6">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  ((현재가 - 매수가) ÷ 매수가) × 100
                </p>
              </div>
              <p>
                예를 들어 삼성전자를 <strong>70,000원</strong>에 매수했고 현재가가 <strong>80,000원</strong>이 되었다면,
                <code>(80,000 - 70,000) / 70,000 = 0.1428</code>이 되며 100을 곱하여 <strong>약 +14.28%</strong>의 수익률을 계산해 낼 수 있습니다.
              </p>
            </Article>
          </SectionCard>

          {/* FAQ */}
          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="계산 결과는 세금이 포함된 수치인가요?"
                answer="아니요, 현재 제공되는 수익률 계산 수식은 순수 가격 변동률만을 나타냅니다. 증권사 거래 수수료 및 제세공과금은 거래소마다 다르기 때문에 실제 수익과 차이가 발생할 수 있습니다."
            />
            <FaqItem
                question="마이너스(-) 수익률의 의미가 무엇인가요?"
                answer="현재가가 매수가보다 낮아 손실 상태임을 의미합니다."
            />
            <FaqItem
                question="물타기 후 수익률은 어떻게 계산하나요?"
                answer="먼저 평단가 계산기를 이용해 평균 매입 단가를 구한 후 해당 값을 입력하세요."
            />
          </FaqSection>

          {/* 관련 계산기 */}
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
                  desc: "손실 제한을 위한 손절 기준 가격 계산",
                },
                {
                  href: "/dividend-calculator",
                  title: "배당 수익 계산기",
                  desc: "배당금 기준 실제 수익률 확인",
                },
              ]}
          />

          <Disclaimer />

          {/* 🔥 SEO 강화 블록 */}
          <SeoContent
              title="주식 수익률 계산기"
              description="주식 수익률 계산기는 매수가와 현재가를 기준으로 투자 수익 또는 손실을 계산하는 도구입니다. 투자 성과를 빠르게 확인할 수 있으며, 목표 수익률 설정에도 활용됩니다."
              formula="(현재가 - 매수가) / 매수가 × 100"
          />

          {/* 🔥 내부 링크 */}
          <InternalLinks />
        </div>
      </main>
  );
}