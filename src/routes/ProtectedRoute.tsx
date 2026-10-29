import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";
import { isTokenExpired } from "../utils/token";
import { publicApi } from "../api/axios";
import type { AuthResponse } from "../features/auth/types/auth";
import type { ApiResponse } from "../types/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, accessToken, refreshToken, setAuth, clearAuth } = useAuthStore();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. If not authenticated at all, redirect to /login
  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If access token is expired AND refresh token is expired (or missing) -> session is dead
  if (isTokenExpired(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      clearAuth();
      return (
        <Navigate
          to="/login"
          state={{ from: location, expired: true }}
          replace
        />
      );
    }
  }

  // 3. If access token is expired, but refresh token is still valid -> attempt transparent refresh
  useEffect(() => {
    let isMounted = true;

    if (isTokenExpired(accessToken) && refreshToken && !isTokenExpired(refreshToken)) {
      setIsRefreshing(true);

      publicApi
        .post<ApiResponse<AuthResponse>>("/auth/refresh", { refreshToken })
        .then((response) => {
          if (!isMounted) return;
          const authData = response.data.data;
          setAuth(
            authData.accessToken,
            authData.refreshToken || refreshToken,
            authData.user || user
          );
          setIsRefreshing(false);
        })
        .catch(() => {
          if (!isMounted) return;
          clearAuth();
          window.location.href = `/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}&expired=true`;
        });
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, refreshToken, user, location, setAuth, clearAuth]);

  // While refreshing an expired access token, show a brief session validation loader
  if (
    isRefreshing ||
    (isTokenExpired(accessToken) && refreshToken && !isTokenExpired(refreshToken))
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Validating secure session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
