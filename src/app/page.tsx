import { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "주식 계산기 모음 | 평단가, 손절가, 수익률 자동 계산",
  description:
    "주식 계산기 사이트로 평단가, 수익률, 손절가, 목표가 계산 기능을 제공하여 투자 판단을 돕는 금융 계산 도구입니다.",
  keywords: [
    "주식 계산기",
    "평단가 계산기",
    "수익률 계산기",
    "손절가 계산기",
    "물타기 계산기",
    "주식 계산기 모음",
  ],
  openGraph: {
    title: "주식 계산기 모음 | 투자 필수 툴 허브",
    description:
      "주식 투자 전 감정을 배제한 기계적 전략 수립을 돕습니다. 빠르고 정확한 주식 계산기 8종을 무료로 이용하세요.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32 text-center flex flex-col items-center">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-600 tracking-wider uppercase mb-6 shadow-sm border border-slate-200">
            당신의 자산을 지키는 필수 금융 툴
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
            다양한 투자 계산을
            <br className="hidden sm:block" />
            간편하게 확인하세요.
          </h1>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-500">
            평단가, 수익률, 손절가 등 다양한 투자 계산을 간편하게 확인할 수 있습니다.
            투자 판단을 위한 참고 도구로 활용해보세요.
          </p>
        </div>
      </section>

      {/* Calculator Grid */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-24">
          {CALCULATORS.map((calc, idx) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`group flex flex-col justify-start rounded-[24px] bg-white p-8 border border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 ${CALCULATORS.length % 2 === 1 && idx === CALCULATORS.length - 1
                  ? "sm:col-span-2 lg:col-span-2 text-center items-center"
                  : ""
                }`}
            >
              {/* Badge + Arrow */}
              <div className="flex w-full items-center justify-between mb-6">
                <span className="inline-flex rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {calc.badge}
                </span>

                <span className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-800 mb-3">
                {calc.title}
              </h2>

              {/* Description */}
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                {calc.desc}
              </p>
            </Link>
          ))}
        </section>

        {/* SEO Content */}
        <SectionCard>
          <Article title="왜 주식 계산기가 필요한가요?">
            <p>
              투자에 실패하는 가장 큰 이유는 <strong>감정적 판단</strong>입니다.
              주가가 떨어지면 공포 매도를 하고, 상승하면 욕심으로 타이밍을 놓칩니다.
            </p>
            <p>
              이 계산기들은 복잡한 엑셀 없이 핵심 투자 지표를 즉시 계산하여
              기계적이고 객관적인 투자 판단을 가능하게 합니다.
            </p>
          </Article>

          <Article title="계산 결과 활용법 안내">
            <p>
              본 사이트의 계산 결과는 참고용입니다.
              실제 투자에서는 수수료, 세금, 슬리피지 등에 따라 결과가 달라질 수 있습니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}