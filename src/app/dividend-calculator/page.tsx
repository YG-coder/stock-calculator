import DividendCalculator from "@/components/calculator/DividendCalculator";
import SourceNote from "@/components/ui/SourceNote";
import { DOMESTIC_DIVIDEND_TAX, FINANCIAL_INCOME_THRESHOLD, TAX_BASIS_YEAR, TAX_REVIEWED_AT } from "@/lib/taxRates";
import { buildMetadata } from "@/lib/metadata";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";

import InternalLinks from "@/components/seo/InternalLinks"
import { DIVIDEND_BASIC } from "@/data/stockCalculatorExamples";

const TITLE = "배당 수익 계산기";
const DESCRIPTION =
    "보유 수량, 주당 배당금, 평균 매수가, 세율(%)을 넣으면 세전·세후 총 배당금과 세금, 총 투자금 기준 세전·세후 배당수익률을 계산합니다. 세율은 직접 입력하며(원화 기본 예시 15.4%, 달러 15%), 매수 수수료와 종합과세는 반영하지 않습니다.";
const PATH = "/dividend-calculator";

export const metadata = buildMetadata({
    title: `${TITLE} | 세전·세후 배당금·배당수익률 계산`,
    description: DESCRIPTION,
    path: PATH,
    keywords: [
        "배당 수익 계산기",
        "배당 계산기",
        "배당수익률 계산기",
        "세후 배당금",
        "미국 주식 배당",
        "국내 주식 배당",
    ],
});

const FAQ_ITEMS = [
  { question: "세후 배당금은 어떻게 계산되나요?", answer: "세전 배당금에 입력한 세율을 곱한 금액을 세금으로 빼서 계산합니다. 세율은 직접 입력하는 값이며, 실제 세율은 국가, 계좌 유형, 제출 서류 등에 따라 달라질 수 있습니다." },
  { question: "배당수익률이 높으면 무조건 좋은 종목인가요?", answer: "아닙니다. 일시적으로 주가가 급락해 배당수익률이 높아 보일 수도 있으므로, 배당 안정성과 기업 실적을 함께 확인해야 합니다." },
  { question: "미국 주식 배당도 계산할 수 있나요?", answer: "네. 통화를 달러로 바꾸고 보유 수량, 주당 배당금, 평균 매수가와 세율을 넣으면 같은 방식으로 세전·세후 배당금과 배당수익률을 계산합니다. 환율 환산과 월 배당 환산이 필요하면 미국주식 배당 계산기를 사용하세요." },
];

