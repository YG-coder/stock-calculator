/**
 * src/lib/contentGate.ts
 *
 * 발행·색인 검사. 인컴랩 아키텍처 §10 QS-001 의 "자동 차단" 항목만 다룬다.
 *
 *   자동 차단 — 구조적으로 확인할 수 있는 결함
 *     빈 본문·빈 필수 절, 공식 출처 누락, 잘못된 내부 링크·앵커,
 *     검수 상태와 기록의 모순, Provisional 문서의 색인 노출
 *
 *   편집 검토 — 사람이 판단할 것 (이 파일이 대신하지 않는다)
 *     공식 출처가 실제 주장을 뒷받침하는지, 조건·예외가 충분한지,
 *     30초 안에 첫 행동을 이해할 수 있는지
 *
 * **이 검사를 통과했다는 사실은 Verified 판정도, 편집 검토 완료도 아니다.**
 * 상태를 올리는 일은 사람이 데이터에 직접 기록할 때만 일어난다.
 *
 * 최소 글자 수 기준은 두지 않는다. 분량은 품질의 대리 지표일 뿐이고,
 * 다른 플랫폼(정보보호)의 2,000자 경고를 이 저장소로 가져오지 않는다 (§10, 2026-09-10).
 * 자동차 전용 Safety Review 계층도 여기 포함하지 않는다 (§13-3).
 */

import {
    getIndexableGuides,
    guidePages,
    visibleFaqs,
    visibleSections,
    withheldItems,
    type GuidePageConfig,
} from "@/data/guidePages";
import { CALCULATORS, POLICY_ROUTES } from "@/lib/constants";
import { effectiveReviewStatus, isIndexableStatus } from "@/lib/contentReview";

export type ContentIssueSeverity = "error" | "warning";

export type ContentIssue = {
    severity: ContentIssueSeverity;
    /** 문제가 있는 문서 */
    slug: string;
    /** 문제가 있는 위치 */
    field: string;
    message: string;
};

/** 가이드 본문 소제목의 앵커 id. 외부에서 링크될 수 있으므로 규칙을 한 곳에 둔다. */
export function guideSectionAnchor(heading: string): string {
    return heading.trim().replace(/\s+/g, "-");
}

/** 데이터에 들어 있지 않은 고정 라우트 */
const STATIC_ROUTES = ["/", "/calculators", "/guides", "/lab"];

