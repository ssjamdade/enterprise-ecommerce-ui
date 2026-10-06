import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/productApi";
import type { Product } from "../types/product";

export const PRODUCT_DETAIL_QUERY_KEY = "product";

/**
 * Hook to fetch single product details by ID
 */
export function useProduct(id: number | undefined) {
  return useQuery<Product, Error>({
    queryKey: [PRODUCT_DETAIL_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error("Product ID is required");
      return getProductById(id);
    },
    enabled: typeof id === "number" && !isNaN(id) && id > 0,
  });
}
