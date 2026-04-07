import { Metadata } from "next";
import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "주식 평단가 계산기 | 물타기 후 평균단가 자동 계산",
  description:
    "주식 매수 후 물타기를 할 때 평균 매입 단가(평단가)가 어떻게 변하는지 쉽게 계산해보세요. 추가 매수 가격과 수량만 입력하면 평균 단가를 즉시 확인할 수 있습니다.",
  keywords: [
    "주식 평단가 계산기", "물타기 계산기", "주식 평균단가", "stock average price calculator", "추가매수 평단",
  ],
  openGraph: {
    title: "주식 평단가 계산기 | 물타기 후 평균단가 자동 계산",
    description: "물타기 전후의 평단가와 투자금을 정확히 계산해보세요. 주식 초보자도 쉽게 사용할 수 있는 필수 금융 계산기입니다.",
    type: "website",
  },
};

export default function AveragePriceCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader 
        badge="필수 금융 계산기" 
        title="주식 평단가 계산기" 
        description="기존 주식을 매수한 상태에서 추가로 주식을 매수(물타기)할 때의 정확한 평균 단가(평단가)를 계산합니다. 감정적인 추가 매수보다는, 본 평단가 계산기를 통해 자신의 예측 단가를 꼼꼼히 확인하고 전략적인 투자를 진행하세요." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <AveragePriceCalculator />

        <SectionCard>
          <Article title="주식 물타기와 평단가 계산의 중요성">
            <p>
              <strong>물타기</strong>란 자신이 매수한 주식의 가격이 하락했을 때 추가로 같은 주식을 매수하여 
              1주당 평균 매입 가격(평단가)을 낮추는 매매 기법을 말합니다. 많은 개인 투자자들이 손실을 회복하기 위해 감정적인 물타기를 감행하곤 합니다.
            </p>
            <p>
              물타기를 하면 평균 단가가 낮아지므로 가격이 조금만 반등해도 본전에 도달할 가능성이 생기는 것은 맞습니다. 
              하지만 그 이면에는 <strong>"투입 자금액의 극대화"</strong>라는 강력한 리스크가 존재합니다. 
              가급적 추가 매수 전에 '평단가 계산기'를 두들겨보고 현실적인 출구 전략을 수립해야 합니다.
            </p>
          </Article>

          <Article title="평단가 계산 방법은?">
            <p>이 계산기는 간단하면서도 수학적으로 오차 없는 공식을 활용합니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                (기존 매수가 × 기존 수량) + (추가 매수가 × 추가 수량)<br/> 
                ─────────────────────────<br/>
                (기존 수량 + 추가 수량)
              </p>
            </div>
            <p>
              즉, 본인이 투자한 <strong>'총 매수 금액'</strong>을 <strong>'총 보유 수량'</strong>으로 똑같이 나누어 1주당 매입가격을 산출합니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="물타기를 하면 평단가가 일반적으로 떨어지나요?" answer="기존 매수가보다 더 낮은 가격(추가 매수가)으로 주식을 추가 수량만큼 매입한다면 평균적인 단가는 수식에 의해 일반적으로 낮아집니다. 그러나 하락 추세가 이어지는 차트라면 단순 평단 낮추기는 오히려 총 손실 금액 증가의 스노우볼이 될 수 있음을 유의해야 합니다." />
          <FaqItem question="평단가 계산 결과에 세금이 포함되나요?" answer="이 계산기는 순수한 '매수 가격'과 '수량'만을 대조하여 가격을 보여줍니다. 증권거래세 등 부가적 세금은 제외된 기초 매매가치이므로, 투자 시에는 보수적으로 현재가나 목표가보다 조금 더 높게 매도를 설정하시는 것이 좋습니다." />
          <FaqItem question="불타기(상승 시 추가매수)도 계산 되나요?" answer="네, 기존 보유 가격보다 추가 매수 가격이 더 높은 경우에도 동일한 수식이 적용되며, 이렇게 될 경우 최종 평균 단가는 이전보다 높아지게 됩니다. 돌파 매매나 추세 추종 투자자들이 평단을 점검할 때 자주 사용합니다." />
        </FaqSection>

        <RelatedCalculators links={[
          { href: "/profit-calculator", title: "수익률 계산기", desc: "신규 평단에 맞춘 예상 목표 수익률 산출" },
          { href: "/stop-loss-calculator", title: "손절가 계산기", desc: "리스크 관리를 위한 기계적 손절 라인 확인" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}