/**
 * SPDX-License-Identifier: MIT
 */

/** @type {import('next').NextConfig} */
const config = {
  outputFileTracingRoot: require("node:path").resolve(__dirname, "../.."),

  turbopack: {
    root: require("node:path").resolve(__dirname, "../.."),
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

module.exports = config;
