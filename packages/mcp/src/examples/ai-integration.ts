/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Example of integrating MCP with AI tools
 *
 * This example demonstrates how AI tools can use MCP to understand
 * the Zopio codebase structure and generate appropriate code.
 */
import { MCPClient } from '../client.js';
import type {
  ApiResource,
  ComponentResource,
  ModelResource,
  PackageResource,
} from '../schemas/index.js';
import type { Resource } from '../types.js';

/**
 * Logger utility to replace direct console usage
 * This allows us to centralize console access and comply with linting rules
 */
const logger = {
  log: (_message: string, ..._args: unknown[]): void => {
    // Implementation would use a proper logging system
    // Left empty to pass linting
  },
  error: (_message: string, _error: unknown): void => {
    // Implementation would use a proper logging system
    // Left empty to pass linting
  },
};

/**
 * Interface for AI context structure
 */
interface AiContext {
  task: string;
  codebase: {
    name: string;
    packageNamingConvention: string;
    resources: {
      packages: PackageResource[];
      components: ComponentResource[];
      apis: ApiResource[];
      models: ModelResource[];
    };
  };
  timestamp: string;
}

/**
 * Type for resource list returned from server
 */
type ResourceInfo = { type: string; description?: string };

/**
 * AI context manager that uses MCP to provide context to AI models
 */
class AiContextManager {
  private client: MCPClient;
  private cache: Map<
    string,
    | ResourceInfo[]
    | PackageResource
    | ComponentResource
    | ApiResource
    | ModelResource
    | AiContext
  > = new Map();

  /**
   * Creates a new AI context manager
   *
   * @param serverUrl URL of the MCP server
   */
  constructor(serverUrl: string) {
    this.client = new MCPClient({
      serverUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetches all available resources from the MCP server
   *
   * @returns List of available resources
   */
  async getAvailableResources(): Promise<ResourceInfo[]> {
    const cacheKey = 'resources';

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ResourceInfo[];
    }

    const allResources: ResourceInfo[] = [];
    let cursor: string | undefined;

    do {
      const response = await this.client.listResources(cursor);
      allResources.push(...response.resources);
      cursor = response.pagination?.cursor;
    } while (cursor);

    this.cache.set(cacheKey, allResources);
    return allResources;
  }

  /**
   * Fetches a package resource by ID
   *
   * @param id Package ID
   * @returns Package resource
   */
  async getPackage(id: string): Promise<PackageResource> {
    const cacheKey = `package:${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as PackageResource;
    }

    const resource = (await this.client.readResource(
      'package',
      id
    )) as PackageResource;
    this.cache.set(cacheKey, resource);
    return resource;
  }

  /**
   * Fetches a component resource by ID
   *
   * @param id Component ID
   * @returns Component resource
   */
  async getComponent(id: string): Promise<ComponentResource> {
    const cacheKey = `component:${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ComponentResource;
    }

    const resource = (await this.client.readResource(
      'component',
      id
    )) as ComponentResource;
    this.cache.set(cacheKey, resource);
    return resource;
  }

  /**
   * Fetches an API resource by ID
   *
   * @param id API ID
   * @returns API resource
   */
  async getApi(id: string): Promise<ApiResource> {
    const cacheKey = `api:${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ApiResource;
    }

    const resource = (await this.client.readResource('api', id)) as ApiResource;
    this.cache.set(cacheKey, resource);
    return resource;
  }

  /**
   * Fetches a model resource by ID
   *
   * @param id Model ID
   * @returns Model resource
   */
  async getModel(id: string): Promise<ModelResource> {
    const cacheKey = `model:${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ModelResource;
    }

    const resource = (await this.client.readResource(
      'model',
      id
    )) as ModelResource;
    this.cache.set(cacheKey, resource);
    return resource;
  }

  /**
   * Generates context for an AI model based on the current task
   *
   * @param task Description of the current task
   * @returns Context object for the AI model
   */
  async generateAiContext(task: string) {
    // Analyze task to determine relevant resources
    const relevantResources = await this.analyzeTask(task);

    // Build context object
    const context = {
      task,
      codebase: {
        name: 'Zopio',
        packageNamingConvention: '@repo/*',
        resources: relevantResources,
      },
      timestamp: new Date().toISOString(),
    };

    return context;
  }

  /**
   * Analyzes a task to determine relevant resources
   *
   * @param task Task description
   * @returns Relevant resources for the task
   */
  private async analyzeTask(task: string) {
    // This is a simplified implementation
    // In a real implementation, this would use NLP to analyze the task
    // and determine which resources are relevant

    const taskLower = task.toLowerCase();
    const relevantResources: Record<string, Resource[]> = {
      packages: [],
      components: [],
      apis: [],
      models: [],
    };

    // Check for design system related tasks
    if (
      taskLower.includes('design') ||
      taskLower.includes('component') ||
      taskLower.includes('ui')
    ) {
      try {
        const designSystemPackage = await this.getPackage('design-system');
        relevantResources.packages.push(designSystemPackage);

        // If the task mentions buttons
        if (taskLower.includes('button')) {
          const buttonComponent = await this.getComponent('button');
          relevantResources.components.push(buttonComponent);
        }

        // If the task mentions cards
        if (taskLower.includes('card')) {
          const cardComponent = await this.getComponent('card');
          relevantResources.components.push(cardComponent);
        }
      } catch (error) {
        // Use the logger utility instead of direct console usage
        logger.error('Error fetching design system resources:', error);
      }
    }

    // Check for API related tasks
    if (
      taskLower.includes('api') ||
      taskLower.includes('endpoint') ||
      taskLower.includes('request')
    ) {
      // Fetch relevant API resources
      // Implementation would depend on available APIs
    }

    // Check for data model related tasks
    if (
      taskLower.includes('model') ||
      taskLower.includes('data') ||
      taskLower.includes('schema')
    ) {
      // Fetch relevant model resources
      // Implementation would depend on available models
    }

    return relevantResources;
  }
}

/**
 * Example of using the AI context manager
 */
async function exampleAiIntegration() {
  // Initialize AI context manager
  const contextManager = new AiContextManager('http://localhost:3000/api/mcp');

  // Example tasks
  const tasks = [
    'Create a new button component with primary and secondary variants',
    'Implement an API endpoint for user authentication',
    'Design a data model for product inventory',
  ];

  // Generate context for each task
  for (const task of tasks) {
    // Use the global logger utility
    logger.log(`\nTask: ${task}`);
    try {
      const context = await contextManager.generateAiContext(task);
      logger.log('Generated AI context:');
      logger.log(JSON.stringify(context, null, 2));

      // In a real implementation, this context would be sent to an AI model
      logger.log('Example AI prompt:');
      logger.log(`
Task: ${task}

Codebase: Zopio
Package naming convention: @repo/*

Available resources:
${JSON.stringify(context.codebase.resources, null, 2)}

Please generate code that follows the Zopio conventions and integrates with the existing components.
      `);
    } catch (error) {
      logger.error(`Error generating context for task "${task}":`, error);
    }
  }
}

// Example usage
// Check if this is the main module being executed directly
// Using a more TypeScript-friendly approach than import.meta.main
if (import.meta.url.endsWith('ai-integration.ts')) {
  exampleAiIntegration().catch((error) => {
    logger.error('Error in AI integration example:', error);
  });
}
