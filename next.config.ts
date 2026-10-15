import { SITE } from "./src/lib/site";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: `www.${new URL(SITE.url).hostname}`,
          },
        ],
        destination: `${SITE.url}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
