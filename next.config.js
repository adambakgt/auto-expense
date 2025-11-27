/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드에서 pdfjs-dist의 top-level await 경고 무시
    // pdfjs-dist는 동적 import로 런타임에 로드되며, 실제로는 정상 작동함
    if (!isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        {
          module: /node_modules\/pdfjs-dist/,
          message: /topLevelAwait|async\/await/,
        },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
