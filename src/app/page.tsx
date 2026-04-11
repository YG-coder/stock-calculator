import { Metadata } from "next";
import Link from "next/link";
import { SectionCard, Article } from "@/components/ui/Shared";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "주식 계산기 모음 | 평단가, 손절가, 물타기, 수익률 자동 계산",
  description:
    "주식 계산기 사이트로 평단가, 수익률, 손절가, 목표가, 배당 수익 계산 기능을 제공하여 투자 판단을 돕는 금융 계산 도구입니다.",
  keywords: [
    "주식 계산기",
    "평단가 계산기",
    "수익률 계산기",
    "손절가 계산기",
    "물타기 계산기",
    "주식 계산기 모음",
    "배당 수익 계산기",
  ],
  openGraph: {
    title: "주식 계산기 모음 | 투자 필수 툴 허브",
    description:
      "주식 평단가 계산기, 수익률 계산기, 손절가 계산기, 목표가 계산기, 배당 수익 계산기까지 한 곳에서 빠르게 확인하세요.",
    type: "website",
  },
};

export default function HomePage() {
  const featuredCalculators = CALCULATORS.filter((c) => c.featured);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32 text-center text-balance flex flex-col items-center">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-600 tracking-wider uppercase mb-6 shadow-sm border border-slate-200">
            당신의 자산을 지키는 필수 금융 툴
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
            다양한 투자 계산을
            <br className="hidden sm:block" /> 간편하게 확인하세요.
          </h1>
          <p className="mt-8 max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-500">
            국내주식, 코인, 미국주식 투자에 필요한 핵심 계산기를 카테고리별로 빠르게 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-16">
          {featuredCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group flex flex-col justify-start rounded-[24px] bg-white p-8 border border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
            >
              <div className="flex w-full items-center justify-between mb-6">
                <span className="inline-flex rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {calc.badge}
                </span>
                <span className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-800 mb-3">
                {calc.title}
              </h2>
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                {calc.desc}
              </p>
            </Link>
          ))}
        </section>

        <SectionCard>
          <Article title="왜 주식 계산기가 필요한가요?">
            <p>
              투자에 실패하는 가장 큰 이유는 <strong>감정적 판단</strong>입니다.
              숫자를 기준으로 투자 판단을 내리면 리스크를 객관적으로 관리하는 데 도움이 됩니다.
            </p>
          </Article>

          <Article title="주식 계산기 활용법 안내">
            <p>
              본 사이트에서 제공하는 모든 계산 결과는 참고용 수치입니다.
              실제 수수료, 세금, 슬리피지에 따라 결과는 달라질 수 있습니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}