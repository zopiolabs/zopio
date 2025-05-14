import { useState } from "react";
import { buildSearchFilters } from "@core/search-utils";
import type { ConditionalFilter } from "@core/filter-utils";

export function useTableSearch(fields: string[]) {
  const [search, setSearch] = useState("");

  const filters: ConditionalFilter[] = buildSearchFilters(fields, search);

  return {
    search,
    setSearch,
    filters
  };
}
