import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { getMyProducts, createProduct, uploadProductImages } from "../../products/api/productApi";
import { getCategories } from "../../categories/api/categoryApi";
import { checkSellerStatus, getMyKyc } from "../api/sellerKycApi";
import type { Product, CreateProductInput } from "../../products/types/product";
import type { Category } from "../../categories/types/category";
import type { SellerKyc } from "../types/sellerKyc";
import {
  ShoppingBagIcon,
  ShieldCheckIcon,
  UploadIcon,
  CloseIcon,
  ArrowRightIcon,
  AlertCircleIcon,
} from "../../../components/common/Icons";

export default function SellerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [kycData, setKycData] = useState<SellerKyc | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add Product Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productForm, setProductForm] = useState<CreateProductInput>({
    name: "",
    description: "",
    sku: "",
    price: 0,
    quantity: 1,
    categoryId: 0,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    initSellerDashboard();
  }, []);

  const initSellerDashboard = async () => {
    try {
      setLoading(true);
      const [approvedStatus, kyc, catList] = await Promise.all([
        checkSellerStatus().catch(() => false),
        getMyKyc().catch(() => null),
        getCategories().catch(() => []),
      ]);

      setIsApproved(approvedStatus);
      setKycData(kyc);
      setCategories(catList);

      if (catList.length > 0) {
        setProductForm((prev) => ({ ...prev, categoryId: catList[0].id }));
      }

      if (approvedStatus) {
        const prodRes = await getMyProducts(0, 50);
        setProducts(prodRes.content || []);
      }
    } catch (err: any) {
      console.error("Error loading seller portal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!productForm.name.trim() || !productForm.sku.trim()) {
      setModalError("Product name and SKU are required.");
      return;
    }
    if (productForm.price <= 0) {
      setModalError("Price must be greater than zero.");
      return;
    }
    if (!productForm.categoryId) {
      setModalError("Please select a category.");
      return;
    }

    try {
      setSubmittingProduct(true);
      const newProduct = await createProduct({
        ...productForm,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity),
      });

      // Upload images if any selected
      if (selectedImages.length > 0) {
        await uploadProductImages(newProduct.id, selectedImages);
      }

      setActionSuccess(`Product "${newProduct.name}" listed successfully!`);
      setModalOpen(false);
      setSelectedImages([]);
      setProductForm({
        name: "",
        description: "",
        sku: "",
        price: 0,
        quantity: 1,
        categoryId: categories[0]?.id || 0,
      });

      // Reload products
      const prodRes = await getMyProducts(0, 50);
      setProducts(prodRes.content || []);
    } catch (err: any) {
      setModalError(
        err.response?.data?.message || "Failed to create product. Check if SKU is unique."
      );
    } finally {
      setSubmittingProduct(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading Seller Portal...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // If user is not yet an approved seller
  if (!isApproved) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 mb-6">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Seller Account Verification Required
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            In accordance with our marketplace policy, all sellers must complete the 4-step Amazon-style KYC verification before they are authorized to list products.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </h2>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-800">
                {kycData ? kycData.overallStatus.replace("_", " ") : "NOT STARTED"}
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Action Required
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {kycData?.overallStatus === "PENDING_REVIEW"
                ? "Your KYC documents are currently in review by the compliance team."
                : kycData?.overallStatus === "ACTION_REQUIRED"
                ? "Some verification steps were rejected. Please review feedback and resubmit."
                : "You haven't submitted your seller onboarding documents yet."}
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/seller/kyc"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              <span>Go to Seller KYC Dashboard</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Approved Seller View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20 mb-2">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Seller Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Seller Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Store: <span className="font-semibold text-slate-800">{kycData?.storeName || "My Store"}</span> ({kycData?.companyName})
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition self-start sm:self-auto"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            <span>+ List New Product</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-sm">
            <span>{actionSuccess}</span>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Products Grid / Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Listed Products ({products.length})
            </h2>
            <Link
              to="/products"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View Public Marketplace →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ShoppingBagIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No products listed yet.</p>
              <p className="mt-1 text-xs text-slate-400">Click "+ List New Product" to add your first item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Inventory</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {p.images && p.images[0] ? (
                              <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full flex items-center justify-center text-[10px] text-slate-400">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{p.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{p.categoryName || "Uncategorized"}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${p.quantity > 5 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {p.quantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${p.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/products/${p.id}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">List New Product</h3>
                  <p className="text-xs text-slate-400">Add inventory to your verified store</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SKU (Unique Item Code) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WH-1000XM5-BLK"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm uppercase font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="1"
                      placeholder="2999"
                      value={productForm.price || ""}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Initial Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="50"
                      value={productForm.quantity || ""}
                      onChange={(e) => setProductForm({ ...productForm, quantity: parseInt(e.target.value, 10) || 1 })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe product features, specifications, and warranty..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Upload Product Photos</label>
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                    <UploadIcon className="w-4 h-4 text-slate-500" />
                    <span>Choose Images ({selectedImages.length} selected)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedImages(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {submittingProduct ? "Listing..." : "Confirm & List Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