const EX = DIVIDEND_BASIC;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function DividendCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path={PATH}
            faqs={FAQ_ITEMS}
        />
            <PageHeader
                badge="현금 흐름 분석"
                title={TITLE}
                description="보유 수량, 주당 배당금, 평균 매수가, 세율을 기준으로 세전·세후 배당금과 배당수익률을 계산하는 도구입니다. 배당 투자 전략을 세울 때 실수령액을 빠르게 확인할 수 있습니다."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <DividendCalculator />


        <SourceNote
          basisYear={TAX_BASIS_YEAR}
          reviewedAt={TAX_REVIEWED_AT}
          applied={[
            { label: "국내 배당소득세", value: `${DOMESTIC_DIVIDEND_TAX.rateDisplay} (${DOMESTIC_DIVIDEND_TAX.rateBreakdown})` },
            { label: "금융소득종합과세 기준", value: `연 ${FINANCIAL_INCOME_THRESHOLD.amountDisplay}` },
          ]}
          conditions={[
            "세율은 기본값이며 직접 수정할 수 있습니다. 계좌 종류와 소득 구간에 따라 실제 세율이 달라질 수 있습니다.",
            FINANCIAL_INCOME_THRESHOLD.note,
            "금융소득종합과세 기준금액과 비교과세는 소득세법 제14조·제62조의 2026년 시행본으로 2026-10-21 확인했습니다. 다른 세율의 검토일은 위 표시와 같습니다.",
            "매수 수수료는 총 투자금에 반영되지 않았습니다.",
            "배당 지급 주기(연·반기·분기·월)는 입력한 주당 배당금에 이미 반영되어 있다고 가정합니다.",
          ]}
          sources={[
            ...DOMESTIC_DIVIDEND_TAX.sources,
            { label: "국가법령정보센터", url: "https://www.law.go.kr/법령/소득세법/제14조", document: "소득세법 제14조제3항제6호 — 금융소득종합과세 기준금액" },
            { label: "국가법령정보센터", url: "https://www.law.go.kr/법령/소득세법/제62조", document: "소득세법 제62조 — 비교과세" },
          ]}
        />

                <SectionCard>
                    <Article title="배당금 계산 방법">
                        <p>
                            배당 수익 계산기는 보유 종목이 실제로 얼마의 현금 흐름을 만들어 주는지 확인하기 위한 도구입니다.
                            세전 금액만 보면 실제 수익을 과대평가할 수 있으므로 세전 금액, 세후 실수령액, 배당수익률을 함께 봅니다.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-center">
                            <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                                세전 배당금 = 보유 수량 × 주당 배당금
                                <br />
                                세금 = 세전 배당금 × 세율 ÷ 100, 세후 배당금 = 세전 배당금 − 세금
                                <br />
                                배당수익률(%) = 배당금 ÷ (보유 수량 × 평균 매수가) × 100
                            </p>
                        </div>
                        <p>
                            예를 들어 {EX.inputs.shares}주를 보유하고 주당 배당금이 {won(EX.inputs.dividendPerShare)}원이라면 세전 배당금은
                            <strong> {EX.expected["세전 총 배당금"]}원</strong>입니다. 세율을 국내 배당소득세 {DOMESTIC_DIVIDEND_TAX.rateDisplay}로
                            넣으면 세금 {EX.expected["세금"]}원을 뺀 세후 배당금은 <strong>{EX.expected["세후 총 배당금"]}원</strong>이고,
                            평균 매수가가 {won(EX.inputs.buyPrice)}원(총 투자금 {EX.expected["총 투자금"]}원)이면 세전 배당수익률{" "}
                            {EX.expected["세전 배당수익률"]}%, 세후 배당수익률 <strong>{EX.expected["세후 배당수익률"]}%</strong>입니다.
                            세율은 직접 입력하는 값이며 매수 수수료는 총 투자금에 넣지 않습니다.
                        </p>
                    </Article>

                    <Article title="배당수익률을 함께 보는 이유">
                        <p>
                            같은 100만 원의 배당금을 받더라도 투자 원금이 1천만 원인지, 1억
                            원인지에 따라 투자 효율은 크게 다릅니다. 이때 중요한 지표가 바로
                            배당수익률입니다. 배당수익률은 투자금 대비 배당금의 비율을 뜻하며,
                            장기 현금 흐름 투자에서 핵심 기준이 됩니다.
                        </p>
                        <p>
                            배당만 보고 종목을 선택하기보다, 배당 성향, 배당 지속 가능성,
                            실적 추이, 주가 변동성까지 함께 고려하는 것이 좋습니다. 배당금은 기업 실적에 따라 줄거나
                            없어질 수 있으므로, 이 계산기는 그런 판단을 시작하기 위한 기본 수치 확인용 도구로 활용하면 좋습니다.
                        </p>
                    </Article>
                </SectionCard>

                <FaqSection title="자주 묻는 질문 (FAQ)">
            {FAQ_ITEMS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
                </FaqSection>

                <RelatedCalculators
                    links={[
                        {
                            href: "/us-stocks/dividend",
                            title: "미국주식 배당 계산기",
                            desc: "환율·원천징수를 반영한 원화 환산 배당금",
                        },
                        {
                            href: "/profit-calculator",
                            title: "주식 수익률 계산기",
                            desc: "배당 외 가격 상승 기준 실제 수익률 확인",
                        },
                        {
                            href: "/compound-interest-calculator",
                            title: "복리 계산기",
                            desc: "배당 재투자 등 장기 적립 결과 계산",
                        },
                    ]}
                />

                <Disclaimer />

                <InternalLinks currentPath={PATH} />
            </div>
        </main>
    );
}
