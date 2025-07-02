/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */
/**
 * Code templates for various Zopio components and patterns
 */

export interface TemplateOptions {
  name: string;
  description?: string;
  author?: string;
  [key: string]: unknown;
}

/**
 * Generate a component template
 */
export function generateComponentTemplate(options: TemplateOptions): string {
  const { name, description = '' } = options;
  
  return `import React from 'react';

/**
 * ${name} Component
 * ${description}
 */
export interface ${name}Props {
  /** The primary content of the component */
  children?: React.ReactNode;
  /** Optional className for styling */
  className?: string;
}

export const ${name} = ({ children, className }: ${name}Props) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
`;
}

/**
 * Generate a hook template
 */
export function generateHookTemplate(options: TemplateOptions): string {
  const { name, description = '' } = options;
  
  return `import { useState, useEffect } from 'react';

/**
 * ${name}
 * ${description}
 */
export function ${name}() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Implementation
  }, []);
  
  return {
    state,
  };
}
`;
}

/**
 * Generate a service template
 */
export function generateServiceTemplate(options: TemplateOptions): string {
  const { name, description = '' } = options;
  
  return `/**
 * ${name}
 * ${description}
 */
export class ${name} {
  constructor() {
    // Initialize service
  }
  
  async initialize() {
    // Setup code
    return true;
  }
  
  async execute(params: any) {
    // Implementation
    return { success: true };
  }
}
`;
}

/**
 * Available template types
 */
export const templateTypes = [
  'component',
  'hook',
  'service',
  'util',
  'context',
  'provider',
] as const;

export type TemplateType = typeof templateTypes[number];
