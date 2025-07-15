/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import posthog, { type PostHog } from 'posthog-js';
import { PostHogProvider as PostHogProviderRaw } from 'posthog-js/react';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { keys } from '../keys';

type PostHogProviderProps = {
  readonly children: ReactNode;
};

export const PostHogProvider: FC<Omit<PostHogProviderProps, 'client'>> = (
  properties
) => {
  useEffect(() => {
    try {
      const envKeys = keys();
      const posthogKey = envKeys?.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = envKeys?.NEXT_PUBLIC_POSTHOG_HOST;

      // Only initialize if both required keys are available
      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: posthogHost,
          person_profiles: 'identified_only',
          capture_pageview: false, // Disable automatic pageview capture, as we capture manually
          capture_pageleave: true, // Overrides the `capture_pageview` setting
        }) as PostHog;
      } else {
        // PostHog not initialized due to missing environment variables
        // This is expected during development or when analytics are not configured
      }
    } catch (_error) {
      // Silent fail for PostHog initialization errors
      // This prevents build errors when analytics configuration is incomplete
    }
  }, []);

  return <PostHogProviderRaw client={posthog} {...properties} />;
};

export { usePostHog as useAnalytics } from 'posthog-js/react';
