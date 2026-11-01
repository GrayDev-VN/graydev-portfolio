import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep verification builds separate from an existing dev server's output.
  distDir: process.env.PORTFOLIO_VERIFY_BUILD === "1" ? ".next-verify" : ".next",
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
