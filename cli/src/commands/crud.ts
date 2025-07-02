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
 * Command to generate CRUD operations for a Zopio project
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudCommand = new Command('crud')
  .description('Generate CRUD operations for your Zopio project')
  .option('-m, --model <name>', 'Model name for CRUD operations')
  .option('-f, --fields <fields>', 'Fields for the model (comma-separated)')
  .option('-a, --all', 'Generate all CRUD components (API, UI, validation)')
  .option('--api-only', 'Generate only API endpoints')
  .option('--ui-only', 'Generate only UI components')
  .action((options) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error(
        'Not a Zopio project. Please run this command in a Zopio project directory.'
      );
      process.exit(1);
    }

    if (!options.model) {
      logger.error(
        'Model name is required. Use --model <name> to specify a model.'
      );
      crudCommand.help();
      return;
    }

    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];

    if (fields.length === 0) {
      logger.warning(
        'No fields specified. Use --fields <fields> to specify fields for the model.'
      );
    }

    if (options.all || (!options.apiOnly && !options.uiOnly)) {
      generateAllCrud(modelName, fields);
    } else if (options.apiOnly) {
      generateApiCrud(modelName, fields);
    } else if (options.uiOnly) {
      generateUiCrud(modelName, fields);
    }
  });

/**
 * Parse comma-separated fields into an array of field objects
 * @param fieldsStr Comma-separated string of fields
 * @returns Array of field objects with name and type
 */
function parseFields(fieldsStr: string): Array<{ name: string; type: string }> {
  return fieldsStr.split(',').map((field) => {
    const [name, type = 'string'] = field.trim().split(':');
    return { name, type };
  });
}

/**
 * Generate all CRUD components for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 */
function generateAllCrud(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): void {
  logger.info(
    `Generating all CRUD components for model ${chalk.green(modelName)}...`
  );

  generateApiCrud(modelName, fields);
  generateUiCrud(modelName, fields);

  logger.info(`CRUD generation completed for model ${chalk.green(modelName)}.`);
}

/**
 * Generate API endpoints for CRUD operations
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 */
function generateApiCrud(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): void {
  logger.info(
    `Generating API endpoints for model ${chalk.green(modelName)}...`
  );

  const apiDir = path.join(
    process.cwd(),
    'src',
    'api',
    modelName.toLowerCase()
  );

  // Create API directory if it doesn't exist
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
    logger.info(`Created API directory at ${chalk.green(apiDir)}`);
  }

  // Generate controller file
  const controllerPath = path.join(
    apiDir,
    `${modelName.toLowerCase()}.controller.ts`
  );
  const controllerContent = generateControllerContent(modelName);
  fs.writeFileSync(controllerPath, controllerContent);
  logger.info(`Created controller at ${chalk.green(controllerPath)}`);

  // Generate model file
  const modelPath = path.join(apiDir, `${modelName.toLowerCase()}.model.ts`);
  const modelContent = generateModelContent(modelName, fields);
  fs.writeFileSync(modelPath, modelContent);
  logger.info(`Created model at ${chalk.green(modelPath)}`);

  // Generate service file
  const servicePath = path.join(
    apiDir,
    `${modelName.toLowerCase()}.service.ts`
  );
  const serviceContent = generateServiceContent(modelName);
  fs.writeFileSync(servicePath, serviceContent);
  logger.info(`Created service at ${chalk.green(servicePath)}`);

  // Generate routes file
  const routesPath = path.join(apiDir, `${modelName.toLowerCase()}.routes.ts`);
  const routesContent = generateRoutesContent(modelName);
  fs.writeFileSync(routesPath, routesContent);
  logger.info(`Created routes at ${chalk.green(routesPath)}`);

  logger.info(
    `API endpoints generation completed for model ${chalk.green(modelName)}.`
  );
}

/**
 * Generate UI components for CRUD operations
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 */
function generateUiCrud(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): void {
  logger.info(
    `Generating UI components for model ${chalk.green(modelName)}...`
  );

  const componentsDir = path.join(
    process.cwd(),
    'src',
    'components',
    modelName.toLowerCase()
  );

  // Create components directory if it doesn't exist
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
    logger.info(
      `Created components directory at ${chalk.green(componentsDir)}`
    );
  }

  // Generate list component
  const listComponentPath = path.join(componentsDir, `${modelName}List.tsx`);
  const listComponentContent = generateListComponentContent(modelName, fields);
  fs.writeFileSync(listComponentPath, listComponentContent);
  logger.info(`Created list component at ${chalk.green(listComponentPath)}`);

  // Generate detail component
  const detailComponentPath = path.join(
    componentsDir,
    `${modelName}Detail.tsx`
  );
  const detailComponentContent = generateDetailComponentContent(
    modelName,
    fields
  );
  fs.writeFileSync(detailComponentPath, detailComponentContent);
  logger.info(
    `Created detail component at ${chalk.green(detailComponentPath)}`
  );

  // Generate form component
  const formComponentPath = path.join(componentsDir, `${modelName}Form.tsx`);
  const formComponentContent = generateFormComponentContent(modelName, fields);
  fs.writeFileSync(formComponentPath, formComponentContent);
  logger.info(`Created form component at ${chalk.green(formComponentPath)}`);

  logger.info(
    `UI components generation completed for model ${chalk.green(modelName)}.`
  );
}

