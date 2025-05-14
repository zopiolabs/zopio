import type { ExportOptions } from "./types";
import { unparse } from "papaparse";
import * as XLSX from "xlsx";

export function exportData({ format, data, fileName = "export" }: ExportOptions): Blob {
  let blob: Blob;

  if (format === "csv") {
    const csv = unparse(data);
    blob = new Blob([csv], { type: "text/csv" });
  } else if (format === "json") {
    const json = JSON.stringify(data, null, 2);
    blob = new Blob([json], { type: "application/json" });
  } else if (format === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const arrayBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    blob = new Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } else {
    throw new Error("Unsupported export format");
  }

  return blob;
}
