import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { loginSchema, type LoginFormData } from "../schemas/authSchemas";
import {
  SparklesIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  AlertCircleIcon,
} from "../../../components/common/Icons";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const isSessionExpired =
    Boolean((location.state as any)?.expired) ||
    searchParams.get("expired") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");

      const response = await login(data);

      setAuth(
        response.accessToken,
        response.refreshToken,
        response.user
      );

      const redirectParam = searchParams.get("redirect");
      const from = redirectParam || (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Invalid email or password. Please verify your credentials.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Pane: Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Brand header */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 text-white font-extrabold text-base shadow-sm shadow-indigo-500/20">
                E
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Enterprise<span className="text-indigo-600">Store</span>
              </span>
            </Link>

            <h2 className="mt-8 text-2xl font-black tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Enter your credentials to access your enterprise account & cart.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="mt-1.5">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-4 ${
                      errors.email
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-indigo-500/10"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password with toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full rounded-xl border py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-4 ${
                      errors.password
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-indigo-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Session Expired Alert */}
              {isSessionExpired && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800 flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Your session has expired. Please sign in again to continue.</span>
                </div>
              )}

              {/* Server Error Alert */}
              {serverError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {serverError}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign in to Account</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                >
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Administrator Access Portal →</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Pane: Showcase Banner */}
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 text-white">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-300 uppercase">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <span>Enterprise Security Standard</span>
          </div>

          <div className="max-w-md space-y-4">
            <h3 className="text-3xl font-black tracking-tight leading-snug">
              Stateless Authentication with Dual Token Rotation
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Short-lived JWT Access Tokens (15 min) paired with PostgreSQL-persisted Refresh Tokens (7 days) for secure, seamless session management.
            </p>

            <div className="space-y-2.5 pt-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>BCrypt password hashing (10 rounds)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Axios interceptor automatic retry queue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Role-based Spring Security authorization</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheckIcon className="w-4 h-4 text-indigo-400" />
            <span>Enterprise E-Commerce Resume Project 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
