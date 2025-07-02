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
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

// Regex patterns for config extraction
const CONFIG_REGEX = /export\s+const\s+i18nConfig\s*=\s*({[\s\S]*?});/;
const JSON_KEY_REGEX = /(['"\\])?([a-zA-Z0-9_]+)(['"\\])?:/g;

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Log messages with consistent styling
 */
class Logger {
  private output: NodeJS.WriteStream;

  constructor() {
    this.output = process.stdout;
  }

  info(message: string): void {
    this.output.write(`${chalk.blue('ℹ')} ${message}\n`);
  }

  success(message: string): void {
    this.output.write(`${chalk.green('✓')} ${message}\n`);
  }

  warning(message: string): void {
    this.output.write(`${chalk.yellow('⚠')} ${message}\n`);
  }

  error(message: string): void {
    this.output.write(`${chalk.red('✗')} ${message}\n`);
  }

  title(message: string): void {
    this.output.write(`${chalk.bold.cyan(`\n${message}\n`)}\n`);
  }
}

export const logger = new Logger();

/**
 * Check if the current directory is a Zopio project
 */
export function isZopioProject(directory: string = process.cwd()): boolean {
  const packageJsonPath = path.join(directory, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return Boolean(
      packageJson.dependencies?.zopio || packageJson.devDependencies?.zopio
    );
  } catch {
    return false;
  }
}

/**
 * Get the project configuration
 */
export async function getProjectConfig(
  directory: string = process.cwd()
): Promise<Record<string, unknown> | null> {
  const configPath = path.join(directory, 'zopio.config.js');

  if (fs.existsSync(configPath)) {
    try {
      // Dynamic import for ESM compatibility
      return await import(configPath);
    } catch (error) {
      logger.error(
        `Failed to load project configuration: ${(error as Error).message}`
      );
      return null;
    }
  }

  return null;
}

/**
 * Get i18n configuration
 */
export function getI18nConfig(directory: string = process.cwd()): {
  defaultLocale: string;
  locales: string[];
} {
  const i18nConfigPath = path.join(directory, 'i18nConfig.ts');
  const languineJsonPath = path.join(directory, 'languine.json');

  if (fs.existsSync(i18nConfigPath)) {
    try {
      const content = fs.readFileSync(i18nConfigPath, 'utf8');
      // Use pre-defined regex to extract config object
      const match = content.match(CONFIG_REGEX);
      if (match?.[1]) {
        // This is a simple parser, in a real implementation you'd want to use a proper TS parser
        return JSON.parse(match[1].replace(JSON_KEY_REGEX, '"$2":'));
      }
    } catch (error) {
      logger.error(
        `Failed to parse i18nConfig.ts: ${(error as Error).message}`
      );
    }
  }

  if (fs.existsSync(languineJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(languineJsonPath, 'utf8'));
    } catch (error) {
      logger.error(
        `Failed to parse languine.json: ${(error as Error).message}`
      );
    }
  }

  // Default config based on memory
  return {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'es', 'de'],
  };
}

/**
 * Create a file with content
 */
export function createFile(filePath: string, content: string): boolean {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    logger.error(
      `Failed to create file ${filePath}: ${(error as Error).message}`
    );
    return false;
  }
}

/**
 * Get template content
 */
export function getTemplate(templateName: string): string | null {
  const templatesDir = path.join(__dirname, '..', '..', 'templates');
  const templatePath = path.join(templatesDir, `${templateName}.js`);

  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }

  return null;
}
