// Script to fix TypeScript configuration paths after refactoring
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directories for packages
const packagesDirectories = [
  path.resolve(__dirname, '../packages/core'),
  path.resolve(__dirname, '../packages/data'),
  path.resolve(__dirname, '../packages/addons')
];

// Find all tsconfig.json files
function findTsConfigFiles(directory) {
  const results = [];
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const tsConfigPath = path.join(filePath, 'tsconfig.json');
      if (fs.existsSync(tsConfigPath)) {
        results.push(tsConfigPath);
      }
    }
  }
  
  return results;
}

// Update tsconfig.json files
function updateTsConfigFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Skip if already has paths configuration
    if (config.compilerOptions && config.compilerOptions.paths && 
        config.compilerOptions.paths['@repo/typescript-config/*']) {
      console.log(`Skipping ${filePath} - already configured`);
      return;
    }
    
    // Determine the relative path to typescript-config
    const packageDir = path.dirname(filePath);
    const relativePathToTypescriptConfig = path.relative(
      packageDir,
      path.resolve(__dirname, '../packages/core/typescript-config')
    );
    
    // Update the configuration
    if (!config.compilerOptions) {
      config.compilerOptions = {};
    }
    
    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {};
    }
    
    config.compilerOptions.paths['@repo/typescript-config/*'] = [
      `${relativePathToTypescriptConfig.replace(/\\/g, '/')}/*`
    ];
    
    // Write the updated configuration
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Fix the testing package's empty src directory issue
function fixTestingPackages() {
  const testingPaths = [
    path.resolve(__dirname, '../packages/addons/testing'),
    path.resolve(__dirname, '../packages/testing')
  ];
  
  for (const testingPath of testingPaths) {
    if (fs.existsSync(testingPath)) {
      const srcDir = path.join(testingPath, 'src');
      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
        console.log(`Created src directory in ${testingPath}`);
      }
      
      const dummyFile = path.join(srcDir, 'index.tsx');
      if (!fs.existsSync(dummyFile)) {
        fs.writeFileSync(dummyFile, `// Placeholder file to satisfy TypeScript configuration\nexport const createTestHarness = () => {\n  return {\n    setup: () => console.log('Test harness setup'),\n    teardown: () => console.log('Test harness teardown')\n  };\n};\n`, 'utf8');
        console.log(`Created placeholder index.tsx in ${srcDir}`);
      }
    }
  }
}

// Main function
function main() {
  console.log('Fixing TypeScript configuration paths...');
  
  let tsConfigFiles = [];
  for (const dir of packagesDirectories) {
    if (fs.existsSync(dir)) {
      tsConfigFiles = tsConfigFiles.concat(findTsConfigFiles(dir));
    }
  }
  
  console.log(`Found ${tsConfigFiles.length} tsconfig.json files to update`);
  
  for (const file of tsConfigFiles) {
    updateTsConfigFile(file);
  }
  
  // Fix testing packages
  fixTestingPackages();
  
  console.log('TypeScript configuration paths fixed successfully!');
}

main();
