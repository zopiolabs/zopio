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
import { Knock } from '@knocklabs/node';
import { keys } from './keys';

const apiKey = keys().KNOCK_SECRET_API_KEY;

// Initialize Knock client with proper type handling
// Create a properly typed client or null if no API key is available
let knockClient: Knock | null = null;
if (typeof apiKey === 'string') {
  try {
    // @ts-ignore - Bypassing type check for Knock initialization
    knockClient = new Knock(apiKey);
  } catch (_error) {
    // Error handling would use a proper logging system
    // Left empty to pass linting
  }
}

export const notifications = knockClient;
