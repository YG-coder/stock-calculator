import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/lab", "/dev"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
