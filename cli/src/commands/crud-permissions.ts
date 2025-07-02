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

interface CrudPermissionsCommandOptions {
  model?: string;
  output?: string;
  roles?: string;
}

/**
 * Parse roles string into an array of role objects
 * @param rolesStr Roles string in format "admin:all,user:read,editor:read,write"
 * @returns Array of role objects
 */
function parseRoles(
  rolesStr: string
): Array<{ role: string; permissions: string[] }> {
  if (!rolesStr) {
    return [];
  }

  return rolesStr.split(',').map((roleStr) => {
    const [role, permissionsStr = 'read'] = roleStr.trim().split(':');
    const permissions = permissionsStr.split(',');

    return {
      role: role.trim(),
      permissions: permissions.map((p) => p.trim()),
    };
  });
}

/**
 * Generate a permissions configuration file
 * @param model Model name
 * @param roles Array of role objects
 * @returns Permissions configuration as a string
 */
function generatePermissionsConfig(
  model: string,
  roles: Array<{ role: string; permissions: string[] }>
): string {
  const modelName = model.toLowerCase();
  const permissionsObj: Record<string, Record<string, string[]>> = {
    [modelName]: {},
  };

  for (const { role, permissions } of roles) {
    permissionsObj[modelName][role] = permissions;
  }

  return `/**
 * Permissions configuration for ${model}
 */
export const ${modelName}Permissions = ${JSON.stringify(permissionsObj, null, 2)};
`;
}

/**
 * Generate a permissions middleware
 * @param model Model name
 * @returns Permissions middleware as a string
 */
function generatePermissionsMiddleware(model: string): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNameLower = model.toLowerCase();

  return `import { Request, Response, NextFunction } from 'express';
import { ${modelNameLower}Permissions } from '../config/${modelNameLower}.permissions';

/**
 * Check if a user has permission to perform an action on ${modelName}
 * @param action Action to check (read, write, update, delete)
 * @returns Express middleware
 */
export const check${modelName}Permission = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get user role from request (this depends on your authentication system)
    const userRole = req.user?.role || 'guest';
    
    // Check if user has permission
    const permissions = ${modelNameLower}Permissions.${modelNameLower}[userRole] || [];
    
    if (permissions.includes(action) || permissions.includes('all')) {
      // User has permission, proceed
      next();
    } else {
      // User doesn't have permission
      res.status(403).json({
        error: 'Forbidden',
        message: \`You don't have permission to \${action} ${modelNameLower}\`
      });
    }
  };
};

/**
 * ${modelName} permission middleware factory
 */
export const ${modelName}PermissionMiddleware = {
  /**
   * Check if user can read ${modelNameLower}s
   */
  read: check${modelName}Permission('read'),
  
  /**
   * Check if user can create ${modelNameLower}s
   */
  create: check${modelName}Permission('create'),
  
  /**
   * Check if user can update ${modelNameLower}s
   */
  update: check${modelName}Permission('update'),
  
  /**
   * Check if user can delete ${modelNameLower}s
   */
  delete: check${modelName}Permission('delete')
};
`;
}

/**
 * Generate a permissions hook for React
 * @param model Model name
 * @returns Permissions hook as a string
 */
function generatePermissionsHook(model: string): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNameLower = model.toLowerCase();

  return `import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ${modelNameLower}Permissions } from '../config/${modelNameLower}.permissions';

/**
 * Hook to check ${modelName} permissions
 * @returns Object with permission check functions
 */
export const use${modelName}Permissions = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role || 'guest';
  
  const permissions = ${modelNameLower}Permissions.${modelNameLower}[userRole] || [];
  const hasPermission = (action: string) => permissions.includes(action) || permissions.includes('all');
  
  return {
    /**
     * Check if user can read ${modelNameLower}s
     */
    canRead: hasPermission('read'),
    
    /**
     * Check if user can create ${modelNameLower}s
     */
    canCreate: hasPermission('create'),
    
    /**
     * Check if user can update ${modelNameLower}s
     */
    canUpdate: hasPermission('update'),
    
    /**
     * Check if user can delete ${modelNameLower}s
     */
    canDelete: hasPermission('delete'),
    
    /**
     * Check if user has a specific permission
     * @param action Action to check
     * @returns Whether user has permission
     */
    can: (action: string) => hasPermission(action)
  };
};
`;
}

