import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useAuthStore } from "../../auth/store/authStore";
import { useCategories } from "../../categories/hooks/useCategories";
import { api } from "../../../api/axios";
import {
  ArrowRightIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckIcon,
} from "../../../components/common/Icons";

export default function HomePage() {
  const { user, accessToken } = useAuthStore();
  const { data: categories = [] } = useCategories();
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestProtectedApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/auth/me");
      setProtectedData(JSON.stringify(res.data, null, 2));
    } catch {
      setError("Failed to fetch protected data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24">
        {/* Subtle Background Glow Gradients */}
        <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-200/50 to-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-200/40 to-indigo-100/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Hero Content */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 backdrop-blur-sm">
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Spring Boot 3 + PostgreSQL + React 19 Showcase</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                High-Performance <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
                  Enterprise E-Commerce
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-600">
                A production-grade full-stack commerce engine featuring dual JWT rotation, Spring Data dynamic search & pagination, Flyway schema versioning, and TanStack Query state caching.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-slate-950/20 hover:bg-indigo-600 transition duration-200"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>Browse Product Catalog</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <Link
                  to="/seller/kyc"
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <ShieldCheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>Seller Onboarding</span>
                </Link>

                {!user && (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <span>Sign In to Demo</span>
                  </Link>
                )}
              </div>

              {/* Feature checkmarks */}
              <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Stateless JWT Auth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Live Stock Inventory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Cloudinary Media CDN</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-rose-400" />
                    <span className="flex h-3 w-3 rounded-full bg-amber-400" />
                    <span className="flex h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Spring Boot REST API</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs font-medium text-slate-700">
                    <span>GET /api/v1/products</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs font-medium text-slate-700">
                    <span>POST /api/v1/auth/refresh</span>
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">Rotated</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs font-medium text-slate-700">
                    <span>POST /api/v1/payments/verify</span>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">Razorpay</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>SYSTEM HEALTH</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300">
                    PostgreSQL: Connected<br />
                    Flyway: 9 Migrations Active<br />
                    Stateless JWT: Enabled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Explore Departments
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Featured Categories
              </h2>
            </div>
            <Link
              to="/products"
              className="mt-3 sm:mt-0 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>View all categories</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 4).map((cat, idx) => {
              const bgImages = [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80",
              ];
              return (
                <Link
                  key={cat.id}
                  to={`/products`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={bgImages[idx % bgImages.length]}
                    alt={cat.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                      Collection
                    </p>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Developer Architecture & Auth Tester Section */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Resume Showcase Console
                </span>
                <h3 className="mt-2 text-xl font-bold">Live JWT Interceptor & Session Inspector</h3>
                <p className="text-xs text-slate-400">
                  Verify request headers and automatic 401 token refresh queueing in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    user ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${user ? "bg-emerald-400" : "bg-slate-500"}`} />
                  {user ? "Session Active" : "Guest Mode"}
                </span>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-slate-500">Authenticated User:</span>
                    <p className="mt-1 font-bold text-white">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-slate-500">User Email:</span>
                    <p className="mt-1 font-bold text-white">{user.email}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-slate-500">Authority Roles:</span>
                    <p className="mt-1 font-bold text-emerald-400">{user.roles?.join(", ") || "ROLE_USER"}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-400 truncate">
                  Authorization: Bearer {accessToken?.slice(0, 50)}...
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTestProtectedApi}
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    {loading ? "Testing..." : "Test Protected API (/api/v1/auth/me)"}
                  </button>
                </div>

                {protectedData && (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-black p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <pre>{protectedData}</pre>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-900/50 bg-rose-950/50 p-4 text-xs text-rose-300">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-400">
                <p>No active user session detected in Zustand store.</p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    to="/login"
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-white hover:bg-slate-700 transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
