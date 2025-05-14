import { PluginDefinition } from './plugin.types';

const registry = new Map<string, PluginDefinition>();

export const PluginRegistry = {
  register(plugin: PluginDefinition) {
    if (!plugin.id) throw new Error('Plugin must have an id');
    registry.set(plugin.id, plugin);
  },
  get(id: string): PluginDefinition | undefined {
    return registry.get(id);
  },
  getAll(): PluginDefinition[] {
    return Array.from(registry.values());
  },
};