/**
 * Command to generate CRUD permissions
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudPermissionsCommand = new Command('crud-permissions')
  .description('Generate permissions configuration and middleware for a model')
  .option('-m, --model <name>', 'Model name')
  .option(
    '-r, --roles <roles>',
    'Roles and permissions in format "admin:all,user:read,editor:read,write"'
  )
  .option('-o, --output <directory>', 'Output directory for permissions files')
  .action((options: CrudPermissionsCommandOptions) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error(
        'Not a Zopio project. Please run this command in a Zopio project directory.'
      );
      process.exit(1);
    }

    if (!options.model) {
      logger.error(
        'Model name is required. Use --model <name> to specify a model name.'
      );
      crudPermissionsCommand.help();
      return;
    }

    const modelName = options.model;
    const roles = options.roles
      ? parseRoles(options.roles)
      : [
          { role: 'admin', permissions: ['all'] },
          { role: 'user', permissions: ['read'] },
          { role: 'editor', permissions: ['read', 'update'] },
        ];

    // Determine output directories
    const baseDir = options.output || process.cwd();
    const configDir = path.join(baseDir, 'src', 'config');
    const middlewareDir = path.join(baseDir, 'src', 'middleware');
    const hooksDir = path.join(baseDir, 'src', 'hooks');

    // Create directories if they don't exist
    for (const dir of [configDir, middlewareDir, hooksDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${chalk.green(dir)}`);
      }
    }

    // Generate permissions configuration
    const permissionsConfig = generatePermissionsConfig(modelName, roles);
    const configPath = path.join(
      configDir,
      `${modelName.toLowerCase()}.permissions.ts`
    );

    fs.writeFileSync(configPath, permissionsConfig);
    logger.success(
      `Generated permissions configuration: ${chalk.green(configPath)}`
    );

    // Generate permissions middleware
    const permissionsMiddleware = generatePermissionsMiddleware(modelName);
    const middlewarePath = path.join(
      middlewareDir,
      `${modelName.toLowerCase()}.permissions.ts`
    );

    fs.writeFileSync(middlewarePath, permissionsMiddleware);
    logger.success(
      `Generated permissions middleware: ${chalk.green(middlewarePath)}`
    );

    // Generate permissions hook
    const permissionsHook = generatePermissionsHook(modelName);
    const hookPath = path.join(hooksDir, `use${modelName}Permissions.ts`);

    fs.writeFileSync(hookPath, permissionsHook);
    logger.success(`Generated permissions hook: ${chalk.green(hookPath)}`);

    logger.info(
      '\nYou can now use these files to implement permissions in your application.'
    );
    logger.info('\nExample usage in Express routes:');
    logger.info(`
import { ${modelName}PermissionMiddleware } from './middleware/${modelName.toLowerCase()}.permissions';

// Apply middleware to routes
router.get('/${modelName.toLowerCase()}', ${modelName}PermissionMiddleware.read, controller.getAll);
router.post('/${modelName.toLowerCase()}', ${modelName}PermissionMiddleware.create, controller.create);
router.put('/${modelName.toLowerCase()}/:id', ${modelName}PermissionMiddleware.update, controller.update);
router.delete('/${modelName.toLowerCase()}/:id', ${modelName}PermissionMiddleware.delete, controller.delete);
`);

    logger.info('\nExample usage in React components:');
    logger.info(`
import { use${modelName}Permissions } from './hooks/use${modelName}Permissions';

function ${modelName}Component() {
  const { canRead, canCreate, canUpdate, canDelete } = use${modelName}Permissions();
  
  return (
    <div>
      {canRead && <${modelName}List />}
      {canCreate && <button>Create ${modelName}</button>}
      {canUpdate && <button>Edit ${modelName}</button>}
      {canDelete && <button>Delete ${modelName}</button>}
    </div>
  );
}
`);
  });
