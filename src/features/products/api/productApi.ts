import { publicApi } from "../../../api/axios";
import type { ApiResponse, PageResponse, PageParams } from "../../../types/api";
import type { Product, ProductFilterParams } from "../types/product";

/**
 * Search & Filter products with server-side pagination and sorting
 */
export const searchProducts = async (
  filter: ProductFilterParams = {},
  pageParams: PageParams = {}
): Promise<PageResponse<Product>> => {
  const { page = 0, size = 12, sort } = pageParams;

  const response = await publicApi.post<ApiResponse<PageResponse<Product>>>(
    "/products/search",
    filter,
    {
      params: {
        page,
        size,
        ...(sort ? { sort } : {}),
      },
    }
  );

  return response.data.data;
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await publicApi.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};
