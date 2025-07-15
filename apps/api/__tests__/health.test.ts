/**
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';
import { GET } from '../app/health/route';

test('Health Check', async () => {
  // Create a mock request object with appropriate headers
  const mockRequest = new Request('http://localhost/health', {
    headers: {
      Accept: 'text/plain',
    },
  });

  const response = await GET(mockRequest);
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('OK');
});
