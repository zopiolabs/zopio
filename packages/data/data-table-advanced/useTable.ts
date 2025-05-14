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

  const toggleRow = (id: number | string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = (ids: (number | string)[]) => {
    setSelectedRows((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(ids);
    });
  };

  const exportCSV = () => {
    const rows = tableData.map((row) =>
      Object.values(row).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const header = Object.keys(tableData[0] || {}).join(",");
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${resource}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  };
}
