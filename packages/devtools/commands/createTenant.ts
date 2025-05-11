import { Command } from 'commander';

export const createTenantCommand = new Command('create-tenant')
  .description('Create a new tenant')
  .requiredOption('--name <name>', 'Tenant name')
  .action((options) => {
    console.log(`[devtools] 🏢 Tenant created: ${options.name}`);
    // future: call tenant creation API or seed logic
  });