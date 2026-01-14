import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出（用于 GitHub Pages）
  output: "export",

  // 如果部署到 GitHub Pages 子路径，取消注释并修改为你的仓库名
  basePath: "/trmenu-editor",

  // GitHub Pages 不支持图片优化
  images: {
    unoptimized: true,
  },

  // 禁用严格模式（可选）
  // reactStrictMode: true,
};

export default nextConfig;
