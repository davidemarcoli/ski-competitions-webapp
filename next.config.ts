import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
})

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
}

export default withSerwist(nextConfig)
