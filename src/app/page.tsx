import Link from "next/link";
import type { Metadata } from "next";
import { BASE_URL, OG_IMAGE } from "@/lib/metadata";
import { CALCULATORS } from "@/lib/constants";
import { getIndexableGuides } from "@/data/guidePages";

const HOME_URL = new URL("/", BASE_URL).href;
const HOME_TITLE = "주식 계산기 | 수익률·평단가·손절가 무료 계산";
const HOME_HEADING = "주식 계산기 — 수익률·평단가·손절가를 한곳에서";
const HOME_DESCRIPTION =
  "주식 계산기로 수익률, 평단가, 손절가, 목표가, 배당과 복리를 무료로 계산하세요. 국내주식·미국주식·코인 중 필요한 도구를 고르고, 계산별 비용 반영 범위와 주의사항을 확인할 수 있습니다.";
const HOME_INTRO =
  "주식 계산기는 매수가·현재가·수량 등 입력값으로 손익과 투자 조건을 계산하는 도구입니다. 이 사이트에서는 수익률·평단가·손절가·목표가·배당·복리를 무료로 계산할 수 있습니다. 보유 손익을 확인하려면 수익률 계산기로, 추가 매수를 비교하려면 평단가 계산기로 시작하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: HOME_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "주식계산기.kr",
    url: HOME_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{
      url: new URL(OG_IMAGE, BASE_URL).href,
      width: 1200,
      height: 630,
      alt: "주식계산기.kr",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [new URL(OG_IMAGE, BASE_URL).href],
  },
};

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${HOME_URL}#webpage`,
  url: HOME_URL,
  name: HOME_HEADING,
  description: HOME_INTRO,
  inLanguage: "ko-KR",
  isPartOf: {
    "@type": "WebSite",
    name: "주식계산기",
    url: HOME_URL,
  },
};

const calculatorByHref = new Map(
  CALCULATORS.filter((item) => item.kind === "calculator").map((item) => [item.href, item])
);

const PURPOSE_GROUPS = [
  {
    title: "매수했거나 추가 매수하려고 해요",
    description: "현재 평단가와 수익률을 확인하고 추가 매수 결과를 비교합니다.",
    primary: "/average-price-calculator",
    secondary: ["/profit-calculator", "/break-even-calculator"],
  },
  {
    title: "목표가와 손실 한도를 정하고 싶어요",
    description: "매매 전에 목표 수익과 허용 손실을 숫자로 정리합니다.",
    primary: "/stop-loss-calculator",
    secondary: ["/target-price-calculator", "/risk-reward-calculator", "/position-size-calculator"],
  },
  {
    title: "장기 투자 계획을 세우고 싶어요",
    description: "배당과 복리, 정기 투자 결과를 기간별로 살펴봅니다.",
    primary: "/compound-interest-calculator",
    secondary: ["/dividend-calculator", "/dca-calculator", "/goal-probability-calculator"],
  },
] as const;

const MARKET_HUBS = [
  { href: "/stocks", label: "국내주식", title: "국내주식 계산기", description: "수익률·평단가·손절가·배당·증권거래세" },
  { href: "/us-stocks", label: "미국주식", title: "미국주식 계산기", description: "환율 반영 수익·해외주식 세금·세후 배당" },
  { href: "/crypto", label: "코인", title: "코인 계산기", description: "레버리지 진입·청산가·수익률·펀딩비" },
] as const;

const indexableGuideBySlug = new Map(
  getIndexableGuides().map((guide) => [guide.slug, guide])
);
const HOME_GUIDES = [
  "average-price-meaning",
  "stop-loss-ratio",
  "compound-investing",
].flatMap((slug) => {
  const guide = indexableGuideBySlug.get(slug);
  return guide ? [guide] : [];
});

const HOME_FAQ = [
  {
    question: "어떤 계산기부터 사용하면 되나요?",
    answer: "보유 중인 주식은 평단가와 수익률 계산기부터 시작하세요. 매수 전이라면 목표가·손절가·포지션 사이즈를 먼저 정하면 계획한 손익 범위를 확인하기 쉽습니다.",
  },
  {
    question: "계산 결과가 증권사 화면과 다를 수 있나요?",
    answer: "수수료, 세금, 환율, 체결 가격과 증권사별 표시 방식에 따라 차이가 날 수 있습니다. 실제 주문 전에는 증권사 화면을 확인하세요.",
  },
  {
    question: "입력한 투자 정보가 저장되나요?",
    answer: "계산은 사용자의 브라우저에서 처리되며 입력한 투자 금액과 가격을 서버에 저장하지 않습니다.",
  },
] as const;

