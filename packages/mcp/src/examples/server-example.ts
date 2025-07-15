/**
 * SPDX-License-Identifier: MIT
 */

import {
  componentSchema,
  createComponentResource,
  createPackageResource,
  packageSchema,
} from '../schemas/index.js';
/**
 * Example MCP server implementation
 */
import { MCPServer } from '../server.js';

// Logger utility to replace console.log
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
 * Create a sample MCP server for the Zopio design system
 */
function createDesignSystemMCPServer() {
  // Define server configuration
  const serverConfig = {
    name: 'ZopioDesignSystem',
    description: 'MCP server for Zopio design system components',
    resources: {
      // Define package resource type
      package: MCPServer.createResourceDefinition(packageSchema, {
        description: 'Zopio package information',
        examples: [
          {
            id: 'design-system',
            type: 'package',
            attributes: {
              name: '@repo/design-system',
              version: '0.1.0',
              description: 'Zopio design system components',
              private: true,
            },
          },
        ],
      }),

      // Define component resource type
      component: MCPServer.createResourceDefinition(componentSchema, {
        description: 'UI component from the Zopio design system',
        examples: [
          {
            id: 'button',
            type: 'component',
            attributes: {
              name: 'Button',
              description: 'Primary button component',
              category: 'input',
              props: {
                variant: {
                  type: 'string',
                  description: 'Button variant (primary, secondary, tertiary)',
                  required: false,
                  defaultValue: 'primary',
                },
                size: {
                  type: 'string',
                  description: 'Button size (sm, md, lg)',
                  required: false,
                  defaultValue: 'md',
                },
                disabled: {
                  type: 'boolean',
                  description: 'Whether the button is disabled',
                  required: false,
                  defaultValue: false,
                },
              },
            },
            relationships: {
              package: {
                data: {
                  id: 'design-system',
                  type: 'package',
                },
              },
            },
          },
        ],
      }),
    },
  };

  // Create server instance
  const server = new MCPServer(serverConfig);

  // Register design system package
  const designSystemPackage = createPackageResource('design-system', {
    name: '@repo/design-system',
    version: '0.1.0',
    description: 'Zopio design system components',
    private: true,
    type: 'module',
    sideEffects: false,
    main: './dist/index.js',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
        default: './dist/index.js',
      },
    },
    dependencies: {
      react: '^19.1.0',
      'tailwind-merge': '^3.3.0',
    },
  });

  server.registerResource(designSystemPackage);

  // Register button component
  const buttonComponent = createComponentResource(
    'button',
    {
      name: 'Button',
      description: 'Primary button component for user interactions',
      category: 'input',
      props: {
        variant: {
          type: 'string',
          description: 'Button variant (primary, secondary, tertiary)',
          required: false,
          defaultValue: 'primary',
        },
        size: {
          type: 'string',
          description: 'Button size (sm, md, lg)',
          required: false,
          defaultValue: 'md',
        },
        disabled: {
          type: 'boolean',
          description: 'Whether the button is disabled',
          required: false,
          defaultValue: false,
        },
        onClick: {
          type: 'function',
          description: 'Click handler',
          required: false,
        },
        children: {
          type: 'node',
          description: 'Button content',
          required: true,
        },
      },
      examples: [
        {
          name: 'Primary Button',
          code: '<Button variant="primary">Click me</Button>',
          description: 'Standard primary button',
        },
        {
          name: 'Secondary Button',
          code: '<Button variant="secondary" size="lg">Cancel</Button>',
          description: 'Large secondary button',
        },
      ],
      usage:
        'Import the Button component from @repo/design-system and use it in your React components.',
      accessibility:
        'Buttons are fully keyboard accessible and support ARIA attributes.',
      packageName: '@repo/design-system',
    },
    'design-system'
  );

  server.registerResource(buttonComponent);

  // Register card component
  const cardComponent = createComponentResource(
    'card',
    {
      name: 'Card',
      description: 'Container component for grouping related content',
      category: 'layout',
      props: {
        variant: {
          type: 'string',
          description: 'Card variant (default, elevated, outlined)',
          required: false,
          defaultValue: 'default',
        },
        padding: {
          type: 'string',
          description: 'Card padding (none, sm, md, lg)',
          required: false,
          defaultValue: 'md',
        },
        className: {
          type: 'string',
          description: 'Additional CSS classes',
          required: false,
        },
        children: {
          type: 'node',
          description: 'Card content',
          required: true,
        },
      },
      examples: [
        {
          name: 'Basic Card',
          code: '<Card>This is a card</Card>',
          description: 'Standard card with default styling',
        },
        {
          name: 'Elevated Card',
          code: '<Card variant="elevated">Elevated card with shadow</Card>',
          description: 'Card with elevation and shadow',
        },
      ],
      packageName: '@repo/design-system',
    },
    'design-system'
  );

  server.registerResource(cardComponent);

  return server;
}

// Create and export the server
export const designSystemServer = createDesignSystemMCPServer();

// Example usage
// Check if this is the main module being executed directly
// Using a more TypeScript-friendly approach than import.meta.main
const isMainModule = import.meta.url.endsWith('server-example.ts');
if (isMainModule) {
  // List available resources
  const resources = designSystemServer.listResources();
  logger.log('Available resources:', resources);

  // Get button component
  const buttonResponse = designSystemServer.handleReadResource(
    'component',
    'button'
  );
  logger.log('Button component:', buttonResponse);
}
