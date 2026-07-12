import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
    PageHeader,
    Disclaimer,
} from "@/components/ui/Shared";
import {
    GUIDE_CLUSTERS,
    getGuidesByCluster,
} from "@/data/guidePages";

export const metadata = buildMetadata({
    title: "투자 가이드",
    description:
        "평단가, 손절, 복리, 세금 등 투자에 필요한 기본 개념을 정리한 가이드 모음입니다. 계산기와 함께 활용해보세요.",
    path: "/guides",
    keywords: [
        "투자 가이드",
        "주식 기초",
        "평단가",
        "손절",
        "복리 투자",
        "배당소득세",
    ],
});

export default function GuidesHubPage() {
    const grouped = getGuidesByCluster(true);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge="투자 가이드"
                title="투자 가이드"
                description="계산기만으로는 알기 어려운 '왜'와 '어떻게'를 정리했습니다. 평단가·손절·복리·세금 같은 기본 개념을 주제별로 묶어 두었습니다."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                <div className="space-y-12">
                    {GUIDE_CLUSTERS.map((cluster) => {
                        const guides = grouped[cluster.name] ?? [];
                        if (guides.length === 0) return null;

                        return (
                            <section key={cluster.name}>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        {cluster.name}
                                    </h2>
                                    <p className="mt-2 text-slate-500">{cluster.desc}</p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {guides.map((guide) => (
                                        <Link
                                            key={guide.slug}
                                            href={`/guides/${guide.slug}`}
                                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                        >
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {guide.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                {guide.summary}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <Disclaimer />
            </div>
        </main>
    );
}
