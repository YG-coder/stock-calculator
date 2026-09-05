import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CALCULATORS } from "@/lib/constants";
import { guidePages } from "@/data/guidePages";

export const metadata = buildMetadata({
  title: "주식계산기 | 무료 투자 계산기",
  description:
    "주식 수익률, 평단가, 손절가, 목표가, 배당과 복리를 투자 상황에 맞춰 계산하고 국내주식·미국주식·코인 계산기를 한 곳에서 확인하세요.",
  path: "/",
  keywords: [
    "주식계산기",
    "주식 수익률 계산기",
    "평단가 계산기",
    "손절가 계산기",
    "목표가 계산기",
    "배당 계산기",
  ],
});

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

const INVESTMENT_FLOW = [
  { step: "1", title: "평단가 확인", description: "여러 번 매수했다면 실제 평균 매입 단가부터 계산합니다.", href: "/average-price-calculator" },
  { step: "2", title: "현재 손익 확인", description: "평단가와 현재가를 기준으로 수익금과 수익률을 확인합니다.", href: "/profit-calculator" },
  { step: "3", title: "매도 목표 설정", description: "원하는 목표 수익률에 도달하는 가격을 계산합니다.", href: "/target-price-calculator" },
  { step: "4", title: "손실 범위 제한", description: "감당할 수 있는 손실률과 손절 가격을 미리 정합니다.", href: "/stop-loss-calculator" },
] as const;

const MARKET_HUBS = [
  { href: "/stocks", label: "국내주식", title: "국내주식 계산기", description: "수익률·평단가·손절가·배당·증권거래세" },
  { href: "/us-stocks", label: "미국주식", title: "미국주식 계산기", description: "환율 반영 수익·해외주식 세금·세후 배당" },
  { href: "/crypto", label: "코인", title: "코인 계산기", description: "레버리지 진입·청산가·수익률·펀딩비" },
] as const;

const HOME_GUIDES = [
  guidePages["average-price-meaning"],
  guidePages["stop-loss-ratio"],
  guidePages["compound-investing"],
].filter(Boolean);

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
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold text-slate-500">무료 투자 계산기</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            투자 결정을 내리기 전에
            <br className="hidden sm:block" /> 숫자부터 확인하세요
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            평단가와 현재 손익부터 목표가·손절가·포지션 크기까지, 투자 과정에 필요한
            계산을 상황별로 찾을 수 있습니다. 회원가입 없이 바로 계산해 보세요.
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
                  <p className="mt-2 grow text-sm leading-6 text-slate-600">{group.description}</p>
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

      <section className="border-y border-slate-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-black tracking-tight">투자 전후 계산 흐름</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            보유 가격을 확인한 뒤 수익과 위험 기준을 순서대로 정리해 보세요.
          </p>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INVESTMENT_FLOW.map((item) => (
              <li key={item.step} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{item.step}</span>
                  <h3 className="font-black">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <Link href={item.href} className="mt-4 inline-block text-sm font-bold text-slate-800 hover:underline">계산기 열기 →</Link>
              </li>
            ))}
          </ol>
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

      <section className="border-y border-slate-200 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">계산 전에 읽어보세요</h2>
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
