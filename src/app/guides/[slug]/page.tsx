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
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";
import {
    getGuide,
    getPublishedGuides,
    getGuide as lookupGuide,
} from "@/data/guidePages";

type Params = { slug: string };

// 발행된 가이드만 정적 생성
export function generateStaticParams(): Params[] {
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

    return buildMetadata({
        title: guide.title,
        description: guide.description,
        path: `/guides/${guide.slug}`,
        keywords: guide.keywords,
    });
}

/** Article + Breadcrumb 구조화 데이터 */
function GuideJsonLd({ slug }: { slug: string }) {
    const guide = getGuide(slug);
    if (!guide) return null;

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

    if (guide.faqs && guide.faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((f) => ({
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
        .filter((g): g is NonNullable<typeof g> => !!g && g.published);

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

                <SectionCard>
                    {guide.sections.map((section) => (
                        <Article key={section.heading} title={section.heading}>
                            {section.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </Article>
                    ))}
                </SectionCard>

                {guide.faqs && guide.faqs.length > 0 ? (
                    <FaqSection title="자주 묻는 질문 (FAQ)">
                        {guide.faqs.map((faq) => (
                            <FaqItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </FaqSection>
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

                <Disclaimer />
            </div>
        </main>
    );
}
