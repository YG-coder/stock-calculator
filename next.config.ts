import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.주식계산기.kr",
          },
        ],
        destination: "https://주식계산기.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
