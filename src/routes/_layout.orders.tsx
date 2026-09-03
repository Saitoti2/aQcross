import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { demoOrders, getProduct, shopName, type OrderStatus } from "@/lib/data";
import { kes } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/orders")({
  component: OrdersPage,
});

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType; bg: string }
> = {
  preparing: {
    label: "Preparing",
    color: "text-amber-600",
    icon: Package,
    bg: "bg-amber-50",
  },
  dispatched: {
    label: "On the way",
    color: "text-blue-600",
    icon: Truck,
    bg: "bg-blue-50",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    icon: CheckCircle,
    bg: "bg-green-50",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    icon: XCircle,
    bg: "bg-red-50",
  },
};

function OrdersPage() {
  const { add } = useCart();

  function reorder(order: (typeof demoOrders)[number]) {
    order.items.forEach((item) => {
      add(item.productId, item.qty);
    });
    toast.success("Items added to cart");
  }

  const active = demoOrders.filter((o) => o.status === "preparing" || o.status === "dispatched");
  const past = demoOrders.filter((o) => o.status === "delivered" || o.status === "cancelled");

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {demoOrders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="neu flex h-24 w-24 items-center justify-center rounded-full">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold">No orders yet</h2>
          <p className="text-sm text-muted-foreground">Your placed orders will appear here.</p>
          <Link to="/" className="rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white">
            Start Shopping
          </Link>
        </div>
      )}

      {/* Active Orders */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-muted-foreground uppercase tracking-wider text-xs">
            Active Orders
          </h2>
          <div className="space-y-4">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={reorder} />
            ))}
          </div>
        </section>
      )}

      {/* Past Orders */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Past Orders
          </h2>
          <div className="space-y-4">
            {past.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={reorder} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onReorder,
}: {
  order: (typeof demoOrders)[number];
  onReorder: (order: (typeof demoOrders)[number]) => void;
}) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.icon;

  // Resolve products
  const resolvedItems = order.items
    .map((i) => ({ product: getProduct(i.productId), qty: i.qty }))
    .filter((i): i is { product: NonNullable<ReturnType<typeof getProduct>>; qty: number } =>
      Boolean(i.product),
    );

  const itemTotal = resolvedItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shops = [...new Set(resolvedItems.map((i) => i.product.shop))];

  return (
    <div className="neu rounded-3xl p-5">
      {/* Order header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">Order #{order.id}</p>
          <p className="text-xs text-muted-foreground">{order.placedAt}</p>
          {shops.map((s) => (
            <p key={s} className="truncate text-xs text-muted-foreground">
              {shopName(s)}
            </p>
          ))}
        </div>
        <span
          className={`flex items-center gap-1 rounded-2xl px-3 py-1 text-xs font-semibold ${cfg.color} ${cfg.bg}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <ul className="mt-4 space-y-2 border-t border-border pt-4">
        {resolvedItems.map(({ product, qty }) => (
          <li key={product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {product.name} × {qty}
            </span>
            <span className="font-semibold">{kes(product.price * qty)}</span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span>
          <span>{kes(order.deliveryFee)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-brand">
            <span>Savings</span>
            <span>−{kes(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{kes(itemTotal + order.deliveryFee - order.discount)}</span>
        </div>
      </div>

      {/* Courier / address */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {order.courier}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(order.status === "delivered" || order.status === "cancelled") && (
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2 text-xs font-semibold text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Reorder
          </button>
        )}
        {order.status === "dispatched" && (
          <Link
            to="/orders"
            className="flex items-center gap-1.5 rounded-2xl neu-sm px-4 py-2 text-xs font-semibold text-brand"
          >
            <Truck className="h-3.5 w-3.5" aria-hidden="true" />
            Track Delivery
          </Link>
        )}
        <Link
          to="/orders"
          className="flex items-center gap-1.5 rounded-2xl neu-sm px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-brand"
        >
          View Details
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
