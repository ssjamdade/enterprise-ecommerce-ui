import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../../../utils/token";
import { handleSessionExpired } from "../../../api/axios";

// Protected route prefixes that require an active session
const PROTECTED_PREFIXES = [
  "/checkout",
  "/orders",
  "/seller",
  "/admin",
];

/**
 * Hook that actively monitors token expiration when the tab is focused or periodically.
 * If both access and refresh tokens expire, immediately redirects to /login.
 */
export function useSessionWatcher() {
  const location = useLocation();
  const { user, accessToken, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      // If access token is expired AND refresh token is expired (or missing)
      if (accessToken && isTokenExpireerd(accessToken)) {
        if (!refreshToken || isTokenExpired(refreshToken)) {
          const isCurrentRouteProtected = PROTECTED_PREFIXES.some((prefix) =>
            location.pathname.startsWith(prefix)
          );

          if (isCurrentRouteProtected) {
            handleSessionExpired();
          }
        }
      }
    };

    // Check immediately on route change or mount
    checkSession();

    // Check when user refocuses the tab / window
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkSession);

    // Periodic check every 30 seconds
    const intervalId = setInterval(checkSession, 30000);

    return () => {
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkSession);
      clearInterval(intervalId);
    };
  }, [user, accessToken, refreshToken, location.pathname]);
}
