import { publicApi, api } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { Category, CreateCategoryInput } from "../types/category";

/**
 * Fetch all categories from backend
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await publicApi.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
};

/**
 * Create a new category (Admin or Seller on product creation)
 */
export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>("/categories", data);
  return response.data.data;
};

/**
 * Update existing category (Admin)
 */
export const updateCategory = async (
  id: number,
  data: CreateCategoryInput
): Promise<Category> => {
  const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
  return response.data.data;
};

/**
 * Delete category (Admin)
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/categories/${id}`);
};
