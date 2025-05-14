import { useEffect, useState } from "react";
import { dataProvider } from "@repo/data-provider";

type ColumnLayout = {
  key: string;
  width?: number;
  visible: boolean;
};

type Params = {
  resource: string;
};

export function useTable({ resource }: Params) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnLayout[]>([]);

  useEffect(() => {
    const layoutKey = `zopio:layout:${resource}`;
    const saved = localStorage.getItem(layoutKey);
    if (saved) {
      setColumns(JSON.parse(saved));
    }
  }, [resource]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await dataProvider.getList({ resource, query: {} });
      setTableData(result.data);
      if (!columns.length && result.data.length > 0) {
        const layout = Object.keys(result.data[0]).map((key) => ({
          key,
          visible: true,
        }));
        setColumns(layout);
        localStorage.setItem(`zopio:layout:${resource}`, JSON.stringify(layout));
      }
      setLoading(false);
    };
    fetchData();
  }, [resource]);

  const toggleColumn = (key: string) => {
    const updated = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(updated);
    localStorage.setItem(`zopio:layout:${resource}`, JSON.stringify(updated));
  };

  const reorderColumns = (keys: string[]) => {
    const reordered = keys
      .map((key) => columns.find((col) => col.key === key))
      .filter((col): col is ColumnLayout => !!col);
    setColumns(reordered);
    localStorage.setItem(`zopio:layout:${resource}`, JSON.stringify(reordered));
  };

  const setColumnWidth = (key: string, width: number) => {
    const updated = columns.map((col) =>
      col.key === key ? { ...col, width } : col
    );
    setColumns(updated);
    localStorage.setItem(`zopio:layout:${resource}`, JSON.stringify(updated));
  };

  return {
    tableData,
    loading,
    columns,
    toggleColumn,
    reorderColumns,
    setColumnWidth,
  };
}
