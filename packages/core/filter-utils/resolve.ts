import type { ConditionalFilter } from "./types";

export function resolveFilters(filters: ConditionalFilter[]): Record<string, any> {
  return filters
    .filter((f) => f.condition !== false)
    .reduce((acc, filter) => {
      acc[filter.field] = filter.value;
      return acc;
    }, {} as Record<string, any>);
}
