// src/app/calculators/page.tsx
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CALCULATORS } from "@/lib/constants";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
    title: "전체 계산기 모음",
    description:
        "수익률 계산기, 평단가 계산기, 손절가 계산기, 손익비 계산기, 배당 계산기 등 주식 투자에 필요한 계산기를 한 곳에서 확인하세요.",
    path: "/calculators",
});

export default function CalculatorsPage() {
    const calculatorItems = CALCULATORS.filter((item) => item.kind === "calculator");

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <PageHeader
                badge="계산기 모음"
                title="전체 계산기"
                description="주식 투자와 리스크 관리에 자주 쓰는 핵심 계산기를 한 곳에서 빠르게 이용할 수 있습니다."
            />

            <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
                <SectionCard>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {calculatorItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-700">
                                        {item.title}
                                    </h2>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {item.badge}
                  </span>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </SectionCard>

                <div className="mt-10 space-y-8">
                    <SectionCard>
                        <Article title="주식 계산기를 활용하면 좋은 점">
                            <p className="mt-2">
                                투자에서는 숫자를 정확하게 보는 습관이 중요합니다. 같은 종목을
                                거래하더라도 누군가는 평단가를 정확히 계산하고, 누군가는 대충
                                감으로 판단합니다. 이 차이가 누적되면 수익과 손실의 차이로 이어질
                                수 있습니다. 주식계산기.kr은 이런 기본 계산을 빠르게 확인할 수
                                있도록 도와줍니다.
                            </p>
                            <p className="mt-3">
                                예를 들어 분할 매수를 반복하는 투자자라면 평균단가 계산기가 매우
                                중요하고, 단기 매매를 하는 경우에는 손절가 계산기와 손익비 계산기가
                                큰 도움이 됩니다. 배당 투자자는 배당 수익률과 예상 배당금을 계산해
                                볼 수 있고, 목표가 계산기를 통해 원하는 수익률에 필요한 매도 가격도
                                확인할 수 있습니다.
                            </p>
                        </Article>
                    </SectionCard>

                    <SectionCard>
                        <Article title="어떤 계산기부터 써야 하나요">
                            <p className="mt-2">
                                처음이라면 가장 많이 쓰는 계산기부터 익히는 것이 좋습니다. 보통은
                                수익률 계산기, 평단가 계산기, 손절가 계산기가 가장 자주 사용됩니다.
                                이미 보유 중인 종목이 있다면 현재 수익률과 평균단가부터 확인하고,
                                신규 매수를 고민 중이라면 손절 기준과 목표 수익률을 함께 계산해 보는
                                방식이 실전적입니다.
                            </p>
                            <p className="mt-3">
                                단순히 계산 결과를 보는 것에서 끝내지 말고, 자신의 투자 원칙과
                                연결해서 활용하는 것이 중요합니다. 예를 들어 손절 기준을 몇 퍼센트로
                                둘지, 목표 수익률을 몇 퍼센트로 잡을지, 물타기 시 추가 매수 규모를
                                어떻게 조절할지 같은 기준을 함께 세우면 계산기가 훨씬 유용해집니다.
                            </p>
                        </Article>
                    </SectionCard>

                    <SectionCard>
                        <Article title="FAQ">
                            <div className="mt-4 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Q1. 계산기 결과는 실제 증권사 앱과 완전히 같나요?
                                    </h3>
                                    <p className="mt-2 text-slate-600">
                                        기본 계산 원리는 같지만, 실제 결과는 수수료, 세금, 체결 가격,
                                        환율 등에 따라 달라질 수 있습니다. 참고용으로 활용하는 것이
                                        좋습니다.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Q2. 모바일에서도 사용할 수 있나요?
                                    </h3>
                                    <p className="mt-2 text-slate-600">
                                        네. 주식계산기.kr은 모바일과 데스크톱 모두에서 사용할 수 있도록
                                        반응형으로 구성되어 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Q3. 입력한 값은 저장되나요?
                                    </h3>
                                    <p className="mt-2 text-slate-600">
                                        대부분의 계산은 브라우저 내에서 처리되며, 회원 데이터처럼 서버에
                                        저장되지 않습니다. 일부 기능은 사용자 편의를 위해 브라우저 저장소를
                                        활용할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </Article>
                    </SectionCard>
                </div>
            </div>
        </main>
    );
}