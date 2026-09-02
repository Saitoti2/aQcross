import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Truck,
  Tag,
  ShieldCheck,
  RefreshCw,
  ShoppingCart,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Clock,
} from "lucide-react";
import { categories, popularCategorySlugs, shops, products, allCategoriesIcon } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/_layout/")({
  component: HomePage,
});

// ─── Service Benefits ────────────────────────────────────────────────────────
const benefits = [
  { icon: Truck, title: "Fast Delivery", sub: "15–45 mins" },
  { icon: Tag, title: "Student Deals", sub: "Special offers" },
  { icon: ShieldCheck, title: "Verified Shops", sub: "Trusted stores" },
  { icon: RefreshCw, title: "Easy Returns", sub: "Hassle free" },
];

// ─── Filter bar options ───────────────────────────────────────────────────────
const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"];
const priceOptions = ["Any Price", "Under KES 200", "KES 200–500", "KES 500–1000", "Over KES 1000"];

function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeShop, setActiveShop] = useState("all");
  const [sortBy, setSortBy] = useState("Relevance");
  const [priceFilter, setPriceFilter] = useState("Any Price");
  const [offersOnly, setOffersOnly] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const popularCategories = popularCategorySlugs
    .map((s) => categories.find((c) => c.slug === s))
    .filter(Boolean) as typeof categories;

  // Filtered products
  const filtered = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (activeShop !== "all" && p.shop !== activeShop) return false;
    if (offersOnly && !p.wasPrice && !p.studentDeal) return false;
    if (priceFilter === "Under KES 200" && p.price >= 200) return false;
    if (priceFilter === "KES 200–500" && (p.price < 200 || p.price > 500)) return false;
    if (priceFilter === "KES 500–1000" && (p.price < 500 || p.price > 1000)) return false;
    if (priceFilter === "Over KES 1000" && p.price <= 1000) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  const AllIcon = allCategoriesIcon;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-6 sm:px-6">

      {/* Search Bar */}
      <div className="mt-5 flex gap-3">
        <Link
          to="/search"
          className="neu neu-hover flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5"
        >
          <svg className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-sm text-muted-foreground">Search for products, categories or shops...</span>
        </Link>
        <Link
          to="/search"
          aria-label="Open filters"
          className="neu neu-hover flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl"
        >
          <SlidersHorizontal className="h-5 w-5 text-brand" aria-hidden="true" />
        </Link>
      </div>

      {/* Service Benefits */}
      <div className="mt-5 neu rounded-3xl px-4 py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {benefits.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="neu-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="mt-6 flex gap-5">

        {/* Left Category Sidebar */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Categories
          </h2>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  activeCategory === "all"
                    ? "bg-brand text-brand-foreground"
                    : "neu neu-hover text-foreground"
                }`}
              >
                <AllIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                All Categories
              </button>
            </li>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-brand text-brand-foreground"
                        : "neu neu-hover text-foreground hover:text-brand"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-brand"}`}
                      aria-hidden="true"
                    />
                    {cat.name}
                  </button>
                </li>
              );
            })}
            <li>
              <Link
                to="/categories"
                className="neu neu-hover flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-brand"
              >
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                View All
              </Link>
            </li>
          </ul>
        </aside>

        {/* Right Content */}
        <div className="min-w-0 flex-1">

          {/* Hero Banner */}
          <div className="neu overflow-hidden rounded-3xl">
            <div className="flex min-h-[220px] items-center justify-between gap-4 px-6 py-6 sm:min-h-[260px] sm:px-8">
              {/* Hero Text */}
              <div className="max-w-[280px] flex-1">
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                  Everything you need,{" "}
                  <span className="text-brand">delivered to you</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Groceries, essentials & more at your convenience.
                </p>
                <Link
                  to="/categories"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
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
                  className="h-28 w-auto object-contain sm:h-52"
                  loading="eager"
                />
              </div>
            </div>
            {/* Carousel indicators */}
            <div className="flex justify-center gap-2 pb-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setHeroSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    heroSlide === i ? "w-6 bg-brand" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shop by Store */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Shop by Store</h2>
              <Link to="/categories" className="text-sm font-semibold text-brand">
                View All
              </Link>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {/* All Shops */}
              <button
                type="button"
                onClick={() => setActiveShop("all")}
                className={`flex shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-all ${
                  activeShop === "all" ? "neu-pressed ring-2 ring-brand" : "neu neu-hover"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand">
                  <ShoppingCart className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="w-16 text-center text-xs font-semibold">All Shops</span>
              </button>
              {shops.map((shop) => (
                <button
                  key={shop.slug}
                  type="button"
                  onClick={() => setActiveShop(shop.slug)}
                  className={`flex shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-all ${
                    activeShop === shop.slug ? "neu-pressed ring-2 ring-brand" : "neu neu-hover"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <span className="text-sm font-bold text-foreground">
                      {shop.name.substring(0, 2)}
                    </span>
                  </div>
                  <span className="w-16 text-center text-xs font-semibold leading-tight">
                    {shop.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-brand text-brand" aria-hidden="true" />
                    <span className="text-[0.65rem] text-muted-foreground">{shop.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          {activeCategory === "all" && activeShop === "all" && (
            <div className="mt-6">
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
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => setActiveCategory(cat.slug)}
                      className="neu neu-hover flex flex-col overflow-hidden rounded-3xl p-0"
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
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="mt-6 flex flex-wrap gap-2">
            {/* Sort by */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setSortOpen((v) => !v); setPriceOpen(false); }}
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
                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
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
                onClick={() => { setPriceOpen((v) => !v); setSortOpen(false); }}
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
                        onClick={() => { setPriceFilter(opt); setPriceOpen(false); }}
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

            {/* Shop filter */}
            <div className="relative flex items-center gap-1.5 rounded-2xl neu px-4 py-2.5 text-sm font-semibold text-muted-foreground">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              <span>
                {activeShop === "all" ? "All Shops" : shops.find((s) => s.slug === activeShop)?.name}
              </span>
            </div>

            {/* Filters */}
            <Link
              to="/search"
              className="neu neu-hover flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand" aria-hidden="true" />
              Filters
            </Link>
          </div>

          {/* Product Grid */}
          <div className="mt-5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <ShoppingCart className="h-14 w-14 text-muted-foreground/30" aria-hidden="true" />
                <p className="text-base font-semibold text-muted-foreground">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold">
                    {activeCategory === "all" ? "Featured Products" : categories.find((c) => c.slug === activeCategory)?.name}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      ({filtered.length})
                    </span>
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    15–45 min delivery
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile category pills */}
      <div className="mt-5 lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
              activeCategory === "all" ? "bg-brand text-white" : "neu"
            }`}
          >
            <AllIcon className="h-4 w-4" aria-hidden="true" />
            All
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                  active ? "bg-brand text-white" : "neu"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-brand"}`} aria-hidden="true" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
