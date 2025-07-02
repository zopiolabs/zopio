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
export async function createApiKey(
  userId: string,
  name: string,
  scopes: string[],
  expiration: string
) {
  // Creates a new Clerk API Key
  const response = await fetch('https://api.clerk.com/v1/api_keys', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      user_id: userId,
      scopes,
      expiration,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Clerk API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}
