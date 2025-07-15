/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { KnockFeedProvider, KnockProvider } from '@knocklabs/react';
import type React from 'react';
import type { ReactNode } from 'react';
import { keys } from '../keys';

const knockApiKey = keys().NEXT_PUBLIC_KNOCK_API_KEY;
const knockFeedChannelId = keys().NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID;

type NotificationsProviderProps = {
  children: ReactNode;
  userId: string;
};

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
  userId,
}) => {
  if (!knockApiKey || !knockFeedChannelId) {
    return children;
  }

  // Using type assertion to work around React 19 compatibility issues
  const Provider = KnockProvider as React.ComponentType<{
    apiKey: string;
    userId: string;
    children: ReactNode;
  }>;
  const FeedProvider = KnockFeedProvider as React.ComponentType<{
    feedId: string;
    children: ReactNode;
  }>;

  return (
    <Provider apiKey={knockApiKey} userId={userId}>
      <FeedProvider feedId={knockFeedChannelId}>{children}</FeedProvider>
    </Provider>
  );
};
