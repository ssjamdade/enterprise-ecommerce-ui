import { api, publicApi } from "../../../api/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

/**
 * Register a new user (public endpoint)
 */
export const register = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const response = await publicApi.post<{ data: AuthResponse }>(
    "/auth/register",
    request
  );
  return response.data.data;
};

/**
 * Login user (public endpoint)
 */
export const login = async (
  request: LoginRequest
): Promise<AuthResponse> => {
  const response = await publicApi.post<{ data: AuthResponse }>(
    "/auth/login",
    request
  );
  return response.data.data;
};

/**
 * Refresh access token using refresh token (public endpoint)
 */
export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const response = await publicApi.post<{ data: AuthResponse }>(
    "/auth/refresh",
    {
      refreshToken,
    }
  );
  return response.data.data;
};

/**
 * Logout user (authenticated endpoint)
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await api.post("/auth/logout", {
    refreshToken,
  });
};