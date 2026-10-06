import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchProducts } from "../api/productApi";
import type { Product, ProductFilterParams } from "../types/product";
import type { PageParams, PageResponse } from "../../../types/api";

export const PRODUCTS_QUERY_KEY = "products";

/**
 * Hook to search and filter products with server-side pagination
 */
export function useProducts(
  filter: ProductFilterParams = {},
  pageParams: PageParams = { page: 0, size: 12 }
) {
  return useQuery<PageResponse<Product>, Error>({
    queryKey: [PRODUCTS_QUERY_KEY, filter, pageParams],
    queryFn: () => searchProducts(filter, pageParams),
    placeholderData: keepPreviousData, // Keeps previous page data while loading next page
  });
}
