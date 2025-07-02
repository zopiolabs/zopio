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
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Download, FileDown } from 'lucide-react';
import { useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type { FieldDefinition, FieldValue, TableColumn } from './types';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf' | 'xml';

export interface ExportOptions {
  /**
   * Export file format
   */
  format: ExportFormat;

  /**
   * Filename without extension
   */
  filename: string;

  /**
   * Whether to include column headers
   */
  includeHeaders: boolean;

  /**
   * Fields to include in export
   */
  fields: string[];

  /**
   * Custom delimiter for CSV export
   */
  delimiter?: string;

  /**
   * Whether to export all data or just current page
   */
  exportAll: boolean;

  /**
   * Additional export options
   */
  [key: string]: unknown;
}

export interface AutoExportProps {
  /**
   * Data to export
   */
  data: Record<string, FieldValue>[];

  /**
   * Field definitions or table columns
   */
  fields: FieldDefinition[] | TableColumn[];

  /**
   * Available export formats
   */
  formats?: ExportFormat[];

  /**
   * Default export options
   */
  defaultOptions?: Partial<ExportOptions>;

  /**
   * Function to handle export with options
   */
  onExport: (
    data: Record<string, FieldValue>[],
    options: ExportOptions
  ) => Promise<void> | void;

  /**
   * Function to fetch all data when exportAll is true
   */
  fetchAllData?: () => Promise<Record<string, FieldValue>[]>;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Button variant
   */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Button label
   */
  label?: string;

  /**
   * Whether to show the button label
   */
  showLabel?: boolean;

  /**
   * Whether to show the button icon
   */
  showIcon?: boolean;

  /**
   * CSS class for the button
   */
  className?: string;
}

/**
 * AutoExport provides a UI for exporting data in various formats.
 * Supports CSV, JSON, XLSX, PDF, and XML with customizable options.
 */
export function AutoExport({
  data,
  fields,
  formats = ['csv', 'json', 'xlsx', 'pdf', 'xml'],
  defaultOptions,
  onExport,
  fetchAllData,
  disabled = false,
  variant = 'outline',
  size = 'sm',
  label,
  showLabel = true,
  showIcon = true,
  className = '',
}: AutoExportProps) {
  const { t } = useCrudTranslation();
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: defaultOptions?.format || 'csv',
    filename: defaultOptions?.filename || 'export',
    includeHeaders: defaultOptions?.includeHeaders !== false,
    fields:
      defaultOptions?.fields ||
      fields.map((field) => ('key' in field ? field.key : field.name)),
    delimiter: defaultOptions?.delimiter || ',',
    exportAll: defaultOptions?.exportAll || false,
    ...defaultOptions,
  });

  // Get field name and label
  const getFieldInfo = (field: FieldDefinition | TableColumn) => {
    if ('key' in field) {
      return { name: field.key, label: field.title };
    }
    return { name: field.name, label: field.label || field.name };
  };

  // Handle export button click
  const handleExport = async () => {
    try {
      setIsExporting(true);

      let dataToExport = data;

      // Fetch all data if exportAll is true and fetchAllData is provided
      if (options.exportAll && fetchAllData) {
        dataToExport = await fetchAllData();
      }

      await onExport(dataToExport, options);
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Get format label
  const getFormatLabel = (format: ExportFormat): string => {
    const formatLabels: Record<ExportFormat, string> = {
      csv: 'CSV',
      json: 'JSON',
      xlsx: 'Excel',
      pdf: 'PDF',
      xml: 'XML',
    };

    return formatLabels[format] || format.toUpperCase();
  };

  // Toggle field selection
  const toggleField = (fieldName: string) => {
    if (options.fields.includes(fieldName)) {
      setOptions({
        ...options,
        fields: options.fields.filter((f) => f !== fieldName),
      });
    } else {
      setOptions({
        ...options,
        fields: [...options.fields, fieldName],
      });
    }
  };

  // Toggle all fields
  const toggleAllFields = () => {
    if (options.fields.length === fields.length) {
      setOptions({
        ...options,
        fields: [],
      });
    } else {
      setOptions({
        ...options,
        fields: fields.map((field) =>
          'key' in field ? field.key : field.name
        ),
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={className}
      >
        {showIcon && <Download className="h-4 w-4" />}
        {showLabel && (
          <span className={showIcon ? 'ml-2' : ''}>
            {label || t('export.button', { defaultValue: 'Export' })}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('export.title', { defaultValue: 'Export Data' })}
            </DialogTitle>
            <DialogDescription>
              {t('export.description', {
                defaultValue:
                  'Configure export options and download your data.',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="export-format" className="text-right">
                {t('export.format')}
              </Label>
              <Select
                value={options.format}
                onValueChange={(value: ExportFormat) =>
                  setOptions({ ...options, format: value })
                }
              >
                <SelectTrigger id="export-format" className="col-span-3">
                  <SelectValue placeholder={t('export.selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {getFormatLabel(format)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="export-filename" className="text-right">
                {t('export.filename')}
              </Label>
              <Input
                id="export-filename"
                value={options.filename}
                onChange={(e) =>
                  setOptions({ ...options, filename: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {options.format === 'csv' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="export-delimiter" className="text-right">
                  {t('export.delimiter')}
                </Label>
                <Input
                  id="export-delimiter"
                  value={options.delimiter}
                  onChange={(e) =>
                    setOptions({ ...options, delimiter: e.target.value })
                  }
                  className="col-span-3"
                  maxLength={1}
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">{t('export.options')}</div>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-headers"
                    checked={options.includeHeaders}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeHeaders: !!checked })
                    }
                  />
                  <Label htmlFor="export-headers">
                    {t('export.includeHeaders')}
                  </Label>
                </div>

                {fetchAllData && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-all"
                      checked={options.exportAll}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, exportAll: !!checked })
                      }
                    />
                    <Label htmlFor="export-all">
                      {t('export.exportAllData')}
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="pt-2 text-right">{t('export.fields')}</div>
              <div className="col-span-3">
                <div className="mb-2 flex items-center space-x-2">
                  <Checkbox
                    id="export-all-fields"
                    checked={options.fields.length === fields.length}
                    onCheckedChange={toggleAllFields}
                  />
                  <Label htmlFor="export-all-fields" className="font-medium">
                    {t('export.selectAll')}
                  </Label>
                </div>

                <div className="max-h-[200px] overflow-y-auto rounded border p-2">
                  {fields.map((field) => {
                    const { name, label } = getFieldInfo(field);
                    return (
                      <div
                        key={name}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`export-field-${name}`}
                          checked={options.fields.includes(name)}
                          onCheckedChange={() => toggleField(name)}
                        />
                        <Label htmlFor={`export-field-${name}`}>
                          {t(`fields.${name}.label`, { defaultValue: label })}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('export.cancel')}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || options.fields.length === 0}
            >
              {isExporting ? (
                <span>{t('export.exporting')}</span>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('export.download')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
