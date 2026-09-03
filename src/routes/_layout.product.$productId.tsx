import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ShieldCheck,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  AlertTriangle,
  Tag,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { getProduct, getCategory, getShop, products } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { kes } from "@/lib/format";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/_layout/product/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const { add, setQty, qtyOf } = useCart();

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold text-muted-foreground">Product not found</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
          Back to Home
        </Link>
      </div>
    );
  }

  const cat = getCategory(product.category);
  const shop = getShop(product.shop);
  const qty = qtyOf(product.id);
  const Icon = cat?.icon;

  // Related products: same category, excluding current
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full">
      {/* Back */}
      <div className="py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Image */}
        <div className="neu-pressed flex aspect-square w-full items-center justify-center rounded-3xl p-8 lg:max-w-sm">
          {cat?.image ? (
            <img src={cat.image} alt={product.name} className="h-full w-full object-contain" />
          ) : Icon ? (
            <Icon className="h-24 w-24 text-brand" aria-hidden="true" />
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1">
          {product.studentDeal && (
            <span className="inline-block rounded-xl bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Student Deal
            </span>
          )}
          {product.prescriptionRequired && (
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Prescription required — verified by pharmacist before dispatch
            </div>
          )}

          <h1 className="mt-3 text-2xl font-bold leading-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.size}</p>

          {/* Shop link */}
          {shop && (
            <Link
              to="/shop/$shopSlug"
              params={{ shopSlug: shop.slug }}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl neu px-3 py-2 text-sm font-semibold hover:text-brand"
            >
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              {shop.name}
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{shop.branch}</span>
              <span className="ml-1 flex items-center gap-0.5 text-xs">
                <Star className="h-3 w-3 fill-brand text-brand" aria-hidden="true" />
                {shop.rating}
              </span>
            </Link>
          )}

          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {product.inStock
              ? `Delivery ${shop?.delivery ?? "15–45 mins"}`
              : "Currently out of stock"}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{kes(product.price)}</span>
            {product.wasPrice && (
              <>
                <span className="text-lg font-medium text-muted-foreground line-through">
                  {kes(product.wasPrice)}
                </span>
                <span className="rounded-xl bg-brand/10 px-2 py-0.5 text-sm font-semibold text-brand">
                  Save {kes(product.wasPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Add to cart */}
          <div className="mt-6">
            {!product.inStock ? (
              <div className="rounded-2xl bg-muted px-5 py-3 text-center text-sm font-semibold text-muted-foreground">
                Out of Stock
              </div>
            ) : qty === 0 ? (
              <button
                type="button"
                onClick={() => {
                  add(product.id);
                  toast.success(`${product.name} added to cart`);
                }}
                className="flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="neu-pressed flex items-center gap-2 rounded-2xl px-2 py-2">
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-brand"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-8 text-center text-base font-bold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-brand"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  View Cart
                </Link>
              </div>
            )}
          </div>

          {/* Category tag */}
          {cat && (
            <div className="mt-4 flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-brand" aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold">More in {cat?.name}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
