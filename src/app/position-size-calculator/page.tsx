import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
import { buildMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import InternalLinks from "@/components/seo/InternalLinks";
import GuideLinks from "@/components/seo/GuideLinks";
import {
  PageHeader,
  SectionCard,
  Article,
  FaqSection,
  FaqItem,
  RelatedCalculators,
  Disclaimer,
} from "@/components/ui/Shared";
import { POSITION_BASIC, POSITION_FLOOR } from "@/data/stockCalculatorExamples";

const TITLE = "포지션 사이즈 계산기";
const DESCRIPTION =
    "총 투자 자본금, 1회 허용 리스크(%), 진입 가격, 손절 라인을 넣으면 허용 손실 금액에 맞는 권장 매수 수량(내림)과 매수 금액, 총 자본 대비 비중을 계산하고, 권장 금액이 자본금을 넘으면 경고합니다. 수수료·세금과 체결 가격 차이는 반영하지 않습니다.";
const PATH = "/position-size-calculator";

export const metadata = buildMetadata({
  title: `${TITLE} | 허용 손실로 매수 수량·금액 계산`,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "포지션 사이즈 계산기",
    "매수 수량 계산",
    "자금 관리",
    "리스크 관리",
    "position size calculator",
  ],
});

const FAQ_ITEMS = [
  { question: "포지션은 작을수록 좋은가요?", answer: "무조건 작은 것이 좋은 것은 아닙니다. 중요한 것은 계좌 대비 감당 가능한 손실 범위 안에서 일관된 비중을 유지하는 것입니다." },
  { question: "손절가가 없으면 계산이 어렵나요?", answer: "네. 포지션 사이즈는 진입가와 손절가 차이를 기준으로 계산하므로 손절 기준이 있어야 정확한 계산이 가능합니다." },
  { question: "초보 투자자도 꼭 써야 하나요?", answer: "그렇습니다. 오히려 초보 투자자일수록 감정적인 비중 조절을 막기 위해 포지션 사이즈 계산 습관이 중요합니다." },
];

const A = POSITION_BASIC;
const B = POSITION_FLOOR;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function PositionSizeCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path={PATH}
            faqs={FAQ_ITEMS}
        />
        <PageHeader
            badge="자금 관리"
            title={TITLE}
            description="총 투자 자본금과 1회 허용 리스크, 진입 가격과 손절 라인을 기준으로 허용 손실 범위에 맞는 매수 수량과 매수 금액을 계산하는 도구입니다. 한 번의 거래가 계좌 전체에 미치는 영향을 미리 정해 둘 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <PositionSizeCalculator />

          <SectionCard>
            <Article title="포지션 사이즈 계산 방법">
              <p>
                많은 투자자가 진입 가격은 신중하게 보지만 실제로 몇 주를 살지는 감으로 정합니다. 포지션이 너무 크면
                작은 손실에도 계좌가 크게 흔들리고, 너무 작으면 전략이 맞아도 수익 효율이 떨어집니다. 이 계산기는
                한 번의 거래에서 최대 얼마까지 잃을지를 먼저 정하고, 그 범위에 맞는 수량을 계산합니다.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                  허용 손실 금액 = 총 투자 자본금 × 1회 허용 리스크 ÷ 100
                  <br />
                  권장 매수 수량 = 허용 손실 금액 ÷ (진입 가격 − 손절 라인), 1주 미만은 버림
                  <br />
                  권장 매수 금액 = 권장 매수 수량 × 진입 가격
                </p>
              </div>
              <p>
                예를 들어 총 투자 자본금 {won(A.inputs.totalCapital)}원, 1회 허용 리스크 {A.inputs.riskPercent}%(허용 손실 100,000원),
                진입 가격 {won(A.inputs.entryPrice)}원, 손절 라인 {won(A.inputs.stopLossPrice)}원(1주당 손실 500원)이면
                권장 매수 수량은 <strong>{A.expected["권장 매수 수량"]}주</strong>, 권장 매수 금액은
                <strong> {A.expected["권장 매수 금액 (포지션 크기)"]}원</strong>으로 총 자본의 {A.expected["총 자본 대비 비중"]}%입니다.
              </p>
              <p>
                같은 조건에서 손절 라인만 {won(B.inputs.stopLossPrice)}원(1주당 손실 300원)으로 바꾸면 100,000 ÷ 300 = 333.33…주이므로
                1주 미만을 버린 <strong>{B.expected["권장 매수 수량"]}주</strong>, {B.expected["권장 매수 금액 (포지션 크기)"]}원({B.expected["총 자본 대비 비중"]}%)이
                권장 수량입니다. 손절 라인이 진입 가격에 가까울수록 같은 허용 손실로 더 많은 수량을 살 수 있다는 뜻이지만,
                그만큼 손절에 자주 걸릴 수 있습니다. 수수료·세금과 체결 가격 차이는 반영하지 않은 값입니다.
              </p>
            </Article>

            <Article title="왜 중요한가?">
              <p>
                투자에서 살아남기 위해서는 한 번의 실수로 계좌가 크게 손상되지 않도록
                해야 합니다. 포지션 사이즈 관리는 진입 타이밍보다 덜 화려해 보여도
                장기적으로는 더 중요한 요소가 될 수 있습니다.
              </p>
              <p>
                이 계산은 손절 라인을 지킨다는 전제에서 성립합니다. 손절 없이 계속 보유하면 손실이 허용 손실 금액을
                넘을 수 있습니다. 특히 단타, 스윙, 추세 추종 매매에서는 손절가와 함께 포지션 사이즈를
                미리 계산하는 습관이 필요합니다.
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

          <InternalLinks currentPath={PATH} />
        </div>
      </main>
  );
}
