import { Star } from "lucide-react";
import { useState } from "react";
import type { Shop } from "@/lib/data";

/**
 * ShopLogo — renders a real logo image for a shop.
 * Falls back to a branded initial tile if the image fails to load.
 *
 * sizes:
 *   "sm"  — h-8  w-8   (product card references)
 *   "md"  — h-12 w-12  (home page carousel tiles)
 *   "lg"  — h-16 w-16  (shop page header)
 *   "xl"  — h-20 w-20  (featured placements)
 */
type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<LogoSize, string> = {
  sm: "h-8  w-8  rounded-xl",
  md: "h-12 w-12 rounded-2xl",
  lg: "h-16 w-16 rounded-2xl",
  xl: "h-20 w-20 rounded-3xl",
};

interface ShopLogoProps {
  shop: Shop;
  size?: LogoSize;
  className?: string;
}

export function ShopLogo({ shop, size = "md", className = "" }: ShopLogoProps) {
  const [imgError, setImgError] = useState(false);
  const tileClass = sizeMap[size];

  // Fallback: branded colour tile with initials
  if (imgError || !shop.logoUrl) {
    return (
      <div
        className={`${tileClass} ${shop.logoBg} ${shop.logoColor} flex shrink-0 items-center justify-center ${className}`}
        aria-label={shop.name}
      >
        <span className="text-xs font-extrabold leading-none tracking-tight">{shop.logoText}</span>
      </div>
    );
  }

  return (
    <div
      className={`${tileClass} flex shrink-0 items-center justify-center overflow-hidden bg-white p-1.5 ${className}`}
      style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}
      aria-label={shop.name}
    >
      <img
        src={shop.logoUrl}
        alt={shop.name}
        loading="lazy"
        className="h-full w-full object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

/**
 * ShopCard — carousel tile with real logo, name and rating.
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
