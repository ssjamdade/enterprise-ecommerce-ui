import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { adminLoginSchema, type AdminLoginFormData } from "../schemas/authSchemas";
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  AlertCircleIcon,
  CheckIcon,
} from "../../../components/common/Icons";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, clearAuth } = useAuthStore();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const isSessionExpired =
    Boolean((location.state as any)?.expired) ||
    searchParams.get("expired") === "true";
  const unauthorizedNotice =
    (location.state as any)?.message ||
    (searchParams.get("unauthorized") === "true" ? "Administrator privileges required to access this portal." : null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const handleAutofillAdmin = () => {
    setValue("usernameOrEmail", "admin", { shouldValidate: true });
    setValue("password", "admin@12345", { shouldValidate: true });
    setServerError("");
  };

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setServerError("");

      const response = await login({
        email: data.usernameOrEmail.trim(),
        password: data.password,
      });

      const user = response.user;
      const isAdmin =
        user?.roles && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ADMIN"));

      if (!isAdmin) {
        clearAuth();
        setServerError("Access Denied: This account does not possess administrator permissions.");
        return;
      }

      setAuth(response.accessToken, response.refreshToken, user);

      const redirectParam = searchParams.get("redirect");
      const from = redirectParam || (location.state as any)?.from?.pathname || "/admin/kyc";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Invalid administrator credentials. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand & Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 p-0.5 shadow-xl shadow-indigo-500/20 mb-4">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Admin Operations Console
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Login
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xs">
            Authenticate with system administrator credentials to access management controls.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md p-6 sm:p-8">
          {/* Status alerts */}
          {isSessionExpired && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-300">
                <span className="font-semibold block">Session Expired</span>
                Your administrator session has timed out. Please sign in again.
              </div>
            </div>
          )}

          {unauthorizedNotice && !serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-300 font-medium">
                {unauthorizedNotice}
              </div>
            </div>
          )}

          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-300 font-medium">
                {serverError}
              </div>
            </div>
          )}

          {/* Quick Credential Helper Pill */}
          <div className="mb-6 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <span className="text-slate-400 block font-mono text-[11px]">System Credentials:</span>
              <span className="font-semibold text-white">admin</span> / <span className="font-mono text-slate-300">admin@12345</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="admin or admin@ecommerce.com"
                {...register("usernameOrEmail")}
                className={`w-full rounded-xl bg-slate-950 border ${
                  errors.usernameOrEmail ? "border-rose-500 focus:ring-rose-500" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                } px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition`}
              />
              {errors.usernameOrEmail && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  {...register("password")}
                  className={`w-full rounded-xl bg-slate-950 border ${
                    errors.password ? "border-rose-500 focus:ring-rose-500" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                  } px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 px-4 text-sm font-bold shadow-lg shadow-indigo-600/30 transition duration-150 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Links back */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link to="/login" className="hover:text-indigo-400 transition">
              ← Customer Sign In
            </Link>
            <Link to="/" className="hover:text-indigo-400 transition">
              Store Homepage →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
