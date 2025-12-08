import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable faster refresh
  experimental: {
    // Optimize for Windows file watching
    webpackBuildWorker: true,
  },
  // Increase file watch limit for Windows
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
        ignored: /node_modules/, // Don't watch node_modules
      };
    }
    return config;
  },
};

export default nextConfig;
