const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function fixImportsInFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Replace design system imports with relative imports
    const updatedContent = content
      .replace(/@repo\/design-system\/lib\/utils/g, '../../lib/utils')
      .replace(/@repo\/design-system\/hooks\/use-([a-z-]+)/g, '../hooks/use-$1')
      .replace(/@repo\/design-system\/components\/ui\/([a-z-]+)/g, './$1');
    
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      // File was fixed
      return true;
    }
    
    return false;
  } catch (_) {
    // Error occurred while processing file
    return false;
  }
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      fixedCount += await processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const fixed = await fixImportsInFile(filePath);
      if (fixed) { fixedCount++; }
    }
  }
  
  return fixedCount;
}

async function main() {
  const designSystemDir = path.resolve(__dirname, '../packages/design-system/components/ui');
  await processDirectory(designSystemDir);
  // Completed fixing imports
}

main().catch(console.error);
