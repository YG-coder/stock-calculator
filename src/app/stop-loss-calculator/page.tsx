import { Metadata } from "next";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "주식 손절가 계산기 | 손절 라인 및 예상 손실 금액 자동 계산",
  description:
    "단타, 스윙 매매의 필수품인 주식 손절가 계산기입니다. 원하시는 손절 비율(%)을 입력하면 기계적으로 정확한 손절 가격과 총 손실 금액을 산출해 드립니다.",
  keywords: [
    "주식 손절가 계산기", "손절가 설정", "손절 기준", "stop loss calculator", "스탑로스", "주식 계산기"
  ],
  openGraph: {
    title: "주식 손절가 계산기 | 기계적 손절 라인 자동 계산",
    description: "감정에 휘둘린 매매는 이제 그만! 진입 전 미리 손절 라인과 허용 가능한 손실을 계산해보세요.",
    type: "website",
  },
};

export default function StopLossCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader 
        badge="주식 계산기" 
        title="주식 손절가 계산기" 
        description="매수가와 손절 비율을 입력하면 손절가, 주당 손실 금액, 총 손실 금액을 한 번에 계산할 수 있습니다. 손절 기준을 미리 정해두면 감정적인 대응을 줄이고, 예상 손실 범위를 통제하는 데 도움이 됩니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <StopLossCalculator />

        <SectionCard>
          <Article title="손절가 계산이 왜 중요한가?">
            <p>
              손절은 수익을 크게 내기 위한 기술이 아니라, <strong>먼저 계좌를 지키기 위한 기본 원칙</strong>입니다. 
              많은 초보 투자자들이 손절을 하지 못해 작은 손실을 큰 손실로 키우곤 합니다. 
              미리 손절가를 정해두면 감정이 개입될 여지를 원천적으로 차단할 수 있습니다.
            </p>
            <p>
              특히 장중 급락이 나오는 종목은 순식간에 대응이 늦어질 수 있습니다. 
              이럴 때 손절 라인을 사전에 계산해두고 HTS/MTS 등에 스탑로스 예약을 걸면 “어디서 정리할지”가 명확해집니다.
            </p>
          </Article>

          <Article title="손절가 계산 방법">
            <p>손절 매도 가격을 구하는 공식은 다음과 같습니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center my-6">
              <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                매수가 × (1 - 손절비율 / 100)
              </p>
            </div>
            <p>
              예를 들어 70,000원에 매수한 뒤 3% 손절 기준을 적용한다면,
              <code>70000 × (1 - 0.03) = 67,900원</code>이 손절 기준가가 됩니다. 
              보유 수량까지 입력하면 이 손절가에 도달 시 발생하는 <strong>총 원금 손실액</strong>을 미리 알 수 있어 리스크 체감이 훨씬 쉽습니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="손절가는 보통 몇 퍼센트로 잡아야 하나요?" answer="정답은 없습니다. 단타, 스윙 여부와 종목 변동성에 따라 달라집니다. 대체로 단타는 -2~3%, 스윙은 차트의 지지선이나 -5~7% 사이를 기준으로 잡는 편입니다. 중요한 건 정한 기준을 일반적으로 지키는 것입니다." />
          <FaqItem question="물타기 전에 손절가부터 계산해야 하나요?" answer="그렇습니다. 물타기는 평균 단가를 낮추지만 리스크 자본금을 두 배 이상으로 늘립니다. 먼저 물타기 한 가격 기준으로 새로운 손절 기준과 허용 총 손실 범위를 가급적 확인한 후 추가 매수를 결정해야 안전하게 변동성에 대비할 수 있습니다." />
          <FaqItem question="스탑로스(자동감시주문) 기능과 연계하려면요?" answer="본 계산기에서 나온 '손절가'를 기억해 두거나 메모한 뒤, 자신이 사용하는 증권사 앱(MTS/HTS)의 주식 자동감시주문 메뉴에 들어가 손실제한 가격을 해당 계산 결과값으로 기입해 두시면 자동화된 손절매가 구현됩니다." />
        </FaqSection>

        <RelatedCalculators links={[
          { href: "/break-even-calculator", title: "본전 회복 계산기", desc: "손절을 미뤘을 때 맞이할 높은 회복 필요 수익률 확인" },
          { href: "/average-price-calculator", title: "물타기 계산기", desc: "추가 매수를 고려할 때 평단가 계산하기" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}