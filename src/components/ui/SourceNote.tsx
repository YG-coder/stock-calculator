import type { TaxSource } from "@/lib/taxRates";

type AppliedValue = {
    label: string;
    value: string;
};

type Props = {
    /** 적용 기준 연도 */
    basisYear: string;
    /** 최종 검토일 (YYYY-MM-DD) */
    reviewedAt: string;
    /** 계산에 실제로 적용한 세율·공제액 */
    applied: AppliedValue[];
    /** 결과가 달라질 수 있는 조건 */
    conditions?: string[];
    sources: readonly TaxSource[];
};

/**
 * 세금·수수료가 개입하는 계산기에 붙이는 기준·출처 블록.
 * 어떤 값을 어느 시점 기준으로 적용했는지 화면에서 확인할 수 있게 한다.
 */
export default function SourceNote({
    basisYear,
    reviewedAt,
    applied,
    conditions,
    sources,
}: Props) {
    return (
        <section
            aria-labelledby="source-note-heading"
            className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <h2
                id="source-note-heading"
                className="text-base font-bold text-slate-900"
            >
                계산 기준과 출처
            </h2>

            <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
                <dt className="font-medium text-slate-500">적용 기준</dt>
                <dd className="text-slate-800">{basisYear}년 기준</dd>

                <dt className="font-medium text-slate-500">최종 검토일</dt>
                <dd className="text-slate-800">{reviewedAt}</dd>

                {applied.map((item) => (
                    <div key={item.label} className="contents">
                        <dt className="font-medium text-slate-500">{item.label}</dt>
                        <dd className="text-slate-800">{item.value}</dd>
                    </div>
                ))}
            </dl>

            {conditions?.length ? (
                <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-700">
                        결과가 달라질 수 있는 조건
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                        {conditions.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-700">공식 출처</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {sources.map((s) => (
                        <li key={s.url}>
                            <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-slate-800 underline-offset-2 hover:underline"
                            >
                                {s.label}
                            </a>
                            {s.document ? (
                                <span className="text-slate-500"> — {s.document}</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    세법과 제도는 개정될 수 있습니다. 실제 신고 전에는 위 공식 자료에서 최신 기준을
                    확인하시기 바랍니다. 본 안내는 주식계산기.kr 운영자가 정리한 참고 자료이며,
                    세무 자문이 아닙니다.
                </p>
            </div>
        </section>
    );
}
