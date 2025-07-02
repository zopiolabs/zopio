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
export * from './types';
export * from './localStorage';
export * from './fileStorage';

import path from 'node:path';
import { FileStorageProvider } from './fileStorage';
import { LocalStorageProvider } from './localStorage';
// Factory function to create the appropriate storage provider based on environment
import type { ViewStorageProvider } from './types';

/**
 * Create a storage provider based on the current environment
 * @param options Configuration options for the storage provider
 * @returns An instance of a ViewStorageProvider
 */
export function createStorageProvider(options?: {
  type?: 'local' | 'file';
  storagePath?: string;
  storagePrefix?: string;
}): ViewStorageProvider {
  const type =
    options?.type || (typeof window === 'undefined' ? 'file' : 'local');

  if (type === 'local') {
    return new LocalStorageProvider(options?.storagePrefix);
  }

  const defaultPath =
    typeof process !== 'undefined' && process.cwd
      ? path.join(process.cwd(), 'data', 'views')
      : './data/views';

  return new FileStorageProvider(options?.storagePath || defaultPath);
}
