/**
 * src/lib/contentReview.ts
 *
 * 콘텐츠 검수 상태 모델. 인컴랩 공통 기준
 * (`Incomelab-Architecture.md` §13-1 · §13-2)을 이 저장소에 적용한 것이다.
 *
 * 핵심 구분 두 가지.
 *
 * 1) **발행(published) 과 검수(reviewStatus) 는 다른 축이다.**
 *    - published: 글이 완성되어 공개 라우트로 존재하는가
 *    - reviewStatus: 그 내용의 근거가 어디까지 확인됐는가
 *    둘을 한 필드로 합치면 "미검토"와 "비공개"가 섞인다.
 *
 * 2) **날짜를 세 가지로 나눈다.**
 *    - updatedAt      문서 수정일. 문구·구조를 고친 날. 사실 검토를 뜻하지 않는다
 *    - sourceChecks[].checkedAt  출처별 확인일. 그 자료를 실제로 대조한 날
 *    - fullReviewAt   문서 전체 검토일. 전체를 검토한 경우에만 기록한다.
 *                     출처 하나의 확인일에서 유도하지 않는다
 *
 * 자동 검사는 구조적 결함만 잡는다. 자동 검사 통과가 편집 검토 완료나
 * Verified 판정을 대신하지 않는다 (아키텍처 §10).
 *
 * 이 파일은 자동차 플랫폼 전용 Safety Review 계층을 포함하지 않는다.
 * 공통 기준은 3단계까지다 (아키텍처 §13-3).
 */

import { taxBasisFingerprint, type TaxBasisKey } from "@/lib/taxRates";

/** 공통 검수 3단계. 이 위에 다른 계층을 쌓지 않는다. */
export type ReviewStatus = "Verified" | "Pending Review" | "Provisional";

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    Verified: "공식 출처 확인",
    "Pending Review": "재검토 대상",
    Provisional: "근거 미확정",
};

export type SourceCheck = {
    label: string;
    url: string;
    /** 실제로 확인한 문서·조문 이름 */
    document: string;
    /** 이 자료를 실제로 대조한 날 (YYYY-MM-DD) */
    checkedAt: string;
    /** 이 자료로 확인한 범위. 확인한 것만 적는다 */
    scope: string;
};

/** 이 문서가 근거로 삼는 기준 데이터와, 검토 당시의 지문 */
export type BasisRef = {
    key: TaxBasisKey;
    /** 검토 시점의 taxBasisFingerprint(key) 값 */
    fingerprint: string;
};

export type ReviewRecord = {
    /** 사람이 판단해 기록한 상태. 자동으로 올라가지 않는다 */
    status: ReviewStatus;
    /** 이 상태로 둔 이유. 상태 전환 근거를 남긴다 */
    statusReason: string;
    /** 문서 수정일 */
    updatedAt: string;
    /** 문서 전체 검토일. 전체를 검토했을 때만 채운다 */
    fullReviewAt?: string;
    /** 출처별 확인 기록 */
    sourceChecks: SourceCheck[];
    /** 이번 검토에서 확인하지 못한 범위. 비어 있지 않으면 전체 검토가 아니다 */
    unverifiedScope: string[];
    /** 참조하는 기준 데이터 */
    basis?: BasisRef[];
};

/** 기준 데이터가 검토 시점 이후 바뀐 항목 */
export function changedBasis(record: ReviewRecord): BasisRef[] {
    return (record.basis ?? []).filter(
        (ref) => taxBasisFingerprint(ref.key) !== ref.fingerprint
    );
}

/**
 * 실제로 적용되는 검수 상태.
 *
 * 기준 데이터가 바뀌면 Verified 는 Pending Review 로 **내려간다**.
 * 반대 방향(자동 승격)은 어떤 경우에도 일어나지 않는다 — Verified 판정은
 * 사람이 문서 전체를 검토한 뒤에만 데이터에 직접 기록한다.
 */
export function effectiveReviewStatus(record: ReviewRecord): ReviewStatus {
    if (record.status === "Verified" && changedBasis(record).length > 0) {
        return "Pending Review";
    }
    return record.status;
}

/**
 * 프로덕션 색인 가능 여부.
 * Provisional 은 근거가 확정되지 않은 상태이므로 색인하지 않는다 (§13-2).
 * Pending Review 는 이미 공개된 문서가 재검토 대기 중인 상태이므로 색인을 유지한다.
 */
export function isIndexableStatus(status: ReviewStatus): boolean {
    return status !== "Provisional";
}

/** 화면에 노출할 검토 요약 문구. 확인하지 않은 것을 확인한 것처럼 적지 않는다. */
export function reviewSummaryLine(record: ReviewRecord): string {
    const status = effectiveReviewStatus(record);
    if (record.fullReviewAt) {
        return `${REVIEW_STATUS_LABEL[status]} · 문서 전체 검토일 ${record.fullReviewAt}`;
    }
    if (record.sourceChecks.length > 0) {
        const latest = record.sourceChecks
            .map((s) => s.checkedAt)
            .sort()
            .at(-1);
        return `${REVIEW_STATUS_LABEL[status]} · 문서 전체 검토일 없음 (가장 최근 출처 확인일 ${latest})`;
    }
    return `${REVIEW_STATUS_LABEL[status]} · 공식 출처 확인 기록 없음`;
}
