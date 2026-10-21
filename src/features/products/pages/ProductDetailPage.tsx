import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useProduct } from "../hooks/useProduct";
import { useAddToCart } from "../../cart/hooks/useCart";
import { useAuthStore } from "../../auth/store/authStore";
import {
  ShoppingBagIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon,
  CheckIcon,
  ChevronLeftIcon,
} from "../../../components/common/Icons";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: product, isLoading, isError, error } = useProduct(productId);
  const addToCartMutation = useAddToCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;

    try {
      setErrorMessage(null);
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity,
      });
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3500);
    } catch {
      setErrorMessage("Failed to add product to cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="aspect-square w-full rounded-3xl bg-slate-200 animate-shimmer" />
            <div className="space-y-6">
              <div className="h-4 w-1/4 rounded bg-slate-200 animate-shimmer" />
              <div className="h-10 w-3/4 rounded bg-slate-200 animate-shimmer" />
              <div className="h-6 w-1/3 rounded bg-slate-200 animate-shimmer" />
              <div className="h-32 w-full rounded-2xl bg-slate-200 animate-shimmer" />
              <div className="h-14 w-full rounded-2xl bg-slate-200 animate-shimmer" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-2xl font-bold">
              ✕
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Product Not Found</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {error?.message || "The product you're looking for might have been removed or is temporarily unavailable."}
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        ];

  const activeImage = images[selectedImageIndex] || images[0];
  const inStock = product.quantity > 0;
  const maxAvailable = product.quantity;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-slate-900 transition">
            Products
          </Link>
          <span>/</span>
          {product.categoryName && (
            <>
              <span className="text-slate-400">{product.categoryName}</span>
              <span>/</span>
            </>
          )}
          <span className="font-semibold text-slate-900 truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Featured Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
                }}
              />

              {/* Floating Category Pill */}
              {product.categoryName && (
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 backdrop-blur-md shadow-sm border border-white/50">
                  {product.categoryName}
                </span>
              )}

              {/* Stock status pill */}
              <span
                className={`absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md shadow-sm border ${
                  inStock
                    ? "bg-emerald-50/95 text-emerald-700 border-emerald-200"
                    : "bg-rose-50/95 text-rose-700 border-rose-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    inStock ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {inStock ? `In Stock (${maxAvailable} units)` : "Out of Stock"}
              </span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-indigo-600 ring-4 ring-indigo-500/20 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-indigo-600">
                  {product.categoryName || "Category"}
                </span>
                {product.sku && (
                  <span className="text-slate-400">
                    SKU: <strong className="font-mono text-slate-700">{product.sku}</strong>
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {product.name}
              </h1>

              {/* Rating Preview */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">4.9 / 5.0</span>
                <span className="text-xs text-slate-400">• 128 Verified Reviews</span>
              </div>

              {/* Price Banner */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Price
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Free Express Shipping
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Inclusive of all local taxes & GST.
                </p>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product Details & Overview
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {product.description ||
                    "Engineered with premium quality materials, rigorous quality control, and designed to meet high standards for durability, functionality, and performance."}
                </p>
              </div>
            </div>

            {/* Purchase Control Card */}
            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              {inStock ? (
                <div className="space-y-4">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Quantity
                    </span>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                        disabled={quantity >= maxAvailable}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add To Cart CTA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>
                        {addToCartMutation.isPending
                          ? "Adding..."
                          : `Add to Cart (${quantity})`}
                      </span>
                    </button>

                    <Link
                      to="/cart"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                    >
                      <span>View Cart</span>
                    </Link>
                  </div>

                  {/* Cart feedback toast */}
                  {addedNotice && (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                        <span>
                          Added {quantity} unit(s) of <strong>{product.name}</strong> to your cart!
                        </span>
                      </div>
                      <Link to="/cart" className="underline font-bold text-emerald-900">
                        View Cart →
                      </Link>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-800 border border-rose-200">
                      {errorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  disabled
                  className="w-full rounded-2xl bg-slate-200 py-3.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-600">
                  <ShieldCheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>Razorpay Verified</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-600">
                  <TruckIcon className="w-4 h-4 text-indigo-600" />
                  <span>Express Transit</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-600">
                  <RefreshCwIcon className="w-4 h-4 text-indigo-600" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
