/**
 * SPDX-License-Identifier: MIT
 */

import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, "../.."),

  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
    ],
  },
};

export default config;
