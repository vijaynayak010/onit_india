import React from "react";
import { Link } from "react-router-dom";
import { resolveHomeIcon, sortHomeItems } from "../../services/homeContent";

function CategoryLink({ category, children }) {
  const url = String(category.linkUrl || `/category/${category.slug || category.id}`).trim();
  if (/^https?:\/\//i.test(url)) {
    return (
      <a href={url} className="block h-full" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={url} className="block h-full">
      {children}
    </Link>
  );
}

export function HomeCategoryChips({ categories = [] }) {
  const items = sortHomeItems(categories);
  if (!items.length) return null;

  return (
    <section className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <span className="mr-1 text-sm text-[var(--color-text-subtle)]">Popular:</span>
      {items.map((cat) => (
        <CategoryLink key={cat.id} category={cat}>
          <span className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] sm:text-sm">
            {cat.title}
          </span>
        </CategoryLink>
      ))}
    </section>
  );
}

export default function HomeCategoryFeed({ categories = [] }) {
  const items = sortHomeItems(categories);
  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
          Browse services
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Explore categories and post a task in minutes
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat) => {
          const Icon = resolveHomeIcon(cat.iconName);
          return (
            <CategoryLink key={cat.id} category={cat}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-md">
                {cat.imageUrl ? (
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img
                      src={cat.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                    <Icon size={36} strokeWidth={1.75} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                      <Icon size={18} />
                    </span>
                    <h3 className="text-base font-semibold text-[var(--color-text)]">
                      {cat.title}
                    </h3>
                  </div>
                  {cat.description ? (
                    <p className="line-clamp-2 text-sm text-[var(--color-text-muted)]">
                      {cat.description}
                    </p>
                  ) : null}
                </div>
              </article>
            </CategoryLink>
          );
        })}
      </div>
    </section>
  );
}
