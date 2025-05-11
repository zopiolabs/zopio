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
  }
};

module.exports = nextConfig;
