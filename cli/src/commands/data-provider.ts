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
import chalk from 'chalk';
// Use ES module import for commander
import { Command } from 'commander';
import { isZopioProject, logger } from '../utils/helpers';

/**
 * Command to generate data providers for a Zopio project
 */
// @ts-ignore: Command is imported as a type but used as a value
export const dataProviderCommand = new Command('data-provider')
  .description('Generate data providers for your Zopio project')
  .option('-t, --type <type>', 'Type of data provider (rest, graphql, mock)')
  .option('-n, --name <name>', 'Name of the data provider')
  .option('-e, --endpoint <url>', 'API endpoint URL')
  .action((options) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error(
        'Not a Zopio project. Please run this command in a Zopio project directory.'
      );
      process.exit(1);
    }

    if (!options.type) {
      logger.error(
        'Provider type is required. Use --type <type> to specify a provider type.'
      );
      dataProviderCommand.help();
      return;
    }

    if (!options.name) {
      logger.error(
        'Provider name is required. Use --name <name> to specify a provider name.'
      );
      dataProviderCommand.help();
      return;
    }

    const providerType = options.type.toLowerCase();
    const providerName = options.name;
    const endpoint = options.endpoint || '';

    switch (providerType) {
      case 'rest': {
        generateRestProvider(providerName, endpoint);
        break;
      }
      case 'graphql': {
        generateGraphQLProvider(providerName, endpoint);
        break;
      }
      case 'mock': {
        generateMockProvider(providerName);
        break;
      }
      default: {
        logger.error(`Unknown provider type: ${chalk.red(providerType)}`);
        logger.info('Available types: rest, graphql, mock');
        break;
      }
    }
  });

/**
 * Generate a REST API data provider
 * @param name Name of the provider
 * @param endpoint API endpoint URL
 */
function generateRestProvider(name: string, endpoint: string): void {
  logger.info(`Generating REST API data provider: ${chalk.green(name)}`);

  const providersDir = path.join(process.cwd(), 'src', 'providers');

  // Create providers directory if it doesn't exist
  if (!fs.existsSync(providersDir)) {
    fs.mkdirSync(providersDir, { recursive: true });
    logger.info(`Created providers directory at ${chalk.green(providersDir)}`);
  }

  const providerPath = path.join(providersDir, `${name}.provider.ts`);

  // Check if provider already exists
  if (fs.existsSync(providerPath)) {
    logger.error(
      `Provider ${chalk.red(name)} already exists at ${chalk.red(providerPath)}`
    );
    return;
  }

  const providerContent = `import axios from 'axios';

/**
 * ${name} REST API data provider
 */
export class ${name}Provider {
  private baseUrl: string;
  
  constructor(baseUrl: string = '${endpoint}') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get a list of resources
   * @param resource Resource name
   * @param params Query parameters
   * @returns Promise with the resource list
   */
  async getList(resource: string, params: any = {}): Promise<any[]> {
    try {
      const response = await axios.get(\`\${this.baseUrl}/\${resource}\`, { params });
      return response.data;
    } catch (error) {
      logger.error('Error fetching list: ' + error);
      throw error;
    }
  }
  
  /**
   * Get a single resource by ID
   * @param resource Resource name
   * @param id Resource ID
   * @returns Promise with the resource
   */
  async getOne(resource: string, id: string): Promise<any> {
    try {
      const response = await axios.get(\`\${this.baseUrl}/\${resource}/\${id}\`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching resource: ' + error);
      throw error;
    }
  }
  
  /**
   * Create a new resource
   * @param resource Resource name
   * @param data Resource data
   * @returns Promise with the created resource
   */
  async create(resource: string, data: any): Promise<any> {
    try {
      const response = await axios.post(\`\${this.baseUrl}/\${resource}\`, data);
      return response.data;
    } catch (error) {
      logger.error('Error creating resource: ' + error);
      throw error;
    }
  }
  
  /**
   * Update a resource
   * @param resource Resource name
   * @param id Resource ID
   * @param data Resource data
   * @returns Promise with the updated resource
   */
  async update(resource: string, id: string, data: any): Promise<any> {
    try {
      const response = await axios.put(\`\${this.baseUrl}/\${resource}/\${id}\`, data);
      return response.data;
    } catch (error) {
      logger.error('Error updating resource: ' + error);
      throw error;
    }
  }
  
  /**
   * Delete a resource
   * @param resource Resource name
   * @param id Resource ID
   * @returns Promise with the deletion result
   */
  async delete(resource: string, id: string): Promise<any> {
    try {
      const response = await axios.delete(\`\${this.baseUrl}/\${resource}/\${id}\`);
      return response.data;
    } catch (error) {
      logger.error('Error deleting resource: ' + error);
      throw error;
    }
  }
}
`;

  fs.writeFileSync(providerPath, providerContent);
  logger.success(
    `Created REST API data provider at ${chalk.green(providerPath)}`
  );
}

/**
 * Generate a GraphQL data provider
 * @param name Name of the provider
 * @param endpoint GraphQL endpoint URL
 */
