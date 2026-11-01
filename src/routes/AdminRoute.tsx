import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";
import { isTokenExpired } from "../utils/token";
import { publicApi } from "../api/axios";
import type { AuthResponse } from "../features/auth/types/auth";
import type { ApiResponse } from "../types/api";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, accessToken, refreshToken, setAuth, clearAuth } = useAuthStore();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. If not authenticated, redirect to /admin/login
  if (!user || !accessToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. Check admin role
  const isAdmin = user.roles && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ADMIN"));
  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        state={{ unauthorized: true, message: "Access Denied: You do not have administrator permissions." }}
        replace
      />
    );
  }

  // 3. If access token is expired AND refresh token is expired -> session expired
  if (isTokenExpired(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      clearAuth();
      return (
        <Navigate
          to="/admin/login"
          state={{ from: location, expired: true }}
          replace
        />
      );
    }
  }

  // 4. Transparent refresh if access token expired but refresh token valid
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
          window.location.href = `/admin/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}&expired=true`;
        });
    }
  }, [accessToken, refreshToken, setAuth, clearAuth, location, user]);

  if (isRefreshing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
