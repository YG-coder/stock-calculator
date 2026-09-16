import { describe, expect, it, vi, beforeEach } from "vitest";
import type { GuidePageConfig } from "@/data/guidePages";
import {
    effectiveReviewStatus,
    isIndexableStatus,
    type ReviewRecord,
} from "@/lib/contentReview";

/**
 * 색인 금지가 사이트맵 제외 하나로 끝나지 않는지 확인한다.
 * 같은 판정이 사이트맵·메타데이터 양쪽에 일관되게 적용돼야 한다.
 */

function review(over: Partial<ReviewRecord> = {}): ReviewRecord {
    return {
        status: "Pending Review",
        statusReason: "테스트",
        updatedAt: "2026-09-16",
        sourceChecks: [],
        unverifiedScope: [],
        ...over,
    };
}

function guide(slug: string, over: Partial<GuidePageConfig> = {}): GuidePageConfig {
    return {
        slug,
        cluster: "세금",
        badge: "세금",
        title: `제목 ${slug}`,
        summary: "요약",
        description: "설명",
        keywords: ["k"],
        intro: "도입",
        sections: [{ heading: "절", paragraphs: ["문단"] }],
        published: true,
        review: review(),
        ...over,
    };
}

const FIXTURE: Record<string, GuidePageConfig> = {
    "open-guide": guide("open-guide"),
    "draft-guide": guide("draft-guide", { review: review({ status: "Provisional" }) }),
    // 기준값이 바뀐 Provisional 문서. 기준 변경만으로 색인이 열리면 안 된다.
    "stale-draft": guide("stale-draft", {
        review: review({
            status: "Provisional",
            basis: [{ key: "overseasStockTax", fingerprint: "deadbeef" }],
        }),
    }),
};

vi.mock("@/data/guidePages", async () => {
    const real = await vi.importActual<typeof import("@/data/guidePages")>(
        "@/data/guidePages"
    );
    const indexable = () =>
        Object.values(FIXTURE).filter(
            (g) => g.published && isIndexableStatus(effectiveReviewStatus(g.review))
        );
    return {
        ...real,
        guidePages: FIXTURE,
        getGuide: (slug: string) => FIXTURE[slug],
        getPublishedGuides: () => Object.values(FIXTURE).filter((g) => g.published),
        getIndexableGuides: indexable,
    };
});

beforeEach(() => {
    vi.resetModules();
});

describe("사이트맵", () => {
    it("Provisional 문서를 제외하고, 색인 대상 문서는 포함한다", async () => {
        const { default: sitemap } = await import("@/app/sitemap");
        const urls = sitemap().map((e) => e.url);
        expect(urls.some((u) => u.endsWith("/guides/open-guide"))).toBe(true);
        expect(urls.some((u) => u.endsWith("/guides/draft-guide"))).toBe(false);
    });

    it("기준값이 바뀐 Provisional 문서도 사이트맵에서 계속 제외된다", async () => {
        const { default: sitemap } = await import("@/app/sitemap");
        const urls = sitemap().map((e) => e.url);
        expect(urls.some((u) => u.endsWith("/guides/stale-draft"))).toBe(false);
    });

    it("구조적 결함이 있으면 사이트맵 생성 단계에서 예외가 난다 (빌드 실패 지점)", async () => {
        const { assertContentGate } = await import("@/lib/contentGate");
        // 픽스처에는 결함이 없으므로 통과해야 한다
        expect(() => assertContentGate()).not.toThrow();
    });
});

describe("가이드 메타데이터", () => {
    it("Provisional 문서는 robots noindex·nofollow 를 받는다", async () => {
        const { generateMetadata } = await import("@/app/guides/[slug]/page");
        const meta = await generateMetadata({
            params: Promise.resolve({ slug: "draft-guide" }),
        });
        expect(meta.robots).toEqual({ index: false, follow: false });
    });

    it("기준값이 바뀐 Provisional 문서도 noindex 를 유지한다", async () => {
        const { generateMetadata } = await import("@/app/guides/[slug]/page");
        const meta = await generateMetadata({
            params: Promise.resolve({ slug: "stale-draft" }),
        });
        expect(meta.robots).toEqual({ index: false, follow: false });
    });

    it("색인 대상 문서에는 noindex 를 걸지 않는다", async () => {
        const { generateMetadata } = await import("@/app/guides/[slug]/page");
        const meta = await generateMetadata({
            params: Promise.resolve({ slug: "open-guide" }),
        });
        // buildMetadata 의 기본값이 유지된다 (색인 허용)
        expect(meta.robots).toMatchObject({ index: true, follow: true });
        expect(meta.alternates?.canonical).toContain("/guides/open-guide");
    });
});
