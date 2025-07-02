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
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from 'commander';
import { logger } from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Plugin {
  name: string;
  commands?: Command[];
}

type PluginInitFunction = () => Command[];

/**
 * Plugin system for Zopio CLI
 * Allows extending the CLI with custom commands and functionality
 */
export class PluginManager {
  plugins: Map<string, Plugin>;
  commands: Command[];

  constructor() {
    this.plugins = new Map();
    this.commands = [];
  }

  /**
   * Load plugins from the project and user directories
   */
  async loadPlugins(): Promise<Command[]> {
    try {
      // Load built-in plugins
      await this.loadBuiltInPlugins();

      // Load project plugins
      await this.loadProjectPlugins();

      // Load user plugins
      await this.loadUserPlugins();

      return this.commands;
    } catch (error) {
      logger.error(`Failed to load plugins: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Load built-in plugins
   */
  async loadBuiltInPlugins(): Promise<void> {
    const builtInPluginsDir = path.join(__dirname, '..', '..', 'plugins');

    if (fs.existsSync(builtInPluginsDir)) {
      const pluginFiles = fs
        .readdirSync(builtInPluginsDir)
        .filter((file) => file.endsWith('.js'));

      for (const pluginFile of pluginFiles) {
        try {
          const pluginPath = path.join(builtInPluginsDir, pluginFile);
          // Convert to file:// URL for ES modules
          const pluginUrl = `file://${pluginPath.replace(/\\/g, '/')}`;
          const plugin = await import(pluginUrl);

          if (plugin.default && typeof plugin.default === 'function') {
            const pluginName = path.basename(pluginFile, '.js');
            this.registerPlugin(pluginName, plugin.default);
          }
        } catch (error) {
          logger.error(
            `Failed to load built-in plugin ${pluginFile}: ${(error as Error).message}`
          );
        }
      }
    }
  }

  /**
   * Load plugins from the current project
   */
  async loadProjectPlugins(): Promise<void> {
    const projectPluginsDir = path.join(process.cwd(), '.zopio', 'plugins');

    if (fs.existsSync(projectPluginsDir)) {
      const pluginFiles = fs
        .readdirSync(projectPluginsDir)
        .filter((file) => file.endsWith('.js'));

      for (const pluginFile of pluginFiles) {
        try {
          const pluginPath = path.join(projectPluginsDir, pluginFile);
          // Convert to file:// URL for ES modules
          const pluginUrl = `file://${pluginPath.replace(/\\/g, '/')}`;
          const plugin = await import(pluginUrl);

          if (plugin.default && typeof plugin.default === 'function') {
            const pluginName = path.basename(pluginFile, '.js');
            this.registerPlugin(pluginName, plugin.default);
          }
        } catch (error) {
          logger.error(
            `Failed to load project plugin ${pluginFile}: ${(error as Error).message}`
          );
        }
      }
    }
  }

  /**
   * Load plugins from the user's home directory
   */
  async loadUserPlugins(): Promise<void> {
    const userHome = process.env.HOME || process.env.USERPROFILE;
    if (!userHome) {
      return;
    }

    const userPluginsDir = path.join(userHome, '.zopio', 'plugins');

    if (fs.existsSync(userPluginsDir)) {
      const pluginFiles = fs
        .readdirSync(userPluginsDir)
        .filter((file) => file.endsWith('.js'));

      for (const pluginFile of pluginFiles) {
        try {
          const pluginPath = path.join(userPluginsDir, pluginFile);
          // Convert to file:// URL for ES modules
          const pluginUrl = `file://${pluginPath.replace(/\\/g, '/')}`;
          const plugin = await import(pluginUrl);

          if (plugin.default && typeof plugin.default === 'function') {
            const pluginName = path.basename(pluginFile, '.js');
            this.registerPlugin(pluginName, plugin.default);
          }
        } catch (error) {
          logger.error(
            `Failed to load user plugin ${pluginFile}: ${(error as Error).message}`
          );
        }
      }
    }
  }

  /**
   * Register a plugin
   */
  registerPlugin(name: string, initFunction: PluginInitFunction): void {
    if (this.plugins.has(name)) {
      logger.warning(`Plugin '${name}' is already registered. Skipping.`);
      return;
    }

    try {
      const commands = initFunction();
      this.plugins.set(name, { name, commands });

      if (Array.isArray(commands)) {
        this.commands.push(...commands);
      }

      logger.info(`Loaded plugin: ${name}`);
    } catch (error) {
      logger.error(
        `Failed to initialize plugin '${name}': ${(error as Error).message}`
      );
    }
  }
}

// Export a singleton instance
export const pluginManager = new PluginManager();
