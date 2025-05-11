/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/queue'],
  rewrites() {
    return [
      {
        source: '/admin/queues/:path*',
        destination: 'http://localhost:3006/admin/queues/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
