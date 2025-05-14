import { useEffect, useState } from "react";

type Params = {
  resource: string;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { field: string; order: "asc" | "desc" };
  filters?: Record<string, string | number>;
};

export function useTable({ resource, initialPage = 1, initialPageSize = 10, initialSort, filters = {} }: Params) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        _page: page.toString(),
        _limit: pageSize.toString(),
        ...(sort ? { _sort: sort.field, _order: sort.order } : {}),
        ...Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v.toString()])),
      });
      const res = await fetch(`/api/${resource}?${query.toString()}`);
      const data = await res.json();
      setTableData(data);
      setLoading(false);
    };
    fetchData();
  }, [resource, page, pageSize, sort, filters]);

  return {
    tableData,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
  };
}
