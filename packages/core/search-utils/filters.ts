import type { ConditionalFilter } from "@core/filter-utils";

export function buildSearchFilters(fields: string[], search: string): ConditionalFilter[] {
  if (!search?.trim()) return [];

  return fields.map((field) => ({
    field,
    operator: "contains",
    value: search,
    condition: true
  }));
}
