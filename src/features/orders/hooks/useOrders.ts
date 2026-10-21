import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store/authStore";
import {
  createOrder as createOrderApi,
  getOrderById as getOrderByIdApi,
  getMyOrders as getMyOrdersApi,
} from "../api/orderApi";
import { CART_QUERY_KEY } from "../../cart/hooks/useCart";
import type { Order, CreateOrderRequest } from "../types/order";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useMyOrders() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Order[], Error>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getMyOrdersApi,
    enabled: Boolean(accessToken),
  });
}

export function useOrder(id: number | undefined) {
  return useQuery<Order, Error>({
    queryKey: ["order", id],
    queryFn: () => {
      if (!id) throw new Error("Order ID is required");
      return getOrderByIdApi(id);
    },
    enabled: typeof id === "number" && !isNaN(id) && id > 0,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => createOrderApi(request),
    onSuccess: (newOrder) => {
      // Invalidate both cart and orders queries
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.setQueryData(["order", newOrder.id], newOrder);
    },
  });
}
