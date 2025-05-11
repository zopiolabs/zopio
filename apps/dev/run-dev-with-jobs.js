const { spawn } = require('node:child_process');
const path = require('node:path');

// Define paths
const devAppPath = path.resolve(__dirname);
const jobsAppPath = path.resolve(__dirname, '..', 'jobs');

// Start the dev app
console.log('Starting dev app...');
const devApp = spawn('pnpm', ['dev'], { 
  cwd: devAppPath,
  stdio: 'inherit',
  shell: true
});

// Start the jobs app
console.log('Starting jobs app...');
const jobsApp = spawn('pnpm', ['dev'], { 
  cwd: jobsAppPath,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down apps...');
  devApp.kill();
  jobsApp.kill();
  process.exit(0);
});



// Log any errors
devApp.on('error', (error) => {
  console.error('Dev app error:', error);
});

jobsApp.on('error', (error) => {
  console.error('Jobs app error:', error);
});

console.log('Both apps are running. Press Ctrl+C to stop.');
