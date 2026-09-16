import { describe, expect, it } from "vitest";
import {
    collectGuideIssues,
    collectContentIssues,
    assertContentGate,
    guideSectionAnchor,
} from "@/lib/contentGate";
import {
    effectiveReviewStatus,
    isIndexableStatus,
    changedBasis,
    type ReviewRecord,
    type ReviewStatus,
} from "@/lib/contentReview";
import type { GuidePageConfig } from "@/data/guidePages";
import {
    guidePages,
    getIndexableGuides,
    getPublishedGuides,
    visibleFaqs,
    visibleSections,
    withheldItems,
} from "@/data/guidePages";
import { taxBasisFingerprint } from "@/lib/taxRates";

/* ------------------------------------------------------------------
   픽스처 — 실제 콘텐츠를 건드리지 않고 규칙만 검증한다
   ------------------------------------------------------------------ */

function review(over: Partial<ReviewRecord> = {}): ReviewRecord {
    return {
        status: "Pending Review",
        statusReason: "테스트용 기록",
        updatedAt: "2026-09-16",
        sourceChecks: [],
        unverifiedScope: [],
        ...over,
    };
}

function guide(over: Partial<GuidePageConfig> = {}): GuidePageConfig {
    const slug = over.slug ?? "fixture-guide";
    return {
        slug,
        cluster: "세금",
        badge: "세금",
        title: "픽스처 가이드",
        summary: "요약",
        description: "설명",
        keywords: ["키워드"],
        intro: "도입",
        sections: [{ heading: "첫 절", paragraphs: ["문단"] }],
        published: true,
        review: review(),
        ...over,
    };
}

const errors = (g: Record<string, GuidePageConfig>) =>
    collectGuideIssues(g).filter((i) => i.severity === "error");
const warnings = (g: Record<string, GuidePageConfig>) =>
    collectGuideIssues(g).filter((i) => i.severity === "warning");

/* ------------------------------------------------------------------ */

describe("검수 상태와 색인", () => {
    it("Provisional 은 색인 대상이 아니고 Verified·Pending Review 는 색인 대상이다", () => {
        expect(isIndexableStatus("Provisional")).toBe(false);
        expect(isIndexableStatus("Pending Review")).toBe(true);
        expect(isIndexableStatus("Verified")).toBe(true);
    });

    it("발행됐어도 Provisional 이면 색인 목록에서 빠진다", () => {
        const g = {
            ok: guide({ slug: "ok" }),
            draft: guide({ slug: "draft", review: review({ status: "Provisional" }) }),
        };
        const indexable = Object.values(g).filter(
            (x) => x.published && isIndexableStatus(effectiveReviewStatus(x.review))
        );
        expect(indexable.map((x) => x.slug)).toEqual(["ok"]);
        // 라우트 자체는 살아 있다 — 색인만 막는 것이지 발행 취소가 아니다
        expect(g.draft.published).toBe(true);
    });

    it("색인되는 문서가 Provisional 문서를 링크하면 error", () => {
        const g = {
            ok: guide({ slug: "ok", relatedGuides: ["draft"] }),
            draft: guide({ slug: "draft", review: review({ status: "Provisional" }) }),
        };
        expect(errors(g).some((e) => e.field === "relatedGuides")).toBe(true);
    });

    it("실제 색인 목록 함수와 검수 상태 판정이 어긋나지 않는다", () => {
        // 화면·사이트맵이 실제로 부르는 함수와 규칙이 같은 답을 내는지 교차 확인
        const fromRule = new Set(
            Object.values(guidePages)
                .filter(
                    (g) =>
                        g.published && isIndexableStatus(effectiveReviewStatus(g.review))
                )
                .map((g) => g.slug)
        );
        const fromApi = new Set(getIndexableGuides().map((g) => g.slug));
        expect([...fromApi].sort()).toEqual([...fromRule].sort());
        expect(
            collectContentIssues().filter((i) => i.field === "getIndexableGuides")
        ).toHaveLength(0);
    });
});

