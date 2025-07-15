/**
 * SPDX-License-Identifier: MIT
 */

/** @type {import('next').NextConfig} */
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
};

module.exports = config;
