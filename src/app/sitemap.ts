import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://주식계산기.kr";

  const routes = [
    "",
    "/average-price-calculator",
    "/stop-loss-calculator",
    "/profit-calculator",
    "/target-price-calculator",
    "/break-even-calculator",
    "/risk-reward-calculator",
    "/position-size-calculator",
    "/about",
    "/contact",
    "/privacy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}