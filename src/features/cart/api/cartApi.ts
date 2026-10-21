import { api } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../types/cart";

/**
 * Fetch active user's cart from backend
 */
export const getCart = async (): Promise<Cart> => {
  const response = await api.get<ApiResponse<Cart>>("/cart");
  return response.data.data;
};

/**
 * Add product item to cart
 */
export const addToCart = async (request: AddToCartRequest): Promise<Cart> => {
  const response = await api.post<ApiResponse<Cart>>("/cart/items", request);
  return response.data.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  itemId: number,
  request: UpdateCartItemRequest
): Promise<Cart> => {
  const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, request);
  return response.data.data;
};

/**
 * Remove single item from cart
 */
export const removeCartItem = async (itemId: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/cart/items/${itemId}`);
};

/**
 * Clear all items from cart
 */
export const clearCart = async (): Promise<void> => {
  await api.delete<ApiResponse<void>>("/cart");
};
