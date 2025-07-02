# View Module

The View module provides a flexible and powerful system for rendering dynamic views based on JSON schemas. It supports various view types including forms, tables, detail views, audit logs, import, and export interfaces.

## Features

- **Schema-Based Rendering**: Create dynamic views using JSON schemas
- **Multiple View Types**: Support for forms, tables, detail views, audit logs, import, and export
- **Validation**: Built-in schema validation using Zod
- **Storage Providers**: Local and file-based storage for view schemas
- **i18n Support**: Internationalization support for all view components
- **Error Handling**: Comprehensive error handling with fallbacks

## Installation

```bash
pnpm install @repo/view
```

## Usage

### Basic Usage

```tsx
import { renderView } from '@repo/view';
import type { ViewSchema } from '@repo/view/types/schema';

// Define a view schema
const formSchema: ViewSchema = {
  id: 'user-form',
  type: 'form',
  title: 'User Information',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'string',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true
    }
  ]
};

// Render the view
function UserForm() {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };
  
  return (
    <div>
      {renderView(formSchema, {
        data: formData,
        onChange: setFormData,
        onSubmit: handleSubmit
      })}
    </div>
  );
}
```

### Using Storage Providers

```tsx
import { ViewService } from '@repo/view/service';

// Save a view schema
async function saveView(schema) {
  try {
    await ViewService.saveView(schema.id, schema);
    console.log('View saved successfully');
  } catch (error) {
    console.error('Error saving view:', error);
  }
}

// Load a view schema
async function loadView(id) {
  try {
    const schema = await ViewService.getView(id);
    console.log('View loaded:', schema);
    return schema;
  } catch (error) {
    console.error('Error loading view:', error);
    return null;
  }
}

// List available views
async function listViews() {
  try {
    const views = await ViewService.listViews();
    console.log('Available views:', views);
    return views;
  } catch (error) {
    console.error('Error listing views:', error);
    return [];
  }
}

// Delete a view
async function deleteView(id) {
  try {
    await ViewService.deleteView(id);
    console.log('View deleted successfully');
  } catch (error) {
    console.error('Error deleting view:', error);
  }
}
```

### Schema Validation

```tsx
import { validateViewSchema } from '@repo/view/engine/validation/schema';

function validateSchema(schema) {
  const result = validateViewSchema(schema);
  
  if (result.success) {
    console.log('Schema is valid');
    return true;
  } else {
    console.error('Schema validation failed:', result.error);
    return false;
  }
}
```

### Using i18n

```tsx
import { useViewTranslations } from '@repo/view/i18n';

function LocalizedView() {
  const t = useViewTranslations();
  
  return (
    <div>
      <h2>{t('form.title')}</h2>
      <p>{t('form.description')}</p>
    </div>
  );
}
```

## View Types

### Form View

Forms are used for data entry and editing.

```tsx
const formSchema: FormViewSchema = {
  id: 'user-form',
  type: 'form',
  title: 'User Information',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'string',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true
    }
  ],
  layout: {
    type: 'simple',
    sections: [
      {
        title: 'Basic Information',
        fields: ['name', 'email']
      }
    ]
  }
};
```

### Table View

Tables are used for displaying and interacting with collections of data.

```tsx
const tableSchema: TableViewSchema = {
  id: 'users-table',
  type: 'table',
  title: 'Users',
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'string'
    },
    {
      name: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email'
    }
  ],
  columns: [
    {
      name: 'id',
      label: 'ID',
      width: 100
    },
    {
      name: 'name',
      label: 'Name',
      sortable: true
    },
    {
      name: 'email',
      label: 'Email',
      sortable: true
    }
  ],
  pagination: {
    enabled: true,
    pageSize: 10
  },
  sorting: {
    enabled: true,
    defaultColumn: 'name',
    defaultDirection: 'asc'
  }
};
```

### Detail View

Detail views are used for displaying detailed information about a single item.

```tsx
const detailSchema: DetailViewSchema = {
  id: 'user-detail',
  type: 'detail',
  title: 'User Details',
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      readOnly: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      readOnly: true
    }
  ],
  layout: {
    type: 'simple',
    sections: [
      {
        title: 'User Information',
        fields: ['id', 'name', 'email']
      }
    ]
  }
};
```

## Field Types

The view module supports various field types:

- **string**: Basic text input
- **text**: Multi-line text input
- **number**: Numeric input
- **integer**: Integer input
- **float**: Floating-point input
- **boolean**: Boolean toggle
- **date**: Date picker
- **time**: Time picker
- **datetime**: Date and time picker
- **email**: Email input
- **password**: Password input
- **url**: URL input
- **tel**: Telephone input
- **select**: Single-select dropdown
- **multiselect**: Multi-select dropdown
- **radio**: Radio button group
- **checkbox**: Checkbox group
- **file**: File upload
- **image**: Image upload
- **color**: Color picker
- **range**: Range slider
- **rating**: Rating input
- **richtext**: Rich text editor
- **code**: Code editor
- **json**: JSON editor
- **relation**: Relation to another entity
- **custom**: Custom field type

## Error Handling

The view module includes robust error handling:

```tsx
import { ViewErrorBoundary } from '@repo/view/components/ErrorBoundary';

function SafeView() {
  return (
    <ViewErrorBoundary
      fallback={<div>Error rendering view</div>}
    >
      {renderView(schema, props)}
    </ViewErrorBoundary>
  );
}
```

## Architecture

The view module is organized into the following components:

- **engine**: Core rendering and validation logic
- **components**: Reusable UI components
- **service**: Storage and data management
- **i18n**: Internationalization support
- **types**: TypeScript type definitions
- **utils**: Utility functions

## Best Practices

- Always validate schemas before rendering
- Use the storage providers for persistent views
- Implement proper error handling
- Use the i18n system for all user-facing text
- Follow the TypeScript type definitions for type safety

## License

BUSL-1.1 - See the [LICENSE](../../LICENSE) file for details.

This package is part of the core Zopio framework, which uses the Business Source License 1.1.
