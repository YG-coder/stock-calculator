import PortfolioCalculator from "@/components/calculator/PortfolioCalculator";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { Article, Disclaimer, FaqItem, FaqSection, PageHeader, RelatedCalculators, SectionCard } from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";

const title = "포트폴리오 기대수익률·변동성 계산기";
const description = "자산별 비중과 기대수익률, 변동성, 상관계수를 입력해 포트폴리오의 기대수익률과 공분산 기반 변동성을 계산합니다.";
const faqs = [{ question: "상관계수는 무엇인가요?", answer: "두 자산의 수익률이 함께 움직이는 정도로 -1부터 1 사이입니다. 낮을수록 포트폴리오 변동성을 낮추는 분산효과가 커질 수 있습니다." }, { question: "기본 입력값을 그대로 사용해도 되나요?", answer: "아니요. 기본값은 계산 예시이며 최신 시장 전망이나 권장 자산배분이 아닙니다. 같은 기준으로 추정한 본인의 가정값을 입력하세요." }];
export const metadata = buildMetadata({ title, description, path: "/portfolio-calculator", keywords: ["포트폴리오 계산기", "자산배분 계산기", "포트폴리오 변동성"] });
export default function Page() { return <main className="min-h-screen bg-slate-50 pb-20"><CalculatorJsonLd title={title} description={description} path="/portfolio-calculator" faqs={faqs} /><PageHeader badge="포트폴리오" title={title} description={description} /><div className="mx-auto max-w-5xl px-6 py-12 md:px-8"><PortfolioCalculator /><SectionCard><Article title="상관관계를 포함해야 하는 이유"><p>자산별 변동성을 비중대로 단순 합산하면 모든 자산이 같은 방향으로 움직인다고 가정하게 됩니다. 공분산을 사용하면 자산 간 동조 정도를 반영해 분산투자 효과를 계산할 수 있습니다.</p></Article></SectionCard><FaqSection title="자주 묻는 질문 (FAQ)">{faqs.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}</FaqSection><RelatedCalculators links={[{ href: "/no-sell-rebalancing-calculator", title: "무매도 리밸런싱", desc: "새 투자금의 자산별 추천 매수액 계산" }, { href: "/dca-calculator", title: "적립식 투자 시뮬레이션", desc: "포트폴리오 가정의 장기 확률 결과 확인" }]} /><Disclaimer /></div></main>; }
