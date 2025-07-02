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
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import React from 'react';
import { useCrudTranslation } from '../i18n';
import type { FieldDefinition, FieldValue } from '../types';

export interface DetailSection {
  /**
   * Section title
   */
  title?: string;

  /**
   * Section description
   */
  description?: string;

  /**
   * Field names to include in this section
   */
  fields: string[];

  /**
   * Number of columns for the grid layout (1-4)
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * Custom CSS class for the section
   */
  className?: string;
}

export interface DetailTab {
  /**
   * Tab title
   */
  title: string;

  /**
   * Tab description
   */
  description?: string;

  /**
   * Sections within this tab
   */
  sections: DetailSection[];

  /**
   * Custom CSS class for the tab
   */
  className?: string;
}

export interface DetailLayout {
  /**
   * Layout type
   */
  type: 'tabs' | 'sections' | 'basic';

  /**
   * Tabs configuration (for tabs layout)
   */
  tabs?: DetailTab[];

  /**
   * Sections configuration (for sections layout)
   */
  sections?: DetailSection[];
}

export interface AutoDetailProps {
  /**
   * Field definitions
   */
  fields: FieldDefinition[];

  /**
   * Data to display
   */
  data: Record<string, FieldValue>;

  /**
   * Layout configuration
   */
  layout?: DetailLayout;

  /**
   * Whether to show labels for fields
   */
  showLabels?: boolean;

  /**
   * Actions to display in the header
   */
  actions?: React.ReactNode[];

  /**
   * Title for the detail view
   */
  title?: string;

  /**
   * Description for the detail view
   */
  description?: string;

  /**
   * Whether to render in a card
   */
  card?: boolean;

  /**
   * Whether to show empty fields
   */
  showEmptyFields?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Custom field renderers
   */
  fieldRenderers?: Record<
    string,
    (value: FieldValue, field: FieldDefinition) => React.ReactNode
  >;

  /**
   * Locale for internationalization
   */
  locale?: string;
}

/**
 * AutoDetail renders a detail view for an entity with support for various layouts
 * including tabs, sections, and custom field rendering.
 */
