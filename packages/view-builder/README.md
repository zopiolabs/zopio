# View Builder

The View Builder module provides a visual interface for creating and editing view schemas used by the View module. It offers a drag-and-drop canvas, component toolbox, and JSON editor for building dynamic views.

## Features

- **Drag-and-Drop Interface**: Easily build views by dragging and dropping components
- **Component Toolbox**: Pre-configured components ready to use
- **JSON Editor**: Direct editing of the view schema with validation
- **Schema Management**: Save, load, and manage view schemas
- **AI Assistance**: Generate view schemas using AI prompts
- **Preview**: Real-time preview of the view being built
- **Validation**: Automatic validation of the schema as you build

## Installation

```bash
pnpm install @repo/view-builder
```

## Usage

### Basic Usage

```tsx
import { ViewBuilder } from '@repo/view-builder';

function ViewBuilderPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Builder</h1>
      <ViewBuilder />
    </div>
  );
}
```

### Custom Configuration

```tsx
import { SchemaProvider } from '@repo/view-builder/hooks/useSchemaState';
import { DragDropCanvas } from '@repo/view-builder/canvas/DragDropCanvas';
import { Toolbox } from '@repo/view-builder/toolbox/Toolbox';
import { JSONEditor } from '@repo/view-builder/json-editor/JSONEditor';

function CustomViewBuilder() {
  return (
    <SchemaProvider>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <Toolbox />
        </div>
        <div className="col-span-6">
          <DragDropCanvas />
        </div>
        <div className="col-span-3">
          <JSONEditor />
        </div>
      </div>
    </SchemaProvider>
  );
}
```

### Using the Schema State Hook

```tsx
import { useSchemaState } from '@repo/view-builder/hooks/useSchemaState';

function SchemaManager() {
  const { 
    schema, 
    setSchema, 
    addField, 
    updateField, 
    removeField, 
    validateSchema,
    persistView,
    loadView,
    deleteView,
    getViewList
  } = useSchemaState();
  
  // Add a new field
  const handleAddField = () => {
    addField({
      name: `field-${Date.now()}`,
      label: 'New Field',
      type: 'string',
      required: false
    });
  };
  
  // Save the current schema
  const handleSave = async () => {
    try {
      await persistView();
      alert('Schema saved successfully');
    } catch (error) {
      console.error('Error saving schema:', error);
      alert('Error saving schema');
    }
  };
  
  return (
    <div>
      <button onClick={handleAddField}>Add Field</button>
      <button onClick={handleSave}>Save Schema</button>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
}
```

### AI-Assisted Schema Generation

```tsx
import { AIPromptPanel } from '@repo/view-builder/ai/AIPromptPanel';

function AIViewBuilder() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generate View with AI</h2>
      <AIPromptPanel />
    </div>
  );
}
```

## Components

### SchemaProvider

The `SchemaProvider` is the core component that manages the state of the view schema and provides methods for manipulating it.

```tsx
import { SchemaProvider } from '@repo/view-builder/hooks/useSchemaState';

function App() {
  return (
    <SchemaProvider>
      {/* Child components */}
    </SchemaProvider>
  );
}
```

### DragDropCanvas

The `DragDropCanvas` component provides a visual interface for building views by dragging and dropping components.

```tsx
import { DragDropCanvas } from '@repo/view-builder/canvas/DragDropCanvas';

function Canvas() {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 min-h-[500px]">
      <DragDropCanvas />
    </div>
  );
}
```

### Toolbox

The `Toolbox` component provides a list of pre-configured components that can be added to the canvas.

```tsx
import { Toolbox } from '@repo/view-builder/toolbox/Toolbox';

function ComponentToolbox() {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Components</h2>
      <Toolbox />
    </div>
  );
}
```

### JSONEditor

The `JSONEditor` component provides a direct interface for editing the view schema as JSON.

```tsx
import { JSONEditor } from '@repo/view-builder/json-editor/JSONEditor';

function SchemaEditor() {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">JSON Editor</h2>
      <JSONEditor />
    </div>
  );
}
```

### AIPromptPanel

The `AIPromptPanel` component provides an interface for generating view schemas using AI prompts.

```tsx
import { AIPromptPanel } from '@repo/view-builder/ai/AIPromptPanel';

function AIAssistant() {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">AI Assistant</h2>
      <AIPromptPanel />
    </div>
  );
}
```

## Schema State Hook

The `useSchemaState` hook provides methods for manipulating the view schema.

```tsx
import { useSchemaState } from '@repo/view-builder/hooks/useSchemaState';

function useSchema() {
  const {
    schema,          // Current schema
    setSchema,       // Set the entire schema
    addField,        // Add a new field
    updateField,     // Update an existing field
    removeField,     // Remove a field
    validateSchema,  // Validate the schema
    persistView,     // Save the schema
    loadView,        // Load a schema
    deleteView,      // Delete a schema
    getViewList      // Get a list of saved schemas
  } = useSchemaState();
  
  return {
    schema,
    setSchema,
    addField,
    updateField,
    removeField,
    validateSchema,
    persistView,
    loadView,
    deleteView,
    getViewList
  };
}
```

## Field Types

The View Builder supports all field types available in the View module:

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

## Best Practices

- **Start Simple**: Begin with a basic schema and add complexity gradually
- **Use Validation**: Validate the schema regularly during development
- **Save Often**: Persist your work frequently to avoid losing changes
- **Use AI Assistance**: Leverage AI prompts for complex schemas
- **Test with Real Data**: Preview the view with realistic data
- **Follow Design Guidelines**: Use consistent naming and organization
- **Document Your Schemas**: Add clear descriptions to fields and sections

## Integration with Design System

The View Builder is fully integrated with the design system to ensure a consistent user experience:

- Uses shared components from `@repo/design-system/components/shared`
- Follows the design tokens from `@repo/design-system/theme`
- Implements i18n using `@repo/design-system/i18n`

## Troubleshooting

### Common Issues

- **Schema Validation Errors**: Check field names for uniqueness and required properties
- **Rendering Issues**: Ensure the schema type is supported by the View module
- **Storage Errors**: Verify that the storage provider is properly configured
- **JSON Parsing Errors**: Check for syntax errors in the JSON editor

### Debugging

- Use the JSON editor to inspect the schema structure
- Check the browser console for error messages
- Validate the schema using `validateSchema` before saving

## License

BUSL-1.1 - See the [LICENSE](../../LICENSE) file for details.

This package is part of the core Zopio framework, which uses the Business Source License 1.1.
