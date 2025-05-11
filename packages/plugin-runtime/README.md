# @zopio/plugin-runtime

Dynamic plugin registration and loading engine for Zopio applications.

## Features

- Plugin definition interface with lifecycle methods
- Central `PluginRegistry` to manage loaded plugins
- `loadPluginsFromConfig(config)` to load and register plugins dynamically
- Compatible with both SSR and edge-safe environments

## Usage

```ts
import { loadPluginsFromConfig } from '@zopio/plugin-runtime';

await loadPluginsFromConfig([
  { id: 'zopio.bi', path: '@zopio/addons-bi', enabled: true },
]);
```

Each plugin should export a default object:

```ts
export default {
  id: 'zopio.bi',
  name: 'Business Intelligence',
  setup: () => { ... },
};
```