import { useState, useEffect, useCallback } from 'react';

interface InfiniteScrollOptions<T> {
  fetchData: (pageToken?: string) => Promise<{ data: T[]; hasMore?: boolean; nextPageData?: string | null }>;
}

export function useInfiniteScroll<T>({ fetchData }: InfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchData();
      setItems(res.data);
      setHasMore(!!res.hasMore);
      setNextPage(res.nextPageData || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !nextPage) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchData(nextPage);
      setItems(prev => [...prev, ...res.data]);
      setHasMore(!!res.hasMore);
      setNextPage(res.nextPageData || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextPage, fetchData]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 150) {
      loadMore();
    }
  };

  return { items, isLoading, error, handleScroll, hasMore };
}
