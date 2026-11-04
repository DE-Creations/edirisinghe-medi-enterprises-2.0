import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface Options {
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Server-paginated list (Laravel paginator JSON: data, last_page, total, optional meta).
 * - Changing `filters` resets to page 1 and debounces the request.
 * - Changing only the page fetches immediately.
 * - Stale responses are ignored; if the current page becomes empty (e.g. last row
 *   deleted) it steps back to the last page that still has rows.
 */
export function usePaginatedList<T = any, M = any>(
  url: string,
  filters: Record<string, unknown> = {},
  { debounceMs = 350, enabled = true }: Options = {},
) {
  const [rows, setRows] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState<M | null>(null);
  const [loading, setLoading] = useState(false);

  const filterKey = JSON.stringify(filters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const pageRef = useRef(page);
  pageRef.current = page;
  const requestId = useRef(0);
  const lastFilterKey = useRef<string | null>(null);

  const load = useCallback(async (pg: number) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: pg };
      Object.entries(filtersRef.current).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      const res = await axios.get(url, { params });
      if (id !== requestId.current) return; // a newer request superseded this one
      const d = res.data;
      const lp: number = d.last_page ?? 1;
      const data: T[] = d.data ?? [];
      if (data.length === 0 && pg > 1 && lp < pg) {
        setPage(Math.max(1, lp));
        return;
      }
      setRows(data);
      setLastPage(lp);
      setTotal(d.total ?? 0);
      setMeta(d.meta ?? null);
    } catch (e) {
      if (id !== requestId.current) return;
      setRows([]);
      setLastPage(1);
      setTotal(0);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;
    const filtersChanged = lastFilterKey.current !== null && lastFilterKey.current !== filterKey;
    if (filtersChanged && page !== 1) {
      setPage(1); // effect re-runs on page 1 and debounces there
      return;
    }
    lastFilterKey.current = filterKey;
    const t = setTimeout(() => load(page), filtersChanged ? debounceMs : 0);
    return () => clearTimeout(t);
  }, [filterKey, page, enabled, load, debounceMs]);

  const refetch = useCallback(() => load(pageRef.current), [load]);

  return { rows, page, setPage, lastPage, total, meta, loading, refetch };
}
