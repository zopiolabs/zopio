import type { ImportOptions } from "./types";
import { parse } from "papaparse";
import * as XLSX from "xlsx";

export async function importData(options: ImportOptions): Promise<any[]> {
  const { format, file, map, validate } = options;
  const text = await file.text();

  let rows: any[] = [];

  if (format === "csv") {
    const parsed = parse(text, { header: true });
    rows = parsed.data as any[];
  } else if (format === "json") {
    rows = JSON.parse(text);
  } else if (format === "xlsx") {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet);
  }

  if (map) rows = rows.map(map);
  if (validate) rows = rows.filter(validate);

  return rows;
}
