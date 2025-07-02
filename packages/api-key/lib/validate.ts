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
interface ClerkApiKey {
  secret: string;
  user_id: string;
  // Add other properties as needed
}

export async function validateApiKey(apiKey: string) {
  const res = await fetch('https://api.clerk.com/v1/api_keys', {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  const allKeys = await res.json();

  const match = allKeys.find((key: ClerkApiKey) => key.secret === apiKey);
  if (!match) {
    throw new Error('Invalid API Key');
  }

  return match.user_id;
}
