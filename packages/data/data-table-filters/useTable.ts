import { useEffect, useState } from "react";
import { dataProvider } from "@repo/data-provider";

type Sort = { field: string; order: "asc" | "desc" };
type Filter = { field: string; operator: "eq" | "contains" | "gte" | "lte"; value: any };

type Params = {
  resource: string;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: Sort;
};

export function useTable({
  resource,
  initialPage = 1,
  initialPageSize = 10,
  initialSort,
}: Params) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState<Sort | undefined>(initialSort);
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = {
        page,
        pageSize,
        sort,
        filters,
      };
      const result = await dataProvider.getList({ resource, query });
      setTableData(result.data);
      setTotal(result.total || 0);
      setLoading(false);
    };
    fetchData();
  }, [resource, page, pageSize, sort, JSON.stringify(filters)]);

  const addFilter = (filter: Filter) => {
    setFilters((prev) => [...prev.filter((f) => f.field !== filter.field), filter]);
  };

  const removeFilter = (field: string) => {
    setFilters((prev) => prev.filter((f) => f.field !== field));
  };

  return {
    tableData,
    total,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
    filters,
    addFilter,
    removeFilter,
  };
}
