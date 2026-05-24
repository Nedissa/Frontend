/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

module.exports = nextConfig;
