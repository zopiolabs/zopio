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
// Type declarations for JavaScript modules

// Add hidden property and methods to commander Command interface
declare module 'commander' {
  interface Command {
    hidden?: boolean;
    name(): string;
    help(): void;
  }
}

// Declare modules for JavaScript command files that haven't been converted to TypeScript yet
declare module '../commands/*.js' {
  import type { Command } from 'commander';
  const command: Command;
  export default command;
}

// Declare specific command modules
declare module '../commands/jobs.js' {
  import type { Command } from 'commander';
  export const jobsCommand: Command;
}

declare module '../commands/crud.js' {
  import type { Command } from 'commander';
  export const crudCommand: Command;
}

declare module '../commands/crud-schema.js' {
  import type { Command } from 'commander';
  export const crudSchemaCommand: Command;
}

declare module '../commands/data-provider.js' {
  import type { Command } from 'commander';
  export const dataProviderCommand: Command;
}

declare module '../commands/crud-ui.js' {
  import type { Command } from 'commander';
  export const crudUiCommand: Command;
}

declare module '../commands/crud-permissions.js' {
  import type { Command } from 'commander';
  export const crudPermissionsCommand: Command;
}

declare module '../commands/crud-unified.js' {
  import type { Command } from 'commander';
  export const unifiedCrudCommand: Command;
}

// Declare module for chalk
declare module 'chalk' {
  export function blue(text: string): string;
  export function green(text: string): string;
  export function yellow(text: string): string;
  export function red(text: string): string;
  export function cyan(text: string): string;
  // Define bold as a function with additional properties
  export interface BoldFunction {
    (text: string): string;
    cyan(text: string): string;
  }
  // Type assertion to allow for bold.cyan usage
  export const bold: BoldFunction;
  export default {
    blue,
    green,
    yellow,
    red,
    cyan,
    bold,
  };
}