/**
 * Generate controller content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns Controller content as a string
 */
function generateControllerContent(modelName: string): string {
  return `import { Request, Response } from 'express';
import { ${modelName}Service } from './${modelName.toLowerCase()}.service';

const service = new ${modelName}Service();

export class ${modelName}Controller {
  async getAll(req: Request, res: Response) {
    try {
      const items = await service.findAll();
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const item = await service.findById(id);
      
      if (!item) {
        return res.status(404).json({ error: '${modelName} not found' });
      }
      
      return res.json(item);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newItem = await service.create(req.body);
      return res.status(201).json(newItem);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedItem = await service.update(id, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({ error: '${modelName} not found' });
      }
      
      return res.json(updatedItem);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const success = await service.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: '${modelName} not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
`;
}

/**
 * Generate model content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns Model content as a string
 */
function generateModelContent(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): string {
  const fieldsDefinition = fields
    .map((field) => {
      return `  ${field.name}: ${field.type};`;
    })
    .join('\n');

  return `export interface ${modelName} {
  id: string;
${fieldsDefinition}
  createdAt: Date;
  updatedAt: Date;
}
`;
}

/**
 * Generate service content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns Service content as a string
 */
function generateServiceContent(modelName: string): string {
  return `import { ${modelName} } from './${modelName.toLowerCase()}.model';

export class ${modelName}Service {
  private items: ${modelName}[] = [];

  async findAll(): Promise<${modelName}[]> {
    return this.items;
  }

  async findById(id: string): Promise<${modelName} | undefined> {
    return this.items.find(item => item.id === id);
  }

  async create(data: Omit<${modelName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${modelName}> {
    const newItem: ${modelName} = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<${modelName}>): Promise<${modelName} | undefined> {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedItem: ${modelName} = {
      ...this.items[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.items.splice(index, 1);
    return true;
  }
}
`;
}

/**
 * Generate routes content for a model
 * @param modelName Name of the model
 * @returns Routes content as a string
 */
function generateRoutesContent(modelName: string): string {
  return `import { Router } from 'express';
import { ${modelName}Controller } from './${modelName.toLowerCase()}.controller';

const router = Router();
const controller = new ${modelName}Controller();

// Get all ${modelName}s
router.get('/', controller.getAll.bind(controller));

// Get ${modelName} by ID
router.get('/:id', controller.getById.bind(controller));

// Create new ${modelName}
router.post('/', controller.create.bind(controller));

// Update ${modelName}
router.put('/:id', controller.update.bind(controller));

// Delete ${modelName}
router.delete('/:id', controller.delete.bind(controller));

export default router;
`;
}

/**
 * Generate list component content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns List component content as a string
 */
function generateListComponentContent(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): string {
  const tableHeaders = fields
    .map((field) => {
      return `            <th>${field.name.charAt(0).toUpperCase() + field.name.slice(1)}</th>`;
    })
    .join('\n');

  const tableRows = fields
    .map((field) => {
      return `              <td>{item.${field.name}}</td>`;
    })
    .join('\n');

  return `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ${modelName} {
  id: string;
${fields.map((field) => `  ${field.name}: ${field.type};`).join('\n')}
  createdAt: Date;
  updatedAt: Date;
}

export const ${modelName}List: React.FC = () => {
  const [items, setItems] = useState<${modelName}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/${modelName.toLowerCase()}');
        if (!response.ok) {
          throw new Error('Failed to fetch ${modelName}s');
        }
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ${modelName}?')) {
      try {
        const response = await fetch(\`/api/${modelName.toLowerCase()}/\${id}\`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete ${modelName}');
        }

        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>${modelName} List</h1>
      <Link to="/${modelName.toLowerCase()}/new" className="btn btn-primary mb-3">
        Create New ${modelName}
      </Link>

      {items.length === 0 ? (
        <p>No ${modelName}s found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
${tableHeaders}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
${tableRows}
                <td>
                  <Link to={\`/${modelName.toLowerCase()}/\${item.id}\`} className="btn btn-sm btn-info me-2">
                    View
                  </Link>
                  <Link to={\`/${modelName.toLowerCase()}/\${item.id}/edit\`} className="btn btn-sm btn-warning me-2">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
`;
}

