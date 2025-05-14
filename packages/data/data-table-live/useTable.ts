import { useEffect, useState, useRef } from "react";
import { dataProvider } from "@repo/data-provider";

type Params = {
  resource: string;
  live?: boolean;
  intervalMs?: number;
};

export function useTable({ resource, live = true, intervalMs = 10000 }: Params) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(live);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const result = await dataProvider.getList({ resource, query: {} });
    setTableData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [resource]);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(fetchData, intervalMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs, resource]);

  return {
    tableData,
    loading,
    enableLive: () => setEnabled(true),
    disableLive: () => setEnabled(false),
    isLiveEnabled: enabled,
  };
}
