import { useState, useCallback, useMemo } from 'react';
import { simpleSearch } from '../utils/search';

export function useSearch<T extends { id: string | number; text?: string }>(
  items: T[],
  searchKey: keyof Omit<T, 'id'> = 'text' as any,
  initialQuery: string = ''
) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return simpleSearch(items, query, searchKey);
  }, [items, query, searchKey]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return {
    query,
    setQuery,
    results,
    isSearching: query.length > 0,
    resultCount: results.length,
    clearSearch,
  };
}
