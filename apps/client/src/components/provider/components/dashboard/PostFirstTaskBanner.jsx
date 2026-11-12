import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Clock, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/docs";
const hero530 = `${CDN}/image-530.webp`;
const hero531 = `${CDN}/image-531.webp`;
const hero1   = `${CDN}/image-1.webp`;
const CARDS = [
  {
    id: "hardcoded-1",
    kind: "promo",
    image: hero1,
    Icon: Plus,
    title: "Post Your First Task",
    description:
      "Get started by posting your task and connect with talented professionals ready to help.",
    href: "/provider/post-task-selection",
    overlay: "linear-gradient(115deg, #51A2FFB2 0%, #A6ECC2B2 100%)",
  },
  {
    id: "hardcoded-530",
    kind: "promo",
    image: hero530,
    Icon: Search,
    title: "Find Top Performers",
    description:
      "Browse through our community of verified professionals and find the perfect match for your project.",
    href: "/provider/explore-talent",
    overlay: "linear-gradient(135deg, #00D492B2 0%, #42D6C0B2 100%)",
  },
  {
    id: "hardcoded-531",
    kind: "promo",
    image: hero531,
    Icon: Clock,
    title: "Get Started in Minutes",
    description:
      "Join thousands of satisfied clients who found their perfect freelancer on FirstDoer.",
    href: "/provider/post-task-selection",
    overlay: "linear-gradient(135deg, #3EBF6DB2 0%, #6A728299 100%)",
  },
];

const SWIPE_THRESHOLD = 48;
const AUTO_MS = 5000;

const PromoCard = ({ image, Icon, title, description, href, overlay, onNavigate }) => (
  <button
    type="button"
    onClick={() => onNavigate(href)}
    className="relative flex h-full min-h-[168px] w-full flex-col items-start overflow-hidden rounded-[22px] p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.10)] transition hover:brightness-[1.03] active:scale-[0.995] sm:min-h-[180px] sm:p-7"
  >
    <img
      src={image}
      alt=""
      className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[1.5px]"
      draggable={false}
    />
    <div className="absolute inset-0" style={{ background: overlay }} aria-hidden />

    <div className="relative z-10 flex h-full w-full max-w-xl flex-col">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-[2px] ring-1 ring-white/40">
        <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
      </div>

      <h2 className="text-[1.25rem] font-heading font-medium tracking-tight text-white sm:text-[1.5rem]">
        {title}
      </h2>
      <p className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-white/95">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white">
        Get Started
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </div>
  </button>
);

const PostFirstTaskBanner = ({ dynamicSlides = [] }) => {
  const navigate = useNavigate();
  const dragStartX = useRef(null);

  const slides = useMemo(() => {
    const dynamic = (dynamicSlides || []).map((s, i) => ({
      id: s.id || `dynamic-${i}`,
      kind: "dynamic",
      slide: s,
    }));
    return [...CARDS, ...dynamic];
  }, [dynamicSlides]);

  const count = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((prev) => (prev >= count ? 0 : prev));
  }, [count]);

  const goTo = useCallback(
    (next) => {
      if (count <= 0) return;
      setActiveIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(() => goTo(activeIndex + 1), AUTO_MS);
    return () => clearInterval(timer);
  }, [count, activeIndex, goTo]);

  const onPointerDown = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
  };

  const onPointerUp = (e) => {
    if (dragStartX.current == null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current;
    const delta = endX - dragStartX.current;
    dragStartX.current = null;
    if (delta <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (delta >= SWIPE_THRESHOLD) goTo(activeIndex - 1);
  };

  return (
    <section className="w-full" aria-label="Promotions">
      <div className="flex items-center gap-2 sm:gap-3">
        {count > 1 ? (
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-slate-700 shadow-sm transition hover:border-[#29ADAC]/30 hover:text-[#083B3A] sm:h-11 sm:w-11"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}

        <div
          className="min-w-0 flex-1 overflow-hidden touch-pan-y"
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
          onMouseLeave={() => {
            dragStartX.current = null;
          }}
          onTouchStart={onPointerDown}
          onTouchEnd={onPointerUp}
        >
          <motion.div
            className="flex w-full"
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {slides.map((card) => (
              <div key={card.id} className="w-full shrink-0 grow-0 basis-full">
                {card.kind === "dynamic" ? (
                  <PromoCard
                    image={card.slide?.imageUrl || ""}
                    Icon={Sparkles}
                    title={card.slide?.title || "Special Offer"}
                    description={card.slide?.subtitle || ""}
                    href={card.slide?.linkUrl || "#"}
                    overlay="linear-gradient(135deg, #8B5CF699 0%, #3B82F699 100%)"
                    onNavigate={navigate}
                  />
                ) : (
                  <PromoCard
                    image={card.image}
                    Icon={card.Icon}
                    title={card.title}
                    description={card.description}
                    href={card.href}
                    overlay={card.overlay}
                    onNavigate={navigate}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {count > 1 ? (
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-slate-700 shadow-sm transition hover:border-[#29ADAC]/30 hover:text-[#083B3A] sm:h-11 sm:w-11"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((card, i) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Go to promo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-[#10605F]" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default PostFirstTaskBanner;
