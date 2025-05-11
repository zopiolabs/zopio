/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/design-system"],
  experimental: {
    turbo: {
      rules: {
        // Exclude files from Turbopack processing
      }
    }
  },
  rewrites() {
    return [
      {
        source: '/jobs',
        destination: 'http://localhost:3008/',
      },
      {
        source: '/jobs/:path*',
        destination: 'http://localhost:3008/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
