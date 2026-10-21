import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { register as registerApi } from "../api/authApi";
import { registerSchema, type RegisterFormData } from "../schemas/authSchemas";
import {
  SparklesIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
} from "../../../components/common/Icons";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError("");

      await registerApi({
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Registration failed. Please verify your details.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Pane: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-extrabold text-base shadow-sm shadow-indigo-500/20">
                E
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Enterprise<span className="text-indigo-600">Store</span>
              </span>
            </Link>

            <h2 className="mt-8 text-2xl font-black tracking-tight text-slate-900">
              Create an account
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Start shopping with enterprise security and instant checkout.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    First Name *
                  </label>
                  <div className="mt-1.5">
                    <input
                      placeholder="Jane"
                      {...register("firstName")}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-4 ${
                        errors.firstName
                          ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200 bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-indigo-500/10"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Last Name
                  </label>
                  <div className="mt-1.5">
                    <input
                      placeholder="Doe"
                      {...register("lastName")}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address *
                </label>
                <div className="mt-1.5">
                  <input
                    type="email"
                    placeholder="jane@example.com"
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

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Phone (10 digits)
                </label>
                <div className="mt-1.5">
                  <input
                    type="tel"
                    placeholder="9876543210"
                    {...register("phone")}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-4 ${
                      errors.phone
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-indigo-500/10"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password (min 8 chars) *
                </label>
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

              {/* Server Error Alert */}
              {serverError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {serverError}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register Account</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Pane: Showcase Banner */}
      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 text-white">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-300 uppercase">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <span>PostgreSQL & Flyway Architecture</span>
          </div>

          <div className="max-w-md space-y-4">
            <h3 className="text-3xl font-black tracking-tight leading-snug">
              Instant Account Creation with Strict Validation
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Synchronized Zod client validation and Spring Boot Jakarta constraints guarantee clean, validated database transactions every time.
            </p>

            <div className="space-y-2.5 pt-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Zero duplicate email conflicts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Default ROLE_USER assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Instant redirect to secure login</span>
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
