#!/usr/bin/env node
import { program } from 'commander';
import { createUserCommand } from './commands/createUser';
import { createTenantCommand } from './commands/createTenant';
import { enablePluginCommand } from './commands/enablePlugin';

program.name('zopio').description('Zopio CLI Devtools').version('0.1.0');

program.addCommand(createUserCommand);
program.addCommand(createTenantCommand);
program.addCommand(enablePluginCommand);

program.parse();