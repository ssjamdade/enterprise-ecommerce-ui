import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useOrder } from "../hooks/useOrders";
import {
  CheckIcon,
  TruckIcon,
  ArrowRightIcon,
} from "../../../components/common/Icons";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;

  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 animate-pulse">
          <div className="h-64 rounded-3xl bg-slate-200 animate-shimmer" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-6 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
            <p className="mt-2 text-xs text-slate-500">
              We couldn't retrieve details for this order.
            </p>
            <Link
              to="/orders"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white"
            >
              View Order History
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm text-center">
          {/* Success Checkmark Circle */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckIcon className="w-8 h-8 text-emerald-600" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Order Status: {order.status}
          </span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Your order <strong>#{order.id}</strong> has been received and registered in our database.
          </p>

          {/* Delivery & Payment Info Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Shipping Destination
              </span>
              <p className="mt-1 text-xs font-bold text-slate-800">{order.shippingFullName}</p>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                {order.shippingAddressLine}, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
              </p>
              <p className="mt-1 text-xs text-slate-400">Phone: {order.shippingPhone}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Payment Status
              </span>
              <p className="mt-1 text-xs font-bold text-slate-800">
                Status:{" "}
                <span className="text-emerald-600 uppercase font-black">
                  {order.paymentStatus}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Total Paid: <strong>₹{order.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                <TruckIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Estimated dispatch in 24 hours</span>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="mt-8 border-t border-slate-100 pt-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Items in this Order ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-500 text-[10px]">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-slate-800">{item.productName}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{item.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/orders"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              <span>View All Orders</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
