import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { useAuthStore } from "../../auth/store/authStore";
import { useCart } from "../../cart/hooks/useCart";
import { useAddresses, useCreateAddress } from "../../addresses/hooks/useAddresses";
import { useCreateOrder } from "../../orders/hooks/useOrders";
import { createPayment, verifyPayment } from "../../payment/api/paymentApi";
import type { CreateAddressRequest, AddressType } from "../../addresses/types/address";
import {
  ShieldCheckIcon,
  TruckIcon,
  CheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "../../../components/common/Icons";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Address Form State
  const [addressForm, setAddressForm] = useState<CreateAddressRequest>({
    fullName: user ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
    phone: user?.phone || "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "HOME",
    isDefault: true,
  });

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  // Set default selected address
  const activeAddressId =
    selectedAddressId ??
    addresses.find((a) => a.defaultAddress)?.id ??
    addresses[0]?.id ??
    null;

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const newAddress = await createAddressMutation.mutateAsync(addressForm);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
    } catch {
      setErrorMessage("Failed to save delivery address. Please check your inputs.");
    }
  };

  const handlePlaceOrderWithRazorpay = async () => {
    if (!activeAddressId) {
      setErrorMessage("Please select or add a delivery address.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Step 1: Create Order in Spring Boot
      const order = await createOrderMutation.mutateAsync({
        addressId: activeAddressId,
      });

      // Step 2: Initialize Razorpay Payment Order
      const paymentOrder = await createPayment(order.id);

      // Step 3: Load Razorpay script if not already present
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      // Step 4: Open Razorpay Modal
      const options = {
        key: paymentOrder.razorpayKeyId,
        amount: Math.round(paymentOrder.amount * 100),
        currency: paymentOrder.currency || "INR",
        name: "EnterpriseStore",
        description: `Order #${order.id} Payment`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: `${user?.firstName} ${user?.lastName || ""}`,
          email: user?.email,
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async (response: any) => {
          try {
            // Step 5: Verify signature on backend
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            navigate(`/orders/${order.id}/confirmation`);
          } catch {
            setErrorMessage("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Unable to initialize payment. You can also use the Developer Test Confirmation below."
      );
      setIsProcessing(false);
    }
  };

  const handleDevTestCheckout = async () => {
    if (!activeAddressId) {
      setErrorMessage("Please select or add a delivery address.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // 1. Create order
      const order = await createOrderMutation.mutateAsync({
        addressId: activeAddressId,
      });

      // 2. Redirect straight to order confirmation
      navigate(`/orders/${order.id}/confirmation`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to create order.");
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-6 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Sign in to Checkout</h2>
            <p className="mt-2 text-xs text-slate-500">
              Please sign in with your account to access your delivery addresses and complete checkout.
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

  if (cartItems.length === 0 && !isCartLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-6 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <ShoppingBagIcon className="mx-auto w-10 h-10 text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="mt-2 text-xs text-slate-500">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition"
            >
              Explore Products
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Secure Checkout
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Select shipping address, review order items, and authorize Razorpay payment.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Delivery Address Selection */}
          <div className="space-y-6 lg:col-span-7">
            {/* Address Selection Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Shipping Address
                  </h3>
                </div>

                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {/* Existing Addresses List */}
              {!showNewAddressForm && (
                <div className="space-y-3">
                  {isAddressesLoading ? (
                    <div className="h-24 rounded-2xl bg-slate-100 animate-shimmer" />
                  ) : addresses.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No saved addresses found. Please add a delivery address below.
                      <button
                        onClick={() => setShowNewAddressForm(true)}
                        className="mt-3 block mx-auto rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer items-start justify-between rounded-2xl border p-4 transition ${
                          activeAddressId === address.id
                            ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/10"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={activeAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="mt-1 h-4 w-4 text-indigo-600"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {address.fullName}
                              </span>
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                {address.addressType}
                              </span>
                              {address.defaultAddress && (
                                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">Phone: {address.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}

              {/* Add New Address Form Modal/Panel */}
              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Full Name *
                      </label>
                      <input
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Phone (10 digits) *
                      </label>
                      <input
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Street Address / House No. *
                    </label>
                    <input
                      required
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        City *
                      </label>
                      <input
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        State *
                      </label>
                      <input
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Pincode *
                      </label>
                      <input
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Address Type:
                    </span>
                    {(["HOME", "WORK", "OTHER"] as AddressType[]).map((type) => (
                      <label key={type} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="newAddressType"
                          checked={addressForm.addressType === type}
                          onChange={() => setAddressForm({ ...addressForm, addressType: type })}
                          className="h-3.5 w-3.5 text-indigo-600"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createAddressMutation.isPending}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition"
                    >
                      {createAddressMutation.isPending ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method Banner */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
                  2
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Payment Gateway
                </h3>
              </div>

              <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm">
                    RZP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Razorpay Online Gateway</h4>
                    <p className="text-xs text-slate-500">UPI, Cards, NetBanking, Wallets</p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                  Secure 256-bit
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & CTAs */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Order Items ({cartItems.length})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.productName}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{item.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Main Pay with Razorpay Button */}
              <button
                onClick={handlePlaceOrderWithRazorpay}
                disabled={isProcessing || !activeAddressId}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Pay with Razorpay (₹{totalAmount.toLocaleString("en-IN")})</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Developer Fast-Forward Simulation Button */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 mb-2">
                  Testing in local dev without live Razorpay popup?
                </p>
                <button
                  type="button"
                  onClick={handleDevTestCheckout}
                  disabled={isProcessing || !activeAddressId}
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  ⚡ Direct Order Place & Confirm (Dev Mode)
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                <span>Encrypted checkout powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
