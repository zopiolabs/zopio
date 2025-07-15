/**
 * SPDX-License-Identifier: MIT
 */

import type { BaseModule } from './module.js';

/**
 * Interface for UI slot definitions in plugins
 */
export interface PluginSlot {
  name: string;
  component: string;
  props?: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      required?: boolean;
      default?: string | number | boolean | Record<string, unknown> | unknown[];
      description?: string;
      enum?: (string | number | boolean)[];
    }
  >;
}

/**
 * Interface for plugin settings
 */
export interface PluginSetting {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  default?: string | number | boolean | Record<string, unknown> | unknown[];
  description?: string;
}

/**
 * Interface for plugin module manifest
 */
export interface PluginManifest extends BaseModule {
  type: 'plugin';
  zopio: {
    category: 'ui' | 'data' | 'auth' | 'utility' | 'workflow';
    icon?: string;
    slots: PluginSlot[];
    permissions?: string[];
    settings?: Record<string, PluginSetting>;
  };
}
