import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Slices a list into pages.
 *
 * The current page is clamped during render so a filter that shrinks the
 * list can never leave the caller showing an empty grid; the effect then
 * settles the stored page back into range.
 *
 * `resetKey` is any value that changes when the caller's filters change —
 * pass one and results always reopen on page 1, so nobody lands on page 4
 * of a two-page result set.
 */
export function usePagination<T>(items: T[], perPage = 12, resetKey?: unknown) {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * perPage, safePage * perPage),
    [items, safePage, perPage],
  );

  /** Jump to a page and put the reader back at the top of the list. */
  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), pageCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Call when a filter changes so results always open on page 1. */
  const resetPage = () => setPage(1);

  return {
    page: safePage,
    pageCount,
    pageItems,
    goToPage,
    resetPage,
    total: items.length,
    rangeStart: items.length === 0 ? 0 : (safePage - 1) * perPage + 1,
    rangeEnd: Math.min(safePage * perPage, items.length),
  };
}

/**
 * Builds the windowed page list, e.g. [1, "…", 4, 5, 6, "…", 12].
 * Always renders the first and last page plus one neighbour either side
 * of the current page.
 */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  // Keep the row a stable width when the current page sits at either end.
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= pageCount - 2)
    [pageCount - 3, pageCount - 2, pageCount - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    const prev = i > 0 ? sorted[i - 1] : undefined;
    if (prev !== undefined && p - prev > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional "Showing 1–12 of 47" summary. */
  rangeStart?: number;
  rangeEnd?: number;
  total?: number;
  /** What is being counted, e.g. "products". */
  label?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  rangeStart,
  rangeEnd,
  total,
  label = "items",
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const showSummary = rangeStart !== undefined && rangeEnd !== undefined && total !== undefined;

  return (
    /*
     * Equal 1fr gutters either side of an auto-width middle column keep the
     * page buttons centred on the container, so the summary's width never
     * pushes them off-centre. Stacks and centres on narrow screens.
     */
    <div className="mt-8 flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      {showSummary && (
        <p className="min-w-0 text-xs font-medium text-muted-foreground sm:col-start-1 sm:text-sm">
          Showing {rangeStart}–{rangeEnd} of {total} {label}
        </p>
      )}

      <nav
        aria-label="Pagination"
        className="flex items-center gap-1.5 sm:col-start-2 sm:justify-self-center"
      >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="neu neu-hover flex h-10 w-10 items-center justify-center rounded-2xl disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pageWindow(page, pageCount).map((entry, i) =>
          entry === "gap" ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="px-1 text-sm font-semibold text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-label={`Page ${entry}`}
              aria-current={entry === page ? "page" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-sm font-semibold transition-all ${
                entry === page ? "bg-brand text-white" : "neu neu-hover"
              }`}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className="neu neu-hover flex h-10 w-10 items-center justify-center rounded-2xl disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
