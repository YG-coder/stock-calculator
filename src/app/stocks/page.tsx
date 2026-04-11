import { Metadata } from "next";
import Link from "next/link";
import { SectionCard, Article } from "@/components/ui/Shared";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "주식 계산기 모음 | 수익률, 평단가, 손절가, 목표가, 배당, 복리 계산",
    description:
        "국내주식 투자에 필요한 수익률 계산기, 평단가 계산기, 손절가 계산기, 목표가 계산기, 배당 수익 계산기, 복리 계산기를 한 곳에서 확인하세요.",
    keywords: [
        "주식 계산기",
        "국내주식 계산기",
        "수익률 계산기",
        "평단가 계산기",
        "손절가 계산기",
        "목표가 계산기",
        "배당 계산기",
        "복리 계산기",
    ],
    openGraph: {
        title: "주식 계산기 모음 | 국내주식 투자 필수 툴 허브",
        description:
            "국내주식 투자에 필요한 핵심 계산기를 한 곳에서 빠르게 확인하세요.",
        type: "website",
    },
};

export default function StocksPage() {
    const order = [
        "/profit-calculator",
        "/average-price-calculator",
        "/target-price-calculator",
        "/stop-loss-calculator",
        "/break-even-calculator",
        "/risk-reward-calculator",
        "/position-size-calculator",
        "/dividend-calculator",
        "/compound-interest-calculator",
    ];

    const calculators = CALCULATORS
        .filter((c) => c.groups?.includes("stocks"))
        .sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <section className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 mb-6">
                        국내주식 투자 필수 도구
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        주식 계산기 모음
                    </h1>
                    <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
                        수익률, 평단가, 손절가, 목표가, 본전 회복, 손익비, 포지션 사이즈,
                        배당, 복리 계산까지 국내주식 투자에 필요한 핵심 계산기를 한 곳에서 빠르게 확인하세요.
                    </p>
                </div>
            </section>

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

                <SectionCard>
                    <Article title="주식 계산기가 왜 필요한가요?">
                        <p>
                            국내주식 투자에서 가장 흔한 실수는 감정으로 매매하는 것입니다.
                            숫자를 기준으로 수익률, 손절가, 목표가, 손익비를 먼저 계산해두면
                            매수와 매도 판단을 더 객관적으로 할 수 있습니다.
                        </p>
                        <p>
                            특히 분할 매수, 물타기, 손절 기준 설정, 배당주 투자처럼 여러 요소가
                            동시에 얽히는 경우에는 계산기를 활용해 리스크와 기대 수익을 함께
                            보는 것이 중요합니다.
                        </p>
                    </Article>

                    <Article title="주식 계산기 활용 방법">
                        <p>
                            매매 전에는 목표가 계산기와 손절가 계산기로 기준 가격을 먼저 정하고,
                            매수 후에는 수익률 계산기와 평단가 계산기로 현재 포지션 상태를 점검하는
                            방식이 가장 실용적입니다.
                        </p>
                        <p>
                            장기 투자자는 배당 계산기와 복리 계산기를 함께 활용하면 배당금 흐름과
                            장기 자산 증가 효과를 더 구체적으로 확인할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="국내주식 투자 시 주의사항">
                        <p>
                            계산 결과는 참고용이며 실제 수익은 수수료, 세금, 체결 가격,
                            시장 변동성에 따라 달라질 수 있습니다. 항상 보수적인 기준으로
                            투자 판단을 하는 것이 좋습니다.
                        </p>
                    </Article>
                </SectionCard>
            </div>
        </main>
    );
}