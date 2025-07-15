// SPDX-License-Identifier: MIT
// apps/api/app/api-keys/controller.ts
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

type CreateKeyInput = {
  userId: string;
  name: string;
  scopes: string[];
  expiration: string;
};

// Schema for API key creation validation
const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  scopes: z.array(z.string()),
  expiration: z
    .string()
    .regex(/^\d+[dmy]$/, 'Expiration must be in format like 30d, 6m, or 1y'),
});

export async function createApiKeyController(input: CreateKeyInput) {
  const { userId, name, scopes, expiration } = input;

  // Validate input
  apiKeySchema.parse({ name, scopes, expiration });

  // Generate a secure API key
  const apiKey = `sk_${randomBytes(32).toString('hex')}`;

  // Calculate expiration date
  const expirationValue = Number.parseInt(expiration.slice(0, -1), 10);
  const expirationUnit = expiration.slice(-1);

  const expiresAt = new Date();
  switch (expirationUnit) {
    case 'd':
      expiresAt.setDate(expiresAt.getDate() + expirationValue);
      break;
    case 'm':
      expiresAt.setMonth(expiresAt.getMonth() + expirationValue);
      break;
    case 'y':
      expiresAt.setFullYear(expiresAt.getFullYear() + expirationValue);
      break;
    default:
      // This should never happen due to regex validation
      break;
  }

  // Create API key in Clerk
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
      expires_at: expiresAt.toISOString(),
      token: apiKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Clerk API error: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  return {
    ...result,
    key: apiKey, // Return the generated key to the client
  };
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