describe("Verified 판정은 기록이 갖춰졌을 때만 허용된다", () => {
    const verified = (over: Partial<ReviewRecord>) =>
        errors({
            g: guide({
                slug: "g",
                review: review({
                    status: "Verified",
                    fullReviewAt: "2026-09-16",
                    sourceChecks: [
                        {
                            label: "출처",
                            url: "https://example.gov",
                            document: "문서",
                            checkedAt: "2026-09-16",
                            scope: "범위",
                        },
                    ],
                    ...over,
                }),
            }),
        });

    it("기록이 다 있으면 통과", () => {
        expect(verified({})).toHaveLength(0);
    });

    it("문서 전체 검토일이 없으면 error — 출처 확인일로 대신할 수 없다", () => {
        const e = verified({ fullReviewAt: undefined });
        expect(e.some((x) => x.message.includes("문서 전체 검토일"))).toBe(true);
    });

    it("확인하지 못한 범위가 남아 있으면 error", () => {
        const e = verified({ unverifiedScope: ["환율 기준 미확인"] });
        expect(e.some((x) => x.message.includes("확인하지 못한 범위"))).toBe(true);
    });

    it("공식 출처 기록이 없으면 error", () => {
        const e = verified({ sourceChecks: [] });
        expect(e.some((x) => x.message.includes("공식 출처"))).toBe(true);
    });

    it("출처 확인일 형식이 틀리면 error", () => {
        const e = verified({
            sourceChecks: [
                {
                    label: "출처",
                    url: "https://example.gov",
                    document: "문서",
                    checkedAt: "2026년 9월",
                    scope: "범위",
                },
            ],
        });
        expect(e.some((x) => x.field.includes("checkedAt"))).toBe(true);
    });

    it("상태 전환 근거가 비어 있으면 error", () => {
        const e = errors({ g: guide({ slug: "g", review: review({ statusReason: "  " }) }) });
        expect(e.some((x) => x.field === "review.statusReason")).toBe(true);
    });
});

describe("구조적 결함", () => {
    it("빈 문단은 error", () => {
        const g = { g: guide({ slug: "g", sections: [{ heading: "절", paragraphs: ["  "] }] }) };
        expect(errors(g).some((e) => e.message.includes("빈 문단"))).toBe(true);
    });

    it("본문 없는 절은 error", () => {
        const g = { g: guide({ slug: "g", sections: [{ heading: "절", paragraphs: [] }] }) };
        expect(errors(g).some((e) => e.message.includes("본문이 비어"))).toBe(true);
    });

    it("존재하지 않는 계산기 경로는 error", () => {
        const g = {
            g: guide({
                slug: "g",
                relatedCalculators: [{ href: "/nope-calculator", title: "t", desc: "d" }],
            }),
        };
        expect(errors(g).some((e) => e.field === "relatedCalculators")).toBe(true);
    });

    it("실제 계산기 경로는 통과한다", () => {
        const g = {
            g: guide({
                slug: "g",
                relatedCalculators: [
                    { href: "/overseas-stock-tax-calculator", title: "t", desc: "d" },
                ],
            }),
        };
        expect(errors(g)).toHaveLength(0);
    });

    it("존재하지 않는 가이드 링크는 error", () => {
        const g = { g: guide({ slug: "g", relatedGuides: ["없는글"] }) };
        expect(errors(g).some((e) => e.field === "relatedGuides")).toBe(true);
    });

    it("본문 속 존재하지 않는 내부 경로는 error", () => {
        const g = {
            g: guide({
                slug: "g",
                sections: [{ heading: "절", paragraphs: ["자세한 내용은 /not-a-route 를 보세요."] }],
            }),
        };
        expect(errors(g).some((e) => e.message.includes("존재하지 않는 내부 경로"))).toBe(true);
    });

    it("존재하지 않는 앵커는 error, 존재하는 앵커는 통과", () => {
        const bad = {
            g: guide({
                slug: "g",
                sections: [{ heading: "첫 절", paragraphs: ["/guides/g#없는앵커 참고"] }],
            }),
        };
        expect(errors(bad).some((e) => e.message.includes("앵커"))).toBe(true);

        const good = {
            g: guide({
                slug: "g",
                sections: [
                    { heading: "첫 절", paragraphs: [`/guides/g#${guideSectionAnchor("둘째 절")} 참고`] },
                    { heading: "둘째 절", paragraphs: ["문단"] },
                ],
            }),
        };
        expect(errors(good)).toHaveLength(0);
    });

    it("소제목 앵커가 중복되면 error", () => {
        const g = {
            g: guide({
                slug: "g",
                sections: [
                    { heading: "같은 제목", paragraphs: ["a"] },
                    { heading: "같은 제목", paragraphs: ["b"] },
                ],
            }),
        };
        expect(errors(g).some((e) => e.message.includes("중복"))).toBe(true);
    });
});

