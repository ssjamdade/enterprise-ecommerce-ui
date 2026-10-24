import { publicApi, api } from "../../../api/axios";
import type { ApiResponse, PageResponse, PageParams } from "../../../types/api";
import type { Product, ProductFilterParams, CreateProductInput } from "../types/product";

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

/**
 * Get products created by the current logged-in seller
 */
export const getMyProducts = async (
  page = 0,
  size = 12
): Promise<PageResponse<Product>> => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(
    "/products/my-products",
    {
      params: { page, size },
    }
  );
  return response.data.data;
};

/**
 * Create a new product (requires ROLE_SELLER / approved KYC)
 */
export const createProduct = async (
  input: CreateProductInput
): Promise<Product> => {
  const response = await api.post<ApiResponse<Product>>("/products", input);
  return response.data.data;
};

/**
 * Upload product images
 */
export const uploadProductImages = async (
  productId: number,
  files: File[]
): Promise<Product> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await api.post<ApiResponse<Product>>(
    `/products/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};
