import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "./data";

export type CartLine = { productId: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  byShop: { shop: string; lines: { product: Product; qty: number }[] }[];
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  qtyOf: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aqross.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const add = useCallback((productId: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = lines
      .map((l) => ({ product: getProduct(l.productId), qty: l.qty }))
      .filter((l): l is { product: Product; qty: number } => Boolean(l.product));

    const subtotal = resolved.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const discount = resolved.reduce(
      (sum, l) => sum + (l.product.wasPrice ? (l.product.wasPrice - l.product.price) * l.qty : 0),
      0,
    );
    const shopSlugs = [...new Set(resolved.map((l) => l.product.shop))];
    const deliveryFee = resolved.length === 0 ? 0 : 100 + Math.max(0, shopSlugs.length - 1) * 60;

    return {
      lines,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      subtotal,
      discount,
      deliveryFee,
      total: subtotal + deliveryFee,
      byShop: shopSlugs.map((shop) => ({
        shop,
        lines: resolved.filter((l) => l.product.shop === shop),
      })),
      add,
      setQty,
      remove,
      clear,
      qtyOf: (productId: string) => lines.find((l) => l.productId === productId)?.qty ?? 0,
    };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