/** 내부 링크 검증에 쓰는 라우트 집합 */
export function knownRoutes(
    guides: Record<string, GuidePageConfig> = guidePages
): Set<string> {
    return new Set([
        ...STATIC_ROUTES,
        ...CALCULATORS.map((c) => c.href),
        ...POLICY_ROUTES.map((p) => p.href),
        ...Object.keys(guides).map((slug) => `/guides/${slug}`),
    ]);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 본문 문자열에서 사이트 내부 경로로 보이는 토큰을 뽑는다. */
function extractInternalPaths(text: string): string[] {
    const matches = text.match(/(?:^|[\s(["'])(\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*(?:#[^\s)"']+)?)/g);
    if (!matches) return [];
    return matches.map((m) => m.replace(/^[\s(["']/, ""));
}

function isBlank(v: string | undefined | null): boolean {
    return !v || v.trim().length === 0;
}

/**
 * 가이드 데이터의 구조적 결함을 모은다. 순수 함수 — 테스트에서 픽스처를 넣을 수 있다.
 */
export function collectGuideIssues(
    guides: Record<string, GuidePageConfig> = guidePages
): ContentIssue[] {
    const issues: ContentIssue[] = [];
    const routes = knownRoutes(guides);
    const add = (
        severity: ContentIssueSeverity,
        slug: string,
        field: string,
        message: string
    ) => issues.push({ severity, slug, field, message });

    const indexable = new Set(
        Object.values(guides)
            .filter(
                (g) => g.published && isIndexableStatus(effectiveReviewStatus(g.review))
            )
            .map((g) => g.slug)
    );

    for (const [key, guide] of Object.entries(guides)) {
        const slug = guide.slug;
        if (key !== slug) {
            add("error", slug, "slug", `레코드 키(${key})와 slug 가 다릅니다.`);
        }

        /* ---------- 빈 필수 본문 ---------- */
        for (const [field, value] of Object.entries({
            title: guide.title,
            summary: guide.summary,
            description: guide.description,
            intro: guide.intro,
        })) {
            if (isBlank(value)) add("error", slug, field, "필수 항목이 비어 있습니다.");
        }
        const shown = visibleSections(guide);
        const shownFaqs = visibleFaqs(guide);
        const withheld = withheldItems(guide);

        if (shown.length === 0) {
            add("error", slug, "sections", "공개되는 본문이 없습니다.");
        }
        guide.sections.forEach((section, i) => {
            if (isBlank(section.heading)) {
                add("error", slug, `sections[${i}].heading`, "소제목이 비어 있습니다.");
            }
            if (section.paragraphs.length === 0) {
                add("error", slug, `sections[${i}]`, `"${section.heading}" 절의 본문이 비어 있습니다.`);
            }
            section.paragraphs.forEach((p, j) => {
                if (isBlank(p)) {
                    add("error", slug, `sections[${i}].paragraphs[${j}]`, "빈 문단이 있습니다.");
                }
            });
        });
        guide.faqs?.forEach((faq, i) => {
            if (isBlank(faq.question) || isBlank(faq.answer)) {
                add("error", slug, `faqs[${i}]`, "질문 또는 답변이 비어 있습니다.");
            }
        });

        /* ---------- 공개 보류 표시 ---------- */
        for (const item of withheld) {
            if (isBlank(item.reason)) {
                add(
                    "error",
                    slug,
                    "provisional",
                    `공개를 보류한 ${item.kind}("${item.label}")에 사유가 없습니다.`
                );
            }
        }

        /* ---------- 앵커 중복 ---------- */
        const anchors = new Set<string>();
        for (const section of shown) {
            const anchor = guideSectionAnchor(section.heading);
            if (anchors.has(anchor)) {
                add("error", slug, "sections", `소제목 앵커가 중복됩니다: #${anchor}`);
            }
            anchors.add(anchor);
        }

        /* ---------- 내부 링크 ---------- */
        for (const item of guide.relatedCalculators ?? []) {
            if (!routes.has(item.href)) {
                add("error", slug, "relatedCalculators", `존재하지 않는 경로입니다: ${item.href}`);
            }
        }
        for (const target of guide.relatedGuides ?? []) {
            const other = guides[target];
            if (!other) {
                add("error", slug, "relatedGuides", `존재하지 않는 가이드입니다: ${target}`);
                continue;
            }
            if (indexable.has(slug) && !indexable.has(target)) {
                add(
                    "error",
                    slug,
                    "relatedGuides",
                    `색인되는 문서가 색인되지 않는 문서(${target})를 링크합니다.`
                );
            }
        }

        /* ---------- 본문·안내 속 경로와 앵커 ---------- */
        const textFields: { field: string; text: string }[] = [
            ...shown.flatMap((s, i) =>
                s.paragraphs.map((p, j) => ({ field: `sections[${i}].paragraphs[${j}]`, text: p }))
            ),
            ...shownFaqs.map((f, i) => ({ field: `faqs[${i}].answer`, text: f.answer })),
            ...(guide.nextSteps?.items ?? []).map((t, i) => ({ field: `nextSteps.items[${i}]`, text: t })),
            ...(guide.actionSummary?.doNow ?? []).map((t, i) => ({ field: `actionSummary.doNow[${i}]`, text: t })),
        ];
        for (const { field, text } of textFields) {
            for (const path of extractInternalPaths(text)) {
                const [base, anchor] = path.split("#");
                if (!routes.has(base)) {
                    add("error", slug, field, `존재하지 않는 내부 경로입니다: ${path}`);
                    continue;
                }
                if (anchor && base === `/guides/${slug}` && !anchors.has(anchor)) {
                    add("error", slug, field, `존재하지 않는 앵커입니다: ${path}`);
                }
            }
        }

        /* ---------- 검수 기록 ---------- */
        const review = guide.review;
        const status = effectiveReviewStatus(review);

        if (isBlank(review.statusReason)) {
            add("error", slug, "review.statusReason", "상태 전환 근거가 비어 있습니다.");
        }
        if (!DATE_RE.test(review.updatedAt)) {
            add("error", slug, "review.updatedAt", "문서 수정일 형식이 올바르지 않습니다 (YYYY-MM-DD).");
        }
        if (review.fullReviewAt && !DATE_RE.test(review.fullReviewAt)) {
            add("error", slug, "review.fullReviewAt", "문서 전체 검토일 형식이 올바르지 않습니다.");
        }
        review.sourceChecks.forEach((check, i) => {
            if (isBlank(check.url)) add("error", slug, `review.sourceChecks[${i}].url`, "출처 URL 이 없습니다.");
            if (isBlank(check.document)) add("error", slug, `review.sourceChecks[${i}].document`, "확인한 문서명이 없습니다.");
            if (isBlank(check.scope)) add("error", slug, `review.sourceChecks[${i}].scope`, "확인 범위가 비어 있습니다.");
            if (!DATE_RE.test(check.checkedAt)) {
                add("error", slug, `review.sourceChecks[${i}].checkedAt`, "출처 확인일 형식이 올바르지 않습니다.");
            }
        });

        if (review.status === "Verified") {
            if (review.sourceChecks.length === 0) {
                add("error", slug, "review", "Verified 인데 공식 출처 확인 기록이 없습니다.");
            }
            if (!review.fullReviewAt) {
                add("error", slug, "review", "Verified 인데 문서 전체 검토일이 없습니다. 출처 하나의 확인일로 대신할 수 없습니다.");
            }
            if (review.unverifiedScope.length > 0) {
                add("error", slug, "review", "Verified 인데 확인하지 못한 범위가 남아 있습니다.");
            }
            if (withheld.length > 0) {
                add(
                    "error",
                    slug,
                    "review",
                    "Verified 인데 근거 미확정으로 공개를 보류한 부분이 남아 있습니다."
                );
            }
        }

        /* ---------- 기준 데이터 변경 감지 ---------- */
        for (const ref of review.basis ?? []) {
            // effectiveReviewStatus 가 이미 Verified 를 끌어내리지만,
            // 사람이 확인해야 한다는 사실 자체를 검사 결과로 남긴다.
            const stale = effectiveReviewStatus({ ...review, status: "Verified" }) !== "Verified";
            if (stale) {
                add(
                    "warning",
                    slug,
                    "review.basis",
                    `기준 데이터(${ref.key})가 검토 시점 이후 바뀌었을 수 있습니다. 재검토 대상입니다.`
                );
                break;
            }
        }

        /* ---------- 색인 일관성 ---------- */
        if (!guide.published && status === "Verified") {
            add("warning", slug, "published", "Verified 인데 발행되지 않았습니다.");
        }
    }

    return issues;
}

/**
 * 실제 데이터 기준 검사 결과.
 *
 * 규칙 검사에 더해, **화면·사이트맵이 실제로 부르는 함수**(`getIndexableGuides`)가
 * 규칙과 같은 답을 내는지 교차 확인한다. 색인 판정이 한 곳에서만 맞고 다른 곳에서
 * 어긋나는 상황을 잡기 위한 것이다.
 */
export function collectContentIssues(): ContentIssue[] {
    const issues = collectGuideIssues(guidePages);

    const expected = new Set(
        Object.values(guidePages)
            .filter(
                (g) => g.published && isIndexableStatus(effectiveReviewStatus(g.review))
            )
            .map((g) => g.slug)
    );
    const actual = new Set(getIndexableGuides().map((g) => g.slug));

    for (const slug of actual) {
        if (!expected.has(slug)) {
            issues.push({
                severity: "error",
                slug,
                field: "getIndexableGuides",
                message:
                    "색인 대상 목록에 들어 있지만 검수 상태로는 색인 대상이 아닙니다. 색인 판정이 어긋났습니다.",
            });
        }
    }
    for (const slug of expected) {
        if (!actual.has(slug)) {
            issues.push({
                severity: "warning",
                slug,
                field: "getIndexableGuides",
                message: "색인 대상이어야 하는데 색인 목록에서 빠져 있습니다.",
            });
        }
    }

    return issues;
}

export function formatIssues(issues: ContentIssue[]): string {
    return issues
        .map((i) => `  [${i.severity}] ${i.slug} · ${i.field} — ${i.message}`)
        .join("\n");
}

/**
 * 빌드 단계 차단. error 가 하나라도 있으면 예외를 던진다.
 * 사이트맵과 가이드 라우트 생성에서 호출하므로 `next build` 가 실패한다.
 */
export function assertContentGate(): void {
    const issues = collectContentIssues();
    const errors = issues.filter((i) => i.severity === "error");
    if (errors.length > 0) {
        throw new Error(
            `[contentGate] 발행할 수 없는 콘텐츠 결함 ${errors.length}건:\n${formatIssues(errors)}`
        );
    }
}
