import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, Clock, ShieldCheck, ChevronLeft, SlidersHorizontal, Tag } from "lucide-react";
import { getShop, products, categories, getCategory } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopLogo } from "@/components/shop/ShopLogo";
import { Pagination, usePagination } from "@/components/shop/Pagination";

const PER_PAGE = 12;

export const Route = createFileRoute("/_layout/shop/$shopSlug")({
  component: ShopPage,
  loader: ({ params }) => {
    const shop = getShop(params.shopSlug);
    // If it's not a shop slug, maybe it's a category slug — handle gracefully
    return { shop: shop ?? null, slug: params.shopSlug };
  },
});

function ShopPage() {
  const { shop, slug } = Route.useLoaderData()!;
  const [activeCategory, setActiveCategory] = useState("all");
  const [offersOnly, setOffersOnly] = useState(false);

  // If slug matches a category, show products for that category across all shops
  const cat = getCategory(slug);

  const shopProducts = useMemo(
    () =>
      products.filter((p) => {
        if (shop) {
          if (p.shop !== shop.slug) return false;
        } else if (cat) {
          if (p.category !== cat.slug) return false;
        }
        if (activeCategory !== "all" && p.category !== activeCategory) return false;
        if (offersOnly && !p.wasPrice && !p.studentDeal) return false;
        return true;
      }),
    [shop, cat, activeCategory, offersOnly],
  );

  const availableCategories = [
    ...new Set(
      products
        .filter((p) => (shop ? p.shop === shop.slug : cat ? p.category === cat.slug : true))
        .map((p) => p.category),
    ),
  ]
    .map((s) => categories.find((c) => c.slug === s))
    .filter(Boolean) as typeof categories;

  // Must run before the not-found early return below — hooks cannot be conditional.
  const { page, pageCount, pageItems, goToPage, total, rangeStart, rangeEnd } = usePagination(
    shopProducts,
    PER_PAGE,
    `${slug}|${activeCategory}|${offersOnly}`,
  );

  if (!shop && !cat) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold text-muted-foreground">Store not found</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
          Back to Home
        </Link>
      </div>
    );
  }

  const displayName = shop?.name ?? cat?.name ?? slug;
  const CatIcon = cat?.icon;

  return (
    <div className="w-full">
      {/* Back */}
      <div className="py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </div>

      {/* Shop / Category Header */}
      <div className="neu rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted">
            {shop ? (
              <ShopLogo shop={shop} size="lg" />
            ) : CatIcon ? (
              <CatIcon className="h-8 w-8 text-brand" aria-hidden="true" />
            ) : (
              <span className="text-xl font-bold text-foreground">
                {displayName.substring(0, 2)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{displayName}</h1>
            {shop && (
              <>
                <p className="mt-0.5 text-sm text-muted-foreground">{shop.tagline}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{shop.branch}</p>
              </>
            )}
            {cat && !shop && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                Browse {shopProducts.length} products across all shops
              </p>
            )}
          </div>
          {shop && (
            <div className="hidden flex-col items-end gap-1 sm:flex">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
                <span className="text-sm font-bold">{shop.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {shop.delivery}
              </div>
              {shop.verified && (
                <div className="flex items-center gap-1 text-xs text-brand">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile shop meta */}
        {shop && (
          <div className="mt-4 flex gap-4 border-t border-border pt-4 sm:hidden">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
              <span className="text-sm font-bold">{shop.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {shop.delivery}
            </div>
            {shop.verified && (
              <div className="flex items-center gap-1 text-sm text-brand">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Verified
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
            activeCategory === "all" ? "bg-brand text-white" : "neu neu-hover"
          }`}
        >
          All
        </button>
        {availableCategories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
              activeCategory === c.slug ? "bg-brand text-white" : "neu neu-hover"
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOffersOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
            offersOnly ? "bg-brand text-white" : "neu neu-hover"
          }`}
        >
          <Tag className="h-4 w-4" aria-hidden="true" />
          Offers
        </button>
        <Link
          to="/search"
          className="neu neu-hover flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold"
        >
          <SlidersHorizontal className="h-4 w-4 text-brand" aria-hidden="true" />
          Filters
        </Link>
      </div>

      {/* Products */}
      <div className="mt-6">
        {shopProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SlidersHorizontal className="h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
            <p className="font-semibold text-muted-foreground">No products match your filters</p>
          </div>
        ) : (
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
              label="products"
            />
          </>
        )}
      </div>
    </div>
  );
}
