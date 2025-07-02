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
 * Generate updated field value based on field type
 * @param field Field object with name and type
 * @returns Template string for the updated field value
 */
function getUpdatedFieldValue(field: { name: string; type: string }): string {
  if (field.type === 'string') {
    return `      ${field.name}: "Updated value"`;
  }
  if (field.type === 'number') {
    return `      ${field.name}: 999`;
  }
  return `      ${field.name}: false`;
}

/**
 * Generate updated field value as a literal value (not a string template)
 * @param field Field object with name and type
 * @returns The appropriate updated value based on type
 */
function generateUpdatedValue(type: string): string {
  if (type === 'string') {
    return '"Updated value"';
  }
  if (type === 'number') {
    return '999';
  }
  return 'false';
}

interface CrudTestingCommandOptions {
  model?: string;
  fields?: string;
  output?: string;
  framework?: string;
  api?: boolean;
  ui?: boolean;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type,age:number"
 * @returns Array of field objects
 */
function parseFields(
  fieldsStr: string
): Array<{ name: string; type: string; example?: string }> {
  if (!fieldsStr) {
    return [];
  }

  return fieldsStr.split(',').map((field) => {
    const parts = field.trim().split(':');
    const name = parts[0].trim();
    const type = parts[1]?.trim() || 'string';
    const example = parts[2]?.trim() || generateExampleValue(name, type);

    return { name, type, example };
  });
}

/**
 * Generate example value based on field name and type
 * @param name Field name
 * @param type Field type
 * @returns Example value as a string
 */
function generateExampleValue(name: string, type: string): string {
  switch (type.toLowerCase()) {
    case 'string': {
      if (name.includes('name')) {
        return '"John Doe"';
      }
      if (name.includes('email')) {
        return '"user@example.com"';
      }
      if (name.includes('phone')) {
        return '"123-456-7890"';
      }
      if (name.includes('address')) {
        return '"123 Main St"';
      }
      if (name.includes('description')) {
        return '"Sample description"';
      }
      return '"example"';
    }
    case 'number':
    case 'integer': {
      if (name.includes('age')) {
        return '30';
      }
      if (name.includes('year')) {
        return '2023';
      }
      if (name.includes('price')) {
        return '99.99';
      }
      if (name.includes('count')) {
        return '5';
      }
      return '42';
    }
    case 'boolean':
      return 'true';
    case 'date':
      return 'new Date()';
    case 'array':
      return '[]';
    case 'object':
      return '{}';
    default:
      return '"example"';
  }
}

/**
 * Generate Jest test for API endpoints
 * @param model Model name
 * @param fields Array of field objects
 * @returns Jest test file as a string
 */
function generateJestApiTest(
  model: string,
  fields: Array<{ name: string; type: string; example?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNameLower = model.toLowerCase();

  // Generate mock data
  const mockDataProperties = fields
    .map((field) => {
      return `    ${field.name}: ${field.example}`;
    })
    .join(',\n');

  // Generate updated field value for the first field (if available)
  const updatedFieldValue =
    fields.length > 0
      ? `      ${fields[0].name}: ${generateUpdatedValue(fields[0].type)}`
      : '      // No fields to update';

  return `import request from 'supertest';
import { app } from '../app';
import { ${modelName}Model } from '../models/${modelNameLower}.model';

describe('${modelName} API Endpoints', () => {
  let testId: string;
  
  // Mock data for testing
  const mock${modelName} = {
${mockDataProperties}
  };
  
  // Clear test data before tests
  beforeAll(async () => {
    await ${modelName}Model.deleteMany({});
  });
  
  // Test POST endpoint
  describe('POST /${modelNameLower}s', () => {
    it('should create a new ${modelNameLower}', async () => {
      const response = await request(app)
        .post('/${modelNameLower}s')
        .send(mock${modelName})
        .expect(201);
      
      expect(response.body).toHaveProperty('_id');
      testId = response.body._id;
      
      // Verify all fields are saved correctly
${fields.map((field) => `      expect(response.body.${field.name}).toEqual(mock${modelName}.${field.name});`).join('\n')}
    });
    
    it('should return 400 with invalid data', async () => {
      await request(app)
        .post('/${modelNameLower}s')
        .send({})
        .expect(400);
    });
  });
  
  // Test GET all endpoint
  describe('GET /${modelNameLower}s', () => {
    it('should return all ${modelNameLower}s', async () => {
      const response = await request(app)
        .get('/${modelNameLower}s')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
  
  // Test GET by ID endpoint
  describe('GET /${modelNameLower}s/:id', () => {
    it('should return a single ${modelNameLower}', async () => {
      const response = await request(app)
        .get(\`/${modelNameLower}s/\${testId}\`)
        .expect(200);
      
      expect(response.body).toHaveProperty('_id', testId);
${fields.map((field) => `      expect(response.body.${field.name}).toEqual(mock${modelName}.${field.name});`).join('\n')}
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .get('/${modelNameLower}s/nonexistentid')
        .expect(404);
    });
  });
  
  // Test PUT endpoint
  describe('PUT /${modelNameLower}s/:id', () => {
    const updatedData = {
      ...mock${modelName},
${fields.length > 0 ? `      ${fields[0].name}: ${fields[0].type === 'string' ? '"Updated value"' : fields[0].type === 'number' ? '999' : 'false'}` : '      // No fields to update'}
    };
    
    it('should update an existing ${modelNameLower}', async () => {
      const response = await request(app)
        .put(\`/${modelNameLower}s/\${testId}\`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body).toHaveProperty('_id', testId);
${fields.length > 0 ? `      expect(response.body.${fields[0].name}).toEqual(updatedData.${fields[0].name});` : '      // No fields to verify'}
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .put('/${modelNameLower}s/nonexistentid')
        .send(updatedData)
        .expect(404);
    });
  });
  
  // Test DELETE endpoint
  describe('DELETE /${modelNameLower}s/:id', () => {
    it('should delete an existing ${modelNameLower}', async () => {
      await request(app)
        .delete(\`/${modelNameLower}s/\${testId}\`)
        .expect(200);
      
      // Verify it's deleted
      await request(app)
        .get(\`/${modelNameLower}s/\${testId}\`)
        .expect(404);
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .delete('/${modelNameLower}s/nonexistentid')
        .expect(404);
    });
  });
});
`;
}

/**
 * Generate Vitest test for API endpoints
 * @param model Model name
 * @param fields Array of field objects
 * @returns Vitest test file as a string
 */
function generateVitestApiTest(
  model: string,
  fields: Array<{ name: string; type: string; example?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNameLower = model.toLowerCase();

  // Generate mock data
  const mockDataProperties = fields
    .map((field) => {
      return `    ${field.name}: ${field.example}`;
    })
    .join(',\n');

  return `import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { ${modelName}Model } from '../models/${modelNameLower}.model';

describe('${modelName} API Endpoints', () => {
  let testId: string;
  
  // Mock data for testing
  const mock${modelName} = {
${mockDataProperties}
  };
  
  // Clear test data before tests
  beforeAll(async () => {
    await ${modelName}Model.deleteMany({});
  });
  
  // Test POST endpoint
  describe('POST /${modelNameLower}s', () => {
    it('should create a new ${modelNameLower}', async () => {
      const response = await request(app)
        .post('/${modelNameLower}s')
        .send(mock${modelName})
        .expect(201);
      
      expect(response.body).toHaveProperty('_id');
      testId = response.body._id;
      
      // Verify all fields are saved correctly
${fields.map((field) => `      expect(response.body.${field.name}).toEqual(mock${modelName}.${field.name});`).join('\n')}
    });
    
    it('should return 400 with invalid data', async () => {
      await request(app)
        .post('/${modelNameLower}s')
        .send({})
        .expect(400);
    });
  });
  
  // Test GET all endpoint
  describe('GET /${modelNameLower}s', () => {
    it('should return all ${modelNameLower}s', async () => {
      const response = await request(app)
        .get('/${modelNameLower}s')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
  
  // Test GET by ID endpoint
  describe('GET /${modelNameLower}s/:id', () => {
    it('should return a single ${modelNameLower}', async () => {
      const response = await request(app)
        .get(\`/${modelNameLower}s/\${testId}\`)
        .expect(200);
      
      expect(response.body).toHaveProperty('_id', testId);
${fields.map((field) => `      expect(response.body.${field.name}).toEqual(mock${modelName}.${field.name});`).join('\n')}
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .get('/${modelNameLower}s/nonexistentid')
        .expect(404);
    });
  });
  
  // Test PUT endpoint
  describe('PUT /${modelNameLower}s/:id', () => {
    const updatedData = {
      ...mock${modelName},
${fields.length > 0 ? `      ${fields[0].name}: ${fields[0].type === 'string' ? '"Updated value"' : fields[0].type === 'number' ? '999' : 'false'}` : '      // No fields to update'}
    };
    
    it('should update an existing ${modelNameLower}', async () => {
      const response = await request(app)
        .put(\`/${modelNameLower}s/\${testId}\`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body).toHaveProperty('_id', testId);
${fields.length > 0 ? `      expect(response.body.${fields[0].name}).toEqual(updatedData.${fields[0].name});` : '      // No fields to verify'}
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .put('/${modelNameLower}s/nonexistentid')
        .send(updatedData)
        .expect(404);
    });
  });
  
  // Test DELETE endpoint
  describe('DELETE /${modelNameLower}s/:id', () => {
    it('should delete an existing ${modelNameLower}', async () => {
      await request(app)
        .delete(\`/${modelNameLower}s/\${testId}\`)
        .expect(200);
      
      // Verify it's deleted
      await request(app)
        .get(\`/${modelNameLower}s/\${testId}\`)
        .expect(404);
    });
    
    it('should return 404 for non-existent ID', async () => {
      await request(app)
        .delete('/${modelNameLower}s/nonexistentid')
        .expect(404);
    });
  });
});
`;
}

/**
 * Generate React Testing Library test for UI components
 * @param model Model name
 * @param fields Array of field objects
 * @returns React Testing Library test file as a string
 */
function generateReactTestingLibraryTest(
  model: string,
  fields: Array<{ name: string; type: string; example?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNameLower = model.toLowerCase();

  // Generate mock data
  const mockDataProperties = fields
    .map((field) => {
      return `    ${field.name}: ${field.example}`;
    })
    .join(',\n');

  return `import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ${modelName}List } from '../components/${modelNameLower}/${modelName}List';
import { ${modelName}Form } from '../components/${modelNameLower}/${modelName}Form';
import { ${modelName}Detail } from '../components/${modelNameLower}/${modelName}Detail';
import { ${modelName}Service } from '../services/${modelNameLower}.service';

// Mock the service
jest.mock('../services/${modelNameLower}.service');

describe('${modelName} Components', () => {
  // Mock data for testing
  const mock${modelName} = {
    _id: '123',
${mockDataProperties}
  };
  
  const mock${modelName}List = [mock${modelName}];
  
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  describe('${modelName}List Component', () => {
    beforeEach(() => {
      // Mock the service methods
      ${modelName}Service.getAll = jest.fn().mockResolvedValue(mock${modelName}List);
      ${modelName}Service.delete = jest.fn().mockResolvedValue({ success: true });
    });
    
    it('should render the list of ${modelNameLower}s', async () => {
      render(
        <MemoryRouter>
          <${modelName}List />
        </MemoryRouter>
      );
      
      // Check if the title is rendered
      expect(screen.getByText('${modelName}s')).toBeInTheDocument();
      
      // Wait for the data to load
      await waitFor(() => {
        // Check if the data is displayed
${fields
  .map((field) => {
    if (field.type === 'boolean') {
      return `        expect(screen.getByText('Yes')).toBeInTheDocument();`;
    }
    if (field.type === 'date') {
      return `        // Date field will be formatted, so we don't check exact value`;
    }
    return `        expect(screen.getByText(mock${modelName}.${field.name}.toString())).toBeInTheDocument();`;
  })
  .join('\n')}
      });
    });
    
    it('should handle delete action', async () => {
      render(
        <MemoryRouter>
          <${modelName}List />
        </MemoryRouter>
      );
      
      // Wait for the data to load
      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
      
      // Mock window.confirm to return true
      window.confirm = jest.fn().mockImplementation(() => true);
      
      // Click the delete button
      fireEvent.click(screen.getByText('Delete'));
      
      // Check if the service method was called
      await waitFor(() => {
        expect(${modelName}Service.delete).toHaveBeenCalledWith('123');
      });
    });
  });
  
  describe('${modelName}Form Component', () => {
    beforeEach(() => {
      // Mock the service methods
      ${modelName}Service.getById = jest.fn().mockResolvedValue(mock${modelName});
      ${modelName}Service.create = jest.fn().mockResolvedValue(mock${modelName});
      ${modelName}Service.update = jest.fn().mockResolvedValue(mock${modelName});
    });
    
    it('should render the create form', async () => {
      render(
        <MemoryRouter initialEntries={['/${modelNameLower}/create']}>
          <Routes>
            <Route path="/${modelNameLower}/create" element={<${modelName}Form />} />
          </Routes>
        </MemoryRouter>
      );
      
      // Check if the title is rendered
      expect(screen.getByText('Create ${modelName}')).toBeInTheDocument();
      
      // Check if form fields are rendered
${fields
  .map((field) => {
    return `      expect(screen.getByLabelText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}')).toBeInTheDocument();`;
  })
  .join('\n')}
    });
    
    it('should handle form submission for create', async () => {
      render(
        <MemoryRouter initialEntries={['/${modelNameLower}/create']}>
          <Routes>
            <Route path="/${modelNameLower}/create" element={<${modelName}Form />} />
          </Routes>
        </MemoryRouter>
      );
      
      // Fill in the form
${fields
  .map((field) => {
    if (field.type === 'boolean') {
      return `      fireEvent.click(screen.getByLabelText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}'));`;
    }
    return `      fireEvent.change(screen.getByLabelText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}'), { target: { value: mock${modelName}.${field.name} } });`;
  })
  .join('\n')}
      
      // Submit the form
      fireEvent.click(screen.getByText('Save'));
      
      // Check if the service method was called
      await waitFor(() => {
        expect(${modelName}Service.create).toHaveBeenCalled();
      });
    });
  });
  
  describe('${modelName}Detail Component', () => {
    beforeEach(() => {
      // Mock the service methods
      ${modelName}Service.getById = jest.fn().mockResolvedValue(mock${modelName});
      ${modelName}Service.delete = jest.fn().mockResolvedValue({ success: true });
    });
    
    it('should render the detail view', async () => {
      render(
        <MemoryRouter initialEntries={['/${modelNameLower}/123']}>
          <Routes>
            <Route path="/${modelNameLower}/:id" element={<${modelName}Detail />} />
          </Routes>
        </MemoryRouter>
      );
      
      // Check if the title is rendered
      expect(screen.getByText('${modelName} Details')).toBeInTheDocument();
      
      // Wait for the data to load
      await waitFor(() => {
        // Check if the data is displayed
${fields
  .map((field) => {
    if (field.type === 'boolean') {
      return `        expect(screen.getByText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}:')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();`;
    }
    if (field.type === 'date') {
      return `        expect(screen.getByText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}:')).toBeInTheDocument();
        // Date field will be formatted, so we don't check exact value`;
    }
    return `        expect(screen.getByText('${field.name.charAt(0).toUpperCase() + field.name.slice(1)}:')).toBeInTheDocument();
        expect(screen.getByText(mock${modelName}.${field.name}.toString())).toBeInTheDocument();`;
  })
  .join('\n')}
      });
    });
    
    it('should handle delete action', async () => {
      render(
        <MemoryRouter initialEntries={['/${modelNameLower}/123']}>
          <Routes>
            <Route path="/${modelNameLower}/:id" element={<${modelName}Detail />} />
          </Routes>
        </MemoryRouter>
      );
      
      // Wait for the data to load
      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
      
      // Mock window.confirm to return true
      window.confirm = jest.fn().mockImplementation(() => true);
      
      // Click the delete button
      fireEvent.click(screen.getByText('Delete'));
      
      // Check if the service method was called
      await waitFor(() => {
        expect(${modelName}Service.delete).toHaveBeenCalledWith('123');
      });
    });
  });
});
`;
}

/**
 * Command to generate tests for CRUD operations
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudTestingCommand = new Command('crud-testing')
  .description('Generate tests for CRUD operations')
  .option('-m, --model <name>', 'Model name')
  .option(
    '-f, --fields <fields>',
    'Fields in format "name:type:example,age:number:30"'
  )
  .option('-o, --output <directory>', 'Output directory for tests')
  .option(
    '-fw, --framework <framework>',
    'Testing framework (jest, vitest)',
    'jest'
  )
  .option('--api', 'Generate API tests')
  .option('--ui', 'Generate UI component tests')
  .action(async (options: CrudTestingCommandOptions) => {
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
      crudTestingCommand.help();
      return;
    }

    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];
    const framework = options.framework || 'jest';

    // Default to generating both API and UI tests if neither is specified
    const generateApi =
      options.api === undefined && options.ui === undefined
        ? true
        : options.api;
    const generateUi =
      options.api === undefined && options.ui === undefined ? true : options.ui;

    if (fields.length === 0) {
      logger.warning(
        'No fields specified. Use --fields <fields> to specify fields for the model.'
      );
    }

    // Determine output directory
    const outputDir = options.output || path.join(process.cwd(), 'tests');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Created output directory: ${outputDir}`);
    }

    // Generate API tests if requested
    if (generateApi) {
      let apiTest = '';
      let apiTestFileName = '';

      switch (framework.toLowerCase()) {
        case 'jest': {
          apiTest = generateJestApiTest(modelName, fields);
          apiTestFileName = `${modelName.toLowerCase()}.api.test.js`;
          break;
        }
        case 'vitest': {
          apiTest = generateVitestApiTest(modelName, fields);
          apiTestFileName = `${modelName.toLowerCase()}.api.test.ts`;
          break;
        }
        default: {
          apiTest = generateJestApiTest(modelName, fields);
          apiTestFileName = `${modelName.toLowerCase()}.api.test.js`;
        }
      }

      const apiTestPath = path.join(outputDir, apiTestFileName);

      fs.writeFileSync(apiTestPath, apiTest);
      logger.success(`Generated API tests: ${chalk.green(apiTestPath)}`);
    }

    // Generate UI component tests if requested
    if (generateUi) {
      const uiTest = generateReactTestingLibraryTest(modelName, fields);
      const uiTestFileName = `${modelName.toLowerCase()}.ui.test.jsx`;
      const uiTestPath = path.join(outputDir, uiTestFileName);

      fs.writeFileSync(uiTestPath, uiTest);
      logger.success(
        `Generated UI component tests: ${chalk.green(uiTestPath)}`
      );
    }

    logger.info('\nYou can now run these tests with:');

    if (framework.toLowerCase() === 'jest') {
      logger.info('npm test');
    } else if (framework.toLowerCase() === 'vitest') {
      logger.info('npm run test');
    }
  });
