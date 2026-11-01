export interface Category {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  active?: boolean;
}