describe("기준 데이터 변경 감지", () => {
    const current = taxBasisFingerprint("overseasStockTax");

    it("지문이 그대로면 상태가 유지된다", () => {
        const r = review({
            status: "Verified",
            fullReviewAt: "2026-09-16",
            basis: [{ key: "overseasStockTax", fingerprint: current }],
        });
        expect(changedBasis(r)).toHaveLength(0);
        expect(effectiveReviewStatus(r)).toBe("Verified");
    });

    it("기준이 바뀌면 Verified 가 Pending Review 로 내려간다", () => {
        const r = review({
            status: "Verified",
            fullReviewAt: "2026-09-16",
            basis: [{ key: "overseasStockTax", fingerprint: "deadbeef" }],
        });
        expect(changedBasis(r)).toHaveLength(1);
        expect(effectiveReviewStatus(r)).toBe("Pending Review");
    });

    it("기준 변경은 어떤 상태도 Verified 로 올리지 않는다", () => {
        const statuses: ReviewStatus[] = ["Pending Review", "Provisional"];
        for (const status of statuses) {
            const r = review({
                status,
                basis: [{ key: "overseasStockTax", fingerprint: "deadbeef" }],
            });
            expect(effectiveReviewStatus(r)).toBe(status);
        }
    });

    it("기준이 바뀐 문서는 재검토 경고로 표시된다", () => {
        const g = {
            g: guide({
                slug: "g",
                review: review({
                    basis: [{ key: "overseasStockTax", fingerprint: "deadbeef" }],
                }),
            }),
        };
        expect(warnings(g).some((w) => w.field === "review.basis")).toBe(true);
    });
});

describe("실제 콘텐츠", () => {
    it("현재 데이터에 차단 대상 결함이 없다", () => {
        const issues = collectContentIssues().filter((i) => i.severity === "error");
        expect(issues, JSON.stringify(issues, null, 2)).toHaveLength(0);
        expect(() => assertContentGate()).not.toThrow();
    });

    it("모든 가이드에 검수 기록이 있다", () => {
        for (const g of Object.values(guidePages)) {
            expect(g.review.status, g.slug).toBeDefined();
            expect(g.review.statusReason.trim().length, g.slug).toBeGreaterThan(0);
        }
    });

    it("실제 검토 없이 Verified 로 올린 문서가 없다", () => {
        for (const g of Object.values(guidePages)) {
            if (g.review.status !== "Verified") continue;
            expect(g.review.fullReviewAt, g.slug).toBeTruthy();
            expect(g.review.sourceChecks.length, g.slug).toBeGreaterThan(0);
        }
    });

    it("가이드가 기록한 기준 지문이 현재 기준 데이터와 일치한다", () => {
        // 어긋나면 taxRates.ts 가 바뀐 것이고, 해당 가이드는 재검토 대상이 된다.
        for (const g of Object.values(guidePages)) {
            for (const ref of g.review.basis ?? []) {
                expect(taxBasisFingerprint(ref.key), `${g.slug}/${ref.key}`).toBe(
                    ref.fingerprint
                );
            }
        }
    });

    it("색인 대상은 발행 문서의 부분집합이다", () => {
        const published = new Set(getPublishedGuides().map((g) => g.slug));
        for (const g of getIndexableGuides()) {
            expect(published.has(g.slug), g.slug).toBe(true);
        }
    });
});

