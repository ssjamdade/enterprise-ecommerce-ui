import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import type { Category, CreateCategoryInput } from "../types/category";
import {
  ShieldCheckIcon,
  SparklesIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  AlertCircleIcon,
} from "../../../components/common/Icons";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Notification banners
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalForm, setModalForm] = useState<CreateCategoryInput>({
    name: "",
    description: "",
    active: true,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setErrorBanner(null);
      const data = await getCategories();
      setCategories(data || []);
    } catch (err: any) {
      setErrorBanner("Failed to load product categories.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalForm({ name: "", description: "", active: true });
    setModalError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setModalForm({
      name: cat.name,
      description: cat.description || "",
      active: cat.active,
    });
    setModalError(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      setModalError("Category name is required.");
      return;
    }

    try {
      setModalSubmitting(true);
      setModalError(null);

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, {
          name: modalForm.name.trim(),
          description: modalForm.description?.trim() || "",
          active: modalForm.active ?? true,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        setSuccessBanner(`Category "${updated.name}" updated successfully.`);
      } else {
        const created = await createCategory({
          name: modalForm.name.trim(),
          description: modalForm.description?.trim() || "",
          active: modalForm.active ?? true,
        });
        setCategories((prev) => [...prev, created]);
        setSuccessBanner(`Category "${created.name}" created successfully.`);
      }

      setModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save category.";
      setModalError(msg);
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccessBanner(`Category "${name}" deleted successfully.`);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete category.";
      setErrorBanner(msg);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description &&
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") return cat.active;
    if (statusFilter === "INACTIVE") return !cat.active;
    return true;
  });

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Navigation Tabs between Admin features */}
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            to="/admin/kyc"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition"
          >
            <ShieldCheckIcon className="w-4 h-4 text-slate-500" />
            <span>Seller KYC Approvals</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/30"
          >
            <SparklesIcon className="w-4 h-4 text-indigo-200" />
            <span>Product Categories</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white mb-2">
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Catalog Taxonomy</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Product Categories
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, configure, and manage e-commerce categories and product classification structure.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition cursor-pointer self-start md:self-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Sticky Global Notifications */}
        {(successBanner || errorBanner) && (
          <div className="mb-6 space-y-2">
            {successBanner && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>{successBanner}</span>
                </div>
                <button
                  onClick={() => setSuccessBanner(null)}
                  className="text-emerald-600 hover:text-emerald-900 p-1 cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            {errorBanner && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-rose-600" />
                  <span>{errorBanner}</span>
                </div>
                <button
                  onClick={() => setErrorBanner(null)}
                  className="text-rose-600 hover:text-rose-900 p-1 cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Categories
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900">{totalCount}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Active & Listed
            </span>
            <div className="mt-2 text-2xl font-black text-emerald-700">{activeCount}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Inactive / Hidden
            </span>
            <div className="mt-2 text-2xl font-black text-slate-600">{inactiveCount}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search category by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === filter
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center">
              <SparklesIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No categories found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? "Try refining your search keyword or clearing the filter."
                  : "Start creating your first product category using the button above."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{cat.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-md truncate">
                        {cat.description || <span className="italic text-slate-400">No description provided</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        {cat.active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-400/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            title="Edit Category"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            title="Delete Category"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Electronics, Footwear"
                  value={modalForm.name}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the product group..."
                  value={modalForm.description}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={modalForm.active ?? true}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="categoryActive"
                  className="text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Active (Visible in Store and to Sellers)
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {modalSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCategory ? "Update Category" : "Create Category"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
