import React from "react";
import { Link, useLocation } from "react-router-dom";
import { domains } from "../../pages/domains/Domains";

export default function DomainsNavBar({ fixedBelowHero } = {}) {
  const location = useLocation();
  const isDomainPage = location.pathname.startsWith("/domains/");
  const currentSlug = isDomainPage ? location.pathname.replace("/domains/", "").split("/")[0] : null;
  const positionClass = fixedBelowHero
    ? "fixed left-0 right-0 top-[6.5rem] md:top-[7.5rem] z-[9998]"
    : "sticky top-[6.5rem] md:top-[7.5rem] z-[9998]";

  return (
    <nav
      aria-label="Task domains"
      className={`w-full border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm ${positionClass} shadow-sm`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2.5 sm:py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] shrink-0 pr-2 sm:pr-3 border-r border-[var(--color-border)] mr-1 sm:mr-2">
            Domains
          </span>
          {domains.map((domain) => {
            const isActive = currentSlug === domain.slug;
            return (
              <Link
                key={domain.slug}
                to={`/domains/${domain.slug}`}
                className={`shrink-0 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary)]"
                }`}
              >
                {domain.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
