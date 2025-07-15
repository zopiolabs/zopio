/**
 * SPDX-License-Identifier: MIT
 */

import type React from 'react';

// Type declarations for modules without type definitions
declare module 'lucide-react' {
  export const StarIcon: React.FC<{ size?: number }>;
  // Add other icons as needed
}

declare module 'react-tweet' {
  export interface TweetProps {
    id: string;
  }
  export const Tweet: React.FC<TweetProps>;
}

// Fix the "JSX element implicitly has type 'any'" errors
declare global {
  interface IntrinsicElements {
    [elemName: string]: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}

// Type declarations for the GitHub API responses
export interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface GitHubContributor {
  id: number;
  avatar_url?: string;
  login?: string;
}
