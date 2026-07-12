/**
 * src/components/seo/GuideLinks.tsx
 *
 * 계산기 페이지 → 관련 투자 가이드로 보내는 역방향 내부 링크 블록.
 *
 * 사용:
 *   <GuideLinks slugs={["stop-loss-ratio"]} />
 *   <GuideLinks slugs={["average-price-meaning", "when-not-to-average-down"]} />
 *
 * 가이드 제목/요약은 guidePages.ts에서 직접 읽어오므로,
 * 가이드 내용이 바뀌면 링크 텍스트도 자동으로 따라갑니다(단일 출처 유지).
 * 발행되지 않았거나(slug published:false) 존재하지 않는 가이드는 자동 제외됩니다.
 */

import Link from "next/link";
import { getGuide } from "@/data/guidePages";

type Props = {
    slugs: string[];
    title?: string;
};

export default function GuideLinks({
    slugs,
    title = "함께 읽으면 좋은 투자 가이드",
}: Props) {
    const guides = slugs
        .map((s) => getGuide(s))
        .filter((g): g is NonNullable<typeof g> => !!g && g.published);

    if (guides.length === 0) return null;

    return (
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <span aria-hidden>📘</span>
                {title}
            </h2>
            <ul className="space-y-3">
                {guides.map((g) => (
                    <li key={g.slug}>
                        <Link
                            href={`/guides/${g.slug}`}
                            className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                        >
                            <span className="font-semibold text-slate-900 group-hover:text-slate-700">
                                {g.title}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                                {g.summary}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
