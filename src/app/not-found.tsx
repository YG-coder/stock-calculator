import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Shared";
import { CALCULATORS, HEADER_CALCULATORS } from "@/lib/constants";

export const metadata: Metadata = {
    title: "페이지를 찾을 수 없습니다",
    description:
        "요청하신 페이지가 없거나 주소가 변경되었습니다. 주식계산기.kr의 계산기 목록에서 필요한 도구를 찾아보세요.",
    // Next 가 not-found 응답에 noindex 를 자동으로 넣지만, 이를 지정하지 않으면
    // 루트 레이아웃의 robots(index, follow)를 상속해 상충하는 태그가 함께 나온다.
    // 명시해서 두 태그의 방향을 일치시킨다.
    robots: { index: false, follow: true },
};

const POPULAR = [
    "/profit-calculator",
    "/average-price-calculator",
    "/compound-interest-calculator",
    "/dividend-calculator",
    "/crypto/liquidation",
];

export default function NotFound() {
    const popular = POPULAR.map((href) =>
        CALCULATORS.find((c) => c.href === href)
    ).filter((c): c is NonNullable<typeof c> => Boolean(c));

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <PageHeader
                badge="404"
                title="페이지를 찾을 수 없습니다"
                description="요청하신 주소가 없거나 변경되었을 수 있습니다. 아래에서 필요한 계산기를 찾아보세요."
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
                <section aria-labelledby="popular-heading">
                    <h2 id="popular-heading" className="text-lg font-bold text-slate-900">
                        많이 찾는 계산기
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {popular.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="sections-heading" className="mt-12">
                    <h2 id="sections-heading" className="text-lg font-bold text-slate-900">
                        전체 메뉴
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-3">
                        {HEADER_CALCULATORS.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <p className="mt-12 text-sm leading-relaxed text-slate-600">
                    찾으시는 계산기가 없다면{" "}
                    <Link href="/contact" className="font-semibold text-slate-800 underline-offset-2 hover:underline">
                        문의하기
                    </Link>
                    에서 알려주세요. 링크가 잘못되었다면 함께 제보해 주시면 확인하겠습니다.
                </p>
            </div>
        </main>
    );
}
