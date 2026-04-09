import { Metadata } from "next";
import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators, Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "주식 목표가 계산기 | 목표 수익률 따른 매도 가격 산출",
  description:
    "주식을 얼마에 팔아야 원하는 수익을 얻을 수 있을까요? 매수가와 목표 수익률을 입력하면 정확한 매도 가격을 즉시 계산해 드립니다.",
  keywords: [
    "주식 목표가 계산기", "목표 매도가", "매도 가격 계산기", "목표 수익률", "수익 실현 계산"
  ],
  openGraph: {
    title: "주식 목표가 계산기 | 목표 수익률 매도 가격 산출",
    description: "감정에 휘둘리지 말고 기계적인 매도를 준비하세요. 목표가와 1주당 이익을 미리 계산해주는 필수 툴입니다.",
    type: "website",
  },
};

export default function TargetPriceCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader
        badge="수익 실현 툴"
        title="주식 목표가 계산기"
        description="주식 목표가 계산기는 매수가와 목표 수익률을 기준으로 목표 매도 가격을 계산하는 도구입니다. 원하는 수익률에 맞는 가격을 미리 설정하여 감정에 흔들리지 않는 매도 전략을 세울 수 있습니다."
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <TargetPriceCalculator />

        <SectionCard>
          <Article title="주식 목표가 계산기란? (설명)">
            <p>
              <strong>주식 목표가 계산기</strong>는 매수가와 목표 수익률을 기준으로 목표 매도 가격을 계산하는 도구입니다.
              목표 수익률에 도달하기 위한 가격을 미리 확인하면 계획적인 매도 전략을 세울 수 있습니다.
            </p>
            <p>
              종목을 매수하기 전부터 <strong>1차 목표가(+10%), 2차 목표가(+20%)</strong>를 미리 설정해두면
              시장 가격 변동에 감정적으로 흔들리지 않고 계획적인 매도 전략을 유지할 수 있습니다.
              목표가를 사전에 정해두는 습관은 수익 실현 기준을 명확하게 만드는 데 도움이 됩니다.
            </p>
          </Article>

          <Article title="계산 방법 (수식)">
            <p>목표가를 구하는 수식은 다음과 같습니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                매수가 × (1 + 목표수익률 / 100)
              </p>
            </div>
            <p>
              예를 들어 50,000원에 매수한 주식의 목표 수익률을 15%로 잡았다면
              <code>50000 × (1 + 0.15) = 57,500원</code>에 매도 주문을 걸어두시면 됩니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="수수료 및 제세공과금이 포함된 가격인가요?" answer="산출된 가격은 순수 자산 상승분만을 반영한 가격입니다. 한국장의 경우 매도 시 거래세 및 매매수수료(약 0.2~0.3%)가 부과되므로, 목표 가격보다 한두 호가 높게 매도해야 원하는 실수령액에 도달하게 됩니다." />
          <FaqItem question="현재가로는 목표가를 계산할 수 없나요?" answer="본인의 원래 매수 단가가 아니라 '현재가'를 매수 가격 란에 입력하시면, '지금 이 가격에서 10% 상승한다면 얼마일까?'와 같은 시뮬레이션 용도로 완벽하게 사용하실 수 있습니다." />
          <FaqItem question="반대로 하락할 때를 대비하려면요?" answer="목표 수익률은 목표가 계산기가 관리하지만, 반대로 가격이 떨어질 때 일정 손실에서 끊어내는 전략은 사이트 내 '손절가 계산기'를 함께 활용하여 가급적 양방향 대응을 해야 합니다." />
        </FaqSection>

        <RelatedCalculators
          links={[
            {
              href: "/profit-calculator",
              title: "주식 수익률 계산기",
              desc: "현재가 기준 실제 수익률과 손익 확인",
            },
            {
              href: "/break-even-calculator",
              title: "본전 회복 계산기",
              desc: "손실 구간에서 필요한 상승률 계산",
            },
          ]}
        />
        <Disclaimer />
      </div>
    </main>
  );
}
