import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store/authStore";
import {
  getMyAddresses,
  createAddress as createAddressApi,
  setDefaultAddress as setDefaultAddressApi,
  deleteAddress as deleteAddressApi,
} from "../api/addressApi";
import type { Address, CreateAddressRequest } from "../types/address";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export function useAddresses() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Address[], Error>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getMyAddresses,
    enabled: Boolean(accessToken),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAddressRequest) => createAddressApi(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => setDefaultAddressApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAddressApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}
