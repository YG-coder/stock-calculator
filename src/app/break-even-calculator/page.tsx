import { Metadata } from "next";
import BreakEvenCalculator from "@/components/calculator/BreakEvenCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "본전 회복 계산기 | 주식 손실 후 물린 원금 회복률 자동 계산",
  description:
    "손실 중인 주식이 본전(원금)을 회복하려면 대체 몇 퍼센트(%)나 상승해야 할까요? 수학적인 하락-상승 비례의 한계점과 손실의 함정을 계산기로 직접 확인하세요.",
  keywords: [
    "본전 회복 계산기", "주식 손실 회복", "원금 회복 계산기", "마이너스 수익률", "주식 본전", "물린 주식 계산"
  ],
  openGraph: {
    title: "본전 회복 계산기 | 마이너스 계좌 필요 회복률 산출",
    description: "손실은 작게 나더라도 회복하려면 훨씬 높은 수익률이 필요합니다. 리스크 관리와 기계적 손절의 중요성을 숫자로 확인해보세요.",
    type: "website",
  },
};

export default function BreakEvenCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader 
        badge="리스크 관리 툴" 
        title="본전 회복 계산기" 
        description="막연한 반등의 기대감에 의존하기 전 가장 현실적인 기준을 제공하는 도구입니다. 현재 계좌의 마이너스 손실률을 입력하면, 남은 금액으로 본전(원금)에 도달하기 위해 앞으로 얼마나 높은 상승률이 필요한지 수학적으로 명확하게 계산해 드립니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <BreakEvenCalculator />

        <SectionCard>
          <Article title="수익의 비대칭성: 손실의 함정 (설명)">
            <p>
              주식 시장에는 매우 잔인하면서도 절대 변하지 않는 수학적 진리가 있습니다. 
              바로 <strong>'떨어진 만큼 오르면 본전이 되지 않는다'</strong>는 사실입니다. 
              초보 투자자들은 -50% 손실이 났을 때, +50%만 오르면 본전이 될 것이라 착각하지만 
              실제로는 원금이 반토막 났기 때문에 그 반토막 난 금액이 두 배(+100%)가 되어야만 겨우 본전이 됩니다.
            </p>
            <p>
              본전 회복 계산기는 이러한 <strong>수익의 비대칭성</strong>을 직관적으로 보여줍니다. 
              손실률이 커질수록 요구되는 회복 상승률은 급격히 증가합니다. -10% 손실은 +11.1%만 오르면 되지만, 
              -90% 손실의 경우 기존 잔고 대비 무려 +900% (10배)가 올라야만 겨우 원금을 회복할 수 있습니다.
            </p>
          </Article>

          <Article title="계산 방법 (수식)">
            <p>본전을 찾기 위해 필요한 상승률 공식은 다음과 같습니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-sm sm:text-xl text-slate-800 font-bold tracking-tight">
                (손실률) ÷ (100 - 손실률) × 100
              </p>
            </div>
            <p>
              만약 <strong>-30%</strong> 손실 상태라고 가정해 봅시다.
              <code>30 / (100 - 30) × 100 = 30 / 70 × 100 = 약 42.85%</code>
              즉, 현재 남은 잔고를 모두 투자하여 42.85%의 수익을 추가로 달성해야만 비로소 최초 원금에 도달하게 됩니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="왜 까진 퍼센트만큼 올라도 본전이 안 되나요?" answer="기준 금액이 달라지기 때문입니다. 1,000만 원에서 50%가 떨어지면 500만 원이 됩니다. 500만 원 입장에서 1,000만 원이 되려면 2배(100% 상승)가 되어야 합니다. 상승은 작아진 원본에서 시작하기 때문에 언제나 회복 상승률이 훨씬 더 가혹합니다." />
          <FaqItem question="손실이 -100%가 되면 어떻게 되나요?" answer="-100%는 자산이 완전히 0원이 된 상태(상장폐지 등)입니다. 어떤 비율을 곱해도 0은 0이므로, 이때는 몇 천 퍼센트의 상승률도 무의미하며 복구가 영구히 불가능한 상태를 뜻합니다." />
          <FaqItem question="회복률이 비현실적일 때는 어떻게 대응해야 하죠?" answer="계산 결과 요구 상승률이 100% 이상이라면 단기간에 보유 종목만으로 원금을 회복하기는 매우 어렵습니다. 이럴 때는 리스크 허용 한도를 점검하고 일부 손절하여 포지션을 가볍게 하거나, 기업 가치가 살아있다면 전략적인 분할 매수를 통과해 평균 단가를 낮추는 계획이 필요합니다." />
        </FaqSection>

        <RelatedCalculators links={[
          { href: "/stop-loss-calculator", title: "손절가 계산기", desc: "추가 손실을 제한하기 위한 생명줄 설정" },
          { href: "/average-price-calculator", title: "물타기 계산기", desc: "추가 매수 시뮬레이션으로 탈출 확률 올리기" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}