function getCalculator(href: string) {
  const calculator = calculatorByHref.get(href);
  if (!calculator) throw new Error(`등록되지 않은 계산기 경로입니다: ${href}`);
  return calculator;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_SCHEMA).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold text-slate-500">무료 투자 계산 도구</p>
          <h1 className="mt-3 max-w-4xl break-keep text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {HOME_HEADING}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {HOME_INTRO}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#start" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
              상황에 맞게 시작하기 ↓
            </Link>
            <Link href="/profit-calculator" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
              수익률 바로 계산
            </Link>
          </div>
        </div>
      </section>

      <section id="start" className="scroll-mt-32 py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-black tracking-tight">어떤 상황이신가요?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            지금 필요한 판단에 가까운 항목을 고르면 관련 계산기를 빠르게 찾을 수 있습니다.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {PURPOSE_GROUPS.map((group) => {
              const primary = getCalculator(group.primary);
              return (
                <article key={group.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-black leading-snug">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 md:min-h-12">{group.description}</p>
                  <Link href={primary.href} className="mt-5 inline-flex w-fit items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700">
                    {primary.label} 계산부터 시작 →
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    {group.secondary.map((href) => {
                      const calculator = getCalculator(href);
                      return (
                        <Link key={href} href={href} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900">
                          {calculator.label}
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">시장별 계산기</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">투자하는 시장에 맞는 전용 계산기와 공용 계산기를 확인하세요.</p>
            </div>
            <Link href="/calculators" className="shrink-0 text-sm font-bold text-slate-700 hover:underline">전체 보기 →</Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {MARKET_HUBS.map((hub) => (
              <Link key={hub.href} href={hub.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <span className="text-xs font-bold text-slate-500">{hub.label}</span>
                <h3 className="mt-2 text-lg font-black group-hover:text-slate-700">{hub.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{hub.description}</p>
                <span className="mt-4 inline-block text-sm font-bold">둘러보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="calculation-basis" aria-labelledby="calculation-basis-title" className="border-y border-slate-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="calculation-basis-title" className="text-2xl font-black tracking-tight">계산 예시와 반영 범위</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <article className="min-w-0 rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold">수익률 계산 예시</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                매수가 10,000원, 현재가 11,000원, 수량 10주라면 평가손익은 10,000원, 수익률은 10%입니다.
              </p>
              <dl className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <div><dt className="font-bold">평가손익</dt><dd>(11,000 − 10,000) × 10 = 10,000원</dd></div>
                <div><dt className="font-bold">수익률</dt><dd>(11,000 − 10,000) ÷ 10,000 × 100 = 10%</dd></div>
              </dl>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                동일 통화로 계산한 가상 예시입니다. 수수료·세금·환율 변동은 반영하지 않았습니다.
              </p>
              <Link href="/profit-calculator" className="mt-4 inline-block text-sm font-bold text-slate-800 underline underline-offset-4">내 입력값으로 수익률 계산하기 →</Link>
            </article>
            <article className="min-w-0 rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold">세금·수수료와 적용 기준</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                계산기마다 세금·수수료·환율의 반영 범위가 다릅니다. 세금이 포함된 결과는 해당 계산기의 ‘계산 기준과 출처’와 연결된 가이드의 검토 상태를 함께 확인하세요.
              </p>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6">
                <li><Link href="/overseas-stock-tax-calculator" className="font-semibold underline underline-offset-4">해외주식 세금 계산 기준</Link></li>
                <li><Link href="/dividend-calculator" className="font-semibold underline underline-offset-4">배당 계산 기준</Link></li>
                <li><a href="https://www.nts.go.kr/" className="font-semibold underline underline-offset-4">국세청 공식 홈페이지</a> — 세금 안내 확인</li>
              </ul>
              <p className="mt-4 text-xs leading-6 text-slate-600">
                국세청 링크는 공식 안내를 찾는 시작점입니다. 적용 근거와 확인 범위는 상세 페이지에서 확인하세요. ‘재검토 대상’은 최신 사실 확인이 완료됐다는 뜻이 아닙니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">계산 결과를 이해하는 가이드</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">계산 결과를 해석하는 데 필요한 기본 개념을 정리했습니다.</p>
            </div>
            <Link href="/guides" className="shrink-0 text-sm font-bold text-slate-700 hover:underline">가이드 전체 →</Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {HOME_GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-400">
                <span className="text-xs font-bold text-slate-500">{guide.badge}</span>
                <h3 className="mt-2 font-black leading-snug">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-black tracking-tight">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {HOME_FAQ.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <span aria-hidden="true" className="shrink-0 text-slate-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-xs leading-6 text-slate-500">
            계산 결과는 입력값을 바탕으로 한 참고값이며 투자 권유가 아닙니다. 실제 수익은 수수료, 세금,
            환율, 체결 가격과 시장 변동에 따라 달라질 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
