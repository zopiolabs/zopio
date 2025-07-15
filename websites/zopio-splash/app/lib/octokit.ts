/**
 * SPDX-License-Identifier: MIT
 */

import { Octokit } from '@octokit/rest';

// Initialize Octokit with auth token if available
export const octokit = new Octokit({
  auth: process.env.GH_TOKEN || '',
  request: {
    // Add cache headers to improve rate limit usage
    headers: {
      'If-None-Match': '',
    },
  },
});

// Helper function to safely fetch GitHub data with fallbacks
export async function safeGitHubFetch<T>(
  fetchFn: () => Promise<{ data: T }>,
  fallback: T
): Promise<T> {
  try {
    const { data } = await fetchFn();
    return data;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging is necessary for debugging API issues
    console.error('GitHub API error:', error);
    return fallback;
  }
}
