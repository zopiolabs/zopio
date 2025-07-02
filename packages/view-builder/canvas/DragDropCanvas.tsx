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
import { renderView } from '@repo/view';
import type { ViewSchema } from '@repo/view/engine/renderers/types';
import React, { useState, useCallback } from 'react';
import { useSchemaState } from '../hooks/useSchemaState.js';
import type { FormField } from '../hooks/useSchemaState.js';

// UI Components from design-system
import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';

// Type declarations for external modules
declare module '@repo/view' {
  export function renderView(schema: ViewSchema): React.ReactNode;
}

// Define types for UI components
type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

/**
 * FieldPreview component for displaying a form field in the canvas
 */
interface FieldPreviewProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (name: string) => void;
}

function FieldPreview({
  field,
  onEdit,
  onDelete,
}: FieldPreviewProps): JSX.Element {
  return (
    <div
      className="field-preview mb-2 rounded-md border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      data-field-type={field.type}
    >
      <div className="field-preview-header mb-2 flex items-center justify-between">
        <h4 className="font-medium text-sm">{field.label || field.name}</h4>
        <div className="field-preview-actions space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(field)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(field.name)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="field-preview-content mb-2 text-muted-foreground text-xs">
        <p>
          Type: {field.type} {field.required && '(Required)'}
        </p>
        {field.description && (
          <p className="field-description">{field.description}</p>
        )}
      </div>

      {field.type === 'string' && (
        <Input placeholder={field.placeholder || field.label} disabled />
      )}

      {field.type === 'boolean' && (
        <div className="flex items-center space-x-2">
          <Checkbox id={field.name} disabled />
          <Label htmlFor={field.name}>{field.label}</Label>
        </div>
      )}

      {field.options && field.options.length > 0 && (
        <div className="mt-1 text-xs">Options: {field.options.join(', ')}</div>
      )}
    </div>
  );
}

/**
 * Field editor component
 */
