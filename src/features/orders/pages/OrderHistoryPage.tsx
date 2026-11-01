import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useAuthStore } from "../../auth/store/authStore";
import { useMyOrders } from "../hooks/useOrders";
import {
  ShoppingBagIcon,
  TruckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "../../../components/common/Icons";

export default function OrderHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const { data: orders = [], isLoading } = useMyOrders();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-6 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Sign in to view orders</h2>
            <p className="mt-2 text-xs text-slate-500">
              Please sign in to your account to review your past purchases and track deliveries.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Order History
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track, review, and manage your recent enterprise store purchases.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-3xl bg-slate-200 animate-shimmer" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No orders yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Discover our latest items and get started.
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
          <div className="space-y-6">
            {orders.map((order) => {
              const isPaid = order.paymentStatus === "PAID";
              const isDelivered = order.status === "DELIVERED";

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:border-slate-300"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Order Number
                        </span>
                        <span className="font-extrabold text-slate-900">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Total Amount
                        </span>
                        <span className="font-extrabold text-slate-900">
                          ₹{order.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Ship To
                        </span>
                        <span className="font-bold text-slate-700">{order.shippingFullName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Pills */}
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          isDelivered
                            ? "bg-indigo-50 text-indigo-700"
                            : order.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4 divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-500 text-[10px]">
                            {item.quantity}x
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{item.productName}</p>
                            <p className="text-[11px] text-slate-400">
                              ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })} each
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-slate-900">
                          ₹{item.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <TruckIcon className="w-4 h-4 text-indigo-600" />
                      <span>Delivery Address: {order.shippingCity}, {order.shippingState}</span>
                    </div>

                    <Link
                      to={`/orders/${order.id}/confirmation`}
                      className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <span>View Receipt</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
