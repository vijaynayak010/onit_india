import React, { useMemo } from "react";
import {
  mapHomeCategoryToBrowseItem,
  useHomeContent,
} from "../../../services/homeContent";

function CategoryCard({ item, isActive, onClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[7.5rem] shrink-0 flex-col items-center justify-center gap-2.5 rounded-2xl border bg-white px-3 py-4 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-8px_rgba(15,23,42,0.12)] active:scale-[0.98] sm:min-w-0 sm:shrink sm:px-2 sm:py-4 md:gap-3 md:py-5 ${
        isActive
          ? "border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/15"
          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/25"
      }`}
    >
      {item.imageUrl && !item.isMore ? (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl md:h-14 md:w-14">
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl md:h-14 md:w-14"
          style={{ backgroundColor: item.iconBg, color: item.iconColor }}
        >
          <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} />
        </div>
      )}
      <span className="text-xs font-bold leading-tight text-[var(--color-text)] sm:text-[13px]">
        {item.label}
      </span>
    </button>
  );
}

export default function BrowseCategoryGrid({
  selectedCategory = null,
  onSelectCategory,
  showHeader = true,
  searchQuery = "",
  className = "",
}) {
  const { categories, loading } = useHomeContent();

  const items = useMemo(() => {
    const q = String(searchQuery || "").trim().toLowerCase();
    let mapped = categories.map((cat, index) => mapHomeCategoryToBrowseItem(cat, index));
    if (q) {
      mapped = mapped.filter(
        (item) =>
          String(item.label || "").toLowerCase().includes(q) ||
          String(item.category || "").toLowerCase().includes(q) ||
          String(item.slug || "").toLowerCase().includes(q)
      );
      return mapped;
    }
    if (!mapped.length) return [];
    return mapped;
  }, [categories, searchQuery]);

  if (!loading && !items.length) {
    if (searchQuery) {
      return (
        <div className={className}>
          {showHeader ? (
            <div className="mb-4 sm:mb-5">
              <h2 className="text-sm font-black uppercase tracking-[0.06em] text-[var(--color-text)] sm:text-base">
                Browse by Category
              </h2>
            </div>
          ) : null}
          <p className="py-10 text-center text-sm font-semibold text-[var(--color-text-muted)]">
            No categories match your search.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      {showHeader ? (
        <div className="mb-4 sm:mb-5">
          <h2 className="text-sm font-black uppercase tracking-[0.06em] text-[var(--color-text)] sm:text-base">
            Browse by Category
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)] sm:text-sm">
            Find the right expert for your project
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="flex gap-3 overflow-hidden sm:grid sm:grid-cols-6 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-[7.5rem] shrink-0 animate-pulse flex-col items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-white px-3 py-4 sm:min-w-0"
            >
              <div className="h-12 w-12 rounded-2xl bg-[var(--color-border-subtle)] md:h-14 md:w-14" />
              <div className="h-3 w-16 rounded bg-[var(--color-border-subtle)]" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:gap-3 sm:overflow-visible sm:pb-0 md:gap-4 ${
            items.length <= 6 ? "sm:grid-cols-6" : "sm:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {items.map((item) => {
            const isActive =
              !item.isMore &&
              selectedCategory &&
              (selectedCategory === item.category ||
                selectedCategory === item.label ||
                selectedCategory === item.slug);

            return (
              <CategoryCard
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={() => {
                  onSelectCategory?.(item);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
