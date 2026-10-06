/**
 * Generic backend API envelope response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Spring Data Page response model
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page index (0-based)
  size: number; // Page size
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Pagination & sorting parameters sent to Spring Data endpoints
 */
export interface PageParams {
  page?: number; // 0-based index
  size?: number;
  sort?: string; // e.g. "price,asc", "price,desc", "id,desc"
}
