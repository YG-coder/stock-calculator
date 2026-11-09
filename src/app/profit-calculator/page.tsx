/**
 * src/app/profit-calculator/page.tsx
 * 역할: 주식 수익률 계산기 페이지
 *
 * 본문의 계산 사례 숫자는 src/data/stockCalculatorExamples.ts 에서만 가져온다.
 * 같은 입력을 실제 계산기에 넣어 대조하는 테스트가 있다(tests/stockCalculatorExamples.test.ts).
 */

import Link from "next/link";
import ProfitCalculator from "@/components/calculator/ProfitCalculator";
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
import InternalLinks from "@/components/seo/InternalLinks";
import GuideLinks from "@/components/seo/GuideLinks";
import {
  PROFIT_AVERAGE_BASIS,
  PROFIT_BASIC,
  PROFIT_FEE_ILLUSTRATION,
  PROFIT_SPLIT_BUYS,
  PROFIT_WRONG_BASIS,
} from "@/data/stockCalculatorExamples";

const TITLE = "주식 수익률 계산기";
const DESCRIPTION =
    "매수가·현재가·보유 수량으로 주식 수익률(%)과 평가 손익, 평가 금액을 계산합니다. 현재가 칸에 목표가를 넣으면 그 가격에서의 예상 수익도 볼 수 있습니다. 수수료·세금·환율은 반영하지 않은 가격 기준 결과입니다.";

export const metadata = buildMetadata({
  title: `${TITLE} | 수익률·평가 손익 계산`,
  description: DESCRIPTION,
  path: "/profit-calculator",
  keywords: [
    "주식 수익률 계산기",
    "수익률 계산",
    "주식 수익률",
    "profit calculator",
    "예상 수익금",
    "손익 계산기",
  ],
});

const FAQ_ITEMS = [
  { question: "계산 결과에 수수료나 세금이 포함되나요?", answer: "아니요. 매수가와 현재가의 가격 차이만으로 계산합니다. 거래 수수료와 매도 시 세금은 반영하지 않으므로 수수료·세금을 반영해 보여주는 증권사 앱 수치와 다를 수 있습니다." },
  { question: "마이너스(-) 수익률의 의미가 무엇인가요?", answer: "현재가가 매수가보다 낮아 손실 상태임을 의미합니다." },
  { question: "여러 번 나눠 샀다면 매수가에 무엇을 넣나요?", answer: "첫 매수가가 아니라 전체 보유분의 평균 단가를 넣어야 합니다. 평단가 계산기로 평균 단가를 먼저 구한 뒤 입력하세요." },
];

const b = PROFIT_BASIC;
const w = PROFIT_WRONG_BASIS;
const a = PROFIT_AVERAGE_BASIS;
const s = PROFIT_SPLIT_BUYS;
const f = PROFIT_FEE_ILLUSTRATION;
const won = (v: string) => Number(v).toLocaleString("ko-KR");

