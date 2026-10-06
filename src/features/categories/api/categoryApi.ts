import { publicApi } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { Category } from "../types/category";

/**
 * Fetch all active categories from backend
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await publicApi.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
};
