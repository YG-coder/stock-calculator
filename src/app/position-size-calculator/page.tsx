import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
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

export const metadata = buildMetadata({
  title: "포지션 사이즈 계산기",
  description:
      "총 투자금, 허용 손실률, 진입가와 손절가를 기준으로 적절한 매수 수량과 투자 금액을 계산하는 포지션 사이즈 계산기입니다.",
  path: "/position-size-calculator",
  keywords: [
    "포지션 사이즈 계산기",
    "매수 수량 계산",
    "자금 관리",
    "리스크 관리",
    "position size calculator",
  ],
});

export default function PositionSizeCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <PageHeader
            badge="자금 관리"
            title="포지션 사이즈 계산기"
            description="포지션 사이즈 계산기는 총 투자금과 허용 손실률, 진입가와 손절가를 기준으로 적절한 매수 수량과 투자 금액을 계산하는 도구입니다. 허용 가능한 손실 범위 안에서 자금 관리를 체계적으로 할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <PositionSizeCalculator />

          <SectionCard>
            <Article title="포지션 사이즈 계산기란?">
              <p>
                <strong>포지션 사이즈 계산기</strong>는 한 번의 거래에서 계좌 전체를
                과도하게 위험에 노출시키지 않도록 적절한 매수 수량을 계산하는 도구입니다.
                많은 투자자가 진입 가격은 신중하게 보지만, 실제로 몇 주를 살지는 감으로
                정하는 경우가 많습니다.
              </p>
              <p>
                하지만 매수 수량은 투자 성과에 큰 영향을 미칩니다. 포지션이 너무 크면
                작은 손실에도 계좌가 크게 흔들리고, 너무 작으면 전략이 잘 맞아도 수익
                효율이 떨어질 수 있습니다.
              </p>
            </Article>

            <Article title="포지션 사이즈 계산의 핵심">
              <p>일반적으로 아래 개념으로 계산합니다.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                  허용 손실 금액 = 총 투자금 × 허용 손실률
                  <br />
                  매수 수량 = 허용 손실 금액 ÷ (진입가 - 손절가)
                </p>
              </div>
              <p>
                즉, 한 번의 거래에서 내가 최대 얼마까지 잃을 수 있는지를 먼저 정하고,
                그 손실 범위 안에 맞는 수량을 계산하는 방식입니다.
              </p>
            </Article>

            <Article title="왜 중요한가?">
              <p>
                투자에서 살아남기 위해서는 한 번의 실수로 계좌가 크게 손상되지 않도록
                해야 합니다. 포지션 사이즈 관리는 진입 타이밍보다 덜 화려해 보여도
                장기적으로는 더 중요한 요소가 될 수 있습니다.
              </p>
              <p>
                특히 단타, 스윙, 추세 추종 매매에서는 손절가와 함께 포지션 사이즈를
                미리 계산하는 습관이 필요합니다.
              </p>
            </Article>
          </SectionCard>

          <FaqSection title="자주 묻는 질문 (FAQ)">
            <FaqItem
                question="포지션은 작을수록 좋은가요?"
                answer="무조건 작은 것이 좋은 것은 아닙니다. 중요한 것은 계좌 대비 감당 가능한 손실 범위 안에서 일관된 비중을 유지하는 것입니다."
            />
            <FaqItem
                question="손절가가 없으면 계산이 어렵나요?"
                answer="네. 포지션 사이즈는 진입가와 손절가 차이를 기준으로 계산하므로 손절 기준이 있어야 정확한 계산이 가능합니다."
            />
            <FaqItem
                question="초보 투자자도 꼭 써야 하나요?"
                answer="그렇습니다. 오히려 초보 투자자일수록 감정적인 비중 조절을 막기 위해 포지션 사이즈 계산 습관이 중요합니다."
            />
          </FaqSection>

          <RelatedCalculators
              links={[
                {
                  href: "/risk-reward-calculator",
                  title: "손익비 계산기",
                  desc: "리스크 대비 기대 수익 분석",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한 기준 가격 계산",
                },
                {
                  href: "/target-price-calculator",
                  title: "주식 목표가 계산기",
                  desc: "목표 수익률 기준 매도 가격 계산",
                },
              ]}
          />

          <Disclaimer />
        </div>
      </main>
  );
}