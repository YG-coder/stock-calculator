import StockTransactionTaxCalculator from "@/components/calculator/StockTransactionTaxCalculator";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import SourceNote from "@/components/ui/SourceNote";
import {
  Article,
  Disclaimer,
  FaqItem,
  FaqSection,
  PageHeader,
  RelatedCalculators,
  SectionCard,
} from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";
import {
  STOCK_TRANSACTION_TAX_EFFECTIVE_AT,
  STOCK_TRANSACTION_TAX_REVIEWED_AT,
} from "@/lib/stockTransactionTax";

const title = "증권거래세 계산기";
const description = "코스피·코스닥·코넥스·K-OTC·비상장 주식의 매도금액 기준 증권거래세와 농어촌특별세를 계산합니다.";
const path = "/stock-transaction-tax-calculator";
const faqs = [
  { question: "수익이 없어도 증권거래세를 내나요?", answer: "증권거래세는 매매차익이 아니라 주식의 양도가액을 기준으로 계산하므로 손실을 보고 팔아도 발생할 수 있습니다." },
  { question: "코스피 세율이 왜 두 항목으로 나뉘나요?", answer: "코스피는 증권거래세 0.05%와 농어촌특별세 0.15%가 함께 부과되어 합계가 0.20%입니다." },
  { question: "K-OTC와 일반 비상장은 같은 세율인가요?", answer: "아닙니다. 2026년 기준 K-OTC는 0.20%, K-OTC가 아닌 일반 비상장·장외 거래는 0.35%로 구분됩니다." },
  { question: "양도소득세와 증권사 수수료도 포함되나요?", answer: "아닙니다. 이 계산기는 증권거래세와 코스피의 농어촌특별세만 계산합니다. 양도소득세와 증권사 수수료는 별도입니다." },
];

export const metadata = buildMetadata({
  title: "증권거래세 계산기 | 시장별 세율 계산",
  description,
  path,
  keywords: ["증권거래세 계산기", "코스피 거래세", "코스닥 거래세", "K-OTC 세율", "비상장주식 거래세"],
});

export default function StockTransactionTaxPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <CalculatorJsonLd title={title} description={description} path={path} faqs={faqs} />
      <PageHeader badge="세금 분석" title={title} description={description} />
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <StockTransactionTaxCalculator />

        <SourceNote
          basisYear="2026"
          reviewedAt={STOCK_TRANSACTION_TAX_REVIEWED_AT}
          applied={[
            { label: "코스피", value: "0.20% (증권거래세 0.05% + 농어촌특별세 0.15%)" },
            { label: "코스닥 / K-OTC", value: "0.20%" },
            { label: "코넥스", value: "0.10%" },
            { label: "일반 비상장·장외", value: "0.35%" },
          ]}
          conditions={[
            `${STOCK_TRANSACTION_TAX_EFFECTIVE_AT} 시행 세율 기준입니다.`,
            "양도소득세와 증권사 매매 수수료는 포함하지 않습니다.",
            "ETF·ETN 등 상품 종류나 비과세 거래 여부에 따라 실제 징수액이 다를 수 있습니다.",
          ]}
          sources={[
            { label: "국가법령정보센터", url: "https://www.law.go.kr/법령/증권거래세법시행령", document: "증권거래세법 시행령 제5조" },
            { label: "국가법령정보센터", url: "https://www.law.go.kr/법령/농어촌특별세법", document: "농어촌특별세법 제5조" },
          ]}
        />

        <SectionCard>
          <Article title="증권거래세 계산 방법">
            <p>증권거래세는 주식을 팔아 이익이 났는지가 아니라 총 매도금액을 기준으로 계산합니다.</p>
            <p><strong>예상 세금 = 총 매도금액 × 해당 시장의 합산 세율</strong></p>
            <p>예를 들어 코스피 주식 1,000만 원을 매도하면 증권거래세 5,000원과 농어촌특별세 15,000원을 합한 20,000원이 계산됩니다.</p>
          </Article>
          <Article title="K-OTC와 일반 비상장 거래 구분">
            <p>K-OTC는 금융투자협회가 운영하는 장외시장입니다. 같은 비상장주식이라도 K-OTC를 통한 거래와 일반 장외거래의 세율이 다르므로 실제 거래 경로를 확인해야 합니다.</p>
          </Article>
        </SectionCard>

        <FaqSection title="자주 묻는 질문 (FAQ)">
          {faqs.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}
        </FaqSection>
        <RelatedCalculators links={[
          { href: "/overseas-stock-tax-calculator", title: "해외주식 세금 계산기", desc: "해외주식 양도차익의 예상 세금 계산" },
          { href: "/profit-calculator", title: "주식 수익률 계산기", desc: "매수가와 현재가 기준 평가손익 계산" },
        ]} />
        <Disclaimer />
      </div>
    </main>
  );
}
