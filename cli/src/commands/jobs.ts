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
import chalk from 'chalk';
// Use ES module import for commander
import { Command } from 'commander';
import { isZopioProject, logger } from '../utils/helpers';

/**
 * Command to manage background jobs for the Zopio project
 */
// @ts-ignore: Command is imported as a type but used as a value
export const jobsCommand = new Command('jobs')
  .description('Manage background jobs for your Zopio project')
  .option('-l, --list', 'List all registered jobs')
  .option('-c, --create <name>', 'Create a new job')
  .option('-r, --run <name>', 'Run a specific job')
  .option('-s, --schedule <name> <cron>', 'Schedule a job with cron expression')
  .action((options) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error(
        'Not a Zopio project. Please run this command in a Zopio project directory.'
      );
      process.exit(1);
    }

    if (options.list) {
      listJobs();
    } else if (options.create) {
      createJob(options.create);
    } else if (options.run) {
      runJob(options.run);
    } else if (options.schedule) {
      // This would require additional parsing for the cron expression
      logger.info('Job scheduling is not implemented yet.');
    } else {
      jobsCommand.help();
    }
  });

/**
 * List all registered jobs in the project
 */
function listJobs(): void {
  const jobsDir = path.join(process.cwd(), 'jobs');

  if (!fs.existsSync(jobsDir)) {
    logger.info(
      'No jobs directory found. Create your first job with "zopio jobs --create <name>"'
    );
    return;
  }

  const jobs = fs
    .readdirSync(jobsDir)
    .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))
    .map((file) => path.basename(file, path.extname(file)));

  if (jobs.length === 0) {
    logger.info(
      'No jobs found. Create your first job with "zopio jobs --create <name>"'
    );
    return;
  }

  logger.info('Registered jobs:');
  for (const job of jobs) {
    logger.info(`- ${chalk.green(job)}`);
  }
}

/**
 * Create a new job with the given name
 * @param name The name of the job to create
 */
function createJob(name: string): void {
  const jobsDir = path.join(process.cwd(), 'jobs');

  // Create jobs directory if it doesn't exist
  if (!fs.existsSync(jobsDir)) {
    fs.mkdirSync(jobsDir, { recursive: true });
    logger.info(`Created jobs directory at ${chalk.green(jobsDir)}`);
  }

  const jobPath = path.join(jobsDir, `${name}.ts`);

  // Check if job already exists
  if (fs.existsSync(jobPath)) {
    logger.error(
      `Job ${chalk.red(name)} already exists at ${chalk.red(jobPath)}`
    );
    return;
  }

  // Create job file with template
  const jobTemplate = `/**
 * ${name} job
 * 
 * This job is registered with the Zopio CLI and can be run with:
 * zopio jobs --run ${name}
 */

export default async function() {
  logger.info('Running ${name} job...');
  
  // Your job logic here
  
  logger.success('${name} job completed successfully');
}
`;

  fs.writeFileSync(jobPath, jobTemplate);
  logger.info(`Created job ${chalk.green(name)} at ${chalk.green(jobPath)}`);
}

/**
 * Run a specific job by name
 * @param name The name of the job to run
 */
function runJob(name: string): void {
  const jobsDir = path.join(process.cwd(), 'jobs');
  const jobPath = path.join(jobsDir, `${name}.ts`);
  const jobPathJs = path.join(jobsDir, `${name}.js`);

  // Check if job exists
  if (!fs.existsSync(jobPath) && !fs.existsSync(jobPathJs)) {
    logger.error(`Job ${chalk.red(name)} not found at ${chalk.red(jobPath)}`);
    return;
  }

  logger.info(`Running job ${chalk.green(name)}...`);

  try {
    // In a real implementation, you would need to handle both TS and JS files
    // This is a simplified version
    logger.info('Job execution is simulated in this version.');
    logger.info(`Job ${chalk.green(name)} completed successfully`);
  } catch (error) {
    logger.error(
      `Error running job ${chalk.red(name)}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
