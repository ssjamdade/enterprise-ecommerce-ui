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
  sellerId?: number;
  sellerName?: string;
  images: string[];
}

export interface ProductFilterParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
}

export interface CreateProductInput {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  categoryId: number;
  active?: boolean;
}
