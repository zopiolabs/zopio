/**
 * SPDX-License-Identifier: MIT
 */

import Image from 'next/image';
import { octokit, safeGitHubFetch } from '../lib/octokit';

export const OpenSource = async () => {
  // Default repository data in case of API failure
  const defaultRepoData = {
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
  };

  // Default contributors data - using proper Octokit types
  const defaultContributors: Array<{
    login?: string;
    id?: number;
    node_id?: string;
    avatar_url?: string;
    gravatar_id?: string | null;
    url?: string;
    html_url?: string;
    type?: string;
    site_admin?: boolean;
    contributions?: number;
  }> = [];

  // Fetch repository data safely
  const repoData = await safeGitHubFetch(
    () =>
      octokit.repos.get({
        owner: 'zopiolabs',
        repo: 'zopio',
      }),
    defaultRepoData
  );

  // Fetch contributors safely
  const contributorsResponse = await safeGitHubFetch(
    () =>
      octokit.repos.listContributors({
        owner: 'zopiolabs',
        repo: 'zopio',
        anon: 'true',
        per_page: 100,
      }),
    defaultContributors
  );

  // Ensure contributors is an array and filter out entries without avatar_url
  const contributors = Array.isArray(contributorsResponse)
    ? contributorsResponse.filter(
        (c) => c && typeof c === 'object' && c.avatar_url
      )
    : [];

  return (
    <div className="flex h-full flex-col items-start justify-between gap-4 p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-neutral-500">
          <small>Open source</small>
        </div>
        <p className="font-semibold text-xl tracking-tight">
          zopio currently has{' '}
          <span className="text-orange-600">{repoData.stargazers_count}</span>{' '}
          stars, <span className="text-orange-600">{repoData.forks_count}</span>{' '}
          forks, and{' '}
          <span className="text-orange-600">{repoData.open_issues_count}</span>{' '}
          open issues and{' '}
          <span className="text-orange-600">{contributors.length}</span>{' '}
          contributors.
        </p>
        <div className="-space-x-1 flex flex-row">
          {contributors.slice(0, 10).map((contributor) => (
            <Image
              key={String(contributor.id)}
              src={String(contributor.avatar_url)}
              alt={contributor.login ? String(contributor.login) : ''}
              width={28}
              height={28}
              className="rounded-full object-cover ring-2 ring-white"
            />
          ))}
        </div>
      </div>
      <a
        href="https://github.com/zopiolabs/zopio"
        className="inline-flex rounded-md border bg-white px-4 py-2 font-medium text-sm shadow-sm"
      >
        Browse the source code
      </a>
    </div>
  );
};
