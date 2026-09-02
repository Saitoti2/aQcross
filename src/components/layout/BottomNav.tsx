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

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 mx-auto w-full max-w-[1240px] px-4 pb-5 pt-3 sm:px-6"
    >
      <ul className="neu-lg grid grid-cols-5 rounded-3xl px-2 py-3 backdrop-blur-none">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1.5 rounded-2xl py-2"
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
                  className={`text-xs ${
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
  );
}
