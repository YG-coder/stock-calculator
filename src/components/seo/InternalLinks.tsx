import Link from "next/link";

const ALL_CALCULATORS = [
    { href: "/profit-calculator", label: "주식 수익률 계산기" },
    { href: "/average-price-calculator", label: "평단가 계산기" },
    { href: "/target-price-calculator", label: "목표가 계산기" },
    { href: "/stop-loss-calculator", label: "손절가 계산기" },
    { href: "/break-even-calculator", label: "본전 회복 계산기" },
    { href: "/risk-reward-calculator", label: "손익비 계산기" },
    { href: "/position-size-calculator", label: "포지션 사이즈 계산기" },
    { href: "/dividend-calculator", label: "배당 수익 계산기" },
    { href: "/compound-interest-calculator", label: "복리 계산기" },
    { href: "/overseas-stock-tax-calculator", label: "해외주식 세금 계산기" },
];

type Props = {
    /** 현재 페이지 경로 — 내 링크는 목록에서 제외 */
    currentPath?: string;
};

export default function InternalLinks({ currentPath }: Props) {
    const links = ALL_CALCULATORS.filter((c) => c.href !== currentPath).slice(0, 6);

    return (
        <nav aria-label="관련 계산기 바로가기" className="mt-10 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">다른 계산기 바로가기</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
                {links.map((c) => (
                    <li key={c.href}>
                        <Link href={c.href} className="text-blue-600 hover:underline">
                            {c.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
