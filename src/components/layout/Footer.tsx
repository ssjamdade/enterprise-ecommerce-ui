import { Link } from "react-router-dom";
import { ShieldCheckIcon, TruckIcon, RefreshCwIcon } from "../common/Icons";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <TruckIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Free Express Delivery</h4>
                <p className="text-xs text-slate-500">On all orders over ₹999 across India</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Razorpay Protected</h4>
                <p className="text-xs text-slate-500">256-bit encrypted checkout & webhooks</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <RefreshCwIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">7-Day Easy Returns</h4>
                <p className="text-xs text-slate-500">Hassle-free replacement policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-700 text-white font-black text-sm shadow-sm">
                E
              </span>
              <span>EnterpriseStore</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              A high-performance enterprise e-commerce platform built with Spring Boot 3, PostgreSQL, Flyway, and React 19.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Shop</h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/products" className="hover:text-slate-900 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-slate-900 transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-slate-900 transition">
                  Featured Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Account & Security</h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/login" className="hover:text-slate-900 transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-slate-900 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-slate-400">JWT Rotation & Refresh</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Engineering Stack</h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>Spring Boot 3 + Spring Security</li>
              <li>PostgreSQL + Flyway Migrations</li>
              <li>React 19 + TypeScript + Vite</li>
              <li>TanStack Query + Zustand Store</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row text-xs text-slate-400">
          <p>© 2026 EnterpriseStore. All rights reserved. Resume Showcase Project.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
