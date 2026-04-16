import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CALCULATORS } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "주식계산기 | 무료 투자 계산기",
  description:
      "주식 수익률 계산기, 평단가 계산기, 손절가 계산기, 목표가 계산기, 배당 계산기 등 투자에 필요한 계산기를 무료로 제공합니다.",
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

export default function HomePage() {
  const featuredCalculators = CALCULATORS.filter(
      (item) => item.kind === "calculator" && item.featured
  ).slice(0, 6);

  const fallbackCalculators =
      featuredCalculators.length > 0
          ? featuredCalculators
          : CALCULATORS.filter((item) => item.kind === "calculator").slice(0, 6);

  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-tight text-slate-600">
            무료 투자 계산기
          </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
              투자 판단에 필요한 계산을
              <br className="hidden sm:block" />한 번에 확인하세요
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              주식계산기.kr은 수익률 계산, 평단가 계산, 손절가 계산, 목표가 계산,
              손익비 분석, 배당 수익 계산 등 투자자가 자주 사용하는 계산을 웹에서
              빠르게 확인할 수 있도록 만든 무료 계산기 사이트입니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                  href="/calculators"
                  className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                전체 계산기 보기
              </Link>

              <Link
                  href="/profit-calculator"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                대표 계산기 바로가기
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">대표 계산기</h2>
              <p className="mt-2 text-sm text-slate-600">
                자주 사용하는 핵심 계산기를 먼저 확인해보세요.
              </p>
            </div>

            <Link
                href="/calculators"
                className="text-sm font-semibold text-slate-700 underline-offset-2 hover:underline"
            >
              전체 계산기 보기
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fallbackCalculators.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.desc}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {item.badge}
                </span>
                  </div>

                  <div className="mt-4 text-sm font-semibold text-slate-800">
                    계산기 열기 →
                  </div>
                </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-2 md:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold tracking-tight">
              주식계산기.kr은 어떤 사이트인가요?
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                주식계산기.kr은 투자 과정에서 자주 필요한 계산을 빠르게 확인할 수
                있도록 만든 계산기 중심 사이트입니다. 단순히 숫자만 보여주는 것이
                아니라, 계산 결과를 어떻게 해석해야 하는지 이해를 돕기 위한 안내
                문구와 관련 계산기 링크도 함께 제공합니다.
              </p>
              <p>
                예를 들어 추가 매수 후 평단가를 다시 계산하고, 그 값을 기준으로
                수익률을 확인한 뒤, 목표가와 손절가를 함께 정하는 식으로 여러
                계산기를 연결해 활용할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
  );
}