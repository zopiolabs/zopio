/**
 * SPDX-License-Identifier: MIT
 */

import fs from 'node:fs';
import path from 'node:path';

export function loadSchema(name: string): Record<string, unknown> {
  const filePath = path.join(__dirname, '..', 'schema', `${name}.schema.json`);
  const schema = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(schema);
}
