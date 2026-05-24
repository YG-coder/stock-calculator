import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/metadata";
import { CALCULATORS, POLICY_ROUTES } from "@/lib/constants";
import { getPublishedGuides } from "@/data/guidePages";

export default function sitemap(): MetadataRoute.Sitemap {
    const guideRoutes = getPublishedGuides().map((g) => `/guides/${g.slug}`);

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

    return routes.map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
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
