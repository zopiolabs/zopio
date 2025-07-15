/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Base module interface for all Zopio modules
 */
export interface BaseModule {
  /**
   * Unique identifier for the module
   */
  id: string;

  /**
   * Display name of the module
   */
  name: string;

  /**
   * Version of the module (semver)
   */
  version: string;

  /**
   * Type of module (app, plugin, integration, tool)
   */
  type: string;

  /**
   * Author of the module
   */
  author?: string;

  /**
   * Description of the module
   */
  description?: string;

  /**
   * Tags for the module
   */
  tags?: string[];

  /**
   * Main entry point for the module
   */
  entry: string;

  /**
   * Preview image for the module
   */
  preview?: string;

  /**
   * Dependencies for the module
   */
  dependencies?: Record<string, string>;

  /**
   * License for the module
   */
  license?: string;

  /**
   * Repository URL for the module
   */
  repository?: string;

  /**
   * Homepage URL for the module
   */
  homepage?: string;

  /**
   * Bugs URL for the module
   */
  bugs?: string;

  /**
   * Keywords for the module
   */
  keywords?: string[];

  /**
   * Zopio-specific configuration
   */
  zopio: Record<string, unknown>;
}
