import { Metadata } from "next";
import TargetPriceCalculator from "@/components/calculator/TargetPriceCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

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
        description="주식 투자에서 매수보다 어려운 것이 바로 '매도'입니다. 본인이 목표로 하는 정확히 정량화된 목표 수익률에 맞춰 정확한 매도 가격을 산출하고 기계적으로 수익을 실현하세요." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <TargetPriceCalculator />

        <SectionCard>
          <Article title="주식 목표가 계산기란? (설명)">
            <p>
              <strong>주식 목표가 계산기</strong>는 투자자가 원하는 특정 <strong>목표 수익률(%)</strong>을 달성하기 위해 
              자산을 '얼마에 팔아야 하는지' 그 정확한 가격 지점을 계산해 주는 도구입니다.
            </p>
            <p>
              종목을 매수하기 전부터 <strong>1차 목표가(+10%), 2차 목표가(+20%)</strong>를 미리 설정해두면 
              시장 가격 변동에 감정적으로 흔들리지 않고 원칙적인 투자를 이어갈 수 있습니다. 
              이 도구는 수익을 극대화하면서도 익절 타이밍을 구체화하는 데에 필수적입니다.
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

        <RelatedCalculators links={[
          { href: "/profit-calculator", title: "수익률 계산기", desc: "현재가 기준 디테일한 예상 수익률 계산" },
          { href: "/break-even-calculator", title: "본전 회복 계산기", desc: "손실 난 종목의 아찔한 원금 회복 구간 확인" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}
