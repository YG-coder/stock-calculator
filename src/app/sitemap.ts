import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/metadata";
import { CALCULATORS, POLICY_ROUTES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = Array.from(
        new Set([
            "",
            "/calculators",
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
                    : route.startsWith("/crypto")
                        ? 0.9
                        : route.includes("calculator")
                            ? 0.8
                            : 0.7,
    }));
}