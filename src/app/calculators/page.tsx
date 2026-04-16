import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CALCULATORS } from "@/lib/constants";

export const metadata = buildMetadata({
    title: "전체 계산기",
    description:
        "주식 수익률 계산기, 평단가 계산기, 손절가 계산기, 목표가 계산기, 손익비 계산기, 배당 계산기 등 주식계산기.kr의 전체 계산기를 한 곳에서 확인할 수 있습니다.",
    path: "/calculators",
    keywords: [
        "전체 계산기",
        "주식 계산기 모음",
        "주식 계산기",
        "수익률 계산기",
        "평단가 계산기",
        "손절가 계산기",
    ],
});

const STOCK_GROUP_LABEL = "국내 주식 계산기";
const US_STOCK_GROUP_LABEL = "미국 주식 계산기";
const CRYPTO_GROUP_LABEL = "코인 계산기";
const COMMON_GROUP_LABEL = "공용 계산기";

type GroupLabel =
    | typeof STOCK_GROUP_LABEL
    | typeof US_STOCK_GROUP_LABEL
    | typeof CRYPTO_GROUP_LABEL
    | typeof COMMON_GROUP_LABEL;

function getGroupLabel(groups?: ("stocks" | "crypto" | "us-stocks")[]): GroupLabel {
    if (!groups || groups.length === 0) return COMMON_GROUP_LABEL;
    if (groups.includes("stocks")) return STOCK_GROUP_LABEL;
    if (groups.includes("us-stocks")) return US_STOCK_GROUP_LABEL;
    if (groups.includes("crypto")) return CRYPTO_GROUP_LABEL;
    return COMMON_GROUP_LABEL;
}

export default function CalculatorsPage() {
    const calculatorItems = CALCULATORS.filter((item) => item.kind === "calculator");

    const grouped: Record<GroupLabel, typeof calculatorItems> = {
        [STOCK_GROUP_LABEL]: calculatorItems.filter(
            (item) => getGroupLabel(item.groups) === STOCK_GROUP_LABEL
        ),
        [US_STOCK_GROUP_LABEL]: calculatorItems.filter(
            (item) => getGroupLabel(item.groups) === US_STOCK_GROUP_LABEL
        ),
        [CRYPTO_GROUP_LABEL]: calculatorItems.filter(
            (item) => getGroupLabel(item.groups) === CRYPTO_GROUP_LABEL
        ),
        [COMMON_GROUP_LABEL]: calculatorItems.filter(
            (item) => getGroupLabel(item.groups) === COMMON_GROUP_LABEL
        ),
    };

    const allGroups = [
        STOCK_GROUP_LABEL,
        US_STOCK_GROUP_LABEL,
        CRYPTO_GROUP_LABEL,
        COMMON_GROUP_LABEL,
    ] as const satisfies readonly GroupLabel[];

    const orderedGroups = allGroups.filter(
        (groupName): groupName is GroupLabel => grouped[groupName].length > 0
    );

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-16">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-tight text-slate-600">
            계산기 허브
          </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                        전체 계산기
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                        주식계산기.kr에서 제공하는 전체 계산기를 한 곳에서 확인할 수 있습니다.
                        수익률 계산, 평단가 계산, 손절가 계산, 목표가 계산, 손익비 분석,
                        배당 수익 계산 등 투자 판단에 필요한 핵심 계산기를 빠르게 찾아볼 수
                        있습니다.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            홈으로 가기
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
                <div className="space-y-12">
                    {orderedGroups.map((groupName) => (
                        <section key={groupName}>
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{groupName}</h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {groupName === STOCK_GROUP_LABEL &&
                                            "국내 주식 투자에 자주 사용하는 계산기를 모았습니다."}
                                        {groupName === US_STOCK_GROUP_LABEL &&
                                            "미국 주식 투자와 세금 계산에 활용할 수 있는 계산기입니다."}
                                        {groupName === CRYPTO_GROUP_LABEL &&
                                            "코인 및 가상자산 투자에 활용할 수 있는 계산기입니다."}
                                        {groupName === COMMON_GROUP_LABEL &&
                                            "시장 구분 없이 공통으로 활용 가능한 계산기입니다."}
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {grouped[groupName].length}개
                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {grouped[groupName].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700">
                                                    {item.title}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {item.badge}
                      </span>
                                        </div>

                                        <div className="mt-4 text-sm font-semibold text-slate-800">
                                            계산기 열기 →
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-4 md:px-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-bold tracking-tight">전체 계산기 페이지 안내</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        이 페이지는 주식계산기.kr의 전체 계산기 허브입니다. 각 계산기는 서로
                        연결되어 있어 평단가 계산 후 수익률 계산기로 이동하거나, 손절가 계산 후
                        손익비 계산기로 이어서 확인하는 식으로 활용할 수 있습니다. 투자 판단은
                        반드시 본인의 책임 아래 진행해야 하며, 계산 결과는 참고용으로 활용하는
                        것이 좋습니다.
                    </p>
                </div>
            </section>
        </main>
    );
}