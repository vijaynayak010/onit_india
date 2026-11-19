import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Clock, ArrowRight, Sparkles } from "lucide-react";
const MotionDiv = motion.div;
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

const PromoCard = ({ image, icon: Icon, title, description, href, overlay, onNavigate }) => (
  <button
    type="button"
    onClick={() => onNavigate(href)}
    className="relative flex h-full min-h-[124px] w-full flex-col items-start justify-center overflow-hidden rounded-2xl px-6 py-5 text-left shadow-[var(--shadow-sm)] transition hover:brightness-[1.03] active:scale-[0.995] sm:min-h-[132px] sm:px-8 sm:py-6"
  >
    <img
      src={image}
      alt=""
      className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-25 mix-blend-luminosity"
      draggable={false}
    />
    <div
      className="absolute inset-0"
      style={{ background: overlay || "linear-gradient(115deg, #083B3A 0%, #10605F 55%, #1B8887 100%)" }}
      aria-hidden
    />

    <div className="relative z-10 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5 sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-xs">
          {Icon ? React.createElement(Icon, { className: "h-5 w-5 text-white", strokeWidth: 2 }) : null}
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-heading font-medium tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-0.5 max-w-xl text-xs sm:text-sm font-normal leading-snug text-white/90 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-[#7EDEDD] px-4 py-1.5 text-xs font-medium text-[#032120] shadow-xs sm:self-center">
        Get Started
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
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
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div
          className="w-full overflow-hidden touch-pan-y"
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
          onMouseLeave={() => {
            dragStartX.current = null;
          }}
          onTouchStart={onPointerDown}
          onTouchEnd={onPointerUp}
        >
          <MotionDiv
            className="flex w-full"
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {slides.map((card) => (
              <div key={card.id} className="w-full shrink-0 grow-0 basis-full">
                {card.kind === "dynamic" ? (
                  <PromoCard
                    image={card.slide?.imageUrl || ""}
                    icon={Sparkles}
                    title={card.slide?.title || "Special Offer"}
                    description={card.slide?.subtitle || ""}
                    href={card.slide?.linkUrl || "#"}
                    overlay="linear-gradient(135deg, #083B3A 0%, #1B8887 100%)"
                    onNavigate={navigate}
                  />
                ) : (
                  <PromoCard
                    image={card.image}
                    icon={card.Icon}
                    title={card.title}
                    description={card.description}
                    href={card.href}
                    overlay="linear-gradient(115deg, #083B3A 0%, #10605F 55%, #1B8887 100%)"
                    onNavigate={navigate}
                  />
                )}
              </div>
            ))}
          </MotionDiv>
        </div>

        {count > 1 ? (
          <div className="pointer-events-auto absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((card, i) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Go to promo ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PostFirstTaskBanner;
