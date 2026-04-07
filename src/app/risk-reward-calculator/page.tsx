import { Metadata } from "next";
import RiskRewardCalculator from "@/components/calculator/RiskRewardCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "손익비 계산기 | Risk-Reward Ratio 자동 계산",
  description:
    "손익비(Risk:Reward Ratio)와 트레이딩 필요 승률을 계산하세요. 장기적인 계좌 우상향을 위해 진입 전 가급적 확인해야 하는 필수 지표입니다.",
  keywords: [
    "손익비 계산기", "Risk Reward", "손익비율", "기대수익률", "투자 손절비", "트레이딩 도구"
  ],
  openGraph: {
    title: "손익비 계산기 | 투자 기대수익 및 필요 승률 확인",
    description: "한 번의 매매에서 잃을 금액과 얻을 금액의 비율을 시뮬레이션하고 장기 생존 가능한 투자 비율을 만드세요.",
    type: "website",
  },
};

export default function RiskRewardCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader 
        badge="트레이딩 핵심 툴" 
        title="주식 손익비 계산기" 
        description="전문 트레이더들이 감으로 진입하지 않는 이유는 단 하나, '손익비'를 계산하기 때문입니다. 진입 가격과 목표가, 손절가를 입력해 해당 셋업의 위험 대비 보상 비율(RR Ratio)과 장기 생존을 위한 필요 승률을 즉시 확인하세요." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <RiskRewardCalculator />

        <SectionCard>
          <Article title="손익비(Risk-Reward)란 무엇인가요?">
            <p>
              <strong>손익비(RR Ratio)</strong>는 한 번의 매매에서 '감수해야 할 손실 자금(Risk)' 대비 '얻을 수 있는 목표 수익(Reward)'의 비율을 뜻합니다. 
              일반적으로 손익비가 1:2라고 하면, 1만 원의 손실을 감수하고 2만 원의 수익을 노리는 매매 셋업을 의미합니다.
            </p>
            <p>
              승률이 90%에 달하는 트레이더라도 손익비가 1:0.1 이라면, 아홉 번을 이기고도 단 한 번의 패배로 번 돈을 모두 잃게 됩니다. 반대로 <strong>손익비가 1:3 셋업만 골라서 매매한다면, 승률이 단 30%만 나와도 계좌는 장기적으로 유리한 구조를 만들 수</strong>합니다.
            </p>
          </Article>

          <Article title="필요 승률 공식과 활용법">
            <p>특정 손익비를 가진 매매에서 원금(본전)을 유지하기 위해 최소한으로 요구되는 승률 공식은 다음과 같습니다:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
              <p className="font-mono text-lg sm:text-xl text-slate-800 font-bold tracking-tight">
                1 ÷ (1 + 손익비) × 100
              </p>
            </div>
            <p>
              예를 들어 손절을 3%로 잡고 익절을 9%로 잡았다면 손익비는 1:3입니다. 
              <code>1 / (1 + 3) * 100 = 25%</code>
              즉, 이 매매를 계속해서 반복했을 때 10번 중 3번만 성공(승률 25% 초과)해도 수익이 누적되기 시작합니다. 진입 전에 계산기를 두드려보고 <strong>최소 1:2 이상의 손익비가 나오지 않는 자리는 매매를 포기하는 것</strong>이 롱런의 비결입니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="손익비가 '1:1.5 이하'가 나오면 진입하면 안 되나요?" answer="전략에 따라 다르지만, 일반적으로 데이트레이딩 이상의 스윙 매매에서는 최소 1:2 비율이 안 나오는 자리는 무리한 리스크를 지고 있다고 봅니다." />
          <FaqItem question="승률과 손익비 중 어느 것이 더 중요한가요?" answer="둘 다 중요하지만, 현실적으로 초보자가 70~80% 이상의 높은 타점 승률을 매번 유지하는 것은 불가능에 가깝습니다. 따라서 낮은 승률(40% 대)을 가지고서도 계좌를 불려갈 수 있도록 '높은 손익비'의 자리를 찾는 것이 통계적으로 훨씬 안전합니다." />
          <FaqItem question="손익비 관리를 위해 어떤 기능과 연계하면 될까요?" answer="손익비를 제대로 구현하려면 계산된 손절 라인에 가급적 자동 매도가 나가야만 합니다. 이 사이트의 '포지션 사이즈 계산기'를 함께 사용하여 비중 조절까지 완벽하게 컨트롤해 보세요." />
        </FaqSection>

        <RelatedCalculators links={[
          { href: "/position-size-calculator", title: "포지션 사이즈 계산기", desc: "시드 대비 안전한 매수 수량 및 비중 산출" },
          { href: "/stop-loss-calculator", title: "손절가 계산기", desc: "감정을 배제한 기계적 손절 라인 구하기" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}
