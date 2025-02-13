import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 使用 SWC 编译器
  experimental: {
    forceSwcTransforms: true,
  },
};

export default config;
