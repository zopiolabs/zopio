import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Params = {
  resource: string;
  syncToUrl?: boolean;
};

export function useTable({ resource, syncToUrl = true }: Params) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get("q") || "");
  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const [sort, setSort] = useState(searchParams?.get("sort") || "");

  useEffect(() => {
    if (syncToUrl) {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (page > 1) params.set("page", String(page));
      if (sort) params.set("sort", sort);
      router.replace(`?${params.toString()}`);
    }
  }, [search, page, sort]);

  return {
    search,
    setSearch,
    page,
    setPage,
    sort,
    setSort,
  };
}
