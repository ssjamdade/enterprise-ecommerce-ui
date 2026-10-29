import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "../features/auth/store/authStore";
import type { AuthResponse } from "../features/auth/types/auth";
import { isTokenExpired } from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Global helper to handle session expiration and redirect user to login
 */
export function handleSessionExpired() {
  useAuthStore.getState().clearAuth();

  const currentPath = window.location.pathname;
  if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register")) {
    const search = window.location.search;
    const redirectUrl = encodeURIComponent(currentPath + search);
    window.location.href = `/login?redirect=${redirectUrl}&expired=true`;
  }
}

/**
 * Axios instance for unauthenticated endpoints.
 * Examples: /auth/login, /auth/register, /auth/refresh
 * No Bearer token attached, and no 401 response interceptor.
 */
export const publicApi = axios.create({
  baseURL,
});

/**
 * Axios instance for authenticated endpoints.
 * Automatically attaches JWT access token and transparently
 * handles 401 token refresh rotation or redirects on expiration.
 */
export const api = axios.create({
  baseURL,
});

/**
 * Request Interceptor:
 * Attaches Bearer accessToken from Zustand store to every request.
 * If both access token and refresh token are expired, immediately aborts and redirects to /login.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken, refreshToken } = useAuthStore.getState();

    // If both access token and refresh token are expired, redirect to login immediately
    if (accessToken && isTokenExpired(accessToken)) {
      if (!refreshToken || isTokenExpired(refreshToken)) {
        handleSessionExpired();
        return Promise.reject(new Error("Session has expired. Redirecting to login."));
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

/**
 * Shared in-flight refresh promise.
 * Prevents multiple simultaneous 401s from triggering multiple /auth/refresh calls.
 */
let refreshPromise: Promise<AuthResponse> | null = null;

/**
 * Response Interceptor:
 * Intercepts 401 Unauthorized errors and handles automatic token refresh & request retry.
 * If refresh fails or token is expired, clears auth and redirects to /login.
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Only handle 401 errors for valid requests
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Do not attempt to refresh if the refresh endpoint itself returns 401
    if (originalRequest.url?.includes("/auth/refresh")) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    // Prevent infinite loop if retried request fails again with 401
    if (originalRequest._retry) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    const storedRefreshToken = useAuthStore.getState().refreshToken;

    // If there is no refresh token or it is expired, user must log in again
    if (!storedRefreshToken || isTokenExpired(storedRefreshToken)) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // If a refresh request is already running, reuse that promise.
      // Otherwise, start a new refresh request using publicApi.
      if (!refreshPromise) {
        refreshPromise = publicApi
          .post<{ data: AuthResponse }>("/auth/refresh", {
            refreshToken: storedRefreshToken,
          })
          .then((response) => {
            const authResponse = response.data.data;
            const currentUser = useAuthStore.getState().user;

            // Save new tokens to Zustand store & localStorage
            useAuthStore.getState().setAuth(
              authResponse.accessToken,
              authResponse.refreshToken || storedRefreshToken,
              authResponse.user || currentUser!
            );

            return authResponse;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Wait for the active refresh token request to finish
      const authResponse = await refreshPromise;

      // Update Authorization header on original request with new access token
      originalRequest.headers.Authorization = `Bearer ${authResponse.accessToken}`;

      // Retry the original request using api instance
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh token failed or expired -> clear state and force user to log in
      handleSessionExpired();
      return Promise.reject(refreshError);
    }
  }
);
