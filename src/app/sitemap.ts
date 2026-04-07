import type { MetadataRoute } from "next";
import { SITE_URL, CALCULATORS, POLICY_ROUTES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    ...CALCULATORS.map(c => c.href),
    ...POLICY_ROUTES.map(p => p.href)
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}