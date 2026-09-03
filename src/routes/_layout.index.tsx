import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Tag, ShoppingCart, ChevronDown, Clock, X } from "lucide-react";
import { categories, popularCategorySlugs, shops, products } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import { AllShopsCard, ShopCard } from "@/components/shop/ShopLogo";
import { Pagination, usePagination } from "@/components/shop/Pagination";

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
});

// ─── Filter bar options ───────────────────────────────────────────────────────
const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"];
const priceOptions = ["Any Price", "Under KES 200", "KES 200–500", "KES 500–1000", "Over KES 1000"];

const PER_PAGE = 12;

function HomePage() {
  const [activeShop, setActiveShop] = useState("all");
  const [sortBy, setSortBy] = useState("Relevance");
  const [priceFilter, setPriceFilter] = useState("Any Price");
  const [offersOnly, setOffersOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const popularCategories = popularCategorySlugs
    .map((s) => categories.find((c) => c.slug === s))
    .filter(Boolean) as typeof categories;

  const filtered = useMemo(
    () =>
      products
        .filter((p) => {
          if (activeShop !== "all" && p.shop !== activeShop) return false;
          if (offersOnly && !p.wasPrice && !p.studentDeal) return false;
          if (priceFilter === "Under KES 200" && p.price >= 200) return false;
          if (priceFilter === "KES 200–500" && (p.price < 200 || p.price > 500)) return false;
          if (priceFilter === "KES 500–1000" && (p.price < 500 || p.price > 1000)) return false;
          if (priceFilter === "Over KES 1000" && p.price <= 1000) return false;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "Price: Low to High") return a.price - b.price;
          if (sortBy === "Price: High to Low") return b.price - a.price;
          return 0;
        }),
    [activeShop, offersOnly, priceFilter, sortBy],
  );

  const { page, pageCount, pageItems, goToPage, total, rangeStart, rangeEnd } = usePagination(
    filtered,
    PER_PAGE,
    `${activeShop}|${sortBy}|${priceFilter}|${offersOnly}`,
  );

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mt-5">
        <Link
          to="/search"
          className="neu neu-hover flex items-center gap-3 rounded-2xl px-4 py-3.5"
        >
          <svg
            className="h-5 w-5 shrink-0 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-sm text-muted-foreground">
            Search for products, categories or shops...
          </span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="neu mt-6 overflow-hidden rounded-3xl">
        <div className="flex min-h-[200px] items-center justify-between gap-4 px-6 py-6 sm:min-h-[240px] sm:px-8 lg:min-h-[280px] lg:px-12">
          {/* Hero Text */}
          <div className="max-w-[280px] flex-1 lg:max-w-[420px]">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Everything you need, <span className="text-brand">delivered to you</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Groceries, essentials & more at your convenience.
            </p>
            <Link
              to="/categories"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Shop Now
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {/* Hero Basket — shrinks on narrow screens */}
          <div className="relative flex max-w-[40%] shrink flex-col items-center sm:max-w-none sm:flex-shrink-0">
            <img
              src="/3ce0b937-e727-4591-b5fa-8a8eac6f3d1b.png"
              alt="Shopping basket filled with everyday essentials"
              className="h-28 w-auto object-contain sm:h-52 lg:h-60"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Shop by Store */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Shop by Store</h2>
          <Link to="/categories" className="text-sm font-semibold text-brand">
            View All
          </Link>
        </div>
        {/* overflow-x-auto clips the y axis too, so the active ring and the
            neu-hover lift need padding inside the scroller; the negative
            margin keeps the row flush with the rest of the page. */}
        <div className="no-scrollbar -mx-2 flex items-start gap-3 overflow-x-auto px-2 py-2">
          <AllShopsCard active={activeShop === "all"} onClick={() => setActiveShop("all")} />
          {/* Per-shop branded tiles */}
          {shops.map((shop) => (
            <ShopCard
              key={shop.slug}
              shop={shop}
              active={activeShop === shop.slug}
              onClick={() => setActiveShop(shop.slug)}
            />
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-sm font-semibold text-brand">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to="/shop/$shopSlug"
                params={{ shopSlug: cat.slug }}
                className="neu neu-hover flex flex-col overflow-hidden rounded-3xl"
              >
                <div className="flex h-28 w-full items-center justify-center bg-muted/40 sm:h-32">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Icon className="h-12 w-12 text-brand" aria-hidden="true" />
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold leading-tight">{cat.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 flex flex-wrap gap-2">
        {/* Sort by */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSortOpen((v) => !v);
              setPriceOpen(false);
            }}
            className="neu neu-hover flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold"
          >
            Sort by: <span className="text-brand">{sortBy}</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {sortOpen && (
            <ul className="neu-lg absolute left-0 z-20 mt-2 w-52 rounded-2xl p-2">
              {sortOptions.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy(opt);
                      setSortOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${opt === sortBy ? "bg-brand font-semibold text-white" : "font-medium hover:bg-muted"}`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPriceOpen((v) => !v);
              setSortOpen(false);
            }}
            className="neu neu-hover flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold"
          >
            Price {priceFilter !== "Any Price" && <span className="text-brand">·</span>}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {priceOpen && (
            <ul className="neu-lg absolute left-0 z-20 mt-2 w-52 rounded-2xl p-2">
              {priceOptions.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceFilter(opt);
                      setPriceOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${opt === priceFilter ? "bg-brand font-semibold text-white" : "font-medium hover:bg-muted"}`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Offers */}
        <button
          type="button"
          onClick={() => setOffersOnly((v) => !v)}
          className={`neu neu-hover flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${offersOnly ? "bg-brand text-white" : ""}`}
        >
          <Tag className="h-4 w-4" aria-hidden="true" />
          Offers
        </button>

        {/* Active shop filter — only shown when a store is selected */}
        {activeShop !== "all" && (
          <button
            type="button"
            onClick={() => setActiveShop("all")}
            className="flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            {shops.find((s) => s.slug === activeShop)?.name}
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="mt-5">
        {total === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingCart className="h-14 w-14 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-base font-semibold text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">
                Featured Products
                <span className="ml-2 text-sm font-medium text-muted-foreground">({total})</span>
              </h2>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                15–45 min delivery
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={goToPage}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              total={total}
              label="products"
            />
          </>
        )}
      </div>
    </div>
  );
}
