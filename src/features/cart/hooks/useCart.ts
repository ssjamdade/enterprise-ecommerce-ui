import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store/authStore";
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from "../api/cartApi";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../types/cart";

export const CART_QUERY_KEY = ["cart"] as const;

/**
 * Hook to fetch active user's cart
 */
export function useCart() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Cart, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Mutation to add product to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToCartRequest) => addToCartApi(request),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to update item quantity in cart
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, request }: { itemId: number; request: UpdateCartItemRequest }) =>
      updateCartItemApi(itemId, request),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to remove single item from cart
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => removeCartItemApi(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to clear cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCartApi(),
    onSuccess: () => {
      queryClient.setQueryData(CART_QUERY_KEY, { id: 0, items: [], totalAmount: 0 });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