/**
 * Generate detail component content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns Detail component content as a string
 */
function generateDetailComponentContent(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): string {
  const detailFields = fields
    .map((field) => {
      return `      <div className="mb-3">
        <strong>${field.name.charAt(0).toUpperCase() + field.name.slice(1)}:</strong> {item.${field.name}}
      </div>`;
    })
    .join('\n');

  return `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ${modelName} {
  id: string;
${fields.map((field) => `  ${field.name}: ${field.type};`).join('\n')}
  createdAt: Date;
  updatedAt: Date;
}

interface RouteParams {
  id: string;
}

export const ${modelName}Detail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [item, setItem] = useState<${modelName} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(\`/api/${modelName.toLowerCase()}/\${id}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch ${modelName}');
        }
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>${modelName} not found</div>;
  }

  return (
    <div>
      <h1>${modelName} Details</h1>
      
${detailFields}
      
      <div className="mb-3">
        <strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}
      </div>
      
      <div className="mb-3">
        <strong>Updated At:</strong> {new Date(item.updatedAt).toLocaleString()}
      </div>
      
      <div className="mt-4">
        <Link to="/${modelName.toLowerCase()}" className="btn btn-secondary me-2">
          Back to List
        </Link>
        <Link to={\`/${modelName.toLowerCase()}/\${id}/edit\`} className="btn btn-primary">
          Edit
        </Link>
      </div>
    </div>
  );
};
`;
}

/**
 * Generate form component content for a model
 * @param modelName Name of the model
 * @param fields Array of field objects for the model
 * @returns Form component content as a string
 */
function generateFormComponentContent(
  modelName: string,
  fields: Array<{ name: string; type: string }>
): string {
  const formFields = fields
    .map((field) => {
      let inputType = 'text';
      if (field.type === 'number') {
        inputType = 'number';
      }
      if (field.type === 'boolean') {
        inputType = 'checkbox';
      }
      if (field.type === 'Date') {
        inputType = 'datetime-local';
      }

      if (inputType === 'checkbox') {
        return `        <div className="mb-3 form-check">
          <input
            type="${inputType}"
            className="form-check-input"
            id="${field.name}"
            name="${field.name}"
            checked={formData.${field.name} as boolean}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="${field.name}">
            ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </label>
        </div>`;
      }

      return `        <div className="mb-3">
          <label htmlFor="${field.name}" className="form-label">
            ${field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </label>
          <input
            type="${inputType}"
            className="form-control"
            id="${field.name}"
            name="${field.name}"
            value={formData.${field.name} as string}
            onChange={handleChange}
            required
          />
        </div>`;
    })
    .join('\n');

  const initialFormData = fields
    .map((field) => {
      if (field.type === 'number') {
        return `    ${field.name}: 0,`;
      }
      if (field.type === 'boolean') {
        return `    ${field.name}: false,`;
      }
      if (field.type === 'Date') {
        return `    ${field.name}: new Date(),`;
      }
      return `    ${field.name}: '',`;
    })
    .join('\n');

  return `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ${modelName} {
  id: string;
${fields.map((field) => `  ${field.name}: ${field.type};`).join('\n')}
  createdAt: Date;
  updatedAt: Date;
}

interface RouteParams {
  id?: string;
}

export const ${modelName}Form: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Partial<${modelName}>>({
${initialFormData}
  });
  
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchItem = async () => {
        try {
          const response = await fetch(\`/api/${modelName.toLowerCase()}/\${id}\`);
          if (!response.ok) {
            throw new Error('Failed to fetch ${modelName}');
          }
          const data = await response.json();
          setFormData(data);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      };

      fetchItem();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = isEditMode 
        ? \`/api/${modelName.toLowerCase()}/\${id}\` 
        : \`/api/${modelName.toLowerCase()}\`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(\`Failed to \${isEditMode ? 'update' : 'create'} ${modelName}\`);
      }

      navigate(\`/${modelName.toLowerCase()}\`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{isEditMode ? 'Edit' : 'Create'} ${modelName}</h1>
      
      <form onSubmit={handleSubmit}>
${formFields}
        
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update' : 'Create'}
        </button>
        
        <button 
          type="button" 
          className="btn btn-secondary ms-2"
          onClick={() => navigate(\`/${modelName.toLowerCase()}\`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
`;
}
