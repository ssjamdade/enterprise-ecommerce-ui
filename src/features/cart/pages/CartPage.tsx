import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useAuthStore } from "../../auth/store/authStore";
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from "../hooks/useCart";
import {
  ShoppingBagIcon,
  CloseIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "../../../components/common/Icons";

export default function CartPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: cart, isLoading } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-16 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Your Cart Requires Sign In</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Please sign in with your account to view your saved cart items, proceed to checkout, and track orders.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/login"
                className="rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
              >
                Sign In to Account
              </Link>
              <Link
                to="/products"
                className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const isCartEmpty = items.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Review your selected products, adjust quantities, and proceed to secure checkout.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-pulse">
            <div className="lg:col-span-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-shimmer" />
              ))}
            </div>
            <div className="lg:col-span-4 h-64 rounded-2xl bg-slate-200 animate-shimmer" />
          </div>
        ) : isCartEmpty ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              You haven't added any products to your cart yet. Explore our latest catalog and discover great deals.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              <span>Explore Products</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cart Items List */}
            <div className="space-y-4 lg:col-span-8">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500">
                  {items.length} ITEM{items.length > 1 ? "S" : ""}
                </span>
                <button
                  onClick={() => clearCartMutation.mutate()}
                  disabled={clearCartMutation.isPending}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 transition disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 font-bold text-xs">
                      <ShoppingBagIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateItemMutation.mutate({
                              itemId: item.id,
                              request: { quantity: item.quantity - 1 },
                            });
                          } else {
                            removeItemMutation.mutate(item.id);
                          }
                        }}
                        disabled={updateItemMutation.isPending}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItemMutation.mutate({
                            itemId: item.id,
                            request: { quantity: item.quantity + 1 },
                          })
                        }
                        disabled={updateItemMutation.isPending}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[5rem]">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                        Subtotal
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        ₹{item.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeItemMutation.mutate(item.id)}
                      disabled={removeItemMutation.isPending}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Remove Item"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Order Summary
                </h3>

                <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & GST</span>
                    <span className="text-slate-400">Included</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>

                <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Razorpay Checkout</span>
                  </div>
                  <p>7-Day Easy Returns Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
