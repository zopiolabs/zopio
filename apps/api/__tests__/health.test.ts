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
import { expect, test } from 'vitest';
import { GET } from '../app/health/route';

test('Health Check', async () => {
  // Create a mock request object with appropriate headers
  const mockRequest = new Request('http://localhost/health', {
    headers: {
      'Accept': 'text/plain'
    }
  });
  
  const response = await GET(mockRequest);
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('OK');
});
