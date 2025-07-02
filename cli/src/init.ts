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
import { Command } from 'commander';
import { logger } from './utils/helpers';

// @ts-expect-error: Command is imported as a type but used as a value
export const initCommand = new Command()
  .name('init')
  .description('Initialize a new zopio project')
  .action(() => {
    const cwd = process.cwd();
    const pkg = path.join(cwd, 'package.json');
    if (fs.existsSync(pkg)) {
      logger.warning('A project already exists here.');
      return;
    }
    fs.writeFileSync(
      pkg,
      JSON.stringify({ name: 'zopio-app', version: '0.1.0' }, null, 2)
    );
    logger.success('Initialized zopio project.');
  });
