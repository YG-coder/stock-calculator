import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/metadata";
import { CALCULATORS, POLICY_ROUTES } from "@/lib/constants";
import { getIndexableGuides } from "@/data/guidePages";
import { assertContentGate } from "@/lib/contentGate";

export default function sitemap(): MetadataRoute.Sitemap {
    // 빌드 단계 차단 지점. 구조적 결함이 있으면 여기서 next build 가 실패한다.
    assertContentGate();

    // Provisional 문서는 사이트맵에 넣지 않는다. 메타데이터 noindex 와 함께 동작한다.
    const guideRoutes = getIndexableGuides().map((g) => `/guides/${g.slug}`);

    const routes = Array.from(
        new Set([
            "",
            "/calculators",
            "/guides",
            ...guideRoutes,
            ...CALCULATORS.map((c) => c.href),
            ...POLICY_ROUTES.map((p) => p.href),
        ])
    );

    // 실제 콘텐츠 수정일이 관리되기 전에는 빌드 시각을 lastModified로 사용하지 않는다.
    return routes.map((route) => ({
        url: new URL(route || "/", BASE_URL).href,
        changeFrequency: "weekly",
        priority:
            route === ""
                ? 1
                : route === "/calculators"
                    ? 0.9
                    : route === "/guides"
                        ? 0.9
                        : route.startsWith("/guides/")
                            ? 0.8
                            : route.startsWith("/crypto")
                                ? 0.9
                                : route.includes("calculator")
                                    ? 0.8
                                    : 0.7,
    }));
}
