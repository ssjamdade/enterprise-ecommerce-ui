import { api } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { Address, CreateAddressRequest } from "../types/address";

/**
 * Fetch all addresses belonging to the authenticated user
 */
export const getMyAddresses = async (): Promise<Address[]> => {
  const response = await api.get<ApiResponse<Address[]>>("/addresses");
  return response.data.data;
};

/**
 * Create a new delivery address
 */
export const createAddress = async (request: CreateAddressRequest): Promise<Address> => {
  const response = await api.post<ApiResponse<Address>>("/addresses", request);
  return response.data.data;
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (id: number): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/addresses/${id}/default`);
};

/**
 * Delete an address
 */
export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/addresses/${id}`);
};
