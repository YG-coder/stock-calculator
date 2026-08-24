import NoSellRebalancingCalculator from "@/components/calculator/NoSellRebalancingCalculator";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { Article, Disclaimer, FaqItem, FaqSection, PageHeader, RelatedCalculators, SectionCard } from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";

const title = "무매도 리밸런싱 계산기";
const description = "보유 자산을 팔지 않고 새 투자금만으로 목표 자산배분에 가까워지도록 자산별 추천 매수액을 계산합니다.";
const faqs = [
  { question: "무매도 리밸런싱이란 무엇인가요?", answer: "기존 자산을 매도하지 않고 배당금이나 새 투자금을 비중이 부족한 자산에 배분해 목표 비중에 가까워지는 방식입니다." },
  { question: "한 번에 목표 비중이 되지 않는 이유는 무엇인가요?", answer: "비중이 높은 자산을 팔지 않는 조건에서는 새 투자금만으로 모든 초과 비중을 즉시 해소할 수 없기 때문입니다." },
];
export const metadata = buildMetadata({ title, description, path: "/no-sell-rebalancing-calculator", keywords: ["무매도 리밸런싱", "리밸런싱 계산기", "자산배분 계산기"] });

export default function Page() { return <main className="min-h-screen bg-slate-50 pb-20"><CalculatorJsonLd title={title} description={description} path="/no-sell-rebalancing-calculator" faqs={faqs} /><PageHeader badge="자산배분" title={title} description={description} /><div className="mx-auto max-w-5xl px-6 py-12 md:px-8"><NoSellRebalancingCalculator /><SectionCard><Article title="새 투자금으로 비중을 조절하는 방법"><p>현재 총자산에 새 투자금을 더한 금액을 기준으로 자산별 목표금액을 구하고, 목표보다 부족한 자산에 우선 배분합니다. 매도와 양도소득 실현을 피하고 싶을 때 활용할 수 있습니다.</p></Article></SectionCard><FaqSection title="자주 묻는 질문 (FAQ)">{faqs.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}</FaqSection><RelatedCalculators links={[{ href: "/portfolio-calculator", title: "포트폴리오 계산기", desc: "자산배분의 기대수익률과 위험 분석" }, { href: "/dca-calculator", title: "적립식 투자 시뮬레이션", desc: "장기 적립 결과의 확률 분포 확인" }]} /><Disclaimer /></div></main>; }
