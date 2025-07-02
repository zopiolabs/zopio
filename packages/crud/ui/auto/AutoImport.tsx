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
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Progress } from '@repo/design-system/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { AlertCircle, CheckCircle2, FileUp, Upload } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type { FieldDefinition, FieldValue } from './types';

export type ImportFormat = 'csv' | 'json' | 'xlsx' | 'xml';

export interface ImportResult {
  /**
   * Successfully imported records
   */
  success: number;

  /**
   * Failed records
   */
  failed: number;

  /**
   * Error messages
   */
  errors: string[];

  /**
   * Imported data
   */
  data: Record<string, FieldValue>[];
}

export interface ImportOptions {
  /**
   * Import file format
   */
  format: ImportFormat;

  /**
   * Whether to skip header row
   */
  skipHeader: boolean;

  /**
   * Delimiter for CSV files
   */
  delimiter: string;

  /**
   * Field mapping (source field -> target field)
   */
  fieldMapping: Record<string, string>;

  /**
   * Additional import options
   */
  [key: string]: unknown;
}

export interface AutoImportProps {
  /**
   * Field definitions
   */
  fields: FieldDefinition[];

  /**
   * Available import formats
   */
  formats?: ImportFormat[];

  /**
   * Default import options
   */
  defaultOptions?: Partial<ImportOptions>;

  /**
   * Function to handle import with options
   */
  onImport: (file: File, options: ImportOptions) => Promise<ImportResult>;

  /**
   * Function called when import is complete
   */
  onComplete?: (result: ImportResult) => void;

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
 * AutoImport provides a UI for importing data from various file formats.
 * Supports CSV, JSON, XLSX, and XML with field mapping and validation.
 */
export function AutoImport({
  fields,
  formats = ['csv', 'json', 'xlsx', 'xml'],
  defaultOptions,
  onImport,
  onComplete,
  disabled = false,
  variant = 'outline',
  size = 'sm',
  label,
  showLabel = true,
  showIcon = true,
  className = '',
}: AutoImportProps) {
  const { t } = useCrudTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [options, setOptions] = useState<ImportOptions>({
    format: defaultOptions?.format || 'csv',
    skipHeader: defaultOptions?.skipHeader !== false,
    delimiter: defaultOptions?.delimiter || ',',
    fieldMapping: defaultOptions?.fieldMapping || {},
    ...defaultOptions,
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Auto-detect format from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        if (extension === 'csv' && formats.includes('csv')) {
          setOptions({ ...options, format: 'csv' });
        } else if (extension === 'json' && formats.includes('json')) {
          setOptions({ ...options, format: 'json' });
        } else if (
          ['xlsx', 'xls'].includes(extension) &&
          formats.includes('xlsx')
        ) {
          setOptions({ ...options, format: 'xlsx' });
        } else if (extension === 'xml' && formats.includes('xml')) {
          setOptions({ ...options, format: 'xml' });
        }
      }

      // Reset result
      setResult(null);
    }
  };

  // Handle import button click
  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      setProgress(0);
      setResult(null);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 10;
          return next > 90 ? 90 : next;
        });
      }, 200);

      const importResult = await onImport(selectedFile, options);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(importResult);

      if (onComplete) {
        onComplete(importResult);
      }
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        data: [],
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Get format label
  const getFormatLabel = (format: ImportFormat): string => {
    const formatLabels: Record<ImportFormat, string> = {
      csv: 'CSV',
      json: 'JSON',
      xlsx: 'Excel',
      xml: 'XML',
    };

    return formatLabels[format] || format.toUpperCase();
  };

  // Update field mapping
  const updateFieldMapping = (sourceField: string, targetField: string) => {
    setOptions({
      ...options,
      fieldMapping: {
        ...options.fieldMapping,
        [sourceField]: targetField,
      },
    });
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
        {showIcon && <Upload className="h-4 w-4" />}
        {showLabel && (
          <span className={showIcon ? 'ml-2' : ''}>
            {label || t('import.button', { defaultValue: 'Import' })}
          </span>
        )}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={formats
          .map((format) =>
            format === 'csv'
              ? '.csv'
              : format === 'json'
                ? '.json'
                : format === 'xlsx'
                  ? '.xlsx,.xls'
                  : format === 'xml'
                    ? '.xml'
                    : ''
          )
          .join(',')}
        style={{ display: 'none' }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('import.title', { defaultValue: 'Import Data' })}
            </DialogTitle>
            <DialogDescription>
              {t('import.description', {
                defaultValue: 'Upload a file to import data.',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {selectedFile ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                  >
                    {t('import.changeFile')}
                  </Button>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="import-format" className="text-right text-sm">
                    {t('import.format')}
                  </label>
                  <Select
                    value={options.format}
                    onValueChange={(value: ImportFormat) =>
                      setOptions({ ...options, format: value })
                    }
                    disabled={isImporting}
                  >
                    <SelectTrigger id="import-format" className="col-span-3">
                      <SelectValue placeholder={t('import.selectFormat')} />
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

                {options.format === 'csv' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor="import-delimiter"
                      className="text-right text-sm"
                    >
                      {t('import.delimiter')}
                    </label>
                    <Select
                      value={options.delimiter}
                      onValueChange={(value: string) =>
                        setOptions({ ...options, delimiter: value })
                      }
                      disabled={isImporting}
                    >
                      <SelectTrigger
                        id="import-delimiter"
                        className="col-span-3"
                      >
                        <SelectValue
                          placeholder={t('import.selectDelimiter')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=",">Comma (,)</SelectItem>
                        <SelectItem value=";">Semicolon (;)</SelectItem>
                        <SelectItem value="\t">Tab</SelectItem>
                        <SelectItem value="|">Pipe (|)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isImporting && (
                  <div className="space-y-2">
                    <p className="text-center text-sm">
                      {t('import.importing', {
                        defaultValue: 'Importing data...',
                      })}
                    </p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {result && (
                  <Alert
                    variant={result.failed > 0 ? 'destructive' : 'default'}
                  >
                    {result.failed > 0 ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {result.success > 0 && (
                        <p>
                          {t('import.successCount', {
                            defaultValue: `Successfully imported ${result.success} records.`,
                            count: result.success,
                          })}
                        </p>
                      )}
                      {result.failed > 0 && (
                        <p>
                          {t('import.failedCount', {
                            defaultValue: `Failed to import ${result.failed} records.`,
                            count: result.failed,
                          })}
                        </p>
                      )}
                      {result.errors.length > 0 && (
                        <ul className="mt-2 list-disc pl-4 text-xs">
                          {result.errors.slice(0, 3).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {result.errors.length > 3 && (
                            <li>
                              {t('import.moreErrors', {
                                defaultValue: `And ${result.errors.length - 3} more errors...`,
                                count: result.errors.length - 3,
                              })}
                            </li>
                          )}
                        </ul>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500 text-sm">
                  {t('import.dropFile', {
                    defaultValue: 'Click to select a file or drag and drop',
                  })}
                </p>
                <p className="mt-1 text-gray-400 text-xs">
                  {t('import.supportedFormats', {
                    defaultValue: `Supported formats: ${formats.map(getFormatLabel).join(', ')}`,
                  })}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('import.cancel')}
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || !selectedFile}
            >
              {isImporting ? (
                <span>
                  {t('import.importing', { defaultValue: 'Importing...' })}
                </span>
              ) : (
                <span>{t('import.import', { defaultValue: 'Import' })}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
