import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Phone,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { kes } from "@/lib/format";
import { shopName } from "@/lib/data";
import { useDeliveryLocation } from "@/lib/location";

export const Route = createFileRoute("/_layout/checkout")({
  component: CheckoutPage,
});

const paymentMethods = [
  { id: "mpesa", label: "M-Pesa", description: "Pay via Safaricom M-Pesa" },
  { id: "card", label: "Card", description: "Visa / Mastercard" },
  { id: "cash", label: "Cash on Delivery", description: "Pay when your order arrives" },
];

function CheckoutPage() {
  const { byShop, subtotal, discount, deliveryFee, total, count, clear } = useCart();
  const { location } = useDeliveryLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState(location);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("mpesa");
  const [submitted, setSubmitted] = useState(false);

  if (count === 0 && !submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center gap-4 px-4 text-center sm:px-6">
        <h1 className="text-xl font-bold">Nothing to checkout</h1>
        <Link to="/" className="rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center gap-5 px-4 py-12 text-center sm:px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand/10">
          <CheckCircle className="h-12 w-12 text-brand" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your order has been received and is being prepared. Track it in Orders.
          </p>
        </div>
        <div className="neu w-full rounded-3xl p-5 text-left">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
            Delivering to: <span className="font-semibold text-foreground">{address}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
            Estimated delivery: 15–45 minutes
          </div>
        </div>
        <Link
          to="/orders"
          className="w-full rounded-2xl bg-brand py-3.5 text-center text-sm font-semibold text-white"
        >
          Track Order
        </Link>
        <Link to="/" className="text-sm font-semibold text-brand">
          Continue Shopping
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    clear();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: Delivery + Payment */}
          <div className="flex-1 space-y-5">
            {/* Delivery Info */}
            <div className="neu rounded-3xl p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
                <MapPin className="h-5 w-5 text-brand" aria-hidden="true" />
                Delivery Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">
                    Delivery Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="neu-pressed w-full rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                    placeholder="e.g. KCA University, Hostel Block C"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-brand" aria-hidden="true" />
                      Phone Number
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="neu-pressed w-full rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                    placeholder="e.g. 0712 345 678"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">
                    Delivery Notes{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="neu-pressed w-full resize-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Room number, gate, landmark..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="neu rounded-3xl p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
                <CreditCard className="h-5 w-5 text-brand" aria-hidden="true" />
                Payment Method
              </h2>
              <div className="space-y-2">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                      payment === m.id ? "bg-brand/5 ring-2 ring-brand" : "neu-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                      className="accent-brand"
                    />
                    <div>
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order items by shop */}
            <div className="neu rounded-3xl p-5">
              <h2 className="mb-4 text-base font-bold">Order Items</h2>
              <div className="space-y-4">
                {byShop.map(({ shop, lines }) => (
                  <div key={shop}>
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                      <span className="text-sm font-semibold">{shopName(shop)}</span>
                    </div>
                    <ul className="space-y-1.5 pl-6">
                      {lines.map(({ product, qty }) => (
                        <li key={product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {product.name} × {qty}
                          </span>
                          <span className="font-semibold">{kes(product.price * qty)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary + CTA */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="neu sticky top-24 rounded-3xl p-5">
              <h2 className="mb-4 text-lg font-bold">Summary</h2>
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
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold">{kes(total)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Place Order
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                Secure checkout — Verified shops only
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
