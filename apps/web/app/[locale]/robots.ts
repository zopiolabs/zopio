/**
 * SPDX-License-Identifier: MIT
 */

import { env } from '@/env';
import type { MetadataRoute } from 'next';

// Use NEXT_PUBLIC_APP_URL which is available in the environment
const appUrl = env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001';
const url = new URL(appUrl);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', url.href).href,
  };
}
