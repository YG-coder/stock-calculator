import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata, BASE_URL, SITE_NAME } from "@/lib/metadata";
import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    Disclaimer,
} from "@/components/ui/Shared";
import {
    getGuide,
    getPublishedGuides,
    getGuide as lookupGuide,
    visibleFaqs,
    visibleSections,
    withheldItems,
} from "@/data/guidePages";
import { ReviewNote } from "@/components/ui/SourceNote";
import {
    effectiveReviewStatus,
    isIndexableStatus,
} from "@/lib/contentReview";
import { assertContentGate, guideSectionAnchor } from "@/lib/contentGate";

/** 발행됐고 Provisional 이 아닌 문서만 색인 대상이다. */
function isIndexable(slug: string): boolean {
    const guide = getGuide(slug);
    if (!guide || !guide.published) return false;
    return isIndexableStatus(effectiveReviewStatus(guide.review));
}

type Params = { slug: string };

// 발행된 가이드는 모두 라우트를 만든다.
// Provisional 문서도 직접 URL 로는 열리되, 메타데이터에서 noindex 로 처리한다
// (사이트맵 제외만으로는 색인 금지를 보장하지 못한다).
export function generateStaticParams(): Params[] {
    // 빌드 단계 차단 지점.
    assertContentGate();
    return getPublishedGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) return buildMetadata({ title: "가이드", description: "투자 가이드" });

    const base = buildMetadata({
        title: guide.title,
        description: guide.description,
        path: `/guides/${guide.slug}`,
        keywords: guide.keywords,
    });

    // 근거가 확정되지 않은 문서는 색인·수집 대상에서 빼고 구조화 데이터도 붙이지 않는다.
    if (!isIndexable(slug)) {
        return { ...base, robots: { index: false, follow: false } };
    }
    return base;
}

/** Article + Breadcrumb 구조화 데이터 */
function GuideJsonLd({ slug }: { slug: string }) {
    const guide = getGuide(slug);
    if (!guide) return null;
    // 색인하지 않는 문서에 Article·FAQ 구조화 데이터를 붙이지 않는다.
    if (!isIndexable(slug)) return null;

    const url = `${BASE_URL}/guides/${guide.slug}`;

    const graph: Record<string, unknown>[] = [
        {
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            inLanguage: "ko-KR",
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
            publisher: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "홈", item: BASE_URL },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "투자 가이드",
                    item: `${BASE_URL}/guides`,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: guide.title,
                    item: url,
                },
            ],
        },
    ];

    const faqs = visibleFaqs(guide);
    if (faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        });
    }

    const data = { "@context": "https://schema.org", "@graph": graph };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default async function GuideDetailPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { slug } = await params;
    const guide = getGuide(slug);

    if (!guide || !guide.published) {
        notFound();
    }

    // 같은 클러스터 가이드 (가이드 ↔ 가이드), 발행된 것만
    const relatedGuides = (guide.relatedGuides ?? [])
        .map((s) => lookupGuide(s))
        .filter((g): g is NonNullable<typeof g> => !!g && isIndexable(g.slug));

    const status = effectiveReviewStatus(guide.review);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <GuideJsonLd slug={guide.slug} />

            <PageHeader
                badge={guide.badge}
                title={guide.title}
                description={guide.intro}
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                {/* breadcrumb (가시) */}
                <nav className="mb-8 text-sm text-slate-500">
                    <Link href="/" className="hover:text-slate-900">
                        홈
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/guides" className="hover:text-slate-900">
                        투자 가이드
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-700">{guide.cluster}</span>
                </nav>

                {status === "Provisional" ? (
                    <div
                        role="note"
                        className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-relaxed text-rose-900"
                    >
                        <p className="font-semibold">근거가 확정되지 않은 문서입니다.</p>
                        <p className="mt-1">
                            공식 출처 확인이 끝나지 않아 검색엔진 색인에서 제외돼 있습니다.
                            내용을 실제 판단 근거로 쓰지 마시고, 공식 자료를 직접 확인하세요.
                        </p>
                    </div>
                ) : null}

                {/* SOP-001: 결론 → 기준/체크리스트 → 상세 절차 */}
                {guide.actionSummary ? (
                    <section
                        aria-labelledby="action-summary-heading"
                        className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <h2
                            id="action-summary-heading"
                            className="text-lg font-bold text-slate-900"
                        >
                            결론부터
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                            {guide.actionSummary.conclusion}
                        </p>

                        <p className="mt-5 text-sm font-semibold text-slate-700">지금 할 일</p>
                        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                            {guide.actionSummary.doNow.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ol>

                        {guide.actionSummary.conditions?.length ? (
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full min-w-[320px] text-sm">
                                    <caption className="sr-only">적용 조건 요약</caption>
                                    <tbody>
                                        {guide.actionSummary.conditions.map((row) => (
                                            <tr
                                                key={row.label}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap py-2 pr-4 text-left font-medium text-slate-500"
                                                >
                                                    {row.label}
                                                </th>
                                                <td className="py-2 text-slate-800">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </section>
                ) : null}

                <SectionCard>
                    {visibleSections(guide).map((section) => (
                        <Article key={section.heading} title={section.heading}>
                            <span id={guideSectionAnchor(section.heading)} className="sr-only" />
                            {section.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </Article>
                    ))}
                </SectionCard>

                {visibleFaqs(guide).length > 0 ? (
                    <FaqSection title="자주 묻는 질문 (FAQ)">
                        {visibleFaqs(guide).map((faq) => (
                            <FaqItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </FaqSection>
                ) : null}

                {/* Decision Handoff — 계산·판단 뒤에 이어지는 실제 행동 */}
                {guide.nextSteps ? (
                    <section
                        aria-labelledby="next-steps-heading"
                        className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <h2 id="next-steps-heading" className="text-lg font-bold text-slate-900">
                            {guide.nextSteps.heading}
                        </h2>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                            {guide.nextSteps.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span aria-hidden="true" className="text-slate-400">
                                        □
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        {guide.nextSteps.note ? (
                            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                {guide.nextSteps.note}
                            </p>
                        ) : null}
                    </section>
                ) : null}

                {/* 가이드 → 계산기 (CTA) */}
                {guide.relatedCalculators && guide.relatedCalculators.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">
                            관련 계산기로 직접 계산해보기
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {guide.relatedCalculators.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {item.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}

                {/* 가이드 ↔ 가이드 (같은 클러스터) */}
                {relatedGuides.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">
                            함께 읽으면 좋은 가이드
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {relatedGuides.map((g) => (
                                <Link
                                    key={g.slug}
                                    href={`/guides/${g.slug}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        {g.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {g.summary}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}

                <ReviewNote review={guide.review} withheld={withheldItems(guide)} />

                <Disclaimer />
            </div>
        </main>
    );
}
