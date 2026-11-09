/**
 * src/app/average-price-calculator/page.tsx
 * 역할: 주식 평단가(물타기·불타기) 계산기 페이지
 *
 * 본문의 계산 사례 숫자는 src/data/stockCalculatorExamples.ts 에서만 가져온다.
 * 같은 입력을 실제 계산기에 넣어 대조하는 테스트가 있다(tests/stockCalculatorExamples.test.ts).
 */

import Link from "next/link";
import AveragePriceCalculator from "@/components/calculator/AveragePriceCalculator";
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
  AVERAGE_BASIC,
  AVERAGE_DOWN_AFTER,
  AVERAGE_DOWN_BEFORE,
  AVERAGE_DOWN_FURTHER_AFTER,
  AVERAGE_DOWN_FURTHER_BEFORE,
  AVERAGE_UP_AFTER,
  AVERAGE_UP_BEFORE,
  AVERAGE_UP_PULLBACK,
  BREAK_EVEN_AFTER,
  BREAK_EVEN_BEFORE,
} from "@/data/stockCalculatorExamples";

const TITLE = "주식 평단가 계산기";
const DESCRIPTION =
    "보유분과 추가 매수 가격·수량을 최대 10회까지 입력하면 물타기·불타기 후 평균 단가, 총 수량, 총 매수 금액을 계산합니다. 현재가를 넣으면 새 평단가 기준 평가 손익과 수익률도 확인할 수 있습니다. 수수료는 반영하지 않습니다.";

export const metadata = buildMetadata({
  title: `${TITLE} | 물타기·불타기 평균단가 계산`,
  description: DESCRIPTION,
  path: "/average-price-calculator",
  keywords: [
    "주식 평단가 계산기",
    "물타기 계산기",
    "불타기 계산기",
    "주식 평균단가",
    "stock average price calculator",
    "추가매수 평단",
  ],
});

const FAQ_ITEMS = [
  { question: "물타기·불타기 후 수익률도 확인할 수 있나요?", answer: "네. 현재가를 입력하면 새 평단가 기준 평가 손익과 수익률을 함께 보여 줍니다." },
  { question: "평단가가 낮아지면 무조건 좋은 건가요?", answer: "아닙니다. 평단가가 낮아져도 현재 손실금은 줄지 않고, 투입 금액이 늘어난 만큼 이후 하락 때 손실이 더 커집니다. 본문의 물타기 사례를 참고하세요." },
  { question: "수수료는 포함되나요?", answer: "포함되지 않습니다. 매수 가격과 수량만으로 계산하므로, 매수 수수료를 매입 금액에 넣는 증권사의 평균 단가와는 조금 다를 수 있습니다." },
];

const pct = (v: string) => `${v}%`;
const won = (v: string) => `${v.replace(/^\+0$/, "0")}원`;
const num = (v: string) => Number(v).toLocaleString("ko-KR");

function RowsText({ rows }: { rows: { price: string; quantity: string }[] }) {
  return <>{rows.map((r) => `${num(r.price)}원 × ${r.quantity}주`).join(", ")}</>;
}

