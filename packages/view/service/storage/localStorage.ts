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
import type { ViewSchema } from '../../engine/renderers/types';
import type { ViewStorageProvider } from './types';

/**
 * Storage prefix for view schemas in localStorage
 */
const VIEW_STORAGE_PREFIX = 'zopio_view_';

/**
 * A view storage provider that uses localStorage
 */
export class LocalStorageProvider implements ViewStorageProvider {
  /**
   * Save a view schema to localStorage
   * @param id Unique identifier for the view
   * @param view The view schema to save
   * @returns Promise that resolves when the view is saved
   */
  async saveView(id: string, view: ViewSchema): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error(
        'LocalStorageProvider can only be used in browser environments'
      );
    }

    try {
      localStorage.setItem(`${VIEW_STORAGE_PREFIX}${id}`, JSON.stringify(view));
    } catch (error) {
      console.error('Error saving view to localStorage:', error);
      throw new Error(`Failed to save view '${id}' to localStorage`);
    }
  }

  /**
   * Get a view schema from localStorage
   * @param id Unique identifier for the view
   * @returns Promise that resolves with the view schema or undefined if not found
   */
  async getView(id: string): Promise<ViewSchema | undefined> {
    if (typeof window === 'undefined') {
      throw new Error(
        'LocalStorageProvider can only be used in browser environments'
      );
    }

    const item = localStorage.getItem(`${VIEW_STORAGE_PREFIX}${id}`);

    if (!item) {
      return undefined;
    }

    try {
      return JSON.parse(item) as ViewSchema;
    } catch (error) {
      console.error('Error parsing view from localStorage:', error);
      throw new Error(`Failed to parse view '${id}' from localStorage`);
    }
  }

  /**
   * List all view IDs in localStorage
   * @returns Promise that resolves with an array of view IDs
   */
  async listViews(): Promise<string[]> {
    if (typeof window === 'undefined') {
      throw new Error(
        'LocalStorageProvider can only be used in browser environments'
      );
    }

    const views: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key?.startsWith(VIEW_STORAGE_PREFIX)) {
        views.push(key.substring(VIEW_STORAGE_PREFIX.length));
      }
    }

    return views;
  }

  /**
   * Delete a view from localStorage
   * @param id Unique identifier for the view to delete
   * @returns Promise that resolves when the view is deleted
   */
  async deleteView(id: string): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error(
        'LocalStorageProvider can only be used in browser environments'
      );
    }

    localStorage.removeItem(`${VIEW_STORAGE_PREFIX}${id}`);
  }
}
