/**
 * SEO + 애드센스 승인용 콘텐츠 컴포넌트 (페이지별 고유 콘텐츠 버전)
 */

import Link from "next/link";

export type SeoContentRelatedLink = {
    href: string;
    label: string;
};

type Props = {
    title: string;
    intro: string;
    body?: string;
    formula?: string;
    formulaNote?: string;
    whenToUse: string;
    example: string;
    caution?: string;
    relatedLinks?: SeoContentRelatedLink[];
};

export default function SeoContent({
    title,
    intro,
    body,
    formula,
    formulaNote,
    whenToUse,
    example,
    caution,
    relatedLinks,
}: Props) {
    return (
        <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
            <h2 className="text-xl font-bold text-slate-800">{title}에 대해 더 알아보기</h2>

            <p>{intro}</p>

            {body && <p>{body}</p>}

            {formula && (
                <>
                    <h3 className="text-base font-semibold text-slate-800">계산 공식</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-slate-700">
                        {formula}
                    </div>
                    {formulaNote && <p>{formulaNote}</p>}
                </>
            )}

            <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
            <p>{whenToUse}</p>

            <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
            <p>{example}</p>

            {caution && (
                <>
                    <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                    <p>{caution}</p>
                </>
            )}

            {relatedLinks && relatedLinks.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                    <p className="font-semibold text-slate-700 mb-2">함께 사용하면 좋은 계산기</p>
                    <ul className="space-y-1">
                        {relatedLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-blue-600 hover:underline">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
