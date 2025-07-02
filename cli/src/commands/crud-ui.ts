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
// Use ES module import for commander
import { Command } from 'commander';
import { isZopioProject, logger } from '../utils/helpers';

interface CrudUiCommandOptions {
  model?: string;
  output?: string;
  fields?: string;
  theme?: string;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type,age:number"
 * @returns Array of field objects
 */
function parseFields(
  fieldsStr: string
): Array<{ name: string; type: string; label?: string }> {
  if (!fieldsStr) {
    return [];
  }

  return fieldsStr.split(',').map((field) => {
    const parts = field.trim().split(':');
    const name = parts[0].trim();
    const type = parts[1]?.trim() || 'string';
    const label =
      parts[2]?.trim() || name.charAt(0).toUpperCase() + name.slice(1);

    return { name, type, label };
  });
}

/**
 * Generate a React component for listing records
 * @param model Model name
 * @param fields Array of field objects
 * @returns React component as a string
 */
function generateListComponent(
  model: string,
  fields: Array<{ name: string; type: string; label?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  const modelNamePlural = `${modelName}s`;

  // Generate table headers
  const tableHeaders = fields
    .map((field) => `            <th>${field.label || field.name}</th>`)
    .join('\n');

  // Generate table cells
  const tableCells = fields
    .map((field) => {
      if (field.type === 'date') {
        return `              <td>{new Date(item.${field.name}).toLocaleDateString()}</td>`;
      }
      if (field.type === 'boolean') {
        return `              <td>{item.${field.name} ? 'Yes' : 'No'}</td>`;
      }
      return `              <td>{item.${field.name}}</td>`;
    })
    .join('\n');

  return `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { ${modelName}Service } from '../services/${model.toLowerCase()}.service';

/**
 * ${modelNamePlural} List Component
 */
export const ${modelNamePlural}List = () => {
  const [${model.toLowerCase()}s, set${modelNamePlural}] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ${modelName}Service.getAll();
      set${modelNamePlural}(data);
      setError(null);
    } catch (err) {
      setError('Failed to load ${model.toLowerCase()}s. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ${model.toLowerCase()}?')) {
      try {
        await ${modelName}Service.delete(id);
        await loadData();
      } catch (err) {
        setError('Failed to delete ${model.toLowerCase()}. ' + err.message);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h1>${modelNamePlural}</h1>
        </Col>
        <Col xs="auto">
          <Link to="/${model.toLowerCase()}/create">
            <Button variant="primary">Create New ${modelName}</Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
${tableHeaders}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {${model.toLowerCase()}s.length === 0 ? (
              <tr>
                <td colSpan={${fields.length + 1}} className="text-center">
                  No ${model.toLowerCase()}s found
                </td>
              </tr>
            ) : (
              ${model.toLowerCase()}s.map((item) => (
                <tr key={item.id}>
${tableCells}
                <td>
                  <Link to={\`/${model.toLowerCase()}/\${item.id}\`} className="btn btn-info btn-sm me-2">
                    View
                  </Link>
                  <Link to={\`/${model.toLowerCase()}/edit/\${item.id}\`} className="btn btn-primary btn-sm me-2">
                    Edit
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
`;
}

/**
 * Generate a React component for creating/editing records
 * @param model Model name
 * @param fields Array of field objects
 * @returns React component as a string
 */
function generateFormComponent(
  model: string,
  fields: Array<{ name: string; type: string; label?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  // Generate form fields
  const formFields = fields
    .map((field) => {
      let inputField = '';

      switch (field.type) {
        case 'boolean':
          inputField = `
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="${field.name}"
                label="${field.label || field.name}"
                checked={formData.${field.name}}
                onChange={(e) => setFormData({...formData, ${field.name}: e.target.checked})}
              />
            </Form.Group>`;
          break;
        case 'date':
          inputField = `
            <Form.Group className="mb-3">
              <Form.Label>${field.label || field.name}</Form.Label>
              <Form.Control
                type="date"
                name="${field.name}"
                value={formData.${field.name} ? new Date(formData.${field.name}).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
              />
            </Form.Group>`;
          break;
        case 'number':
        case 'integer':
          inputField = `
            <Form.Group className="mb-3">
              <Form.Label>${field.label || field.name}</Form.Label>
              <Form.Control
                type="number"
                name="${field.name}"
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({...formData, ${field.name}: Number(e.target.value)})}
              />
            </Form.Group>`;
          break;
        case 'textarea':
          inputField = `
            <Form.Group className="mb-3">
              <Form.Label>${field.label || field.name}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="${field.name}"
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
              />
            </Form.Group>`;
          break;
        default:
          inputField = `
            <Form.Group className="mb-3">
              <Form.Label>${field.label || field.name}</Form.Label>
              <Form.Control
                type="text"
                name="${field.name}"
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
              />
            </Form.Group>`;
      }

      return inputField;
    })
    .join('');

  // Generate initial form data
  const formFieldsContent = fields
    .map((field) => {
      let defaultValue: string | number | boolean | null = '';

      switch (field.type) {
        case 'boolean':
          defaultValue = false;
          break;
        case 'number':
        case 'integer':
          defaultValue = 0;
          break;
        case 'date':
          defaultValue = null;
          break;
        default:
          defaultValue = '';
      }

      return `  ${field.name}: ${JSON.stringify(defaultValue)}`;
    })
    .join(',\n');

  const initialFormData = `{
${formFieldsContent}
}`;

  return `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { ${modelName}Service } from '../services/${model.toLowerCase()}.service';

/**
 * ${modelName} Form Component
 */
export const ${modelName}Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState(${initialFormData});
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ${modelName}Service.getById(id);
      setFormData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load ${model.toLowerCase()}. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      if (isEditMode) {
        await ${modelName}Service.update(id, formData);
      } else {
        await ${modelName}Service.create(formData);
      }
      
      navigate('/${model.toLowerCase()}');
    } catch (err) {
      setError('Failed to save ${model.toLowerCase()}. ' + err.message);
      setSaving(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>{isEditMode ? 'Edit' : 'Create'} ${modelName}</h1>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
${formFields}
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/${model.toLowerCase()}')}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};
`;
}

/**
 * Generate a React component for viewing a single record
 * @param model Model name
 * @param fields Array of field objects
 * @returns React component as a string
 */
function generateDetailComponent(
  model: string,
  fields: Array<{ name: string; type: string; label?: string }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  // Generate detail fields
  const detailFields = fields
    .map((field) => {
      let displayValue = '';

      switch (field.type) {
        case 'boolean':
          displayValue = `{${model.toLowerCase()}.${field.name} ? 'Yes' : 'No'}`;
          break;
        case 'date':
          displayValue = `{${model.toLowerCase()}.${field.name} ? new Date(${model.toLowerCase()}.${field.name}).toLocaleDateString() : '-'}`;
          break;
        default:
          displayValue = `{${model.toLowerCase()}.${field.name} || '-'}`;
      }

      return `
            <Row className="mb-2">
              <Col sm={3} className="fw-bold">${field.label || field.name}:</Col>
              <Col>${displayValue}</Col>
            </Row>`;
    })
    .join('');

  return `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { ${modelName}Service } from '../services/${model.toLowerCase()}.service';

/**
 * ${modelName} Detail Component
 */
export const ${modelName}Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [${model.toLowerCase()}, set${modelName}] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ${modelName}Service.getById(id);
      set${modelName}(data);
      setError(null);
    } catch (err) {
      setError('Failed to load ${model.toLowerCase()}. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ${model.toLowerCase()}?')) {
      try {
        await ${modelName}Service.delete(id);
        navigate('/${model.toLowerCase()}');
      } catch (err) {
        setError('Failed to delete ${model.toLowerCase()}. ' + err.message);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h1>${modelName} Details</h1>
        </Col>
        <Col xs="auto">
          <Link to="/${model.toLowerCase()}" className="btn btn-secondary me-2">
            Back to List
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : ${model.toLowerCase()} ? (
        <Card>
          <Card.Body>
${detailFields}
          </Card.Body>
          <Card.Footer>
            <Link to={\`/${model.toLowerCase()}/edit/\${id}\`} className="btn btn-primary me-2">
              Edit
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        <Alert variant="warning">
          ${modelName} not found
        </Alert>
      )}
    </Container>
  );
};
`;
}

/**
 * Generate a service for API calls
 * @param model Model name
 * @returns Service as a string
 */
function generateService(model: string): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  return `import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * ${modelName} Service
 */
export const ${modelName}Service = {
  /**
   * Get all ${model.toLowerCase()}s
   * @returns Promise with array of ${model.toLowerCase()}s
   */
  async getAll() {
    const response = await axios.get(\`\${API_URL}/${model.toLowerCase()}s\`);
    return response.data;
  },
  
  /**
   * Get a ${model.toLowerCase()} by ID
   * @param id ${modelName} ID
   * @returns Promise with ${model.toLowerCase()} data
   */
  async getById(id) {
    const response = await axios.get(\`\${API_URL}/${model.toLowerCase()}s/\${id}\`);
    return response.data;
  },
  
  /**
   * Create a new ${model.toLowerCase()}
   * @param data ${modelName} data
   * @returns Promise with created ${model.toLowerCase()}
   */
  async create(data) {
    const response = await axios.post(\`\${API_URL}/${model.toLowerCase()}s\`, data);
    return response.data;
  },
  
  /**
   * Update a ${model.toLowerCase()}
   * @param id ${modelName} ID
   * @param data ${modelName} data
   * @returns Promise with updated ${model.toLowerCase()}
   */
  async update(id, data) {
    const response = await axios.put(\`\${API_URL}/${model.toLowerCase()}s/\${id}\`, data);
    return response.data;
  },
  
  /**
   * Delete a ${model.toLowerCase()}
   * @param id ${modelName} ID
   * @returns Promise with deletion result
   */
  async delete(id) {
    const response = await axios.delete(\`\${API_URL}/${model.toLowerCase()}s/\${id}\`);
    return response.data;
  }
};
`;
}

/**
 * Command to generate CRUD UI components
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudUiCommand = new Command('crud-ui')
  .description('Generate React components for CRUD operations')
  .option('-m, --model <name>', 'Model name')
  .option(
    '-f, --fields <fields>',
    'Fields in format "name:type:label,age:number:Age"'
  )
  .option('-o, --output <directory>', 'Output directory for UI components')
  .option('-t, --theme <theme>', 'UI theme (bootstrap, material)', 'bootstrap')
  .action((options: CrudUiCommandOptions) => {
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
      crudUiCommand.help();
      return;
    }

    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];

    if (fields.length === 0) {
      logger.warning(
        'No fields specified. Use --fields <fields> to specify fields for the model.'
      );
    }

    // Determine output directory
    const outputDir =
      options.output ||
      path.join(process.cwd(), 'src', 'components', modelName.toLowerCase());

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Created output directory: ${outputDir}`);
    }

    // Create services directory if it doesn't exist
    const servicesDir = path.join(process.cwd(), 'src', 'services');
    if (!fs.existsSync(servicesDir)) {
      fs.mkdirSync(servicesDir, { recursive: true });
      logger.info(`Created services directory: ${servicesDir}`);
    }

    // Generate list component
    const listComponent = generateListComponent(modelName, fields);
    const listComponentPath = path.join(outputDir, `${modelName}List.jsx`);

    fs.writeFileSync(listComponentPath, listComponent);
    logger.success(`Generated list component: ${listComponentPath}`);

    // Generate form component
    const formComponent = generateFormComponent(modelName, fields);
    const formComponentPath = path.join(outputDir, `${modelName}Form.jsx`);

    fs.writeFileSync(formComponentPath, formComponent);
    logger.success(`Generated form component: ${formComponentPath}`);

    // Generate detail component
    const detailComponent = generateDetailComponent(modelName, fields);
    const detailComponentPath = path.join(outputDir, `${modelName}Detail.jsx`);

    fs.writeFileSync(detailComponentPath, detailComponent);
    logger.success(`Generated detail component: ${detailComponentPath}`);

    // Generate service
    const service = generateService(modelName);
    const servicePath = path.join(
      servicesDir,
      `${modelName.toLowerCase()}.service.js`
    );

    fs.writeFileSync(servicePath, service);
    logger.success(`Generated service: ${servicePath}`);

    logger.info(
      '\nYou can now use these components in your React application.'
    );
    logger.info('Add the following routes to your router configuration:');
    logger.info(`
import { ${modelName}List } from './components/${modelName.toLowerCase()}/${modelName}List';
import { ${modelName}Form } from './components/${modelName.toLowerCase()}/${modelName}Form';
import { ${modelName}Detail } from './components/${modelName.toLowerCase()}/${modelName}Detail';

<Route path="/${modelName.toLowerCase()}" element={<${modelName}List />} />
<Route path="/${modelName.toLowerCase()}/create" element={<${modelName}Form />} />
<Route path="/${modelName.toLowerCase()}/edit/:id" element={<${modelName}Form />} />
<Route path="/${modelName.toLowerCase()}/:id" element={<${modelName}Detail />} />
`);
  });
