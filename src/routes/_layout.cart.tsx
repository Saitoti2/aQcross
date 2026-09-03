import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { kes } from "@/lib/format";
import { shopName } from "@/lib/data";

export const Route = createFileRoute("/_layout/cart")({
  component: CartPage,
});

function CartPage() {
  const { byShop, count, subtotal, discount, deliveryFee, total, setQty, remove, clear } =
    useCart();

  if (count === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center gap-4 px-4 text-center sm:px-6">
        <div className="neu flex h-24 w-24 items-center justify-center rounded-full">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">
          Add items from the shop and they'll appear here.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Your Cart
          <span className="ml-2 text-base font-medium text-muted-foreground">({count} items)</span>
        </h1>
        <button
          type="button"
          onClick={() => {
            clear();
            toast.info("Cart cleared");
          }}
          className="text-sm font-semibold text-muted-foreground hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Cart items grouped by shop */}
        <div className="flex-1 space-y-5">
          {byShop.map(({ shop, lines }) => (
            <div key={shop} className="neu rounded-3xl p-5">
              {/* Shop header */}
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10">
                  <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                </div>
                <Link
                  to="/shop/$shopSlug"
                  params={{ shopSlug: shop }}
                  className="font-semibold hover:text-brand"
                >
                  {shopName(shop)}
                </Link>
              </div>

              {/* Line items */}
              <ul className="space-y-4">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-start gap-4">
                    <Link
                      to="/product/$productId"
                      params={{ productId: product.id }}
                      className="neu-pressed flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl p-2"
                    >
                      <ShoppingCart className="h-7 w-7 text-brand" aria-hidden="true" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/product/$productId"
                        params={{ productId: product.id }}
                        className="block truncate text-sm font-semibold hover:text-brand"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.size}</p>
                      <p className="mt-1 text-sm font-bold">{kes(product.price)}</p>
                      {product.wasPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          {kes(product.wasPrice)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* Quantity stepper */}
                      <div className="neu-pressed flex items-center gap-1 rounded-2xl px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={`Reduce ${product.name} quantity`}
                          className="flex h-7 w-7 items-center justify-center rounded-xl text-brand"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Increase ${product.name} quantity`}
                          className="flex h-7 w-7 items-center justify-center rounded-xl text-brand"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      {/* Line total */}
                      <p className="text-sm font-bold">{kes(product.price * qty)}</p>
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          remove(product.id);
                          toast.info(`${product.name} removed`);
                        }}
                        aria-label={`Remove ${product.name}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 lg:shrink-0">
          <div className="neu sticky top-24 rounded-3xl p-5">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{kes(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Savings</span>
                  <span className="font-semibold text-brand">−{kes(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">{kes(deliveryFee)}</span>
              </div>
              {byShop.length > 1 && (
                <p className="text-xs text-muted-foreground">Multi-shop delivery fee applied.</p>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold">{kes(total)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Proceed to Checkout
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/" className="mt-3 block text-center text-sm font-semibold text-brand">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
