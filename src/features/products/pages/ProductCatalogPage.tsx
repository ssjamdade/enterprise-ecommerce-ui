import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProductCard from "../components/ProductCard";
import ProductFilterBar from "../components/ProductFilterBar";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilterParams } from "../types/product";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "../../../components/common/Icons";

export default function ProductCatalogPage() {
  const [filter, setFilter] = useState<ProductFilterParams>({});
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("id,desc");

  // Fetch products via React Query
  const { data, isLoading, isError, error, isFetching } = useProducts(
    filter,
    { page, size: 12, sort }
  );

  const handleFilterChange = (newFilter: ProductFilterParams) => {
    setFilter(newFilter);
    setPage(0);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(0);
  };

  const handleReset = () => {
    setFilter({});
    setSort("id,desc");
    setPage(0);
  };

  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  const products = data?.content || [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-slate-950/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <span>Enterprise Catalog</span>
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                <span>Spring Boot 3 + PostgreSQL</span>
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Explore All Products
              </h1>
              <p className="max-w-xl text-xs sm:text-sm text-slate-300">
                Discover high-quality items with instant inventory validation, dynamic category filters, and secure ordering.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-right">
                <p className="text-2xl font-black text-white">
                  {isLoading ? "..." : totalElements}
                </p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Total Products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar Component */}
        <div className="mb-8">
          <ProductFilterBar
            filter={filter}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
        </div>

        {/* Status / Showing Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            {isLoading ? (
              "Fetching products from database..."
            ) : (
              <>
                Showing <strong className="text-slate-800">{products.length}</strong> of{" "}
                <strong className="text-slate-800">{totalElements}</strong> items
                {isFetching && !isLoading && (
                  <span className="ml-2 text-indigo-600 font-semibold">(syncing...)</span>
                )}
              </>
            )}
          </span>
          <span className="text-[11px] text-slate-400">Page {page + 1} of {Math.max(1, totalPages)}</span>
        </div>

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-lg font-bold">
              !
            </div>
            <h3 className="mt-3 text-base font-bold">Unable to Load Products</h3>
            <p className="mt-1 text-xs text-rose-600">
              {error?.message || "Please verify your Spring Boot backend is active on port 8080."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-sm"
            >
              Retry Request
            </button>
          </div>
        )}

        {/* Shimmer Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="aspect-square w-full rounded-xl bg-slate-200 animate-shimmer mb-4" />
                <div className="h-4 w-3/4 rounded bg-slate-200 animate-shimmer mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-100 animate-shimmer mb-4" />
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="h-5 w-20 rounded bg-slate-200 animate-shimmer" />
                  <div className="h-7 w-16 rounded-xl bg-slate-200 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No Matching Products Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any products matching your current filters. Try changing your search query or reset filters.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <button
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0 || isFetching}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition shadow-sm ${
                    page === idx
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={page >= totalPages - 1 || isFetching}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Next</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
