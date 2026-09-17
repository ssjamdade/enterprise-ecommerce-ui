import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "../features/auth/store/authStore";
import { refreshToken } from "../features/auth/api/authApi";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    const storedRefreshToken =
      useAuthStore.getState().refreshToken;

    if (!storedRefreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return Promise.reject(error);
    }

    isRefreshing = true;

    try {
      const response = await refreshToken(storedRefreshToken);

      useAuthStore.getState().setAuth(
        response.accessToken,
        response.refreshToken,
        response.user
      );

      originalRequest.headers.Authorization =
        `Bearer ${response.accessToken}`;

      return api(originalRequest);

    } catch (refreshError) {

      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);