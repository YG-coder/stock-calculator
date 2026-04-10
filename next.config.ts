/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;