function generateGraphQLProvider(name: string, endpoint: string): void {
  logger.info(`Generating GraphQL data provider: ${chalk.green(name)}`);

  const providersDir = path.join(process.cwd(), 'src', 'providers');

  // Create providers directory if it doesn't exist
  if (!fs.existsSync(providersDir)) {
    fs.mkdirSync(providersDir, { recursive: true });
    logger.info(`Created providers directory at ${chalk.green(providersDir)}`);
  }

  const providerPath = path.join(providersDir, `${name}.provider.ts`);

  // Check if provider already exists
  if (fs.existsSync(providerPath)) {
    logger.error(
      `Provider ${chalk.red(name)} already exists at ${chalk.red(providerPath)}`
    );
    return;
  }

  const providerContent = `import axios from 'axios';

/**
 * ${name} GraphQL data provider
 */
export class ${name}Provider {
  private endpoint: string;
  
  constructor(endpoint: string = '${endpoint}') {
    this.endpoint = endpoint;
  }
  
  /**
   * Execute a GraphQL query
   * @param query GraphQL query
   * @param variables Query variables
   * @returns Promise with the query result
   */
  async query(query: string, variables: any = {}): Promise<any> {
    try {
      const response = await axios.post(this.endpoint, {
        query,
        variables,
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data;
    } catch (error) {
      logger.error('GraphQL query error: ' + error);
      throw error;
    }
  }
  
  /**
   * Execute a GraphQL mutation
   * @param mutation GraphQL mutation
   * @param variables Mutation variables
   * @returns Promise with the mutation result
   */
  async mutate(mutation: string, variables: any = {}): Promise<any> {
    try {
      const response = await axios.post(this.endpoint, {
        query: mutation,
        variables,
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data;
    } catch (error) {
      logger.error('GraphQL mutation error: ' + error);
      throw error;
    }
  }
  
  /**
   * Get a list of resources
   * @param resource Resource name
   * @param fields Fields to retrieve
   * @param params Query parameters
   * @returns Promise with the resource list
   */
  async getList(resource: string, fields: string[], params: any = {}): Promise<any[]> {
    const query = \`
      query Get\${resource}List($limit: Int, $offset: Int) {
        \${resource.toLowerCase()}(limit: $limit, offset: $offset) {
          \${fields.join('\\n')}
        }
      }
    \`;
    
    const variables = {
      limit: params.limit || 10,
      offset: params.offset || 0,
    };
    
    const result = await this.query(query, variables);
    return result[resource.toLowerCase()];
  }
  
  /**
   * Get a single resource by ID
   * @param resource Resource name
   * @param id Resource ID
   * @param fields Fields to retrieve
   * @returns Promise with the resource
   */
  async getOne(resource: string, id: string, fields: string[]): Promise<any> {
    const query = \`
      query Get\${resource}($id: ID!) {
        \${resource.toLowerCase()}(id: $id) {
          \${fields.join('\\n')}
        }
      }
    \`;
    
    const variables = { id };
    
    const result = await this.query(query, variables);
    return result[resource.toLowerCase()];
  }
}
`;

  fs.writeFileSync(providerPath, providerContent);
  logger.success(
    `Created GraphQL data provider at ${chalk.green(providerPath)}`
  );
}

/**
 * Generate a mock data provider
 * @param name Name of the provider
 */
function generateMockProvider(name: string): void {
  logger.info(`Generating mock data provider: ${chalk.green(name)}`);

  const providersDir = path.join(process.cwd(), 'src', 'providers');

  // Create providers directory if it doesn't exist
  if (!fs.existsSync(providersDir)) {
    fs.mkdirSync(providersDir, { recursive: true });
    logger.info(`Created providers directory at ${chalk.green(providersDir)}`);
  }

  const providerPath = path.join(providersDir, `${name}.provider.ts`);

  // Check if provider already exists
  if (fs.existsSync(providerPath)) {
    logger.error(
      `Provider ${chalk.red(name)} already exists at ${chalk.red(providerPath)}`
    );
    return;
  }

  const providerContent = `/**
 * ${name} mock data provider
 */
export class ${name}Provider {
  private data: Record<string, any[]>;
  
  constructor() {
    // Initialize with empty data store
    this.data = {};
  }
  
  /**
   * Get a list of resources
   * @param resource Resource name
   * @returns Array of resources
   */
  getList(resource: string): any[] {
    if (!this.data[resource]) {
      this.data[resource] = [];
    }
    
    return [...this.data[resource]];
  }
  
  /**
   * Get a single resource by ID
   * @param resource Resource name
   * @param id Resource ID
   * @returns Resource or null if not found
   */
  getOne(resource: string, id: string): any | null {
    if (!this.data[resource]) {
      return null;
    }
    
    return this.data[resource].find(item => item.id === id) || null;
  }
  
  /**
   * Create a new resource
   * @param resource Resource name
   * @param data Resource data
   * @returns Created resource
   */
  create(resource: string, data: any): any {
    if (!this.data[resource]) {
      this.data[resource] = [];
    }
    
    const newItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.data[resource].push(newItem);
    return { ...newItem };
  }
  
  /**
   * Update a resource
   * @param resource Resource name
   * @param id Resource ID
   * @param data Resource data
   * @returns Updated resource or null if not found
   */
  update(resource: string, id: string, data: any): any | null {
    if (!this.data[resource]) {
      return null;
    }
    
    const index = this.data[resource].findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedItem = {
      ...this.data[resource][index],
      ...data,
      updatedAt: new Date(),
    };
    
    this.data[resource][index] = updatedItem;
    return { ...updatedItem };
  }
  
  /**
   * Delete a resource
   * @param resource Resource name
   * @param id Resource ID
   * @returns True if deleted, false if not found
   */
  delete(resource: string, id: string): boolean {
    if (!this.data[resource]) {
      return false;
    }
    
    const index = this.data[resource].findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.data[resource].splice(index, 1);
    return true;
  }
  
  /**
   * Seed the data store with initial data
   * @param resource Resource name
   * @param items Array of items to seed
   */
  seed(resource: string, items: any[]): void {
    this.data[resource] = items.map(item => ({
      ...item,
      id: item.id || Date.now().toString(),
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date(),
    }));
  }
}
`;

  fs.writeFileSync(providerPath, providerContent);
  logger.success(`Created mock data provider at ${chalk.green(providerPath)}`);
}