interface FieldEditorProps {
  field?: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

function FieldEditor({
  field,
  onSave,
  onCancel,
}: FieldEditorProps): JSX.Element {
  const [name, setName] = React.useState(field?.name || `field-${Date.now()}`);
  const [label, setLabel] = React.useState(field?.label || '');
  const [type, setType] = React.useState(field?.type || 'string');
  const [required, setRequired] = React.useState(field?.required || false);
  const [description, setDescription] = React.useState(
    field?.description || ''
  );
  const [placeholder, setPlaceholder] = React.useState(
    field?.placeholder || ''
  );
  const [options, setOptions] = React.useState(field?.options?.join(',') || '');

  const handleSave = () => {
    if (!label) {
      alert('Label is required');
      return;
    }

    onSave({
      name,
      label,
      type,
      required,
      description: description || undefined,
      placeholder: placeholder || undefined,
      options: options ? options.split(',').map((o) => o.trim()) : undefined,
    });
  };

  return (
    <Card className="space-y-4 p-4">
      <h3 className="font-medium text-lg">
        {field ? 'Edit Field' : 'Add Field'}
      </h3>

      <div className="space-y-2">
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Field Label"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="field-type">Type</Label>
        <select
          id="field-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-md border p-2"
        >
          <option value="string">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Checkbox</option>
          <option value="date">Date</option>
          <option value="select">Select</option>
        </select>
      </div>

      {type === 'select' && (
        <div className="space-y-2">
          <Label htmlFor="field-options">Options (comma separated)</Label>
          <Input
            id="field-options"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="field-placeholder">Placeholder</Label>
        <Input
          id="field-placeholder"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Field Placeholder"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="field-description">Description</Label>
        <Input
          id="field-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Field Description"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="field-required"
          checked={required}
          onCheckedChange={(checked) => setRequired(checked === true)}
        />
        <Label htmlFor="field-required">Required</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Field</Button>
      </div>
    </Card>
  );
}

/**
 * Preview component for the view
 */
function ViewPreview({ schema }: { schema: ViewSchema }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <h3 className="mb-4 font-medium text-lg">Preview</h3>
      {renderView(schema, {
        onSubmit: (data) => console.log('Form submitted:', data),
      })}
    </div>
  );
}

/**
 * Main canvas component for drag and drop view building
 */
export function DragDropCanvas() {
  const { schema, addField, removeField, updateField } = useSchemaState();
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [activeTab, setActiveTab] = useState('editor');

  const handleAddField = useCallback(
    (field: FormField) => {
      addField(field);
      setEditingField(undefined);
    },
    [addField]
  );

  const handleUpdateField = useCallback(
    (field: FormField) => {
      updateField(field.name, field);
      setEditingField(undefined);
    },
    [updateField]
  );

  const handleEditField = useCallback((field: FormField) => {
    setEditingField(field);
  }, []);

  // Define a callback for deleting fields
  const handleDeleteField = useCallback(
    (name: string) => {
      if (confirm(`Are you sure you want to delete the field '${name}'?`)) {
        removeField(name);
      }
    },
    [removeField]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingField(undefined);
  }, []);

  // Define field type for schema fields
  type SchemaField = {
    label?: string;
    type?: string;
    required?: boolean;
    options?: string[];
    description?: string;
    placeholder?: string;
    section?: string;
    order?: number;
  };

  // Get fields from schema
  const fields = Object.entries(schema.fields || {}).map(([name, field]) => ({
    name,
    label: (field as SchemaField).label || name,
    type: (field as SchemaField).type || 'string',
    required: (field as SchemaField).required || false,
    options: (field as SchemaField).options || [],
    description: (field as SchemaField).description || '',
    placeholder: (field as SchemaField).placeholder,
    section: (field as SchemaField).section || '',
    order: (field as SchemaField).order || 0,
  }));

  // Sort fields by order
  const sortByOrder = (a: FormField, b: FormField) => {
    const orderA = a.order || 0;
    const orderB = b.order || 0;
    return orderA - orderB;
  };

  fields.sort(sortByOrder);

  // Sort fields by section
  const sortBySection = (o: Record<string, FormField[]>) => {
    const sections = Object.keys(o);
    return sections.sort();
  };

  // Helper function to check if object is empty
  const isEmpty = (o: Record<string, unknown>) => {
    return Object.keys(o).length === 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetSection: string
  ) => {
    event.preventDefault();
    const data: string = event.dataTransfer.getData('text/plain');
    try {
      const parsedData = JSON.parse(data) as { type: string; field: FormField };
      if (parsedData.type === 'field') {
        handleAddField(parsedData.field);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  // Use the FieldPreview component defined above

  const renderFieldPreview = (field: FormField) => {
    return (
      <FieldPreview
        key={field.name}
        field={field}
        onEdit={handleEditField}
        onDelete={handleDeleteField}
      />
    );
  };

  const renderFieldsByType = (type: string) => {
    return fields
      .filter((field) => field.type === type)
      .map(renderFieldPreview);
  };

  const renderFieldsBySection = (section: string) => {
    return fields
      .filter((field) => field.section === section)
      .map(renderFieldPreview);
  };

  // Group fields by section if available
  const sections = fields.reduce<string[]>((acc, field) => {
    if (field.section && !acc.includes(field.section)) {
      acc.push(field.section);
    }
    return acc;
  }, []);

  // Get all field types for grouping
  const fieldTypes = fields.reduce<string[]>((acc, field) => {
    if (!acc.includes(field.type)) {
      acc.push(field.type);
    }
    return acc;
  }, []);

  const renderTabs = () => {
    return (
      <div className="mb-4 flex border-b">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'editor' ? 'border-primary border-b-2' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'preview' ? 'border-primary border-b-2' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
    );
  };

  const renderFieldGroups = () => {
    if (sections.length > 0) {
      return sections.map((section) => (
        <div key={section} className="mb-6">
          <h3 className="mb-2 font-medium text-lg">{section}</h3>
          <div className="space-y-2">{renderFieldsBySection(section)}</div>
        </div>
      ));
    }

    if (fieldTypes.length > 0) {
      return fieldTypes.map((type) => (
        <div key={type} className="mb-6">
          <h3 className="mb-2 font-medium text-lg">
            {type.charAt(0).toUpperCase() + type.slice(1)} Fields
          </h3>
          <div className="space-y-2">{renderFieldsByType(type)}</div>
        </div>
      ));
    }

    return fields.map(renderFieldPreview);
  };

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Form Builder</h2>
            <Button onClick={() => setEditingField({} as FormField)}>
              Add Field
            </Button>
          </div>

          {editingField ? (
            <FieldEditor
              field={editingField}
              onSave={editingField.name ? handleUpdateField : handleAddField}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="space-y-2">
              {fields.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                  No fields added yet. Click "Add Field" to start building your
                  form.
                </div>
              ) : (
                fields.map((field) => (
                  <FieldPreview
                    key={field.name}
                    field={field}
                    onEdit={handleEditField}
                    onDelete={handleDeleteField}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1">
          <ViewPreview schema={schema} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
