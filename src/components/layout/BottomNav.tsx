import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    to: "/categories",
    label: "Categories",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/categories") || p.startsWith("/shop"),
  },
  { to: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingBag,
    match: (p: string) => p.startsWith("/orders"),
  },
  {
    to: "/account",
    label: "Account",
    icon: User,
    match: (p: string) => p.startsWith("/account") || p.startsWith("/auth"),
  },
] as const;

/**
 * Primary navigation below the lg breakpoint, where the sidebar rail is
 * hidden. On desktop the sidebar takes over and this is not rendered.
 */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    /* Full-width background bar handles wide screens; inner content is capped */
    <div className="sticky bottom-0 z-20 w-full bg-background/95 backdrop-blur-sm lg:hidden">
      <nav
        aria-label="Primary"
        className="mx-auto w-full max-w-[1440px] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <ul className="neu-lg grid grid-cols-5 rounded-3xl px-1 py-2 sm:px-2 sm:py-3">
          {items.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1 rounded-2xl py-1.5 sm:gap-1.5 sm:py-2"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      active ? "neu-pressed" : ""
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-brand" : "text-muted-foreground"}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={`text-[0.65rem] sm:text-xs ${
                      active ? "font-semibold text-brand" : "font-medium text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
