import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { categories } from "@/lib/data";

/**
 * Category browsing is not listed here — it lives in the "All Categories"
 * dropdown below, so the rail never offers the same destination twice.
 */
const navItems = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
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
 * Desktop navigation rail. Hidden below lg, where BottomNav takes over.
 */
export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Category pages live at /shop/<slug>; open the dropdown when we're on one
  // so the reader can see where they are in the list.
  const [categoriesOpen, setCategoriesOpen] = useState(() =>
    categories.some((c) => pathname === `/shop/${c.slug}`),
  );

  const onCategoriesIndex = pathname.startsWith("/categories");

  return (
    <aside
      className="no-scrollbar sticky top-[84px] hidden w-60 shrink-0 self-start overflow-y-auto lg:block"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <nav aria-label="Primary" className="neu flex flex-col gap-1 rounded-3xl p-3">
        <h2 className="mb-1 px-2 pt-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          Menu
        </h2>

        {navItems.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-brand"}`}
                aria-hidden="true"
              />
              {label}
            </Link>
          );
        })}

        {/* Categories — the label navigates to the index, the chevron expands
            the list, so the row serves both without one shadowing the other. */}
        <div className="mt-2 border-t border-border pt-2">
          <div
            className={`flex items-center rounded-2xl pr-1 transition-all ${
              onCategoriesIndex
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-foreground hover:bg-muted/60"
            }`}
          >
            <Link
              to="/categories"
              aria-current={onCategoriesIndex ? "page" : undefined}
              className="flex flex-1 items-center gap-3 rounded-2xl py-2.5 pl-3 text-sm font-semibold"
            >
              <LayoutGrid
                className={`h-4 w-4 shrink-0 ${onCategoriesIndex ? "text-white" : "text-brand"}`}
                aria-hidden="true"
              />
              All Categories
            </Link>
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              aria-controls="sidebar-categories"
              aria-label={categoriesOpen ? "Collapse category list" : "Expand category list"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                } ${onCategoriesIndex ? "text-white" : "text-muted-foreground"}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {categoriesOpen && (
            <ul id="sidebar-categories" className="mt-1 flex flex-col gap-0.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = pathname === `/shop/${cat.slug}`;
                return (
                  <li key={cat.slug}>
                    <Link
                      to="/shop/$shopSlug"
                      params={{ shopSlug: cat.slug }}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-2xl py-2 pl-6 pr-3 text-sm transition-all ${
                        active
                          ? "bg-brand font-semibold text-brand-foreground"
                          : "font-medium text-foreground hover:bg-muted/60 hover:text-brand"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-brand"}`}
                        aria-hidden="true"
                      />
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}
