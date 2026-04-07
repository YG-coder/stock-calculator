import { Metadata } from "next";
import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
import { PageHeader, SectionCard, Article, FaqSection, FaqItem, RelatedCalculators , Disclaimer } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "포지션 사이즈 계산기 | 계좌 손실 1% 제한 안전 비중 산출",
  description:
    "총 자본금과 허용 리스크(%)를 기반으로 이번 매매에서 정확히 몇 주를 사야 손실을 극적으로 통제할 수 있는지 권장 매수 수량을 계산합니다.",
  keywords: [
    "포지션 사이즈 계산기", "비중 조절", "주식 매수 수량", "리스크 관리", "켈리 공식", "켈리 기준", "계좌 관리"
  ],
  openGraph: {
    title: "포지션 사이즈 계산기 | 리스크 관리를 위한 최적 비중 조절 툴",
    description: "진입가와 손절가를 설정하고 본인의 원금 대비 허용 손실 룰에 맞춘 안전한 주식 매수 수량을 즉시 확인하세요.",
    type: "website",
  },
};

export default function PositionSizeCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <PageHeader 
        badge="자금 관리 툴" 
        title="포지션 사이즈 계산기" 
        description="시장 예측은 틀릴 수 있지만, 내가 잃을 금액은 정확히 통제할 수 있습니다. 한 번의 매매에서 계좌 원금의 1~2%만 잃도록 손절 기준을 잡았을 때, 정확히 몇 주를 매수(Position Size)해야 하는지 철저히 수학적으로 계산해 드립니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <PositionSizeCalculator />

        <SectionCard>
          <Article title="포지션 사이즈 조절(Position Sizing)이란?">
            <p>
              전문 트레이더들이 시장에서 수 년간 살아남는 비밀은 '종목'이 아니라 <strong>'철저한 비중 조절(자금 관리)'</strong>에 있습니다. 
              포지션 사이징이란 매수할 종목의 차트를 보고 손절액의 폭을 정한 뒤 그 폭이 내 총 자본의 1~2% 위험도에만 할당되도록 실제 매수할 주식 수를 역산하는 과정입니다.
            </p>
            <p>
              예를 들어 자본금이 1억 원이고, 한 번의 매매당 2% 리스크(200만 원)만 허용하기로 룰을 세울 수 있습니다.
              이 상태에서 50,000원짜리 주식을 45,000원에 손절할 거라면, 주당 5,000원의 손실이 발생합니다. 
              최대 200만 원까지만 잃기 위해 <code>200만 원 / 5,000원 = 400주</code>를 매입하는 것이 바로 포지션 사이즈 공식입니다.
            </p>
          </Article>

          <Article title="계좌가 녹는 이유: 허용 리스크 (1% 룰)">
            <p>
              현명한 세계적 투자자들은 <strong>되도록 1회 매매에서 시드 머니의 1~3% 이상을 리스크로 두지 않습니다.</strong>
            </p>
            <p>
              만약 전 자산을 한 종목에 집중 투자한 뒤 -10%에 손절했다면 계좌는 바로 10%의 손실을 입게 됩니다. 이러한 타격이 연속될 경우 자본은 점차 크게 감소합니다. 하지만 본 계산기를 통해 1회 매매의 허용 리스크를 '2%' 범위 내외로 제한하는 포지션 수량을 지킨다면, <strong>시장의 여러 불확실한 상황 속에서도 계좌 자본을 훨씬 안정적으로 보존</strong>할 수 있습니다.
            </p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          <FaqItem question="허용 리스크(%)는 어느 정도가 적당한가요?" answer="일반적으로 데이트레이더나 전업 투자자는 1%~2%를 사용합니다. 초보자라면 자금 보호를 위해 1%를 추천드리며, 확신이 높은 좋은 자리라고 하더라도 가급적 5%를 넘기지 않는 것을 권장합니다." />
          <FaqItem question="소액 투자자(예: 100만 원)도 비중 조절을 해야 하나요?" answer="네, 소액일수록 올바른 위험 관리 습관이 중요합니다. 100만 원의 2%면 2만 원입니다. 한 종목당 손실 허용액을 미리 제한하는 방식으로 매매하면서 실력을 먼저 키우는 훈련이 가급적 기반이 되어야 금액이 커져도 흔들리지 않습니다." />
          <FaqItem question="추가 매수(물타기)할 때는 룰이 달라지나요?" answer="물타기를 이미 염두에 두었다면 총 목표 포지션 사이즈 안에서 비중을 1차와 2차로 쪼개야 합니다. 관련해서는 이 웹사이트의 '평단가 계산기'를 함께 활용하여 전략적으로 시나리오를 짜보세요." />
        </FaqSection>

        <RelatedCalculators links={[
          { href: "/risk-reward-calculator", title: "손익비 계산기", desc: "이 셋업이 진입할 만한 승률이 되는지 검증" },
          { href: "/break-even-calculator", title: "본전 회복 계산기", desc: "집중 투자 실패 시 요구되는 현실적인 복구 수치 확인" }
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}
