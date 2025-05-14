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
  const [search, setSearch] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [editingRow, setEditingRow] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`zopio-table-columns:${resource}`);
    if (stored) setVisibleColumns(JSON.parse(stored));
  }, [resource]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = {
        page,
        pageSize,
        sort,
        filters: { ...filters, q: search },
      };
      const result = await dataProvider.getList({ resource, query });
      setTableData(result.data);
      setTotal(result.total || 0);
      if (visibleColumns.length === 0 && result.data.length > 0) {
        const cols = Object.keys(result.data[0]);
        setVisibleColumns(cols);
        localStorage.setItem(`zopio-table-columns:${resource}`, JSON.stringify(cols));
      }
      setLoading(false);
    };
    fetchData();
  }, [resource, page, pageSize, sort, JSON.stringify(filters), search]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col];
      localStorage.setItem(`zopio-table-columns:${resource}`, JSON.stringify(updated));
      return updated;
    });
  };

  const editRow = (row: any) => {
    setEditingRow({ ...row });
  };

  const updateRow = async () => {
    if (!editingRow?.id) return;
    await dataProvider.update({
      resource,
      id: editingRow.id,
      variables: editingRow,
    });
    setEditingRow(null);
    const query = { page, pageSize, sort, filters: { ...filters, q: search } };
    const result = await dataProvider.getList({ resource, query });
    setTableData(result.data);
    setTotal(result.total || 0);
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
    search,
    setSearch,
    visibleColumns,
    toggleColumn,
    editingRow,
    setEditingRow,
    editRow,
    updateRow,
  };
}
