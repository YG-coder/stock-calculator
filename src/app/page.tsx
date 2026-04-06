import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "주식 계산기 모음 | 손절가, 평단가, 수익률 계산기",
  description:
    "손절가, 평단가, 수익률을 한 번에 계산할 수 있는 주식 계산기 사이트입니다. 실전 투자에 바로 활용 가능한 투자 도구 모음입니다.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            📈 주식 계산기 모음
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            손절가, 평단가, 수익률 계산기를 한 곳에서 사용할 수 있는 투자 도구 모음입니다.
          </p>

          <p className="mt-2 text-slate-500">
            실제 투자에 바로 활용할 수 있는 계산기를 순차적으로 제공합니다.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Link
            href="/stop-loss-calculator"
            className="block rounded-2xl border p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">손절가 계산기</h2>
            <p className="mt-2 text-slate-600">
              손절 라인을 계산하여 손실을 미리 관리할 수 있습니다.
            </p>
          </Link>

          <Link
            href="/average-price-calculator"
            className="block rounded-2xl border p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">평단가 계산기</h2>
            <p className="mt-2 text-slate-600">
              여러 번 매수한 평균 단가를 계산할 수 있습니다.
            </p>
          </Link>

          <div className="rounded-2xl border p-6 opacity-50">
            <h2 className="text-xl font-semibold">수익률 계산기 (준비중)</h2>
            <p className="mt-2 text-slate-600">
              투자 수익률을 계산할 수 있는 기능이 추가될 예정입니다.
            </p>
          </div>

          <div className="rounded-2xl border p-6 opacity-50">
            <h2 className="text-xl font-semibold">물타기 계산기 (준비중)</h2>
            <p className="mt-2 text-slate-600">
              추가 매수 전략 계산 기능이 추가될 예정입니다.
            </p>
          </div>
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold">주식 계산기를 사용하는 이유</h2>

          <p className="text-slate-600 leading-7">
            주식 투자에서 중요한 것은 감정이 아니라 기준입니다. 손절가, 평균 단가,
            수익률을 미리 계산해두면 시장 상황에 흔들리지 않고 안정적으로 대응할 수
            있습니다.
          </p>

          <p className="text-slate-600 leading-7">
            이 사이트는 투자자가 빠르게 판단할 수 있도록 필요한 계산 기능을 단순하게
            제공하는 것을 목표로 합니다.
          </p>
        </section>
      </div>
    </main>
  );
}