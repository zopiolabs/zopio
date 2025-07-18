/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { useAnalytics } from '@repo/analytics/posthog/client';
import { useUser } from '@repo/auth/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const PostHogIdentifier = () => {
  const { user } = useUser();
  const identified = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const analytics = useAnalytics();

  useEffect(() => {
    // Track pageviews
    if (pathname && analytics) {
      try {
        let url = window.origin + pathname;
        if (searchParams.toString()) {
          url = `${url}?${searchParams.toString()}`;
        }
        analytics.capture('$pageview', {
          $current_url: url,
        });
      } catch (_error) {
        // Silently handle analytics errors
      }
    }
  }, [pathname, searchParams, analytics]);

  useEffect(() => {
    if (!user || identified.current || !analytics) {
      return;
    }

    try {
      analytics.identify(user.id, {
        email: user.emailAddresses.at(0)?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        avatar: user.imageUrl,
        phoneNumber: user.phoneNumbers.at(0)?.phoneNumber,
      });

      identified.current = true;
    } catch (_error) {
      // Silently handle analytics errors
    }
  }, [user, analytics]);

  return null;
};
