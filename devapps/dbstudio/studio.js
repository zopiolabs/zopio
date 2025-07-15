/**
 * SPDX-License-Identifier: MIT
 */

// Simple script to run Prisma Studio with the correct environment variables
const path = require('node:path');
const fs = require('node:fs');

// Define regex at top level
const ENV_LINE_REGEX = /^([^=]+)=(.*)$/;

// Path to the database .env file
const envPath = path.resolve(__dirname, '../../packages/database/.env');
const schemaPath = path.resolve(
  __dirname,
  '../../packages/database/prisma/schema.prisma'
);

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  process.stderr.write(`Error: .env file not found at ${envPath}\n`);
  process.exit(1);
}

// Read the .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse the .env file
for (const line of envContent.split('\n')) {
  const match = line.match(ENV_LINE_REGEX);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    envVars[key] = value;
  }
}

// Set environment variables
for (const [key, value] of Object.entries(envVars)) {
  process.env[key] = value;
}

process.stdout.write(
  'Starting Prisma Studio with the correct environment variables...\n'
);
process.stdout.write(`Using schema: ${schemaPath}\n`);

try {
  // Run Prisma Studio with the schema path
  // SECURITY: Use spawn with array arguments instead of execSync with string interpolation
  // to prevent command injection vulnerabilities (CWE-78)
  const { spawn } = require('node:child_process');

  // Use spawn with array of arguments to safely pass command parameters
  const studio = spawn(
    'npx',
    ['prisma', 'studio', '--schema', schemaPath, '--port', '3005'],
    {
      stdio: 'inherit',
      env: process.env,
    }
  );

  // Handle process exit
  studio.on('exit', (code) => {
    if (code !== 0) {
      process.stderr.write(`Prisma Studio exited with code ${code}\n`);
      process.exit(code);
    }
  });

  // Keep the process running until Prisma Studio exits
  process.on('SIGINT', () => {
    studio.kill('SIGINT');
  });
} catch (error) {
  process.stderr.write(`Error running Prisma Studio: ${error}\n`);
  process.exit(1);
}
