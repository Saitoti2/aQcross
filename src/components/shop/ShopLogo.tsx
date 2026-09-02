import { Star } from "lucide-react";
import type { Shop } from "@/lib/data";

/**
 * ShopLogo — renders a branded logo tile for a shop.
 *
 * sizes:
 *   "sm"  — used inside product cards / small references   (h-8  w-8)
 *   "md"  — used in horizontal shop carousels              (h-12 w-12)
 *   "lg"  — used in shop page headers                      (h-16 w-16)
 *   "xl"  — used in featured / hero placements             (h-20 w-20)
 */
type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<LogoSize, { tile: string; text: string }> = {
  sm: { tile: "h-8 w-8 rounded-xl text-xs",    text: "font-bold" },
  md: { tile: "h-12 w-12 rounded-2xl text-sm", text: "font-extrabold" },
  lg: { tile: "h-16 w-16 rounded-2xl text-lg", text: "font-extrabold" },
  xl: { tile: "h-20 w-20 rounded-3xl text-xl", text: "font-extrabold" },
};

interface ShopLogoProps {
  shop: Shop;
  size?: LogoSize;
  className?: string;
}

export function ShopLogo({ shop, size = "md", className = "" }: ShopLogoProps) {
  const { tile, text } = sizeMap[size];

  return (
    <div
      className={`${tile} ${shop.logoBg} ${shop.logoColor} flex shrink-0 items-center justify-center ${className}`}
      aria-label={shop.name}
    >
      <span className={`${text} leading-none tracking-tight`}>{shop.logoText}</span>
    </div>
  );
}

/**
 * ShopCard — a self-contained carousel tile with logo, name and rating.
 * Used in the "Shop by Store" horizontal scroll on the home page.
 */
interface ShopCardProps {
  shop: Shop;
  active?: boolean;
  onClick?: () => void;
}

export function ShopCard({ shop, active = false, onClick }: ShopCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-all ${
        active ? "neu-pressed ring-2 ring-brand" : "neu neu-hover"
      }`}
    >
      <ShopLogo shop={shop} size="md" />
      <span className="w-16 text-center text-xs font-semibold leading-tight">{shop.name}</span>
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 fill-brand text-brand" aria-hidden="true" />
        <span className="text-[0.65rem] font-medium text-muted-foreground">{shop.rating}</span>
      </div>
    </button>
  );
}
