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
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ViewSchema } from '../../engine/renderers/types';
import type { ViewStorageProvider } from './types';

/**
 * A view storage provider that uses the file system
 */
export class FileStorageProvider implements ViewStorageProvider {
  private basePath: string;

  /**
   * Create a new FileStorageProvider
   * @param basePath The base directory path where views will be stored
   */
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Get the full path for a view file
   * @param id View ID
   * @returns Full file path
   */
  private getViewPath(id: string): string {
    return path.join(this.basePath, `${id}.json`);
  }

  /**
   * Ensure the base directory exists
   */
  private async ensureBaseDir(): Promise<void> {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('Error creating base directory:', error);
      throw new Error(`Failed to create directory '${this.basePath}'`);
    }
  }

  /**
   * Save a view schema to the file system
   * @param id Unique identifier for the view
   * @param view The view schema to save
   * @returns Promise that resolves when the view is saved
   */
  async saveView(id: string, view: ViewSchema): Promise<void> {
    await this.ensureBaseDir();

    try {
      const viewPath = this.getViewPath(id);
      await fs.writeFile(viewPath, JSON.stringify(view, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving view to file:', error);
      throw new Error(`Failed to save view '${id}' to file`);
    }
  }

  /**
   * Get a view schema from the file system
   * @param id Unique identifier for the view
   * @returns Promise that resolves with the view schema or undefined if not found
   */
  async getView(id: string): Promise<ViewSchema | undefined> {
    const viewPath = this.getViewPath(id);

    try {
      const content = await fs.readFile(viewPath, 'utf8');
      return JSON.parse(content) as ViewSchema;
    } catch (error) {
      // If file doesn't exist, return undefined
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return undefined;
      }

      console.error('Error reading view from file:', error);
      throw new Error(`Failed to read view '${id}' from file`);
    }
  }

  /**
   * List all view IDs in the storage directory
   * @returns Promise that resolves with an array of view IDs
   */
  async listViews(): Promise<string[]> {
    try {
      await this.ensureBaseDir();

      const files = await fs.readdir(this.basePath);
      return files
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.basename(file, '.json'));
    } catch (error) {
      console.error('Error listing views from directory:', error);
      throw new Error('Failed to list views from directory');
    }
  }

  /**
   * Delete a view from the file system
   * @param id Unique identifier for the view to delete
   * @returns Promise that resolves when the view is deleted
   */
  async deleteView(id: string): Promise<void> {
    const viewPath = this.getViewPath(id);

    try {
      await fs.unlink(viewPath);
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error deleting view file:', error);
        throw new Error(`Failed to delete view '${id}'`);
      }
    }
  }
}
