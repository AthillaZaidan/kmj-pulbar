import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['async_hooks'],
  
  // Configure image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  
  // Add empty turbopack config to use Turbopack without warnings
  turbopack: {},
};

export default nextConfig;
