import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
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
  title: "주식 목표가 계산기",
  description:
      "매수가와 목표 수익률을 기준으로 목표 매도 가격을 계산할 수 있는 주식 목표가 계산기입니다.",
  path: "/target-price-calculator",
  keywords: [
    "주식 목표가 계산기",
    "목표가 계산",
    "매도 목표가",
    "주식 목표 수익률",
    "target price calculator",
  ],
});

export default function TargetPriceCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="수익 실현 툴"
            title="주식 목표가 계산기"
            description="주식 목표가 계산기는 매수가와 목표 수익률을 기준으로 목표 매도 가격을 계산하는 도구입니다. 원하는 수익률에 맞는 가격을 미리 설정해 계획적인 매도 전략을 세울 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <TargetPriceCalculator />

          <SectionCard>
            <Article title="주식 목표가 계산기란?">
              <p>
                <strong>주식 목표가 계산기</strong>는 매수가와 목표 수익률을
                기준으로 어느 가격에서 매도해야 원하는 수익에 도달하는지 계산하는
                도구입니다. 많은 투자자가 매수는 신중하게 하면서 매도 기준은 막연하게
                두는 경우가 많습니다.
              </p>
              <p>
                목표가를 미리 정해 두면 주가가 빠르게 움직여도 감정적으로 흔들리지
                않고, 계획적인 매매를 유지하는 데 도움이 됩니다.
              </p>
            </Article>

            <Article title="목표가 계산 공식">
              <p>기본 공식은 아래와 같습니다.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                  매수가 × (1 + 목표수익률 ÷ 100)
                </p>
              </div>
              <p>
                예를 들어 50,000원에 매수했고 목표 수익률이 15%라면 목표가는
                <strong> 57,500원</strong>입니다.
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

          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="수수료와 세금이 반영된 목표가인가요?"
                answer="아니요. 현재 계산값은 순수 가격 기준입니다. 실제 매도 시에는 수수료와 세금 등을 함께 고려해야 합니다."
            />
            <FaqItem
                question="현재가를 기준으로도 계산할 수 있나요?"
                answer="네. 현재가를 기준값으로 넣으면 지금 가격에서 원하는 수익률 상승 시 도달하는 가격을 계산하는 용도로도 활용할 수 있습니다."
            />
            <FaqItem
                question="목표가만 정하면 충분한가요?"
                answer="아닙니다. 목표가와 함께 손절가, 포지션 사이즈까지 정해야 전략이 더 완성도 있게 됩니다."
            />
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

          <SeoContent
              title="주식 목표가 계산기"
              intro="주식 목표가 계산기는 매수가와 원하는 목표 수익률을 입력하면 해당 수익률을 달성하기 위한 목표 매도 가격을 자동으로 계산해주는 도구입니다. 수익 실현 기준을 미리 정해두면 감정적 판단을 줄일 수 있습니다."
              body="투자에서 '언제 팔 것인가'는 '언제 살 것인가'만큼 중요합니다. 목표가를 미리 설정해두면 주가가 오를 때 너무 일찍 팔거나 욕심 때문에 매도 타이밍을 놓치는 실수를 줄일 수 있습니다."
              formula="목표가 = 매수가 × (1 + 목표 수익률 ÷ 100)"
              formulaNote="수수료는 포함되지 않습니다. 수수료를 고려할 경우 목표 수익률을 약간 높게 설정하는 것이 좋습니다."
              whenToUse="신규 매수 직후 목표 수익률(예: +15%, +20%)을 정해두고 목표가를 미리 계산해둘 때 활용하세요. 또는 분할 매도 전략을 세울 때 각 구간의 목표가를 계산하는 데 사용합니다."
              example="예시: 삼성전자 70,000원에 매수, 목표 수익률 20% → 목표가 84,000원. 수수료 0.25% 고려 시 목표가 84,210원. 10주 보유 시 세전 수익금 약 142,000원."
              caution="목표가는 투자 전략의 기준점이지 주가 상승을 보장하지 않습니다. 목표가 도달 여부는 시장 상황에 따라 달라집니다."
              relatedLinks={[
                  { href: "/profit-calculator", label: "수익률 계산기" },
                  { href: "/stop-loss-calculator", label: "손절가 계산기" },
                  { href: "/risk-reward-calculator", label: "손익비 계산기" },
                  { href: "/average-price-calculator", label: "평단가 계산기" },
              ]}
          />

          <InternalLinks currentPath="/target-price-calculator" />
        </div>
      </main>
  );
}