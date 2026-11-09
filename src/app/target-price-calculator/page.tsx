import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
import { buildMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import {
  PageHeader,
  SectionCard,
  Article,
  FaqSection,
  FaqItem,
  RelatedCalculators,
  Disclaimer,
} from "@/components/ui/Shared";

import InternalLinks from "@/components/seo/InternalLinks"
import GuideLinks from "@/components/seo/GuideLinks"
import { TARGET_BASIC } from "@/data/stockCalculatorExamples";

const TITLE = "주식 목표가 계산기";
const DESCRIPTION =
    "매수가와 목표 수익률(%)을 넣으면 목표 매도 가격과 주당 예상 수익을 계산합니다. 원화·달러 입력을 지원하며, 수수료·세금·환율은 반영하지 않은 가격 기준 결과입니다.";
const PATH = "/target-price-calculator";

export const metadata = buildMetadata({
  title: `${TITLE} | 목표 수익률로 매도 가격 계산`,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "주식 목표가 계산기",
    "목표가 계산",
    "매도 목표가",
    "주식 목표 수익률",
    "target price calculator",
  ],
});

const FAQ_ITEMS = [
  { question: "수수료와 세금이 반영된 목표가인가요?", answer: "아니요. 현재 계산값은 순수 가격 기준입니다. 실제 매도 시에는 수수료와 세금 등을 함께 고려해야 합니다." },
  { question: "현재가를 기준으로도 계산할 수 있나요?", answer: "네. 현재가를 기준값으로 넣으면 지금 가격에서 원하는 수익률 상승 시 도달하는 가격을 계산하는 용도로도 활용할 수 있습니다." },
  { question: "목표가만 정하면 충분한가요?", answer: "아닙니다. 목표가와 함께 손절가, 포지션 사이즈까지 정해야 전략이 더 완성도 있게 됩니다." },
];

const EX = TARGET_BASIC;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function TargetPriceCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path={PATH}
            faqs={FAQ_ITEMS}
        />
        <PageHeader
            badge="수익 실현 툴"
            title={TITLE}
            description="매수가와 목표 수익률을 기준으로 목표 매도 가격과 주당 예상 수익을 계산하는 도구입니다. 원하는 수익률에 맞는 가격을 미리 정해 두면 계획적인 매도 전략을 세울 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <TargetPriceCalculator />

          <SectionCard>
            <Article title="목표가 계산 방법">
              <p>
                목표가는 매수가에 목표 수익률만큼을 더한 가격입니다. 많은 투자자가 매수는 신중하게 하면서
                매도 기준은 막연하게 두는 경우가 많은데, 목표가를 미리 정해 두면 주가가 빠르게 움직여도
                계획적인 매매를 유지하는 데 도움이 됩니다.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  목표가 = 매수가 × (1 + 목표 수익률 ÷ 100)
                </p>
              </div>
              <p>
                예를 들어 {won(EX.inputs.buyPrice)}원에 매수했고 목표 수익률이 {EX.inputs.targetRate}%라면 목표가는
                <strong> {EX.expected["목표 가격"]}원</strong>이고, 주당 {EX.expected["주당 예상 수익"]}원의 수익이 기대됩니다.
                이 값은 수수료·세금을 반영하지 않은 가격 기준이므로, 실제 수익은 거래 비용만큼 줄어듭니다.
              </p>
            </Article>

            <Article title="실전 활용 팁">
              <p>
                목표가는 하나의 숫자로만 두기보다 구간으로 설정하는 것이 더 현실적일
                수 있습니다. 예를 들어 1차 익절, 2차 익절처럼 나눠서 관리하면 변동성이
                큰 장에서도 유연하게 대응할 수 있습니다.
              </p>
              <p>
                또한 목표가만 정하지 말고 손절가와 손익비도 함께 계산해야 전략이
                완성됩니다.
              </p>
            </Article>
          </SectionCard>

                <GuideLinks slugs={["stop-loss-ratio"]} />

          <FaqSection title="자주 묻는 질문 (FAQ)">
            {FAQ_ITEMS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </FaqSection>

          <RelatedCalculators
              links={[
                {
                  href: "/profit-calculator",
                  title: "주식 수익률 계산기",
                  desc: "현재가 기준 실제 수익률과 손익 확인",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "하락 시 손실 제한 가격 계산",
                },
                {
                  href: "/risk-reward-calculator",
                  title: "손익비 계산기",
                  desc: "리스크 대비 기대 수익 분석",
                },
              ]}
          />

          <Disclaimer />

          <InternalLinks currentPath={PATH} />
        </div>
      </main>
  );
}
