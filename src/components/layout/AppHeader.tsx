import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useDeliveryLocation } from "@/lib/location";
import { useCart } from "@/lib/cart";

export function AppHeader() {
  const { location, setLocation, options } = useDeliveryLocation();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="mx-auto w-full max-w-[1240px] px-4 pt-5 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="neu flex h-16 shrink-0 items-center rounded-2xl px-4 sm:px-6">
          <Logo className="h-7 sm:h-9" />
        </div>

        <div className="relative ml-auto">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="neu neu-hover flex h-14 max-w-[15rem] items-center gap-2 rounded-2xl px-4 text-left sm:max-w-none sm:px-5"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate text-sm font-medium sm:text-[0.95rem]">{location}</span>
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>

          {open && (
            <ul
              role="listbox"
              aria-label="Delivery location"
              className="neu-lg absolute right-0 z-30 mt-2 w-72 rounded-2xl p-2"
            >
              {options.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option === location}
                    onClick={() => {
                      setLocation(option);
                      setOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                      option === location
                        ? "bg-brand font-semibold text-brand-foreground"
                        : "font-medium hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          to="/cart"
          aria-label={`Cart, ${count} items`}
          className="neu neu-hover relative flex h-14 w-14 items-center justify-center rounded-2xl"
        >
          <ShoppingCart className="h-5 w-5 text-brand" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
              {count}
            </span>
          )}
        </Link>

        <Link
          to="/notifications"
          aria-label="Notifications, 3 unread"
          className="neu neu-hover relative flex h-14 w-14 items-center justify-center rounded-2xl"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
            3
          </span>
        </Link>
      </div>
    </header>
  );
}
