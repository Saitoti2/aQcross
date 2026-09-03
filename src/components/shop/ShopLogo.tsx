import { ShoppingCart, Star } from "lucide-react";
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

/*
 * One shared shell for every "Shop by Store" tile.
 *
 * Width and the name/meta block are fixed so a two-line shop name
 * ("Goodlife Pharmacy") lines up with a one-line one and every tile in the
 * row ends up the same height.
 */
const tileShell =
  "flex w-[6.75rem] shrink-0 flex-col items-center gap-2 rounded-2xl p-3 transition-all";
const tileName =
  "flex h-8 w-full items-center justify-center text-center text-xs font-semibold leading-tight";
const tileMeta = "flex h-4 items-center justify-center gap-1";

function tileState(active: boolean) {
  return active ? "neu-pressed ring-2 ring-brand" : "neu neu-hover";
}

/**
 * AllShopsCard — the "clear the store filter" tile that leads the row.
 * Shares ShopCard's shell so it sits flush with the branded tiles.
 */
interface AllShopsCardProps {
  active?: boolean;
  onClick?: () => void;
}

export function AllShopsCard({ active = false, onClick }: AllShopsCardProps) {
  return (
    <button type="button" onClick={onClick} className={`${tileShell} ${tileState(active)}`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand">
        <ShoppingCart className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      <span className={tileName}>All Shops</span>
      {/* Empty meta row keeps this tile the same height as the rated ones. */}
      <div className={tileMeta} aria-hidden="true" />
    </button>
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
    <button type="button" onClick={onClick} className={`${tileShell} ${tileState(active)}`}>
      <ShopLogo shop={shop} size="md" />
      <span className={tileName}>
        <span className="line-clamp-2">{shop.name}</span>
      </span>
      <div className={tileMeta}>
        <Star className="h-3 w-3 fill-brand text-brand" aria-hidden="true" />
        <span className="text-[0.65rem] font-medium text-muted-foreground">{shop.rating}</span>
      </div>
    </button>
  );
}
