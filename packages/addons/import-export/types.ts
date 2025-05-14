export type ImportFormat = "csv" | "json" | "xlsx";
export type ExportFormat = "csv" | "json" | "xlsx";

export interface ImportOptions {
  format: ImportFormat;
  file: Blob;
  map?: (row: any) => any;
  validate?: (row: any) => boolean;
}

export interface ExportOptions {
  format: ExportFormat;
  data: any[];
  fileName?: string;
}
