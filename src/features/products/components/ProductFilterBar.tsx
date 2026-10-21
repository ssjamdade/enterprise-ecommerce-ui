import { useCategories } from "../../categories/hooks/useCategories";
import type { ProductFilterParams } from "../types/product";
import { SearchIcon, CloseIcon, FilterIcon } from "../../../components/common/Icons";

interface ProductFilterBarProps {
  filter: ProductFilterParams;
  onFilterChange: (newFilter: ProductFilterParams) => void;
  sort: string;
  onSortChange: (newSort: string) => void;
  onReset: () => void;
}

export default function ProductFilterBar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onReset,
}: ProductFilterBarProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const hasActiveFilters =
    Boolean(filter.keyword) ||
    filter.categoryId !== undefined ||
    filter.minPrice !== undefined ||
    filter.maxPrice !== undefined ||
    sort !== "id,desc";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by product name, SKU, or description..."
            value={filter.keyword || ""}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                keyword: e.target.value || undefined,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder-slate-400 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
          {filter.keyword && (
            <button
              onClick={() => onFilterChange({ ...filter, keyword: undefined })}
              className="absolute right-3 top-3 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
              title="Clear search"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="id,desc">✨ Newest Arrivals</option>
            <option value="price,asc">📉 Price: Low to High</option>
            <option value="price,desc">📈 Price: High to Low</option>
            <option value="name,asc">🔤 Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Categories Pill Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
          <FilterIcon className="w-3.5 h-3.5" />
          <span>Categories:</span>
        </span>

        <button
          onClick={() => onFilterChange({ ...filter, categoryId: undefined })}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition duration-150 ${
            filter.categoryId === undefined
              ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          All Items
        </button>

        {categoriesLoading ? (
          <span className="text-xs text-slate-400 animate-pulse">Loading categories...</span>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  categoryId: filter.categoryId === category.id ? undefined : category.id,
                })
              }
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition duration-150 ${
                filter.categoryId === category.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      {/* Price Range & Quick Filter Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Price Filter (₹):
          </span>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="Min"
                value={filter.minPrice !== undefined ? filter.minPrice : ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 rounded-lg border border-slate-200 py-1.5 pl-6 pr-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
            <span className="text-slate-300 font-bold">—</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max"
                value={filter.maxPrice !== undefined ? filter.maxPrice : ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 rounded-lg border border-slate-200 py-1.5 pl-6 pr-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition shadow-sm"
          >
            <CloseIcon className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
