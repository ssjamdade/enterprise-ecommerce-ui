import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { logout } from "../../auth/api/authApi";
import { api } from "../../../api/axios";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken: storedRefreshToken, clearAuth } = useAuthStore();
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      if (storedRefreshToken) {
        await logout(storedRefreshToken);
      }
    } catch (err) {
      console.error("Logout error on server:", err);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const handleTestProtectedApi = async () => {
    try {
      setLoading(true);
      setError(null);
      // Calls /auth/me which is a protected route on Spring Boot
      const res = await api.get("/auth/me");
      setProtectedData(JSON.stringify(res.data, null, 2));
    } catch (err: unknown) {
      setError("Failed to fetch protected data. Check console or token validity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Enterprise E-Commerce</h1>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-3">
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Auth State Status</h2>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span>
                <span className="font-medium text-green-700">Authenticated</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Roles:</strong> {user.roles?.join(", ") || "ROLE_USER"}</p>
              </div>
              <div className="pt-2">
                <p className="text-xs font-mono text-gray-400 truncate">
                  <strong>Access Token:</strong> {accessToken?.slice(0, 30)}...
                </p>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleTestProtectedApi}
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Testing..." : "Test Protected API (/api/v1/auth/me)"}
                </button>
              </div>

              {protectedData && (
                <div className="mt-3 rounded-lg bg-gray-900 p-4 font-mono text-xs text-green-400 overflow-x-auto">
                  <pre>{protectedData}</pre>
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              <p>You are currently not logged in.</p>
              <p className="mt-2">
                Please{" "}
                <Link to="/login" className="text-indigo-600 underline font-medium">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/register" className="text-indigo-600 underline font-medium">
                  Register
                </Link>{" "}
                to test authentication.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
