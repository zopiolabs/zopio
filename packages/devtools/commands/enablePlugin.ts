import { Command } from 'commander';

export const enablePluginCommand = new Command('enable-plugin')
  .description('Enable a plugin by ID')
  .requiredOption('--id <id>', 'Plugin ID')
  .action((options) => {
    console.log(`[devtools] 🔌 Plugin enabled: ${options.id}`);
    // future: interact with plugin registry / config
  });