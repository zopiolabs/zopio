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
/**
 * @repo/crud-engine
 *
 * Core CRUD engine that extends the data package with additional features.
 * This module provides enhanced CRUD operations with support for permissions,
 * auditing, and plugins.
 */

import type {
  CreateParams,
  CrudProvider,
  DeleteParams,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from '@repo/data-base';
import { createDataProvider, providerRegistry } from '@repo/data-base';

/**
 * CrudEngine configuration options
 */
export interface CrudEngineOptions {
  /** The data provider to use */
  dataProvider: CrudProvider;
  /** Enable auditing of operations */
  enableAudit?: boolean;
  /** Enable permissions checking */
  enablePermissions?: boolean;
  /** Plugins to use */
  plugins?: CrudPlugin[];
  /** Default locale for internationalization */
  defaultLocale?: string;
  /** Supported locales for internationalization */
  supportedLocales?: string[];
}

/**
 * CRUD plugin interface
 */
export interface CrudPlugin {
  /** Unique name of the plugin */
  name: string;
  /** Plugin initialization function */
  initialize: (engine: CrudEngine) => void;
  /** Hooks for different CRUD operations */
  hooks?: {
    beforeGetList?: (params: GetListParams) => GetListParams;
    afterGetList?: (result: any, params: GetListParams) => any;
    beforeGetOne?: (params: GetOneParams) => GetOneParams;
    afterGetOne?: (result: any, params: GetOneParams) => any;
    beforeCreate?: (params: CreateParams) => CreateParams;
    afterCreate?: (result: any, params: CreateParams) => any;
    beforeUpdate?: (params: UpdateParams) => UpdateParams;
    afterUpdate?: (result: any, params: UpdateParams) => any;
    beforeDelete?: (params: DeleteParams) => DeleteParams;
    afterDelete?: (result: any, params: DeleteParams) => any;
  };
}

/**
 * CrudEngine class that provides enhanced CRUD operations
 */
export class CrudEngine {
  private dataProvider: CrudProvider;
  private plugins: CrudPlugin[] = [];
  private enableAudit: boolean;
  private enablePermissions: boolean;
  private defaultLocale: string;
  private supportedLocales: string[];

  /**
   * Create a new CrudEngine instance
   */
  constructor(options: CrudEngineOptions) {
    this.dataProvider = options.dataProvider;
    this.enableAudit = options.enableAudit ?? false;
    this.enablePermissions = options.enablePermissions ?? false;
    this.defaultLocale = options.defaultLocale ?? 'en';
    this.supportedLocales = options.supportedLocales ?? ['en'];

    // Initialize plugins
    if (options.plugins) {
      this.plugins = options.plugins;
      this.plugins.forEach((plugin) => plugin.initialize(this));
    }
  }

  /**
   * Get the data provider
   */
  getDataProvider(): CrudProvider {
    return this.dataProvider;
  }

  /**
   * Get a list of resources
   */
  async getList(params: GetListParams): Promise<any> {
    let modifiedParams = params;

    // Apply plugin hooks
    for (const plugin of this.plugins) {
      if (plugin.hooks?.beforeGetList) {
        modifiedParams = plugin.hooks.beforeGetList(modifiedParams);
      }
    }

    // Execute the operation
    const result = await this.dataProvider.getList(modifiedParams);

    // Apply plugin hooks
    let modifiedResult = result;
    for (const plugin of this.plugins) {
      if (plugin.hooks?.afterGetList) {
        modifiedResult = plugin.hooks.afterGetList(modifiedResult, params);
      }
    }

    return modifiedResult;
  }

  /**
   * Get a single resource
   */
  async getOne(params: GetOneParams): Promise<any> {
    let modifiedParams = params;

    // Apply plugin hooks
    for (const plugin of this.plugins) {
      if (plugin.hooks?.beforeGetOne) {
        modifiedParams = plugin.hooks.beforeGetOne(modifiedParams);
      }
    }

    // Execute the operation
    const result = await this.dataProvider.getOne(modifiedParams);

    // Apply plugin hooks
    let modifiedResult = result;
    for (const plugin of this.plugins) {
      if (plugin.hooks?.afterGetOne) {
        modifiedResult = plugin.hooks.afterGetOne(modifiedResult, params);
      }
    }

    return modifiedResult;
  }

  /**
   * Create a new resource
   */
  async create(params: CreateParams): Promise<any> {
    let modifiedParams = params;

    // Apply plugin hooks
    for (const plugin of this.plugins) {
      if (plugin.hooks?.beforeCreate) {
        modifiedParams = plugin.hooks.beforeCreate(modifiedParams);
      }
    }

    // Execute the operation
    const result = await this.dataProvider.create(modifiedParams);

    // Apply plugin hooks
    let modifiedResult = result;
    for (const plugin of this.plugins) {
      if (plugin.hooks?.afterCreate) {
        modifiedResult = plugin.hooks.afterCreate(modifiedResult, params);
      }
    }

    return modifiedResult;
  }

  /**
   * Update a resource
   */
  async update(params: UpdateParams): Promise<any> {
    let modifiedParams = params;

    // Apply plugin hooks
    for (const plugin of this.plugins) {
      if (plugin.hooks?.beforeUpdate) {
        modifiedParams = plugin.hooks.beforeUpdate(modifiedParams);
      }
    }

    // Execute the operation
    const result = await this.dataProvider.update(modifiedParams);

    // Apply plugin hooks
    let modifiedResult = result;
    for (const plugin of this.plugins) {
      if (plugin.hooks?.afterUpdate) {
        modifiedResult = plugin.hooks.afterUpdate(modifiedResult, params);
      }
    }

    return modifiedResult;
  }

  /**
   * Delete a resource
   */
  async delete(params: DeleteParams): Promise<any> {
    let modifiedParams = params;

    // Apply plugin hooks
    for (const plugin of this.plugins) {
      if (plugin.hooks?.beforeDelete) {
        modifiedParams = plugin.hooks.beforeDelete(modifiedParams);
      }
    }

    // Execute the operation
    const result = await this.dataProvider.delete(modifiedParams);

    // Apply plugin hooks
    let modifiedResult = result;
    for (const plugin of this.plugins) {
      if (plugin.hooks?.afterDelete) {
        modifiedResult = plugin.hooks.afterDelete(modifiedResult, params);
      }
    }

    return modifiedResult;
  }
}

/**
 * Create a new CrudEngine instance
 */
export function createCrudEngine(options: CrudEngineOptions): CrudEngine {
  return new CrudEngine(options);
}

/**
 * Create a CrudEngine with a data provider
 */
export function createCrudEngineWithProvider(
  providerType: string,
  providerConfig: any,
  engineOptions?: Partial<CrudEngineOptions>
): CrudEngine {
  const dataProvider = createDataProvider({
    type: providerType,
    config: providerConfig,
  });

  return createCrudEngine({
    dataProvider,
    ...engineOptions,
  });
}

/**
 * Export provider registry for convenience
 */
export { providerRegistry };
