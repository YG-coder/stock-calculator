import SorrCalculator from "@/components/calculator/SorrCalculator";
import SorrSimulationCalculator from "@/components/calculator/SorrSimulationCalculator";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { Article, Disclaimer, FaqItem, FaqSection, PageHeader, RelatedCalculators, SectionCard } from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";

const title = "수익률 순서 위험 계산기";
const description = "월별 확률 시뮬레이션으로 은퇴자산 소진 위험을 계산하고, 같은 수익률 목록의 원래 순서와 역순 결과도 비교합니다.";
const faqs = [
  { question: "수익률 순서 위험이란 무엇인가요?", answer: "같은 수익률 목록이라도 인출 초기에 하락이 발생하면 보유 수량이 줄어 이후 회복 효과가 약해지는 위험입니다." },
  { question: "두 계산 결과는 어떻게 다른가요?", answer: "월 인출 시뮬레이션은 수천 개의 월별 확률 경로에서 소진 위험을 계산하고, 정순·역순 비교는 사용자가 입력한 동일한 연 수익률 집합의 순서 효과만 분리해 보여줍니다." },
];
export const metadata = buildMetadata({ title, description, path: "/sequence-risk-calculator", keywords: ["수익률 순서 위험", "SoRR 계산기", "은퇴 인출 계산기"] });

export default function Page() {
  return <main className="min-h-screen bg-slate-50 pb-20"><CalculatorJsonLd title={title} description={description} path="/sequence-risk-calculator" faqs={faqs} /><PageHeader badge="은퇴 위험" title={title} description={description} /><div className="mx-auto max-w-5xl space-y-10 px-6 py-12 md:px-8"><SorrSimulationCalculator /><SectionCard><Article title="같은 수익률의 순서만 직접 비교"><p>아래 도구는 입력한 연 수익률을 원래 순서와 역순으로 적용합니다. 평균수익률은 같게 유지하면서 은퇴 초반 하락의 영향을 직관적으로 확인할 수 있습니다.</p></Article></SectionCard><SorrCalculator /><SectionCard><Article title="SoRR이 중요한 이유"><p>적립기에는 수익률 순서가 최종 복리 결과에 미치는 영향이 작지만, 정기 인출이 시작되면 초기 하락장에서 더 많은 자산을 매도하게 되어 회복력이 크게 떨어질 수 있습니다.</p></Article></SectionCard><FaqSection title="자주 묻는 질문 (FAQ)">{faqs.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}</FaqSection><RelatedCalculators links={[{ href: "/fire-calculator", title: "FIRE 은퇴 시뮬레이션", desc: "은퇴 전후 전체 계획의 소진 위험 계산" }]} /><Disclaimer /></div></main>;
}
