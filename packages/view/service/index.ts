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
import type { ViewSchema } from '../engine/renderers/types';
import { FileStorageProvider } from './storage/fileStorage';
import { LocalStorageProvider } from './storage/localStorage';
import type { ViewStorageProvider } from './storage/types';

// Default storage provider instance
let defaultProvider: ViewStorageProvider;

/**
 * Initialize the view service with a storage provider
 * @param provider The storage provider to use
 */
export function initViewService(provider: ViewStorageProvider): void {
  defaultProvider = provider;
}

/**
 * Get the default storage provider, initializing it if necessary
 * @returns The default storage provider
 */
function getDefaultProvider(): ViewStorageProvider {
  if (!defaultProvider) {
    // Default to localStorage in browser, file storage in Node.js
    if (typeof window !== 'undefined') {
      defaultProvider = new LocalStorageProvider();
    } else {
      // Default to a views directory in the current working directory
      const defaultPath = `${process.cwd()}/views`;
      defaultProvider = new FileStorageProvider(defaultPath);
    }
  }

  return defaultProvider;
}

/**
 * Save a view schema to storage
 * @param id Unique identifier for the view
 * @param view The view schema to save
 * @param provider Optional custom storage provider
 * @returns Promise that resolves when the view is saved
 */
export async function saveView(
  id: string,
  view: ViewSchema,
  provider?: ViewStorageProvider
): Promise<void> {
  const storage = provider || getDefaultProvider();
  return storage.saveView(id, view);
}

/**
 * Get a view schema from storage
 * @param id Unique identifier for the view
 * @param provider Optional custom storage provider
 * @returns Promise that resolves with the view schema or undefined if not found
 */
export async function getView(
  id: string,
  provider?: ViewStorageProvider
): Promise<ViewSchema | undefined> {
  const storage = provider || getDefaultProvider();
  return storage.getView(id);
}

/**
 * List all view IDs in storage
 * @param provider Optional custom storage provider
 * @returns Promise that resolves with an array of view IDs
 */
export async function listViews(
  provider?: ViewStorageProvider
): Promise<string[]> {
  const storage = provider || getDefaultProvider();
  return storage.listViews();
}

/**
 * Delete a view from storage
 * @param id Unique identifier for the view to delete
 * @param provider Optional custom storage provider
 * @returns Promise that resolves when the view is deleted
 */
export async function deleteView(
  id: string,
  provider?: ViewStorageProvider
): Promise<void> {
  const storage = provider || getDefaultProvider();
  return storage.deleteView(id);
}

// Export storage providers
export { LocalStorageProvider, FileStorageProvider };
export type { ViewStorageProvider };
