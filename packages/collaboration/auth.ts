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
import 'server-only';
import { Liveblocks as LiveblocksNode } from '@liveblocks/node';
import { keys } from './keys';

type AuthenticateOptions = {
  userId: string;
  orgId: string;
  userInfo: Liveblocks['UserMeta']['info'];
};

const secret = keys().LIVEBLOCKS_SECRET;

export const authenticate = async ({
  userId,
  orgId,
  userInfo,
}: AuthenticateOptions) => {
  if (!secret) {
    throw new Error('LIVEBLOCKS_SECRET is not set');
  }

  const liveblocks = new LiveblocksNode({ secret });

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(userId, { userInfo });

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user write access on their organization
  session.allow(`${orgId}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();

  return new Response(body, { status });
};
