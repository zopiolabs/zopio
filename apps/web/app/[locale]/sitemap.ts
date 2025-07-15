/**
 * SPDX-License-Identifier: MIT
 */

import fs from 'node:fs';
import { env } from '@/env';
import { blog, legal } from '@repo/cms';
import type { MetadataRoute } from 'next';

const appFolders = fs.readdirSync('app', { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith('_'))
  .filter((folder) => !folder.name.startsWith('('))
  .map((folder) => folder.name);
const blogs = (await blog.getPosts()).map((post) => post._slug);
const legals = (await legal.getPosts()).map((post) => post._slug);
// Use NEXT_PUBLIC_APP_URL which is available in the environment
const appUrl = env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001';
const url = new URL(appUrl);

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: new URL('/', url).href,
    lastModified: new Date(),
  },
  ...pages.map((page) => ({
    url: new URL(page, url).href,
    lastModified: new Date(),
  })),
  ...blogs.map((blog) => ({
    url: new URL(`blog/${blog}`, url).href,
    lastModified: new Date(),
  })),
  ...legals.map((legal) => ({
    url: new URL(`legal/${legal}`, url).href,
    lastModified: new Date(),
  })),
];

export default sitemap;
