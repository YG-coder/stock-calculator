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

/* ============================================================
   검수 상태 블록 (가이드용)
   ------------------------------------------------------------
   인컴랩 아키텍처 §13-1 에 따라 세 날짜를 구분해 보여준다.
     문서 수정일 / 출처별 확인일·확인 범위 / 문서 전체 검토일
   전체 검토일이 없으면 만들어내지 않고, 출처별 확인일을 안내한다.
   ============================================================ */

import {
    REVIEW_STATUS_LABEL,
    effectiveReviewStatus,
    reviewSummaryLine,
    type ReviewRecord,
} from "@/lib/contentReview";
import type { WithheldItem } from "@/data/guidePages";

const STATUS_STYLE: Record<string, string> = {
    Verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
    "Pending Review": "border-amber-200 bg-amber-50 text-amber-800",
    Provisional: "border-rose-200 bg-rose-50 text-rose-800",
};

export function ReviewNote({
    review,
    withheld = [],
}: {
    review: ReviewRecord;
    /** 근거 미확정으로 공개를 보류한 항목 */
    withheld?: WithheldItem[];
}) {
    const status = effectiveReviewStatus(review);

    return (
        <section
            aria-labelledby="review-note-heading"
            className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="flex flex-wrap items-center gap-3">
                <h2 id="review-note-heading" className="text-base font-bold text-slate-900">
                    근거와 검토 상태
                </h2>
                <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}
                >
                    {REVIEW_STATUS_LABEL[status]}
                </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">{reviewSummaryLine(review)}</p>

            <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
                <dt className="font-medium text-slate-500">문서 수정일</dt>
                <dd className="text-slate-800">
                    {review.updatedAt}
                    <span className="text-slate-500"> (문구·구조를 고친 날. 사실 검토를 뜻하지 않습니다)</span>
                </dd>
                <dt className="font-medium text-slate-500">문서 전체 검토일</dt>
                <dd className="text-slate-800">
                    {review.fullReviewAt ?? "없음 — 아래 출처별 확인 범위만 확인했습니다"}
                </dd>
            </dl>

            {review.sourceChecks.length > 0 ? (
                <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-semibold text-slate-700">출처별 확인 기록</p>
                    <ul className="mt-2 space-y-3 text-sm text-slate-600">
                        {review.sourceChecks.map((check) => (
                            <li key={`${check.url}-${check.checkedAt}`}>
                                <a
                                    href={check.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-800 underline-offset-2 hover:underline"
                                >
                                    {check.label}
                                </a>
                                <span className="text-slate-500"> — {check.document}</span>
                                <div className="mt-1 text-xs text-slate-500">
                                    확인일 {check.checkedAt} · 확인 범위: {check.scope}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    이 문서에는 공식 출처 확인 기록이 아직 없습니다.
                </p>
            )}

            {review.unverifiedScope.length > 0 ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">확인하지 못한 범위</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-amber-900">
                        {review.unverifiedScope.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {withheld.length > 0 ? (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-900">
                        근거 확인 전이라 공개하지 않은 내용
                    </p>
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-rose-900">
                        {withheld.map((item) => (
                            <li key={`${item.kind}-${item.label}`}>
                                <span className="font-medium">
                                    [{item.kind}] {item.label}
                                </span>
                                <div className="mt-1 text-xs">{item.reason}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                검토 상태 판단 근거: {review.statusReason}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                자동 검사는 빈 본문·출처 누락·잘못된 내부 링크 같은 구조적 결함만 확인합니다.
                검사를 통과했다는 것이 내용 검토가 끝났다는 뜻은 아닙니다.
            </p>
        </section>
    );
}
