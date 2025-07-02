#!/usr/bin/env node

/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */

/**
 * Script to create a new plugin in the marketplace
 * Usage: node create-plugin.js <category> <plugin-name> [description]
 */
// No need for execSync in this script
const path = require('node:path');
const fs = require('node:fs');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Validate arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  process.stderr.write(`${colors.red}Error: Missing required arguments${colors.reset}\n`);
  process.stdout.write('Usage: node create-plugin.js <category> <plugin-name> [description]\n');
  process.stdout.write('Available categories: developer-plugins, business-plugins, fintech-plugins, insurtech-plugins, embedded-apps, integrations\n');
  process.exit(1);
}

const category = args[0];
const pluginName = args[1];
const description = args[2] || `${pluginName} plugin for Zopio`;

// Validate category
const validCategories = [
  'developer-plugins',
  'business-plugins',
  'fintech-plugins',
  'insurtech-plugins',
  'embedded-apps',
  'integrations',
];

if (!validCategories.includes(category)) {
  process.stderr.write(`${colors.red}Error: Invalid category '${category}'${colors.reset}\n`);
  process.stdout.write(`Available categories: ${validCategories.join(', ')}\n`);
  process.exit(1);
}

// Determine plugin directory and package name
const marketplaceDir = path.resolve(__dirname);
const pluginDir = path.join(marketplaceDir, category, pluginName);
const packagePrefix = category === 'integrations' ? 'integration' : 'plugin';
const categoryPrefix = category.replace('-plugins', '').replace('embedded-apps', 'embedded');
const packageName = `@repo/${packagePrefix}-${categoryPrefix}-${pluginName}`;

// Check if plugin already exists
if (fs.existsSync(pluginDir)) {
  process.stderr.write(`${colors.red}Error: Plugin '${pluginName}' already exists in ${category}${colors.reset}\n`);
  process.exit(1);
}

// Create plugin directory structure
process.stdout.write(`${colors.blue}Creating plugin '${pluginName}' in ${category}...${colors.reset}\n`);

fs.mkdirSync(pluginDir, { recursive: true });
fs.mkdirSync(path.join(pluginDir, 'src'), { recursive: true });
fs.mkdirSync(path.join(pluginDir, 'tests'), { recursive: true });

// Create package.json
const packageJson = {
  name: packageName,
  version: '0.1.0',
  private: true,
  main: './dist/index.js',
  module: './dist/index.mjs',
  types: './dist/index.d.ts',
  sideEffects: false,
  files: ['dist/**'],
  scripts: {
    build: 'tsup',
    dev: 'tsup --watch',
    lint: 'biome lint ./src',
    typecheck: 'tsc --noEmit',
    test: 'vitest run',
    clean: 'rimraf .turbo dist'
  },
  peerDependencies: {
    react: '>=19.0.0',
    'react-dom': '>=19.0.0',
    '@repo/design-system': 'workspace:*',
    '@repo/ui-components': 'workspace:*'
  },
  devDependencies: {
    '@biomejs/biome': '^1.5.3',
    '@repo/typescript-config': 'workspace:*',
    '@types/node': '^20.11.0',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'rimraf': '^5.0.5',
    'tsup': '^8.0.1',
    'typescript': '^5.8.3',
    'vitest': '^1.0.0'
  }
};

fs.writeFileSync(
  path.join(pluginDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Create tsconfig.json
const tsConfig = {
  extends: '@repo/typescript-config/react-library.json',
  compilerOptions: {
    outDir: 'dist',
    rootDir: 'src',
    jsx: 'react-jsx'
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist']
};

fs.writeFileSync(
  path.join(pluginDir, 'tsconfig.json'),
  JSON.stringify(tsConfig, null, 2)
);

// Create tsup.config.ts
const tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@repo/design-system',
    '@repo/ui-components',
    '@repo/typescript-config',
  ],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  outDir: 'dist',
});`;

fs.writeFileSync(path.join(pluginDir, 'tsup.config.ts'), tsupConfig);

// Create index.ts
const indexTs = `/**
 * ${description}
 * 
 * @packageDocumentation
 */

