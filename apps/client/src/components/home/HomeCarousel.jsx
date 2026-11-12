import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sortHomeItems } from "../../services/homeContent";

function SlideLink({ slide, children }) {
  const url = String(slide.linkUrl || "").trim();
  if (!url) return children;
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

export default function HomeCarousel({ slides = [], className = "mt-6 sm:mt-8" }) {
  const items = sortHomeItems(slides);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const current = items[index] || items[0];

  return (
    <section className={className} aria-label="Promotions">
      <div className="relative h-full min-h-[168px] overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.10)] sm:min-h-[180px]">
        <SlideLink slide={current}>
          <div className="relative flex h-full min-h-[168px] flex-col justify-end sm:min-h-[180px]">
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative z-10 p-5 sm:p-6 md:p-7">
              <h2 className="text-[1.35rem] font-medium tracking-tight text-white sm:text-[1.5rem]">
                {current.title}
              </h2>
              {current.subtitle ? (
                <p className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-white/95">
                  {current.subtitle}
                </p>
              ) : null}
            </div>
          </div>
        </SlideLink>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % items.length)}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {items.map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
