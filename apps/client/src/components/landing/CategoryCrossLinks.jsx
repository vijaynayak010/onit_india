import React from "react";
import { Link } from "react-router-dom";
import { Send, Briefcase } from "react-feather";

/**
 * Internal links to other categories; optionally show conversion CTAs.
 * Use showCtas={false} when the page already has the same CTAs in hero/footer to avoid repetition.
 *
 * @param {string} title - Section heading (e.g. "Explore other categories")
 * @param {Array<{ to: string, label: string }>} links - Links to other category pages
 * @param {Object} ctaPrimary - { to, label } e.g. "Post Your Task"
 * @param {Object} ctaSecondary - { to, label } e.g. "Get Work Executed"
 * @param {"teal"|"green"} variant - teal (#004d43) or green (green-600)
 * @param {boolean} showCtas - If false, only show links (no duplicate Post task / Get work executed buttons)
 */
const CategoryCrossLinks = ({
  title = "Explore other categories",
  links = [],
  ctaPrimary = { to: "/", label: "Post Your Task" },
  ctaSecondary = { to: "/task-performers", label: "Get Work Executed" },
  variant = "teal",
  showCtas = true,
}) => {
  const isTeal = variant === "teal";
  const primaryBg = isTeal ? "bg-[#004d43] hover:bg-[#003d35]" : "bg-green-600 hover:bg-green-700";
  const secondaryBorder = isTeal ? "border-[#004d43] text-[#004d43] hover:bg-[#004d43]/5" : "border-green-600 text-green-700 hover:bg-green-50";
  const linkCls = isTeal ? "text-[#004d43] hover:text-[#003d35] hover:underline" : "text-green-700 hover:text-green-800 hover:underline";

  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </h2>
      {links.length > 0 && (
        <div className={`flex flex-wrap gap-x-4 gap-y-2 ${showCtas ? "mb-4" : ""}`}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className={`text-sm font-medium ${linkCls}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
      {showCtas && (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={ctaPrimary.to}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-semibold text-sm transition-colors ${primaryBg}`}
          >
            <Send size={16} strokeWidth={2.5} />
            {ctaPrimary.label}
          </Link>
          <Link
            to={ctaSecondary.to}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-semibold text-sm transition-colors ${secondaryBorder}`}
          >
            <Briefcase size={16} strokeWidth={2.5} />
            {ctaSecondary.label}
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategoryCrossLinks;
