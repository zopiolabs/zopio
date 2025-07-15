/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Example MCP client implementation
 */
import { MCPClient } from '../client.js';
import type { ComponentResource, PackageResource } from '../schemas/index.js';

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
 * Example function demonstrating how to use the MCP client to fetch design system components
 */
async function fetchDesignSystemComponents() {
  // Initialize client with server URL
  const client = new MCPClient({
    serverUrl: 'http://localhost:3000/api/mcp',
    headers: {
      Authorization: 'Bearer example-token',
    },
  });

  try {
    // List available resources
    logger.log('Fetching available resources...');
    const resourcesList = await client.listResources();
    logger.log(`Found ${resourcesList.resources.length} resource types`);

    // Fetch design system package
    logger.log('Fetching design system package...');
    const designSystemPackage = (await client.readResource(
      'package',
      'design-system'
    )) as PackageResource;
    logger.log(
      `Package: ${designSystemPackage.attributes?.name} v${designSystemPackage.attributes?.version}`
    );
    logger.log(`Description: ${designSystemPackage.attributes?.description}`);

    // Fetch button component
    logger.log('Fetching button component...');
    const buttonComponent = (await client.readResource(
      'component',
      'button'
    )) as ComponentResource;
    logger.log(`Component: ${buttonComponent.attributes?.name}`);
    logger.log(`Description: ${buttonComponent.attributes?.description}`);

    // Display button props
    logger.log('Button props:');
    const props = buttonComponent.attributes?.props || {};
    for (const [propName, propDef] of Object.entries(props)) {
      const required = propDef.required ? '(required)' : '(optional)';
      const defaultValue =
        propDef.defaultValue !== undefined
          ? `default: ${JSON.stringify(propDef.defaultValue)}`
          : '';

      logger.log(`- ${propName} [${propDef.type}] ${required} ${defaultValue}`);
      if (propDef.description) {
        logger.log(`  ${propDef.description}`);
      }
    }

    // Display usage examples
    logger.log('Usage examples:');
    if (buttonComponent.attributes?.examples) {
      for (const [
        index,
        example,
      ] of buttonComponent.attributes.examples.entries()) {
        logger.log(`\nExample ${index + 1}: ${example.name}`);
        if (example.description) {
          logger.log(example.description);
        }
        logger.log('```jsx');
        logger.log(example.code);
        logger.log('```');
      }
    }

    return {
      package: designSystemPackage,
      component: buttonComponent,
    };
  } catch (error) {
    logger.error('Error fetching MCP resources:', error);
    throw error;
  }
}

/**
 * Example function demonstrating how to use MCP resources in a React component
 */
function generateComponentCode(component: ComponentResource): string {
  const { name = 'Component', props = {} } = component.attributes || {};

  // Generate prop types
  const propTypes = Object.entries(props)
    .map(([propName, propDef]) => {
      const isRequired = propDef.required ? '' : '?';
      let typeDef: string;

      switch (propDef.type) {
        case 'string':
          typeDef = 'string';
          break;
        case 'number':
          typeDef = 'number';
          break;
        case 'boolean':
          typeDef = 'boolean';
          break;
        case 'function':
          typeDef = '() => void';
          break;
        case 'node':
        case 'element':
          typeDef = 'React.ReactNode';
          break;
        case 'array':
          typeDef = 'any[]';
          break;
        case 'object':
          typeDef = 'Record<string, unknown>';
          break;
        default:
          typeDef = 'any';
          break;
      }

      return `  ${propName}${isRequired}: ${typeDef};`;
    })
    .join('\n');

  // Generate component code
  return `import * as React from 'react';

/**
 * ${component.attributes?.description || ''}
 */
export interface ${name}Props {
${propTypes}
}

/**
 * ${name} component
 * 
 * @param props Component props
 * @returns React component
 */
export const ${name} = (props: ${name}Props): React.ReactElement => {
  // Implementation would go here
  return (
    <div className="zopio-${name.toLowerCase()}">
      {props.children}
    </div>
  );
};

${name}.displayName = '${name}';
`;
}

// Example usage
// Check if this is the main module being executed directly
// Using a more TypeScript-friendly approach than import.meta.main
const isMainModule = import.meta.url.endsWith('client-example.ts');
if (isMainModule) {
  fetchDesignSystemComponents()
    .then(({ component }) => {
      if (component) {
        logger.log('\nGenerated component code:');
        logger.log(generateComponentCode(component));
      }
    })
    .catch((error) => logger.error('Error:', error));
}
