/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 使用 SWC 编译器
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig; 