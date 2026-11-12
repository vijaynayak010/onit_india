import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Database,
  Headphones
} from "react-feather";

// Custom premium SVG Icons matching mockup specifications perfectly
const BuildingIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="16" />
    <line x1="15" y1="22" x2="15" y2="16" />
    <line x1="9" y1="16" x2="15" y2="16" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
  </svg>
);

const PaletteIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.87827 21.3411 7.91036 20.213 6.28906C19.7892 5.6798 18.9663 5.5 18.25 5.75L17.25 6.1C16.5596 6.34015 15.7877 6.09633 15.3787 5.50974C14.7745 4.6433 13.9872 3.93175 13.0766 3.44136C12.3926 3.07297 12 2.3783 12 1.6v0C12 .716344 11.2837 0 10.4 0 4.98762 0 .5 4.38071 .5 9.77778C.5 16.5276 5.86538 22 12 22z" />
    <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
  </svg>
);

const GraduationCapIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    <path d="M21.5 12v6" />
  </svg>
);

export const domains = [
  {
    slug: "business-operations-research",
    title: "Business Operations & Research",
    description: "Get expert help with research, reports, data entry and more",
    image: "/assets/bussiness.jpeg",
    iconName: "Building"
  },
  {
    slug: "content-design-marketing",
    title: "Content, Design & Marketing",
    description: "Discover your opportunities and start rocking instantly",
    image: "/assets/design.jpeg",
    iconName: "Palette"
  },
  {
    slug: "tech-data-admin",
    title: "Tech, Data and Admin",
    description: "Get support with APIs, web development, setup, data",
    image: "/assets/tech.jpeg",
    iconName: "Database"
  },
  {
    slug: "academic-knowledge-support",
    title: "Academic & Knowledge Support",
    description: "Get expert help with research, reports, study materials and",
    image: "/assets/acdamic.jpeg",
    iconName: "GraduationCap"
  },
  {
    slug: "on-ground-local-assistance",
    title: "On-Ground & Local Assistance",
    description: "Get help with documentation work, office admin, add-on",
    image: "/assets/on ground.jpeg",
    iconName: "Headphones"
  },
];

const iconMap = {
  Building: BuildingIcon,
  Palette: PaletteIcon,
  Database: Database,
  GraduationCap: GraduationCapIcon,
  Headphones: Headphones
};

function Domains() {
  return (
    <div className="w-full px-4 mt-0 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16 bg-[#f8fafc] border-t border-b border-slate-100">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)] mb-2">
          Categories
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-800 font-sans mb-3">
          Explore Domains on <span className="text-slate-900">On<span className="text-[var(--color-primary)]">IT</span> INDIA</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Discover your opportunities and start working smartly with verified professionals in these specialized domains.
        </p>
      </div>

      {/* Cards Section */}
      <div className="relative group/domain-scroll max-w-7xl mx-auto">
        {/* Left Scroll Button (Mobile/Tablet Only) */}
        <button
          onClick={() => {
            const container = document.getElementById('domains-container');
            if (container) container.scrollBy({ left: -280, behavior: 'smooth' });
          }}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 lg:hidden hover:shadow-lg transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Scroll Button (Mobile/Tablet Only) */}
        <button
          onClick={() => {
            const container = document.getElementById('domains-container');
            if (container) container.scrollBy({ left: 280, behavior: 'smooth' });
          }}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 lg:hidden hover:shadow-lg transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          id="domains-container"
          className="
            flex lg:grid
            lg:grid-cols-5
            overflow-x-auto lg:overflow-visible
            gap-5 sm:gap-6
            pb-8 lg:pb-0
            scrollbar-hide
            snap-x
            px-2 sm:px-0
          "
        >
          {domains.map((domain) => {
            const Icon = iconMap[domain.iconName];

            return (
              <Link
                key={domain.slug}
                to={`/domains/${domain.slug}`}
                className="flex-shrink-0 lg:flex-shrink w-[260px] sm:w-[280px] lg:w-full snap-center group/card flex"
              >
                <div
                  className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col w-full h-full"
                >
                  {/* Image Header with floating Icon Badge */}
                  <div className="relative h-36 w-full overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Floating Icon Overlay */}
                    <div className="absolute top-3 left-3 bg-white p-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center w-9 h-9 border border-slate-50">
                      {Icon && <Icon size={18} className="text-slate-800" strokeWidth={2} />}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-slate-900 font-medium text-sm sm:text-base mb-1.5 leading-snug tracking-tight group-hover/card:text-[var(--color-primary)] transition-colors duration-200 min-h-[44px] flex items-center">
                        {domain.title}
                      </h3>
                      <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mb-4 line-clamp-2 min-h-[32px]">
                        {domain.description}
                      </p>
                    </div>

                    {/* Explore Now Button - Dark by default, Green on hover */}
                    <div
                      className="w-full py-2 px-3 rounded-lg font-bold text-xs sm:text-sm text-center transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm bg-[#050515] text-white group-hover/card:bg-[var(--color-primary)] group-hover/card:hover:bg-[var(--color-primary-hover)] group-hover/card:hover:shadow-[var(--shadow-glow)]"
                    >
                      Explore Now
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Domains;
