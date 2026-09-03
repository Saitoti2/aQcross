import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, MapPin, Moon, ShoppingCart, Sun } from "lucide-react";
import { useState } from "react";
import { useDeliveryLocation } from "@/lib/location";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/hooks/use-theme";
import { Logo } from "@/components/brand/Logo";

export function AppHeader() {
  const { location, setLocation, options } = useDeliveryLocation();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { toggle } = useTheme();

  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ── Logo ─────────────────────────────────────────────── */}
          {/* Large, visually prominent pill — the brand anchor */}
          <div className="neu neu-hover flex shrink-0 items-center rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5">
            <Logo className="h-9 sm:h-12 md:h-14" />
          </div>

          {/* ── Location picker ──────────────────────────────────── */}
          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="neu neu-hover flex h-11 w-full items-center gap-1.5 rounded-2xl px-3 text-left sm:h-13 sm:gap-2 sm:px-4"
            >
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">
                {location}
              </span>
              <ChevronDown
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </button>

            {open && (
              <ul
                role="listbox"
                aria-label="Delivery location"
                className="neu-lg absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl p-2"
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

          {/* ── Theme toggle ─────────────────────────────────────── */}
          {/* Icons swap via CSS dark: classes — no JS state, no hydration
              mismatch, and no delayed icon flash after mount. */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggle}
            className="neu neu-hover relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-13 sm:w-13"
          >
            {/* Moon shown in light mode */}
            <Moon className="h-5 w-5 text-foreground dark:hidden" aria-hidden="true" />
            {/* Sun shown in dark mode */}
            <Sun className="h-5 w-5 text-brand hidden dark:block" aria-hidden="true" />
          </button>

          {/* ── Cart ─────────────────────────────────────────────── */}
          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            className="neu neu-hover relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-13 sm:w-13"
          >
            <ShoppingCart className="h-5 w-5 text-brand" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-white ring-2 ring-background">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {/* ── Bell — hidden below 375 px to prevent header overflow ── */}
          <Link
            to="/notifications"
            aria-label="Notifications, 3 unread"
            className="neu neu-hover relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl xs:flex sm:h-13 sm:w-13"
          >
            <Bell className="h-5 w-5 text-foreground" aria-hidden="true" />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-white ring-2 ring-background">
              3
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
