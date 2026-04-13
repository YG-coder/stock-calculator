import { Metadata } from "next";
import Link from "next/link";
import { SectionCard, Article } from "@/components/ui/Shared";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "미국주식 계산기 모음 | 세금, 환율, 배당 계산",
    description:
        "미국주식 투자에 필요한 세금 계산기, 환율 수익 계산기, 배당 계산기를 한 곳에서 확인하세요. 실제 세후 수익과 환율 영향을 반영한 계산이 가능합니다.",
    keywords: [
        "미국주식 계산기",
        "해외주식 세금 계산기",
        "환율 수익 계산기",
        "미국주식 배당 계산기",
        "달러 투자 계산",
    ],
    openGraph: {
        title: "미국주식 계산기 모음 | 투자 필수 툴 허브",
        description:
            "세금, 환율, 배당까지 미국주식 투자에 필요한 핵심 계산기를 한 곳에서 확인하세요.",
        type: "website",
    },
};

export default function USStocksPage() {
    const order = [
        "/overseas-stock-tax-calculator",
        "/us-stocks/exchange-profit",
        "/us-stocks/dividend",
    ];

    // ✅ 미국 전용만 (공용 제외)
    const calculators = CALCULATORS
        .filter(
            (c) =>
                c.kind === "calculator" &&
                c.groups?.includes("us-stocks") &&
                !c.isCommon
        )
        .sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* 헤더 */}
            <section className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 mb-6">
                        미국주식 투자 필수 도구
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        미국주식 계산기 모음
                    </h1>
                    <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
                        세금, 환율, 배당까지 미국주식 투자에 필요한 핵심 계산기를 한 곳에서 빠르게 확인하세요.
                    </p>
                </div>
            </section>

            {/* 계산기 리스트 */}
            <div className="mx-auto max-w-5xl px-6 py-16">
                <section className="grid gap-6 sm:grid-cols-2 mb-16">
                    {calculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <div className="flex justify-between mb-4">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    {calc.badge}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-2">{calc.title}</h2>
                            <p className="text-sm text-slate-500">{calc.desc}</p>
                        </Link>
                    ))}
                </section>

                {/* SEO 콘텐츠 */}
                <SectionCard>
                    <Article title="미국주식 계산기가 왜 필요한가요?">
                        <p>
                            미국주식은 국내주식과 달리 <strong>환율과 세금</strong>이 수익에 큰 영향을 미칩니다.
                        </p>
                        <p>
                            단순 수익률이 아닌 세후 수익과 환율까지 반영한 실제 수익을 확인하는 것이 중요합니다.
                        </p>
                    </Article>

                    <Article title="미국주식 계산기 활용 방법">
                        <p>
                            투자 전에는 세금 계산기로 실제 수익을 확인하고, 환율 계산기를 통해 환차익까지 고려해야 합니다.
                        </p>
                        <p>
                            배당 투자자는 배당 계산기를 활용해 세후 배당 수익을 반드시 확인해야 합니다.
                        </p>
                    </Article>

                    <Article title="미국주식 투자 시 주의사항">
                        <p>
                            환율 변동과 세금은 수익률에 큰 영향을 미치므로 항상 보수적으로 투자 판단을 해야 합니다.
                        </p>
                    </Article>
                </SectionCard>
            </div>
        </main>
    );
}