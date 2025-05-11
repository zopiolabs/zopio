import { PluginDefinition } from './plugin.types';
import { PluginRegistry } from './PluginRegistry';

interface PluginConfig {
  id: string;
  path: string;
  enabled: boolean;
}

export async function loadPluginsFromConfig(config: PluginConfig[]) {
  for (const plugin of config) {
    if (!plugin.enabled) continue;
    const mod = (await import(/* @vite-ignore */ plugin.path)) as { default: PluginDefinition };
    PluginRegistry.register(mod.default);
    await mod.default.setup();
  }
}