export default function ProfitCalculatorPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path="/profit-calculator"
            faqs={FAQ_ITEMS}
        />
        <PageHeader
            badge="필수 금융 계산기"
            title={TITLE}
            description="매수가와 현재가, 보유 수량을 넣으면 수익률과 평가 손익, 평가 금액을 바로 계산합니다. 현재가 칸에 목표 가격을 넣으면 그 가격에 도달했을 때의 예상 수익을 확인할 수 있습니다. 수수료·세금·환율은 반영하지 않습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <ProfitCalculator />

          <SectionCard>
            <Article title="계산 방법">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 space-y-2 text-center">
                <p className="font-mono text-base sm:text-lg text-slate-800 font-bold tracking-tight">수익률 = (현재가 − 매수가) ÷ 매수가 × 100</p>
                <p className="font-mono text-sm sm:text-base text-slate-700">평가 손익 = (현재가 − 매수가) × 보유 수량</p>
                <p className="font-mono text-sm sm:text-base text-slate-700">평가 금액 = 현재가 × 보유 수량</p>
              </div>
              <p>
                예를 들어 매수가 {won(b.buy)}원, 현재가 {won(b.current)}원, 보유 수량 {won(b.quantity)}주를 입력하면
                수익률 <strong>{b.expected.rate}%</strong>, 평가 손익 <strong>{b.expected.profit}원</strong>, 평가 금액{" "}
                <strong>{b.expected.evalAmount}원</strong>이 나옵니다. 수익률은 소수 셋째 자리에서 반올림해 표시합니다.
              </p>
              <p>
                현재가 칸에는 지금 가격 대신 목표 가격이나 손절 가격을 넣어도 됩니다. 그 가격에 도달했을 때의 수익률과
                손익을 미리 확인할 수 있습니다.
              </p>
            </Article>

            <Article title="증권사 앱 수익률과 계산기 결과가 다른 이유">
              <p>같은 종목인데 증권사 앱과 결과가 다르다면 아래 세 가지를 차례로 확인해 보세요.</p>

              <h3 className="mt-6 text-lg font-bold text-slate-900">1. 매수가에 평균 단가를 넣었나요?</h3>
              <p>
                {won(s.rows[0].price)}원에 {s.rows[0].quantity}주, {won(s.rows[1].price)}원에 {s.rows[1].quantity}주를 나눠 사고
                현재가가 {won(w.current)}원이라고 해 보겠습니다. 매수가에 첫 매수가 {won(w.buy)}원을 넣으면 수익률이{" "}
                <strong>{w.expected.rate}%</strong>(손익 {w.expected.profit}원)으로 손실처럼 보입니다. 실제 평균 단가는{" "}
                {s.expected.average}원이므로 이 값을 넣어야 수익률 <strong>{a.expected.rate}%</strong>(손익 {a.expected.profit}원)이
                됩니다. 증권사 앱은 평균 단가를 기준으로 보여 주므로, 여러 번 샀다면{" "}
                <Link href="/average-price-calculator" className="font-semibold text-slate-900 underline underline-offset-2">평단가 계산기</Link>로
                평균 단가를 먼저 구하세요.
              </p>

              <h3 className="mt-6 text-lg font-bold text-slate-900">2. 수수료와 세금을 반영했나요?</h3>
              <p>
                이 계산기는 가격 차이만 계산합니다. 증권사 앱은 회사와 설정에 따라 매수 수수료를 매입 금액에 넣거나,
                팔 때 낼 수수료와 세금을 미리 빼고 보여 주기도 합니다. 정확한 반영 방식은 이용 중인 증권사 안내에서
                확인하세요.
              </p>
              <p>
                차이가 어느 정도인지 보기 위해 위 기본 예시({won(b.buy)}원에 {won(b.quantity)}주 매수, {won(b.current)}원)에
                매수·매도 수수료를 각각 <strong>{f.assumedFeeRatePercent}%</strong>로 <em>가정</em>해 보겠습니다. 매수 수수료{" "}
                {f.buyFee}원과 매도 수수료 {f.sellFee}원을 빼면 손익은 {f.netProfit}원, 수수료를 포함한 매입 금액 대비 수익률은
                약 {f.netRate}%입니다. 이 가정값은 설명용이며 실제 수수료율은 증권사·계좌마다 다릅니다. 매도 시 내는 세금은
                이 예시에 넣지 않았습니다. 시장별 세금은{" "}
                <Link href="/stock-transaction-tax-calculator" className="font-semibold text-slate-900 underline underline-offset-2">증권거래세 계산기</Link>에서
                따로 계산할 수 있습니다.
              </p>

              <h3 className="mt-6 text-lg font-bold text-slate-900">3. 같은 시점의 가격인가요?</h3>
              <p>
                증권사 앱은 시세가 바뀔 때마다 수익률을 다시 계산합니다. 이 계산기는 입력한 가격으로만 계산하므로,
                앱과 비교할 때는 같은 시점의 현재가를 넣어야 합니다.
              </p>
            </Article>

            <Article title="이 계산기가 하지 않는 것">
              <p>
                수수료·세금·환율, 배당금, 보유 기간은 반영하지 않습니다. 해외주식의 원화 기준 수익은{" "}
                <Link href="/us-stocks/exchange-profit" className="font-semibold text-slate-900 underline underline-offset-2">환율 반영 수익 계산기</Link>,
                배당을 포함한 수익은{" "}
                <Link href="/dividend-calculator" className="font-semibold text-slate-900 underline underline-offset-2">배당 수익 계산기</Link>에서
                확인하세요. 가격 기준 공식이므로 ETF·코인처럼 사고파는 가격이 있는 자산에도 같은 방식으로 쓸 수 있습니다.
              </p>
            </Article>
          </SectionCard>

          <GuideLinks slugs={["profit-calculator-guide"]} />

          <FaqSection title="자주 묻는 질문 (FAQ)">
            {FAQ_ITEMS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </FaqSection>

          <RelatedCalculators
              links={[
                {
                  href: "/average-price-calculator",
                  title: "물타기 평단가 계산기",
                  desc: "추가 매수 후 평균 매입 단가 계산",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한을 위한 손절 기준 가격 계산",
                },
                {
                  href: "/target-price-calculator",
                  title: "주식 목표가 계산기",
                  desc: "목표 수익률에 맞는 매도 가격 계산",
                },
              ]}
          />

          <Disclaimer />

          <InternalLinks currentPath="/profit-calculator" />
        </div>
      </main>
  );
}