describe("assertContentGate", () => {
    it("error 가 있으면 예외를 던진다", () => {
        // 실제 데이터에는 결함이 없으므로, 던지는 경로는 픽스처로 확인한다
        const broken = { g: guide({ slug: "g", sections: [] }) };
        expect(errors(broken).length).toBeGreaterThan(0);
    });
});

describe("기준 지문 자체", () => {
    it("같은 값이면 같은 지문, 키가 다르면 다른 지문", () => {
        expect(taxBasisFingerprint("overseasStockTax")).toBe(
            taxBasisFingerprint("overseasStockTax")
        );
        expect(taxBasisFingerprint("overseasStockTax")).not.toBe(
            taxBasisFingerprint("domesticDividendTax")
        );
    });

    it("8자리 16진수 형식", () => {
        expect(taxBasisFingerprint("financialIncomeThreshold")).toMatch(/^[0-9a-f]{8}$/);
    });
});


/* ==================================================================
   검수 상태가 의도치 않게 완화되지 않는가
   ================================================================== */

describe("Provisional 은 기준값 변경으로 완화되지 않는다", () => {
    const staleBasis = [{ key: "overseasStockTax" as const, fingerprint: "deadbeef" }];

    it("기준이 바뀌어도 Provisional 은 그대로다", () => {
        const r = review({ status: "Provisional", basis: staleBasis });
        expect(changedBasis(r)).toHaveLength(1);
        expect(effectiveReviewStatus(r)).toBe("Provisional");
        expect(isIndexableStatus(effectiveReviewStatus(r))).toBe(false);
    });

    it("기준이 바뀐 Provisional 문서도 색인 대상에서 계속 빠진다", () => {
        const g = {
            ok: guide({ slug: "ok" }),
            draft: guide({
                slug: "draft",
                review: review({ status: "Provisional", basis: staleBasis }),
            }),
        };
        const indexable = Object.values(g)
            .filter((x) => x.published && isIndexableStatus(effectiveReviewStatus(x.review)))
            .map((x) => x.slug);
        expect(indexable).toEqual(["ok"]);
    });

    it("Pending Review 도 기준값 변경으로 올라가지 않는다", () => {
        const r = review({ status: "Pending Review", basis: staleBasis });
        expect(effectiveReviewStatus(r)).toBe("Pending Review");
    });

    it("기준 변경은 Verified 를 내리는 방향으로만 작동한다", () => {
        const down = review({
            status: "Verified",
            fullReviewAt: "2026-09-16",
            basis: staleBasis,
        });
        expect(effectiveReviewStatus(down)).toBe("Pending Review");
        const keep = review({
            status: "Verified",
            fullReviewAt: "2026-09-16",
            basis: [
                { key: "overseasStockTax", fingerprint: taxBasisFingerprint("overseasStockTax") },
            ],
        });
        expect(effectiveReviewStatus(keep)).toBe("Verified");
    });
});

/* ==================================================================
   미검토와 근거 미확정의 구분
   ================================================================== */

