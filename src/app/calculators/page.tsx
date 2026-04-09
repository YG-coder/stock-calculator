import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "주식 계산기 모음 | 수익률, 평단가, 손절가, 배당 계산기",
    description:
        "주식 수익률 계산기, 물타기 평단가 계산기, 손절가 계산기, 목표가 계산기, 본전 회복 계산기, 손익비 계산기, 포지션 사이즈 계산기, 배당 수익 계산기를 한 곳에서 확인하세요.",
    alternates: {
        canonical: "https://주식계산기.kr/calculators",
    },
};

export default function CalculatorsPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-6 py-16 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        전체 주식 계산기 모음
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-slate-500">
                        주식 수익률 계산기, 물타기 평단가 계산기, 손절가 계산기, 목표가 계산기,
                        본전 회복 계산기, 손익비 계산기, 포지션 사이즈 계산기, 배당 수익 계산기를 한 곳에서 확인하세요.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 py-12">
                <div className="grid gap-6 sm:grid-cols-2">
                    {CALCULATORS.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {calc.badge}
                            </div>
                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                                {calc.title}
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-slate-500">
                                {calc.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}