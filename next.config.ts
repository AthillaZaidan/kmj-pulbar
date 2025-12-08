import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress async_hooks warnings in Bun
  experimental: {
    webpackBuildWorker: true,
  },
  serverExternalPackages: ['async_hooks'],
  // Increase file watch limit for Windows
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Suppress async_hooks warnings for Bun
    if (process.versions.bun) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('async_hooks');
      }
      
      config.resolve.alias = {
        ...config.resolve.alias,
        'async_hooks': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
