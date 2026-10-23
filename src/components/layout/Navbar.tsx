import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { logout } from "../../features/auth/api/authApi";
import { useCart } from "../../features/cart/hooks/useCart";
import {
  ShoppingBagIcon,
  SearchIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "../common/Icons";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshToken: storedRefreshToken, clearAuth } = useAuthStore();
  const { data: cart } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Create a ref for the dropdown container
const dropdownRef = useRef<HTMLDivElement>(null);
// 2. Listen for clicks anywhere on the document
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // If click was outside dropdownRef element, close the dropdown
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setUserDropdownOpen(false);
    }
  };
  if (userDropdownOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  // Cleanup listener when unmounted or dropdown closed
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [userDropdownOpen]);

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = async () => {
    try {
      if (storedRefreshToken) {
        await logout(storedRefreshToken);
      }
    } catch (err) {
      console.error("Logout error on server:", err);
    } finally {
      clearAuth();
      setUserDropdownOpen(false);
      navigate("/login");
    }
  };

  const isProductsActive = location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-1.5 px-4 text-center text-[11px] font-medium text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Spring Boot 3 + React 19 Enterprise Architecture Demo</span>
          <span className="hidden sm:inline opacity-60">|</span>
          <span className="hidden sm:inline text-indigo-300">Fast Delivery & Razorpay Checkout</span>
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-extrabold text-base shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                Enterprise<span className="text-indigo-600">Store</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                E-Commerce
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`rounded-lg px-3 py-1.5 transition ${
                location.pathname === "/"
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`rounded-lg px-3 py-1.5 transition ${
                isProductsActive
                  ? "bg-indigo-50 font-semibold text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              All Products
            </Link>
          </nav>
        </div>

        {/* Quick Search Trigger & Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition"
          >
            <SearchIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Search products...</span>
            <kbd className="hidden lg:inline-block rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </Link>

          {/* Cart Icon with Live Badge */}
          <Link
            to="/cart"
            title="Shopping Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
        
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-3 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 text-xs">
                  {user.firstName?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline font-semibold text-slate-900">
                  {user.firstName}
                </span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <>
                
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50">
                    <div className="border-b border-slate-100 px-3 py-2.5">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="mt-1.5 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        {user.roles?.[0]?.replace("ROLE_", "") || "USER"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Overview</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <SparklesIcon className="w-3.5 h-3.5 text-indigo-500" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <ShoppingBagIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Cart ({cartItemCount})</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOutIcon className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 hover:bg-indigo-600 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <span className="text-sm">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            All Products
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Search Catalog
          </Link>
        </div>
      )}
    </header>
  );
}