export default function AveragePriceCalculatorPage() {
  const basic = AVERAGE_BASIC;
  const downBefore = AVERAGE_DOWN_BEFORE;
  const downAfter = AVERAGE_DOWN_AFTER;
  const furtherBefore = AVERAGE_DOWN_FURTHER_BEFORE;
  const furtherAfter = AVERAGE_DOWN_FURTHER_AFTER;
  const upBefore = AVERAGE_UP_BEFORE;
  const upAfter = AVERAGE_UP_AFTER;
  const pullback = AVERAGE_UP_PULLBACK;

  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
        <CalculatorJsonLd
            title={TITLE}
            description={DESCRIPTION}
            path="/average-price-calculator"
            faqs={FAQ_ITEMS}
        />
        <PageHeader
            badge="필수 투자 계산기"
            title={TITLE}
            description="여러 번 나눠 산 주식의 평균 매입 단가를 계산합니다. 물타기(하락 매수)·불타기(상승 매수) 뒤 평단가와 수익률이 어떻게 바뀌는지 바로 확인할 수 있습니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          <AveragePriceCalculator />

          <SectionCard>
            <Article title="사용 방법">
              <ol className="list-decimal space-y-2 pl-5">
                <li>1차 매수 칸에 지금 보유한 주식의 매수가와 수량을 넣습니다. 이미 여러 번 샀다면 증권사 앱의 평균 단가와 보유 수량을 넣어도 됩니다.</li>
                <li>2차 매수 칸에 추가로 살 가격과 수량을 넣습니다. ‘추가 매수 입력’ 버튼으로 최대 10회까지 입력할 수 있습니다.</li>
                <li>현재가(선택)를 넣으면 새 평단가 기준 평가 손익과 수익률이 함께 나옵니다.</li>
              </ol>
              <p>가격과 수량 중 하나만 입력한 칸이 있으면 계산을 보류합니다. 두 칸 모두 비운 매수 행은 계산에서 제외합니다.</p>
            </Article>

            <Article title="계산 방법">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center my-6">
                <p className="font-mono text-sm sm:text-lg text-slate-800 font-bold tracking-tight">
                  평균 단가 = 총 매수 금액 ÷ 총 보유 수량
                </p>
              </div>
              <p>
                <RowsText rows={basic.rows} />로 세 번 나눠 샀다면 총 매수 금액은 {won(basic.expected.totalAmount)}, 총 수량은{" "}
                {basic.expected.totalQuantity}주이므로 평균 단가는 <strong>{won(basic.expected.average)}</strong>입니다. 계산기에 같은
                값을 넣어 확인해 보세요.
              </p>
            </Article>

            <Article title="물타기하면 평단가는 낮아지는데 손실금은 왜 그대로일까?">
              <p>
                {num(downBefore.rows[0].price)}원에 {downBefore.rows[0].quantity}주를 샀는데 현재가가 {num(downBefore.current ?? "")}원입니다.
                평가 손익은 {won(downBefore.expected.profit ?? "")}, 수익률은 {pct(downBefore.expected.rate ?? "")}입니다. 여기서{" "}
                {num(downAfter.rows[1].price)}원에 {downAfter.rows[1].quantity}주를 더 사면 평균 단가는{" "}
                <strong>{won(downAfter.expected.average)}</strong>으로 내려가고 수익률은 <strong>{pct(downAfter.expected.rate ?? "")}</strong>가
                됩니다. 그런데 평가 손익은 여전히 <strong>{won(downAfter.expected.profit ?? "")}</strong>입니다.
              </p>
              <p>
                새로 산 주식은 지금 가격에 샀기 때문에 그 자체로는 손익이 0입니다. 그래서 기존 손실금은 그대로이고,
                투입 금액({won(downBefore.expected.totalAmount)} → {won(downAfter.expected.totalAmount)})이 커진 만큼 수익률만 작아 보입니다.
              </p>
              <p>달라지는 것은 두 가지입니다.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  본전 가격이 {num(BREAK_EVEN_BEFORE.current)}원에서 {num(BREAK_EVEN_AFTER.current)}원으로 낮아져, 현재가{" "}
                  {num(BREAK_EVEN_BEFORE.buy)}원 기준으로 필요한 상승률이 {pct(BREAK_EVEN_BEFORE.expected.rate)}에서{" "}
                  {pct(BREAK_EVEN_AFTER.expected.rate)}로 줄어듭니다.
                </li>
                <li>
                  반대로 주가가 {num(furtherAfter.current ?? "")}원까지 더 내리면 손실이 커집니다. 추가 매수를 안 했다면{" "}
                  {won(furtherBefore.expected.profit ?? "")}이지만, 추가 매수 뒤에는 {won(furtherAfter.expected.profit ?? "")}입니다.
                </li>
              </ul>
              <p>
                필요한 상승률은{" "}
                <Link href="/profit-calculator" className="font-semibold text-slate-900 underline underline-offset-2">수익률 계산기</Link>에
                매수가 {num(BREAK_EVEN_BEFORE.buy)}원, 현재가 칸에 본전 가격을 넣어 검산할 수 있습니다.
              </p>
            </Article>

            <Article title="불타기하면 수익금은 그대로인데 수익률은 왜 낮아질까?">
              <p>
                {num(upBefore.rows[0].price)}원에 {upBefore.rows[0].quantity}주를 사서 현재가 {num(upBefore.current ?? "")}원이면 평가 손익{" "}
                {won(upBefore.expected.profit ?? "")}, 수익률 {pct(upBefore.expected.rate ?? "")}입니다.{" "}
                {num(upAfter.rows[1].price)}원에 {upAfter.rows[1].quantity}주를 더 사면 평균 단가는 <strong>{won(upAfter.expected.average)}</strong>으로
                올라가고, 손익은 {won(upAfter.expected.profit ?? "")} 그대로이지만 수익률은 <strong>{pct(upAfter.expected.rate ?? "")}</strong>로
                낮아집니다.
              </p>
              <p>
                이후 주가가 {num(pullback.current ?? "")}원으로 내리면 평균 단가와 같아져 손익이 {won(pullback.expected.profit ?? "")}으로 본전이 됩니다.
                추가 매수가 없었다면 같은 가격에서도 수익이 남아 있었을 상황입니다.
              </p>
            </Article>

            <Article title="결과를 읽을 때 주의할 점">
              <p>
                평균 단가는 보유 수량 전체를 하나로 봤을 때의 기준 매입가입니다. 추가 매수가 좋은 선택인지 알려 주는 값은
                아니므로, 종목의 변동성과 전체 투자금, 감당할 수 있는 손실을 함께 따져 보세요. 매수 수수료는 반영하지
                않습니다.
              </p>
            </Article>
          </SectionCard>

          <GuideLinks slugs={["when-not-to-average-down", "average-price-meaning"]} />

          <FaqSection title="자주 묻는 질문 (FAQ)">
            {FAQ_ITEMS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </FaqSection>

          <RelatedCalculators
              links={[
                {
                  href: "/profit-calculator",
                  title: "주식 수익률 계산기",
                  desc: "평균 단가 기준 수익률과 평가 손익 확인",
                },
                {
                  href: "/stop-loss-calculator",
                  title: "주식 손절가 계산기",
                  desc: "손실 제한 가격 계산",
                },
                {
                  href: "/break-even-calculator",
                  title: "본전 회복 계산기",
                  desc: "손실 후 회복에 필요한 상승률 계산",
                },
              ]}
          />

          <Disclaimer />

          <InternalLinks currentPath="/average-price-calculator" />
        </div>
      </main>
  );
}
