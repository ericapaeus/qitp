/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // 生成独立部署包
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // 支持子路径部署
  // 使用 SWC 编译器
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig; 