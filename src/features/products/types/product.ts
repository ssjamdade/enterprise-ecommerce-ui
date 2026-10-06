export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  active: boolean;
  categoryId: number;
  categoryName: string;
  images: string[];
}

export interface ProductFilterParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
}
