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
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { useEffect, useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type { FieldDefinition, FieldValue, TableFilter } from '../types';
import { fieldComponentMap } from './fieldComponentMap';

export interface AutoFilterProps {
  /**
   * Field definitions to generate filter controls
   */
  fields: FieldDefinition[];

  /**
   * Current filter values
   */
  value?: Record<string, FieldValue>;

  /**
   * Called when filters change
   */
  onChange?: (filters: Record<string, FieldValue>) => void;

  /**
   * Called when filters are applied
   */
  onApply?: (filters: TableFilter[]) => void;

  /**
   * Called when filters are reset
   */
  onReset?: () => void;

  /**
   * Custom filter operators for each field type
   */
  operatorsByType?: Record<string, string[]>;

  /**
   * Default operator to use for each field type
   */
  defaultOperatorsByType?: Record<string, string>;

  /**
   * Whether to show the filter panel expanded by default
   */
  defaultExpanded?: boolean;

  /**
   * Custom CSS class name
   */
  className?: string;
}

/**
 * AutoFilter renders a filter panel for data tables with dynamic filter controls
 * based on field definitions.
 */
export function AutoFilter({
  fields,
  value = {},
  onChange,
  onApply,
  onReset,
  operatorsByType,
  defaultOperatorsByType,
  defaultExpanded = false,
  className = '',
}: AutoFilterProps) {
  const { t } = useCrudTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [filterValues, setFilterValues] =
    useState<Record<string, FieldValue>>(value);
  const [operators, setOperators] = useState<Record<string, string>>({});

  // Initialize operators based on field types
  useEffect(() => {
    const initialOperators: Record<string, string> = {};

    fields.forEach((field) => {
      initialOperators[field.name] =
        defaultOperatorsByType?.[field.type] || 'eq';
    });

    setOperators(initialOperators);
  }, [fields, defaultOperatorsByType]);

  // Update filter values when external value changes
  useEffect(() => {
    setFilterValues(value);
  }, [value]);

  // Get available operators for a field type
  const getOperatorsForType = (type: string): string[] => {
    if (operatorsByType?.[type]) {
      return operatorsByType[type];
    }

    // Default operators by field type
    switch (type) {
      case 'number':
      case 'date':
      case 'datetime':
        return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'];
      case 'string':
      case 'text':
      case 'email':
      case 'url':
        return ['eq', 'neq', 'contains', 'startsWith', 'endsWith'];
      case 'boolean':
        return ['eq'];
      default:
        return ['eq', 'neq'];
    }
  };

  // Get operator label
  const getOperatorLabel = (operator: string): string => {
    const operatorLabels: Record<string, string> = {
      eq: t('filters.operators.equals'),
      neq: t('filters.operators.notEquals'),
      gt: t('filters.operators.greaterThan'),
      gte: t('filters.operators.greaterThanOrEqual'),
      lt: t('filters.operators.lessThan'),
      lte: t('filters.operators.lessThanOrEqual'),
      contains: t('filters.operators.contains'),
      startsWith: t('filters.operators.startsWith'),
      endsWith: t('filters.operators.endsWith'),
      between: t('filters.operators.between'),
    };

    return operatorLabels[operator] || operator;
  };

  // Handle filter value change
  const handleFilterChange = (fieldName: string, fieldValue: FieldValue) => {
    const newValues = {
      ...filterValues,
      [fieldName]: fieldValue,
    };

    setFilterValues(newValues);

    if (onChange) {
      onChange(newValues);
    }
  };

  // Handle operator change
  const handleOperatorChange = (fieldName: string, operator: string) => {
    setOperators({
      ...operators,
      [fieldName]: operator,
    });
  };

  // Apply filters
  const handleApply = () => {
    if (onApply) {
      const tableFilters: TableFilter[] = Object.entries(filterValues)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([column, value]) => ({
          column,
          operator: operators[column] || 'eq',
          value,
        }));

      onApply(tableFilters);
    }

    // Auto-collapse after applying if it was initially collapsed
    if (!defaultExpanded) {
      setExpanded(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilterValues({});

    if (onChange) {
      onChange({});
    }

    if (onReset) {
      onReset();
    }
  };

  // Render filter controls
  const renderFilterControls = () => {
    return fields.map((field) => {
      const FieldComponent =
        fieldComponentMap[field.type] || fieldComponentMap.string;
      const availableOperators = getOperatorsForType(field.type);
      const currentOperator = operators[field.name] || 'eq';

      return (
        <div key={field.name} className="mb-4">
          <div className="mb-1 flex items-center">
            <label className="font-medium text-sm">
              {t(`fields.${field.name}.label`, {
                defaultValue: field.label || field.name,
              })}
            </label>
          </div>

          <div className="flex gap-2">
            {availableOperators.length > 1 && (
              <select
                className="rounded-md border px-2 py-1 text-sm"
                value={currentOperator}
                onChange={(e) =>
                  handleOperatorChange(field.name, e.target.value)
                }
                aria-label={`Operator for ${field.name}`}
              >
                {availableOperators.map((op) => (
                  <option key={op} value={op}>
                    {getOperatorLabel(op)}
                  </option>
                ))}
              </select>
            )}

            <div className="flex-1">
              <FieldComponent
                id={`filter-${field.name}`}
                name={field.name}
                value={filterValues[field.name]}
                onChange={(value: FieldValue) =>
                  handleFilterChange(field.name, value)
                }
                placeholder={t(`fields.${field.name}.filterPlaceholder`, {
                  defaultValue:
                    field.placeholder ||
                    `Filter by ${field.label || field.name}`,
                })}
                className="w-full"
                {...field.props}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Card className={`${className} mb-4`}>
      <CardHeader
        className="cursor-pointer pb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{t('filters.title', { defaultValue: 'Filters' })}</span>
          <Button variant="ghost" size="sm">
            {expanded ? t('filters.collapse') : t('filters.expand')}
          </Button>
        </CardTitle>
      </CardHeader>

      {expanded && (
        <>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {renderFilterControls()}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button variant="outline" onClick={handleReset}>
              {t('filters.reset', { defaultValue: 'Reset' })}
            </Button>
            <Button variant="default" onClick={handleApply}>
              {t('filters.apply', { defaultValue: 'Apply Filters' })}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
