/**
 * SPDX-License-Identifier: MIT
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadSchema } from './schema-loader.js';

const Ajv = require('ajv');
const ajv = new Ajv();
const pluginsPath = path.join(__dirname, '..', 'plugins');
const schema = loadSchema('plugin');

for (const dir of fs.readdirSync(pluginsPath)) {
  const file = path.join(pluginsPath, dir, 'plugin.json');
  const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const validate = ajv.compile(schema);

  if (validate(content)) {
    process.stdout.write(`[✅] Valid: ${dir}\n`);
  } else {
    process.stderr.write(
      `[❌] Invalid plugin.json: ${dir} ${JSON.stringify(validate.errors)}\n`
    );
    process.exit(1);
  }
}