export * from './components';
`;

fs.writeFileSync(path.join(pluginDir, 'src/index.ts'), indexTs);

// Create components.tsx
const componentsTsx = `/**
 * Components for ${pluginName}
 */
import { useState } from 'react';

export interface ${toPascalCase(pluginName)}Props {
  /** Optional title */
  title?: string;
}

/**
 * Main ${toPascalCase(pluginName)} component
 */
export const ${toPascalCase(pluginName)} = ({ title = '${toPascalCase(pluginName)}' }: ${toPascalCase(pluginName)}Props) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold mb-4 text-xl">{title}</h2>
      <p className="mb-4">This is the ${pluginName} plugin for Zopio.</p>
      
      <button
        className="bg-blue-500 disabled:bg-blue-300 hover:bg-blue-600 px-4 py-2 rounded text-white"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      
      {isActive && (
        <div className="border-t mt-4 pt-4">
          <p>Plugin is now active!</p>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync(path.join(pluginDir, 'src/components.tsx'), componentsTsx);

// Create README.md
const readmeMd = `# ${toPascalCase(pluginName)}

${description}

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

## Usage

\`\`\`tsx
import { ${toPascalCase(pluginName)} } from '${packageName}';

export default function MyComponent() {
  return (
    <${toPascalCase(pluginName)} title="Custom Title" />
  );
}
\`\`\`

## API Reference

### ${toPascalCase(pluginName)}

Main component for the plugin.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | '${toPascalCase(pluginName)}' | Title to display in the component |

## Development

\`\`\`bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Run tests
pnpm test
\`\`\`

## Contributing

Please see the main Zopio repository contributing guidelines.
`;

fs.writeFileSync(path.join(pluginDir, 'README.md'), readmeMd);

// Create test file
const testFile = `import { describe, it, expect } from 'vitest';
import { ${toPascalCase(pluginName)} } from '../src/components';

describe('${toPascalCase(pluginName)}', () => {
  it('should be defined', () => {
    expect(${toPascalCase(pluginName)}).toBeDefined();
  });
});
`;

fs.writeFileSync(path.join(pluginDir, 'tests/components.test.ts'), testFile);

// Update modules.json
try {
  const modulesJsonPath = path.join(marketplaceDir, 'modules.json');
  const modulesJson = JSON.parse(fs.readFileSync(modulesJsonPath, 'utf8'));
  
  // Find the category
  const categoryName = {
    'developer-plugins': 'Developer Plugins',
    'business-plugins': 'Business Plugins',
    'fintech-plugins': 'Fintech Plugins',
    'insurtech-plugins': 'Insurtech Plugins',
    'embedded-apps': 'Embedded Apps',
    'integrations': 'Integrations'
  }[category];
  
  const categoryObj = modulesJson.categories.find(c => c.name === categoryName);
  
  if (categoryObj) {
    // Add the new plugin to the modules array
    categoryObj.modules.push({
      name: toPascalCase(pluginName),
      definition: description,
      importCode: `import { ${toPascalCase(pluginName)} } from '${packageName}';`
    });
    
    // Write the updated modules.json
    fs.writeFileSync(modulesJsonPath, JSON.stringify(modulesJson, null, 2));
  }
} catch (error) {
  process.stderr.write(`${colors.yellow}Warning: Could not update modules.json: ${error.message}${colors.reset}\n`);
}

process.stdout.write(`${colors.green}Plugin '${pluginName}' created successfully!${colors.reset}\n`);
process.stdout.write('\nNext steps:\n');
process.stdout.write(`1. cd ${path.relative(process.cwd(), pluginDir)}\n`);
process.stdout.write('2. pnpm install\n');
process.stdout.write('3. pnpm dev\n\n');

// Helper function to convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
