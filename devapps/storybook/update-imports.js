/**
 * SPDX-License-Identifier: MIT
 */

const fs = require('node:fs');
const path = require('node:path');

// Directory containing the stories
const storiesDir = path.join(__dirname, 'stories');

// Function to update imports in a file
function updateImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Regular expression to match imports from @repo/design-system/ui/<component>
    const importRegex = /from\s+['"]@repo\/design-system\/ui\/([^'"]+)['"]/g;

    // Replace with imports from the barrel file
    const updatedContent = content.replace(
      importRegex,
      "from '@repo/design-system/ui'"
    );

    // Regular expression to match imports from @/packages/design-system/ui/<component>
    const localImportRegex =
      /from\s+['"]@\/packages\/design-system\/ui\/([^'"]+)['"]/g;

    // Replace with imports from the barrel file
    const finalContent = updatedContent.replace(
      localImportRegex,
      "from '@repo/design-system/ui'"
    );

    // Only write if content changed
    if (content !== finalContent) {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      // File updated successfully
      return true;
    }
    return false;
  } catch (_error) {
    // Error occurred while updating file
    return false;
  }
}

// Process all story files
function processStoryFiles() {
  const files = fs.readdirSync(storiesDir);
  let _updatedCount = 0;

  for (const file of files) {
    if (file.endsWith('.stories.tsx')) {
      const filePath = path.join(storiesDir, file);
      const updated = updateImports(filePath);
      if (updated) {
        _updatedCount++;
      }
    }
  }

  // Process completed
}

processStoryFiles();
