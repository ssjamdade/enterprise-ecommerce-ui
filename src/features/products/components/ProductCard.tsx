import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { StarIcon, ChevronRightIcon } from "../../../components/common/Icons";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use first image if available, else clean high-quality e-commerce fallback
  const thumbnail =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  const inStock = product.quantity > 0;

  // Fake rating based on product id for e-commerce realism
  const rating = (4.2 + ((product.id * 3) % 8) / 10).toFixed(1);
  const reviewCount = 18 + ((product.id * 17) % 85);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback if Cloudinary image fails to load
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Floating Category Pill */}
        {product.categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-md shadow-sm border border-white/50">
            {product.categoryName}
          </span>
        )}

        {/* Stock Status Pill */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-sm border ${
            inStock
              ? "bg-emerald-50/95 text-emerald-700 border-emerald-200/60"
              : "bg-rose-50/95 text-rose-700 border-rose-200/60"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              inStock ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          {inStock ? "In Stock" : "Sold Out"}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Rating and Reviews */}
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-800">{rating}</span>
          <span className="text-[11px] text-slate-400">({reviewCount})</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1">
          {product.description || "Premium quality product with guaranteed authentic materials."}
        </p>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all group-hover:bg-indigo-600 group-hover:shadow-indigo-500/25">
            <span>View</span>
            <ChevronRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
