import { api } from "../../../api/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";


export const login = async (
  request: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", request);
  return response.data.data;
};

export const register = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", request);
  return response.data.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/refresh", {
    refreshToken,
  });

  return response.data.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await api.post("/auth/logout", {
    refreshToken,
  });
};