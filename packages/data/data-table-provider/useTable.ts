import { useEffect, useState } from "react";
import { dataProvider } from "@repo/data-provider";

type Params = {
  resource: string;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { field: string; order: "asc" | "desc" };
  filters?: Record<string, any>;
};

export function useTable({
  resource,
  initialPage = 1,
  initialPageSize = 10,
  initialSort,
  filters = {},
}: Params) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);

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
  };
}
