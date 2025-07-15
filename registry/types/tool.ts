/**
 * SPDX-License-Identifier: MIT
 */

import type { BaseModule } from './module.js';

/**
 * Interface for tool command definitions
 */
export interface ToolCommand {
  /**
   * Name of the command
   */
  name: string;

  /**
   * Description of the command
   */
  description: string;

  /**
   * Command arguments
   */
  args?: {
    /**
     * Name of the argument
     */
    name: string;

    /**
     * Description of the argument
     */
    description: string;

    /**
     * Type of the argument
     */
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';

    /**
     * Whether the argument is required
     */
    required?: boolean;

    /**
     * Default value for the argument
     */
    default?: string | number | boolean | unknown[] | Record<string, unknown>;
  }[];

  /**
   * Function to execute when the command is called
   */
  handler: string;
}

/**
 * Interface for tool manifest
 */
export interface ToolManifest extends BaseModule {
  /**
   * Type of module (must be 'tool')
   */
  type: 'tool';

  /**
   * Zopio-specific configuration
   */
  zopio: {
    /**
     * Category of the tool
     */
    category: string;

    /**
     * Icon for the tool
     */
    icon: string;

    /**
     * Commands provided by the tool
     */
    commands: ToolCommand[];

    /**
     * Permissions required by the tool
     */
    permissions?: string[];

    /**
     * Environment variables required by the tool
     */
    env?: {
      /**
       * Name of the environment variable
       */
      name: string;

      /**
       * Description of the environment variable
       */
      description: string;

      /**
       * Whether the environment variable is required
       */
      required?: boolean;

      /**
       * Default value for the environment variable
       */
      default?: string;
    }[];
  };
}
