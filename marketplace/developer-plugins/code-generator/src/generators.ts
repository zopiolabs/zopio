/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */
/**
 * Code generators for creating files and structures
 */
import type { TemplateOptions, TemplateType } from './templates.js';
import { generateComponentTemplate, generateHookTemplate, generateServiceTemplate } from './templates.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface GeneratorOptions extends TemplateOptions {
  outputPath: string;
  type: TemplateType;
  createTestFile?: boolean;
  createStoryFile?: boolean;
}

/**
 * Generate code files based on templates
 */
export function generateCode(options: GeneratorOptions): string[] {
  const { name, type, outputPath, createTestFile = false, createStoryFile = false } = options;
  const generatedFiles: string[] = [];
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Generate the main file
  let template = '';
  const fileName = `${name}.${type === 'component' ? 'tsx' : 'ts'}`;
  const filePath = path.join(outputPath, fileName);
  
  switch (type) {
    case 'component':
      template = generateComponentTemplate(options);
      break;
    case 'hook':
      template = generateHookTemplate(options);
      break;
    case 'service':
      template = generateServiceTemplate(options);
      break;
    default:
      throw new Error(`Unsupported template type: ${type}`);
  }
  
  fs.writeFileSync(filePath, template);
  generatedFiles.push(filePath);
  
  // Generate test file if requested
  if (createTestFile) {
    const testFileName = `${name}.test.${type === 'component' ? 'tsx' : 'ts'}`;
    const testFilePath = path.join(outputPath, testFileName);
    const testTemplate = generateTestTemplate(options);
    fs.writeFileSync(testFilePath, testTemplate);
    generatedFiles.push(testFilePath);
  }
  
  // Generate story file if requested and it's a component
  if (createStoryFile && type === 'component') {
    const storyFileName = `${name}.stories.tsx`;
    const storyFilePath = path.join(outputPath, storyFileName);
    const storyTemplate = generateStoryTemplate(options);
    fs.writeFileSync(storyFilePath, storyTemplate);
    generatedFiles.push(storyFilePath);
  }
  
  return generatedFiles;
}

/**
 * Generate a test template
 */
function generateTestTemplate(options: TemplateOptions): string {
  const { name, type } = options;
  
  if (type === 'component') {
    return `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name}>Test Content</${name}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
`;
  }
  
  return `import { ${name} } from './${name}';

describe('${name}', () => {
  it('works correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
`;
}

/**
 * Generate a story template
 */
function generateStoryTemplate(options: TemplateOptions): string {
  const { name } = options;
  
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {
    children: 'Example content',
  },
};
`;
}