export function AutoDetail({
  fields,
  data,
  layout,
  showLabels = true,
  actions = [],
  title,
  description,
  card = true,
  showEmptyFields = false,
  className = '',
  fieldRenderers = {},
  locale,
}: AutoDetailProps) {
  const { t } = useCrudTranslation();

  // Get field definition by name
  const getFieldDefinition = (name: string): FieldDefinition | undefined => {
    return fields.find((field) => field.name === name);
  };

  // Render a single field value
  const renderFieldValue = (fieldName: string): React.ReactNode => {
    const fieldDef = getFieldDefinition(fieldName);
    if (!fieldDef) return null;

    const value = data[fieldName];

    // Skip empty fields if configured
    if (
      !showEmptyFields &&
      (value === undefined || value === null || value === '')
    ) {
      return null;
    }

    // Use custom renderer if provided
    if (fieldRenderers[fieldDef.type]) {
      return fieldRenderers[fieldDef.type](value, fieldDef);
    }

    // Use custom renderer for specific field if provided
    if (fieldRenderers[fieldName]) {
      return fieldRenderers[fieldName](value, fieldDef);
    }

    // Default rendering based on field type
    switch (fieldDef.type) {
      case 'boolean':
        return value ? (
          <Badge variant="success">
            {t('fields.boolean.true', { defaultValue: 'Yes' })}
          </Badge>
        ) : (
          <Badge variant="secondary">
            {t('fields.boolean.false', { defaultValue: 'No' })}
          </Badge>
        );

      case 'date':
      case 'datetime':
        if (!value) return null;
        try {
          const date = new Date(value as string | number);
          return fieldDef.type === 'date'
            ? date.toLocaleDateString(locale)
            : date.toLocaleString(locale);
        } catch (e) {
          return String(value);
        }

      case 'select':
      case 'radio':
        if (!value) return null;
        const option = fieldDef.options?.find((opt) => opt.value === value);
        return option?.label || value;

      case 'multiselect':
      case 'checkbox':
        if (!value || !Array.isArray(value) || value.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((val, index) => {
              const option = fieldDef.options?.find((opt) => opt.value === val);
              return (
                <Badge key={index} variant="outline">
                  {option?.label || val}
                </Badge>
              );
            })}
          </div>
        );

      case 'json':
        if (!value) return null;
        try {
          return (
            <pre className="max-h-[200px] overflow-auto rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(value, null, 2)}
            </pre>
          );
        } catch (e) {
          return String(value);
        }

      case 'richtext':
      case 'markdown':
        if (!value) return null;
        return (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value as string }}
          />
        );

      case 'image':
        if (!value) return null;
        return (
          <img
            src={value as string}
            alt={fieldDef.label || fieldName}
            className="h-auto max-h-[200px] max-w-full rounded"
          />
        );

      case 'file':
        if (!value) return null;
        return (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t('fields.file.download', { defaultValue: 'Download file' })}
          </a>
        );

      case 'color':
        if (!value) return null;
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: value as string }}
            />
            <span>{value as string}</span>
          </div>
        );

      default:
        return value !== undefined && value !== null ? String(value) : null;
    }
  };

  // Render a field with label
  const renderField = (fieldName: string): React.ReactNode => {
    const fieldDef = getFieldDefinition(fieldName);
    if (!fieldDef) return null;

    const fieldValue = renderFieldValue(fieldName);
    if (fieldValue === null && !showEmptyFields) return null;

    return (
      <div key={fieldName} className="mb-4">
        {showLabels && (
          <div className="mb-1 font-medium text-gray-500 text-sm">
            {t(`fields.${fieldName}.label`, {
              defaultValue: fieldDef.label || fieldName,
            })}
          </div>
        )}

        <div className="text-base">
          {fieldValue !== null ? (
            fieldValue
          ) : (
            <span className="text-gray-400 italic">
              {t('detail.emptyValue', { defaultValue: 'Not provided' })}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Render a section of fields
  const renderSection = (section: DetailSection): React.ReactNode => {
    const visibleFields = section.fields.filter((fieldName) => {
      const fieldDef = getFieldDefinition(fieldName);
      if (!fieldDef) return false;

      // Skip hidden fields
      if (typeof fieldDef.hidden === 'function') {
        return !fieldDef.hidden(data);
      }
      return !fieldDef.hidden;
    });

    if (visibleFields.length === 0) return null;

    const gridCols = section.columns || 1;
    const gridClass =
      {
        1: '',
        2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        3: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
      }[gridCols] || '';

    return (
      <div
        key={section.title || 'default-section'}
        className={`mb-6 ${section.className || ''}`}
      >
        {section.title && (
          <>
            <h3 className="mb-2 font-medium text-lg">
              {t(`detail.sections.${section.title}`, {
                defaultValue: section.title,
              })}
            </h3>

            {section.description && (
              <p className="mb-3 text-gray-500 text-sm">
                {t(`detail.sections.${section.title}.description`, {
                  defaultValue: section.description,
                })}
              </p>
            )}

            <Separator className="mb-4" />
          </>
        )}

        <div className={gridClass}>{visibleFields.map(renderField)}</div>
      </div>
    );
  };

  // Render content based on layout
  const renderContent = () => {
    // If no layout is provided, render all fields in a single column
    if (!layout) {
      return (
        <div>
          {fields
            .filter((field) => {
              // Skip hidden fields
              if (typeof field.hidden === 'function') {
                return !field.hidden(data);
              }
              return !field.hidden;
            })
            .map((field) => renderField(field.name))}
        </div>
      );
    }

    // Render based on layout type
    switch (layout.type) {
      case 'tabs':
        if (!layout.tabs || layout.tabs.length === 0) {
          return renderContent();
        }

        return (
          <Tabs defaultValue="0">
            <TabsList className="mb-4">
              {layout.tabs.map((tab, index) => (
                <TabsTrigger key={tab.title} value={index.toString()}>
                  {t(`detail.tabs.${tab.title}`, { defaultValue: tab.title })}
                </TabsTrigger>
              ))}
            </TabsList>

            {layout.tabs.map((tab, index) => (
              <TabsContent
                key={tab.title}
                value={index.toString()}
                className={tab.className}
              >
                {tab.description && (
                  <p className="mb-4 text-gray-500 text-sm">
                    {t(`detail.tabs.${tab.title}.description`, {
                      defaultValue: tab.description,
                    })}
                  </p>
                )}

                {tab.sections.map(renderSection)}
              </TabsContent>
            ))}
          </Tabs>
        );

      case 'sections':
        if (!layout.sections || layout.sections.length === 0) {
          return renderContent();
        }

        return <div>{layout.sections.map(renderSection)}</div>;

      default:
        return renderContent();
    }
  };

  // Wrap content in card if requested
  const content = renderContent();

  if (card) {
    return (
      <Card className={className}>
        {(title || actions.length > 0) && (
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </div>

              {actions.length > 0 && (
                <div className="flex space-x-2">
                  {actions.map((action, index) => (
                    <React.Fragment key={index}>{action}</React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {(title || actions.length > 0) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && <h2 className="font-semibold text-xl">{title}</h2>}
            {description && <p className="mt-1 text-gray-500">{description}</p>}
          </div>

          {actions.length > 0 && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {content}
    </div>
  );
}
