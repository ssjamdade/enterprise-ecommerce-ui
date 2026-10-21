import { api } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { Order, CreateOrderRequest } from "../types/order";

/**
 * Create a new order from current cart items with shipping address
 */
export const createOrder = async (request: CreateOrderRequest): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>("/orders", request);
  return response.data.data;
};

/**
 * Fetch specific order details by ID
 */
export const getOrderById = async (id: number): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
};

/**
 * Fetch authenticated user's order history
 */
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>("/orders/my-orders");
  return response.data.data;
};
