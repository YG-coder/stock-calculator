import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "코인 계산기 모음 | 청산가, 수익률, 물타기 계산기",
    description:
        "비트코인, 이더리움 등 암호화폐 투자에 필요한 청산가 계산기, 수익 계산기, 물타기 계산기를 한 곳에서 확인하세요.",
    alternates: {
        canonical: "https://주식계산기.kr/crypto",
    },
};

const calculators = [
    {
        title: "코인 청산가 계산기",
        desc: "레버리지 사용 시 예상 청산 가격을 계산합니다.",
        href: "/crypto/liquidation",
    },
    {
        title: "코인 수익 계산기",
        desc: "매수/매도 가격과 수수료 기준 실제 수익률을 계산합니다.",
        href: "/crypto/profit",
    },
    {
        title: "코인 물타기 계산기",
        desc: "추가 매수 시 평균 단가를 계산합니다.",
        href: "/crypto/average",
    },
];

export default function CryptoPage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-16">
            <h1 className="text-3xl font-bold mb-6 md:text-4xl">코인 계산기 모음</h1>

            <p className="mb-12 leading-relaxed text-slate-600">
                암호화폐 투자 시 반드시 필요한 핵심 계산기들을 한 곳에 모았습니다.
                레버리지 청산가, 수익률 계산, 물타기 계산까지 빠르게 확인하세요.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                {calculators.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-2xl border border-slate-200 p-6 transition hover:shadow-lg"
                    >
                        <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                    </Link>
                ))}
            </div>

            <section className="mt-16 text-sm leading-relaxed text-slate-600">
                <h2 className="mb-3 text-lg font-semibold">코인 계산기가 필요한 이유</h2>
                <p>
                    암호화폐 시장은 변동성이 크고 레버리지를 자주 사용하기 때문에,
                    진입 전에 수익률과 청산 가격을 정확하게 계산하는 것이 중요합니다.
                    코인 계산기 허브를 통해 필요한 도구를 빠르게 선택할 수 있습니다.
                </p>
            </section>
        </main>
    );
}