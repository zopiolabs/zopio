import { Command } from 'commander';

export const createUserCommand = new Command('create-user')
  .description('Create a new user')
  .requiredOption('--email <email>', 'User email')
  .option('--role <role>', 'User role', 'user')
  .action((options) => {
    console.log(`[devtools] ✅ User created: ${options.email} (role: ${options.role})`);
    // future: call user service or mock DB
  });