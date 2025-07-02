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
import { Command } from 'commander';
import { generateCommand } from './generate';
import { initCommand } from './init';

export function main() {
  // @ts-expect-error: Command is imported as a type but used as a value
  const program = new Command();

  program
    .name('zopio')
    .description('Zopio CLI - Modular B2B Framework Toolkit')
    .version('0.1.0');

  program.addCommand(initCommand);
  program.addCommand(generateCommand);

  program.parse();
}
