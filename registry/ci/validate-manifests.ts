/**
 * SPDX-License-Identifier: MIT
 */

// registry/ci/validate-manifests.ts

import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['plugins', 'integrations', 'apps', 'templates', 'tools'];

for (const folder of ROOTS) {
  const dirPath = path.join(__dirname, '..', folder);
  const modules = fs.readdirSync(dirPath);

  for (const mod of modules) {
    const manifestPath = path.join(dirPath, mod, 'zopio.module.json');
    if (!fs.existsSync(manifestPath)) {
      process.stderr.write(`❌ Missing manifest for ${folder}/${mod}\n`);
      continue;
    }
    try {
      const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!content.type || !content.name || !content.entry) {
        process.stderr.write(`⚠️ Invalid manifest in ${folder}/${mod}\n`);
      } else {
        process.stdout.write(`✅ Valid: ${content.name}\n`);
      }
    } catch {
      process.stderr.write(`❌ JSON parse error in ${folder}/${mod}\n`);
    }
  }
}
