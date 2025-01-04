import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // data.fis-ski.com
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.fis-ski.com',
        port: '',
        pathname: '/general/load-competitor-picture/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
