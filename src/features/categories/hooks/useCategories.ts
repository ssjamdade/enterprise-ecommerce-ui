import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoryApi";
import type { Category } from "../types/category";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

/**
 * Hook to fetch and cache all product categories
 */
export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // Categories change infrequently (10 min cache)
  });
}
