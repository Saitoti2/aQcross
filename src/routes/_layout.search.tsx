import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Tag } from "lucide-react";
import { products, categories, shops } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import { Pagination, usePagination } from "@/components/shop/Pagination";

export const Route = createFileRoute("/_layout/search")({
  component: SearchPage,
});

const PER_PAGE = 12;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeShop, setActiveShop] = useState("all");
  const [offersOnly, setOffersOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (activeShop !== "all" && p.shop !== activeShop) return false;
      if (offersOnly && !p.wasPrice && !p.studentDeal) return false;
      if (inStockOnly && !p.inStock) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shop.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory, activeShop, offersOnly, inStockOnly]);

  const hasFilters = activeCategory !== "all" || activeShop !== "all" || offersOnly || inStockOnly;

  const { page, pageCount, pageItems, goToPage, total, rangeStart, rangeEnd } = usePagination(
    results,
    PER_PAGE,
    `${query}|${activeCategory}|${activeShop}|${offersOnly}|${inStockOnly}`,
  );

  function clearFilters() {
    setActiveCategory("all");
    setActiveShop("all");
    setOffersOnly(false);
    setInStockOnly(false);
  }

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="sticky top-0 z-10 bg-background pb-3 pt-5">
        <div className="flex gap-3">
          <div className="neu flex flex-1 items-center gap-3 rounded-2xl px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products, categories or shops..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Toggle filters"
            className={`neu neu-hover flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl transition-all ${
              showFilters ? "bg-brand text-white" : ""
            }`}
          >
            <SlidersHorizontal
              className={`h-5 w-5 ${showFilters ? "text-white" : "text-brand"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="neu mt-3 rounded-3xl p-4">
            {/* Category filter */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === "all" ? "bg-brand text-white" : "neu-sm"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setActiveCategory(c.slug)}
                    className={`shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeCategory === c.slug ? "bg-brand text-white" : "neu-sm"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop filter */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Shop
              </p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveShop("all")}
                  className={`shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeShop === "all" ? "bg-brand text-white" : "neu-sm"
                  }`}
                >
                  All Shops
                </button>
                {shops.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setActiveShop(s.slug)}
                    className={`shrink-0 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeShop === s.slug ? "bg-brand text-white" : "neu-sm"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOffersOnly((v) => !v)}
                className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  offersOnly ? "bg-brand text-white" : "neu-sm"
                }`}
              >
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                Offers Only
              </button>
              <button
                type="button"
                onClick={() => setInStockOnly((v) => !v)}
                className={`rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  inStockOnly ? "bg-brand text-white" : "neu-sm"
                }`}
              >
                In Stock Only
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-semibold text-brand"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {(query || hasFilters) && (
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          {results.length} result{results.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </p>
      )}

      {/* Empty state — no search yet */}
      {!query && !hasFilters && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="h-14 w-14 text-muted-foreground/30" aria-hidden="true" />
          <p className="text-base font-semibold text-muted-foreground">Search for anything</p>
          <p className="text-sm text-muted-foreground">
            Products, categories, shops — it's all here.
          </p>
        </div>
      )}

      {/* No results */}
      {(query || hasFilters) && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="h-14 w-14 text-muted-foreground/30" aria-hidden="true" />
          <p className="text-base font-semibold text-muted-foreground">No results found</p>
          <p className="text-sm text-muted-foreground">
            Try a different keyword or adjust your filters.
          </p>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <>
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
            label="results"
          />
        </>
      )}
    </div>
  );
}
