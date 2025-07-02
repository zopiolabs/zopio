/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
'use client';

import { getUsers } from '@/app/actions/users/get';
import { searchUsers } from '@/app/actions/users/search';
import { Room } from '@repo/collaboration/room';
import type { ReactNode } from 'react';

export const CollaborationProvider = ({
  orgId,
  children,
}: {
  orgId: string;
  children: ReactNode;
}) => {
  const resolveUsers = async ({ userIds }: { userIds: string[] }) => {
    const response = await getUsers(userIds);

    if ('error' in response) {
      throw new Error('Problem resolving users');
    }

    return response.data;
  };

  const resolveMentionSuggestions = async ({ text }: { text: string }) => {
    const response = await searchUsers(text);

    if ('error' in response) {
      throw new Error('Problem resolving mention suggestions');
    }

    return response.data;
  };

  return (
    <Room
      id={`${orgId}:presence`}
      authEndpoint="/api/collaboration/auth"
      fallback={
        <div className="px-3 text-muted-foreground text-xs">Loading...</div>
      }
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      {children}
    </Room>
  );
};
