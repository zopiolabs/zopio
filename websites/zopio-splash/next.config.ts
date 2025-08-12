/**
 * SPDX-License-Identifier: MIT
 */

import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone', // Enable standalone output for Docker deployment
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

export default config;
