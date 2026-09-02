import { Link } from "@tanstack/react-router";
import { Clock, Minus, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { kes } from "@/lib/format";
import { shopName, categories, type Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(product.id);

  return (
    <article className="neu neu-hover flex flex-col rounded-3xl p-4">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="block rounded-2xl"
      >
        <div className="neu-pressed flex aspect-square items-center justify-center rounded-2xl p-4">
          <ProductThumb product={product} />
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="text-sm font-semibold leading-snug hover:text-brand"
          >
            {product.name}
          </Link>
          {product.studentDeal && (
            <span className="shrink-0 rounded-lg bg-brand px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand-foreground">
              Student
            </span>
          )}
        </div>

        <p className="mt-1 text-xs font-medium text-muted-foreground">{product.size}</p>

        <Link
          to="/shop/$shopSlug"
          params={{ shopSlug: product.shop }}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          {shopName(product.shop)}
        </Link>

        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {product.inStock ? "Delivery 15–45 mins" : "Out of stock"}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-bold">{kes(product.price)}</p>
            {product.wasPrice && (
              <p className="text-xs font-medium text-muted-foreground line-through">
                {kes(product.wasPrice)}
              </p>
            )}
          </div>

          {qty === 0 ? (
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => {
                add(product.id);
                toast.success(`${product.name} added to cart`);
              }}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground transition-transform active:scale-95 disabled:opacity-40"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <div className="neu-pressed flex h-11 items-center gap-1 rounded-2xl px-1.5">
              <button
                type="button"
                onClick={() => setQty(product.id, qty - 1)}
                aria-label={`Reduce ${product.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-brand"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-5 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(product.id, qty + 1)}
                aria-label={`Increase ${product.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-brand"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductThumb({ product, size = 640 }: { product: Product; size?: number }) {
  const category = categories.find((c) => c.slug === product.category);
  if (category?.image) {
    return (
      <img
        src={category.image}
        alt={product.name}
        loading="lazy"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    );
  }
  const Icon = category?.icon;
  return Icon ? <Icon className="h-14 w-14 text-brand" aria-hidden="true" /> : null;
}
