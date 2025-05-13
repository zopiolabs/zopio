import type { PluginDefinition } from './plugin.types';
import { PluginRegistry } from './PluginRegistry';

// Simple logger that can be replaced with a more sophisticated logging system
const logger = {
  error: (message: string, ...args: unknown[]) => {
    // In production, this could be replaced with a proper logging service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    // In production, this could be replaced with a proper logging service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    }
  }
};

/**
 * Configuration for a plugin to be loaded
 */
export interface PluginConfig {
  /** Unique identifier for the plugin */
  id: string;
  /** Path to the plugin module */
  path: string;
  /** Whether the plugin is enabled */
  enabled: boolean;
}

/**
 * Loads plugins from the provided configuration
 * @param config Array of plugin configurations
 * @returns Promise that resolves when all plugins are loaded
 */
export async function loadPluginsFromConfig(config: PluginConfig[]): Promise<void> {
  const enabledPlugins = config.filter(plugin => plugin.enabled);
  
  for (const plugin of enabledPlugins) {
    try {
      // Use dynamic import with error handling
      const mod = await import(/* @vite-ignore */ plugin.path)
        .catch(error => {
          logger.error(`Failed to load plugin ${plugin.id} from ${plugin.path}:`, error);
          return null;
        });
      
      if (!mod || !mod.default) {
        logger.error(`Plugin ${plugin.id} does not export a default export`);
        continue;
      }
      
      const pluginDef = mod.default as PluginDefinition;
      
      // Validate plugin definition
      if (!pluginDef.id || !pluginDef.name || typeof pluginDef.setup !== 'function') {
        logger.error(`Plugin ${plugin.id} has an invalid definition`);
        continue;
      }
      
      // Register and initialize the plugin
      PluginRegistry.register(pluginDef);
      
      try {
        await pluginDef.setup();
        logger.info(`Plugin ${pluginDef.name} (${pluginDef.id}) initialized successfully`);
      } catch (setupError) {
        logger.error(`Error initializing plugin ${pluginDef.name} (${pluginDef.id}):`, setupError);
      }
    } catch (error) {
      logger.error(`Unexpected error loading plugin ${plugin.id}:`, error);
    }
  }
}