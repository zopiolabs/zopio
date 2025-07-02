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
// apps/api/app/api-keys/controller.ts
import { createApiKey } from '@repo/api-key/lib/clerk-adapter';

type CreateKeyInput = {
  userId: string;
  name: string;
  scopes: string[];
  expiration: string;
};

export async function createApiKeyController(input: CreateKeyInput) {
  const { userId, name, scopes, expiration } = input;
  return await createApiKey(userId, name, scopes, expiration);
}

export async function listApiKeysController() {
  const response = await fetch('https://api.clerk.com/v1/api_keys', {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function deleteApiKeyController(id: string) {
  const response = await fetch(`https://api.clerk.com/v1/api_keys/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Clerk API error: ${JSON.stringify(error)}`);
  }

  return { success: true, id };
}
