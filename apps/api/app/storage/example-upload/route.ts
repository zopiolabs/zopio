/**
 * SPDX-License-Identifier: MIT
 */

import { put } from '@repo/storage';

export async function POST(): Promise<Response> {
  try {
    // This route is a minimal example of using Vercel Blob through @repo/storage.
    // It does not accept arbitrary user input and only writes a small placeholder file.
    const blob = await put('example.txt', 'Hello from Zopio storage example', {
      access: 'private',
    });

    return new Response(
      JSON.stringify({
        ok: true,
        url: blob.url,
        note: 'This is a placeholder route. Replace with real upload logic for your project.',
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'Failed to write to storage. Check BLOB_READ_WRITE_TOKEN and Vercel Blob configuration.',
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}
