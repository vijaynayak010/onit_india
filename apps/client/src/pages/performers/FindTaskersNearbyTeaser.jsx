import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "react-feather";

/**
 * Teaser section: "Find taskers nearby you" — sits above Partner section.
 * Links to the full "Find Performers Nearby You" section below.
 */
export default function FindTaskersNearbyTeaser() {
  return (
    <section
      aria-labelledby="find-taskers-teaser-heading"
      className="relative w-full bg-[var(--color-surface)] border-y border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)]">
              <MapPin size={20} className="text-[var(--color-primary)]" aria-hidden />
            </span>
            <div>
              <h2
                id="find-taskers-teaser-heading"
                className="text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl"
              >
                Find taskers nearby you
              </h2>
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
                Search by area or location and get matched with verified taskers.
              </p>
            </div>
          </div>
          <Link
            to="/#nearby-taskers"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
          >
            Explore nearby taskers
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
