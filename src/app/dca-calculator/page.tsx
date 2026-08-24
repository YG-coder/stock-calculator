import DcaCalculator from "@/components/calculator/DcaCalculator";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { Article, Disclaimer, FaqItem, FaqSection, PageHeader, RelatedCalculators, SectionCard } from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";

const title = "적립식 투자 시뮬레이션";
const description = "초기 투자금과 월 투자금, 기대수익률, 변동성을 바탕으로 적립식 투자의 장기 자산 분포를 몬테카를로 방식으로 확인합니다.";
export const metadata = buildMetadata({ title, description, path: "/dca-calculator", keywords: ["적립식 투자 계산기", "DCA 계산기", "몬테카를로 시뮬레이션", "장기 투자"] });
const faqs = [
  { question: "일반 복리 계산기와 무엇이 다른가요?", answer: "일반 복리 계산기는 매달 같은 수익률을 가정하지만, 이 도구는 변동성이 있는 여러 시장 경로를 만들어 최종 자산의 범위를 보여줍니다." },
  { question: "P10과 P90은 무엇인가요?", answer: "P10은 시뮬레이션 결과의 하위 10% 지점이고 P90은 상위 10%가 시작되는 지점입니다. 최저·최고 수익이나 보장 범위가 아닙니다." },
  { question: "결과가 실제 미래를 예측하나요?", answer: "아닙니다. 입력한 수익률·변동성·물가 가정에 따른 조건부 시뮬레이션이며 실제 투자 결과를 보장하지 않습니다." },
];

export default function DcaCalculatorPage() {
  return <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
    <CalculatorJsonLd title={title} description={description} path="/dca-calculator" faqs={faqs} />
    <PageHeader badge="투자 시뮬레이션" title={title} description={description} />
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
      <DcaCalculator />
      <SectionCard>
        <Article title="적립식 투자 시뮬레이션이란?"><p>매월 일정 금액을 투자할 때 하나의 고정 수익률 대신 다양한 시장 경로를 생성해 장기 결과의 분포를 확인하는 도구입니다. 결과는 예측값이 아니라 입력 가정에 따른 조건부 범위입니다.</p></Article>
        <Article title="계산 기준"><p>연 CAGR과 연 변동성을 월 단위 수익률로 변환하고, 선택한 납입 시점에 투자금을 반영합니다. 실질 기준은 입력한 물가상승률로 각 시점의 금액을 현재 가치로 환산합니다.</p></Article>
      </SectionCard>
      <FaqSection title="자주 묻는 질문 (FAQ)">{faqs.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}</FaqSection>
      <RelatedCalculators links={[{ href: "/compound-interest-calculator", title: "복리 계산기", desc: "고정 수익률 기준 복리 결과 계산" }, { href: "/position-size-calculator", title: "포지션 사이즈 계산기", desc: "허용 손실 기준 투자 금액 계산" }]} />
      <Disclaimer />
    </div>
  </main>;
}
