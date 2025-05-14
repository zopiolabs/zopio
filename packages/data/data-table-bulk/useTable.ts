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
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

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
      if (visibleColumns.length === 0 && result.data.length > 0) {
        setVisibleColumns(Object.keys(result.data[0]));
      }
      setLoading(false);
    };
    fetchData();
  }, [resource, page, pageSize, sort, JSON.stringify(filters)]);

  const toggleRow = (id: number | string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (ids: (number | string)[]) => {
    const allSelected = ids.every((id) => selectedRows.has(id));
    setSelectedRows(allSelected ? new Set() : new Set(ids));
  };

  const exportCSV = () => {
    const rows = tableData.map((row) =>
      visibleColumns.map((key) => `"${String(row[key]).replace(/"/g, '""')}"`).join(",")
    );
    const header = visibleColumns.join(",");
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${resource}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bulkDelete = async () => {
    for (const id of selectedRows) {
      await dataProvider.delete({ resource, id });
    }
    setSelectedRows(new Set());
    const query = { page, pageSize, sort, filters };
    const result = await dataProvider.getList({ resource, query });
    setTableData(result.data);
    setTotal(result.total || 0);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
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
    selectedRows,
    toggleRow,
    toggleAll,
    exportCSV,
    bulkDelete,
    visibleColumns,
    toggleColumn,
  };
}