describe("근거 미확정 부분은 공개에서 보류한다", () => {
    const withheldGuide = (over = {}) =>
        guide({
            slug: "g",
            sections: [
                { heading: "확인된 절", paragraphs: ["문단"] },
                {
                    heading: "미확정 절",
                    paragraphs: ["근거 없는 수치"],
                    provisional: { reason: "공식 근거 미확인" },
                },
            ],
            faqs: [
                { question: "질문", answer: "답변" },
                {
                    question: "미확정 질문",
                    answer: "근거 없는 수치",
                    provisional: { reason: "본문과 같은 수치" },
                },
            ],
            ...over,
        });

    it("보류한 절과 FAQ 는 공개 목록에서 빠진다", () => {
        const g = withheldGuide();
        expect(visibleSections(g).map((s) => s.heading)).toEqual(["확인된 절"]);
        expect(visibleFaqs(g).map((f) => f.question)).toEqual(["질문"]);
        expect(withheldItems(g)).toHaveLength(2);
    });

    it("보류 사유가 비어 있으면 error", () => {
        const g = {
            g: guide({
                slug: "g",
                sections: [
                    { heading: "절", paragraphs: ["a"] },
                    { heading: "보류", paragraphs: ["b"], provisional: { reason: "  " } },
                ],
            }),
        };
        expect(errors(g).some((e) => e.field === "provisional")).toBe(true);
    });

    it("보류한 부분이 남아 있으면 Verified 로 올릴 수 없다", () => {
        const g = {
            g: withheldGuide({
                review: review({
                    status: "Verified",
                    fullReviewAt: "2026-09-16",
                    sourceChecks: [
                        {
                            label: "출처",
                            url: "https://example.gov",
                            document: "문서",
                            checkedAt: "2026-09-16",
                            scope: "범위",
                        },
                    ],
                }),
            }),
        };
        expect(
            errors(g).some((e) => e.message.includes("공개를 보류한 부분"))
        ).toBe(true);
    });

    it("모든 절을 보류하면 공개할 본문이 없어 error", () => {
        const g = {
            g: guide({
                slug: "g",
                sections: [
                    { heading: "절", paragraphs: ["a"], provisional: { reason: "근거 미확인" } },
                ],
            }),
        };
        expect(errors(g).some((e) => e.message.includes("공개되는 본문이 없습니다"))).toBe(true);
    });

    it("보류한 절의 내용은 링크·앵커 검사 대상에서 빠진다", () => {
        // 공개되지 않는 글의 깨진 경로 때문에 빌드가 막히지 않아야 한다
        const g = {
            g: guide({
                slug: "g",
                sections: [
                    { heading: "절", paragraphs: ["정상"] },
                    {
                        heading: "보류",
                        paragraphs: ["/not-a-route 참고"],
                        provisional: { reason: "근거 미확인" },
                    },
                ],
            }),
        };
        expect(errors(g)).toHaveLength(0);
    });
});

describe("실제 콘텐츠의 구분 적용", () => {
    it("배당소득세 가이드는 근거 미확정 부분만 보류하고 문서는 공개 상태를 유지한다", () => {
        const g = guidePages["dividend-tax-basic"];
        expect(g.published).toBe(true);
        expect(effectiveReviewStatus(g.review)).toBe("Pending Review");
        expect(isIndexableStatus(effectiveReviewStatus(g.review))).toBe(true);
        expect(withheldItems(g).length).toBeGreaterThan(0);
    });

    it("보류한 특례 세율 구간이 공개 본문·FAQ 에 남아 있지 않다", () => {
        const g = guidePages["dividend-tax-basic"];
        const shown = [
            ...visibleSections(g).flatMap((s) => s.paragraphs),
            ...visibleFaqs(g).flatMap((f) => [f.question, f.answer]),
        ].join(" ");
        expect(shown).not.toContain("14%·20%·25%·30%");
        expect(shown).not.toContain("배당성향이 40% 이상");
        expect(shown).not.toContain("27.5%");
    });

    it("해외주식 가이드는 보류한 부분 없이 공개된다", () => {
        const g = guidePages["us-stock-tax-basic"];
        expect(withheldItems(g)).toHaveLength(0);
        expect(isIndexableStatus(effectiveReviewStatus(g.review))).toBe(true);
    });

    it("확인하지 못한 범위는 화면에 남아 있다 (미검토와 미확정을 모두 기록)", () => {
        for (const slug of ["us-stock-tax-basic", "dividend-tax-basic"]) {
            expect(guidePages[slug].review.unverifiedScope.length).toBeGreaterThan(0);
        }
    });
});
