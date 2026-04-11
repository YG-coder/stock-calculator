import { Metadata } from "next";
import Link from "next/link";
import { SectionCard, Article } from "@/components/ui/Shared";
import { CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "코인 계산기 모음 | 청산가, 수익률, 레버리지, 물타기 계산기",
    description:
        "비트코인, 이더리움 등 암호화폐 투자에 필요한 청산가 계산기, 레버리지 수익 계산기, 수익률 계산기, 펀딩비 계산기, 물타기 계산기를 한 곳에서 확인하세요.",
    keywords: [
        "코인 계산기",
        "비트코인 계산기",
        "청산가 계산기",
        "레버리지 계산기",
        "코인 수익 계산기",
        "펀딩비 계산기",
        "물타기 계산기",
    ],
    openGraph: {
        title: "코인 계산기 모음 | 투자 필수 툴 허브",
        description:
            "암호화폐 투자에 필요한 모든 계산기를 한 곳에서 빠르게 사용하세요.",
        type: "website",
    },
};

export default function CryptoPage() {
    const order = [
        "/crypto/entry",
        "/crypto/liquidation",
        "/crypto/leverage-profit",
        "/crypto/profit",
        "/crypto/funding-fee",
        "/crypto/average",
    ];

    const calculators = CALCULATORS
        .filter((c) => c.hubs?.includes("crypto"))
        .sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* 헤더 */}
            <section className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 mb-6">
                        암호화폐 투자 필수 도구
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        코인 계산기 모음
                    </h1>
                    <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
                        청산가, 수익률, 레버리지, 펀딩비, 물타기 계산기까지
                        암호화폐 투자에 필요한 핵심 계산기를 한 곳에서 빠르게 확인하세요.
                    </p>
                </div>
            </section>

            {/* 계산기 리스트 */}
            <div className="mx-auto max-w-5xl px-6 py-16">
                <section className="grid gap-6 sm:grid-cols-2 mb-16">
                    {calculators.map(
                        (calc) => (
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
                        )
                    )}
                </section>

                {/* SEO 콘텐츠 */}
                <SectionCard>
                    <Article title="코인 계산기가 왜 필요한가요?">
                        <p>
                            암호화폐 시장은 변동성이 매우 크기 때문에 감정적인 판단으로
                            투자하면 큰 손실로 이어질 수 있습니다.
                        </p>
                        <p>
                            특히 레버리지 거래에서는 작은 가격 변동에도 손익이 크게
                            확대되므로, 청산가와 수익 구조를 미리 계산하는 것이 중요합니다.
                        </p>
                    </Article>

                    <Article title="코인 계산기 활용 방법">
                        <p>
                            투자 전에는 청산가 계산기를 통해 위험 구간을 확인하고,
                            수익 계산기와 레버리지 계산기를 통해 예상 수익 구조를
                            미리 점검하는 것이 좋습니다.
                        </p>
                        <p>
                            또한 펀딩비 계산기를 활용하면 장기 포지션 유지 시 발생하는
                            추가 비용까지 고려할 수 있습니다.
                        </p>
                    </Article>

                    <Article title="코인 투자 시 주의사항">
                        <p>
                            레버리지는 수익을 크게 늘릴 수 있지만 동시에 손실도 빠르게
                            확대됩니다. 따라서 항상 손절 기준을 설정하고,
                            계산기를 활용해 리스크를 관리하는 것이 중요합니다.
                        </p>
                    </Article>
                </SectionCard>
            </div>
        </main>
    );
}