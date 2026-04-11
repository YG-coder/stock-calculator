import { Metadata } from "next";
import Link from "next/link";
import { SectionCard, Article } from "@/components/ui/Shared";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "미국주식 계산기 모음 | 세금, 수익률, 배당, 복리 계산",
    description:
        "미국주식 투자에 필요한 세금 계산기, 수익률 계산기, 배당 계산기, 복리 계산기를 한 곳에서 확인하세요. 환율과 세금을 반영한 실제 수익을 계산할 수 있습니다.",
    keywords: [
        "미국주식 계산기",
        "미국주식 세금 계산기",
        "미국주식 수익률 계산기",
        "배당 계산기",
        "복리 계산기",
        "S&P500 투자 계산",
    ],
    openGraph: {
        title: "미국주식 계산기 모음 | 투자 필수 툴 허브",
        description:
            "세금, 환율, 배당, 수익률까지 미국주식 투자에 필요한 모든 계산기를 한 곳에서 확인하세요.",
        type: "website",
    },
};

export default function USStocksPage() {
    const order = [
        "/overseas-stock-tax-calculator",
        "/us-stocks/exchange-profit",
        "/us-stocks/dividend",
        "/compound-interest-calculator",
        "/dividend-calculator",
        "/average-price-calculator",
    ];

    const calculators = CALCULATORS
        .filter((c) => c.groups?.includes("us-stocks"))
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
                        세금, 수익률, 배당, 복리 계산까지 미국주식 투자에 필요한 핵심 계산기를
                        한 곳에서 빠르게 확인하세요.
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
                            미국주식은 국내주식과 달리 환율, 세금, 배당 원천징수가 실제 수익에 큰 영향을 미칩니다.
                        </p>
                        <p>
                            따라서 단순 수익률만 보는 것이 아니라 세후 수익과 원화 기준 수익까지 함께 계산하는 것이 중요합니다.
                        </p>
                    </Article>

                    <Article title="미국주식 계산기 활용 방법">
                        <p>
                            투자 전에는 세금 계산기를 통해 실제 세후 수익을 확인하고, 수익 계산기와 복리 계산기를 통해 장기 투자 시 예상 자산 증가를 확인하는 것이 좋습니다.
                        </p>
                        <p>
                            특히 S&P500 ETF 투자처럼 장기 투자에서는 복리 효과가 매우 중요합니다.
                        </p>
                    </Article>

                    <Article title="미국주식 투자 시 주의사항">
                        <p>
                            환율 변동과 세금은 수익률에 큰 영향을 미치므로 항상 보수적인 기준으로 투자 판단을 해야 합니다.
                        </p>
                    </Article>
                </SectionCard>
            </div>
        </main>
    );
}