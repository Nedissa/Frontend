/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // react-icons re-exporterar tusentals ikoner per undermapp (t.ex. react-icons/si) —
    // utan detta importeras hela barrel-filen även om bara en handfull ikoner används,
    // vilket kostar 200-800ms extra per cold start. Next.js transformerar automatiskt
    // barrel-imports (import { X } from 'react-icons/si') till direkta imports vid bygge.
    optimizePackageImports: ['react-icons'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/blogg', destination: '/pilotbloggen', permanent: true },
      { source: '/blogg/:slug', destination: '/pilotbloggen/:slug', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '194.14.207.94',
        port: '9000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'api.techpilots.se',
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;
