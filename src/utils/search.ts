/**
 * Fast search utility with Levenshtein distance for fuzzy matching
 */

export interface SearchableItem {
  id: string | number;
  text?: string;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching and typo tolerance
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Perform simple substring search (fastest)
 */
export function simpleSearch<T extends SearchableItem>(
  items: T[],
  query: string,
  searchKey: keyof Omit<T, 'id'> = 'text' as any
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    String(item[searchKey]).toLowerCase().includes(lowerQuery)
  );
}

/**
 * Perform fuzzy search with scoring
 */
export function fuzzySearch<T extends SearchableItem>(
  items: T[],
  query: string,
  searchKey: keyof Omit<T, 'id'> = 'text' as any,
  maxDistance: number = 2
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  const results = items
    .map((item) => {
      const text = String(item[searchKey]).toLowerCase();
      const distance = levenshteinDistance(lowerQuery, text);
      const isMatch = distance <= maxDistance || text.includes(lowerQuery);

      return { item, distance, isMatch };
    })
    .filter((result) => result.isMatch)
    .sort((a, b) => {
      // Exact matches first
      const aExact = String(a.item[searchKey]).toLowerCase() === lowerQuery ? 0 : 1;
      const bExact = String(b.item[searchKey]).toLowerCase() === lowerQuery ? 0 : 1;

      if (aExact !== bExact) return aExact - bExact;

      // Then by distance
      return a.distance - b.distance;
    })
    .map((result) => result.item);

  return results;
}

/**
 * Perform multi-field search
 */
export function multiFieldSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
  method: 'simple' | 'fuzzy' = 'simple'
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    return searchFields.some((field) => {
      const value = String(item[field]).toLowerCase();

      if (method === 'fuzzy') {
        const distance = levenshteinDistance(lowerQuery, value);
        return distance <= 2 || value.includes(lowerQuery);
      }

      return value.includes(lowerQuery);
    });
  });
}

/**
 * Paginate search results
 */
export function paginate<T>(
  items: T[],
  pageNumber: number,
  pageSize: number
): { items: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    currentPage: pageNumber,
  };
}
