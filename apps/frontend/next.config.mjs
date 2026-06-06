/** @type {import('next').NextConfig} */
const nextConfig = {
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
