import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Database,
  GraduationCap,
  Headphones,
  Palette,
} from "lucide-react";

const CATEGORY_ITEMS = [
  {
    id: "business",
    number: "1",
    title: "Business, Operations & Management",
    description: "Get expert help with research, reports, data entry and more",
    href: "/domains/business-operations-research",
    icon: Building2,
    gridClassName: "md:col-span-2 md:col-start-1 md:row-start-1",
    className:
      "bg-[#E7FBF1] text-[#009966] md:min-h-[195px] md:p-[30px_34px]",
    iconClassName: "bg-[rgba(0,153,102,0.22)]",
    numberClassName: "text-[rgba(0,153,102,0.09)] md:right-16",
    descriptionClassName: "text-[#717182]",
  },
  {
    id: "content",
    number: "2",
    title: "Content, Design & Marketing",
    description: "Discover your opportunities and start rocking instantly",
    href: "/domains/content-design-marketing",
    icon: Palette,
    gridClassName: "md:col-start-3 md:row-start-1",
    className: "bg-[#FFF1E0] text-[#FF6900]",
    iconClassName: "bg-[#FFC482]",
    numberClassName: "text-[rgba(255,105,0,0.09)]",
    descriptionClassName: "text-[#364153]",
  },
  {
    id: "local",
    number: "3",
    title: "On-Ground & Local Assistance",
    description: "Get help with documentation work, office admin, add-on request and more",
    href: "/domains/on-ground-local-assistance",
    icon: Headphones,
    gridClassName: "md:col-start-4 md:row-span-2 md:row-start-1",
    className: "bg-[#DFDFFF] text-[#615FFF] md:min-h-[400px]",
    iconClassName: "bg-[rgba(97,95,255,0.2)]",
    numberClassName: "text-[rgba(97,95,255,0.07)]",
    descriptionClassName: "text-[#717182]",
    tall: true,
  },
  {
    id: "tech",
    number: "4",
    title: "Tech, Data and Admin",
    description: "Get support with APIs, web development, setup, data handling and more",
    href: "/domains/tech-data-admin",
    icon: Database,
    gridClassName: "md:col-start-1 md:row-start-2",
    className: "bg-[#CCF1F8] text-[#030213]",
    iconClassName: "bg-[rgba(0,184,219,0.18)]",
    numberClassName: "text-[rgba(0,184,219,0.1)]",
    descriptionClassName: "text-[#717182]",
  },
  {
    id: "academic",
    number: "5",
    title: "Academic & Knowledge support",
    description: "Get expert help with research, reports, study materials and more",
    href: "/domains/academic-knowledge-support",
    icon: GraduationCap,
    gridClassName: "md:col-start-2 md:row-start-2",
    className: "border border-black/10 bg-[#FAF5FF] text-[#030213]",
    iconClassName: "bg-[rgba(166,80,177,0.14)]",
    numberClassName: "text-[rgba(166,80,177,0.08)]",
    descriptionClassName: "text-[#717182]",
  },
];

const ROTATING_CHARS = ["t", "R", "s", "1", "2", "9", "P", "o", "s"];
const MotionLink = motion(Link);

function getCardEntrance(direction, isInView, prefersReducedMotion, delay = 0) {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1, x: 0 },
    };
  }
  return {
    initial: { opacity: 0, x: direction === "right" ? "42vw" : "-42vw" },
    animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === "right" ? "42vw" : "-42vw" },
    transition: {
      type: "spring",
      stiffness: 78,
      damping: 18,
      mass: 0.8,
      delay,
    },
  };
}

function CategoryCard({ item, direction, isInView, prefersReducedMotion, motionLocked, delay = 0 }) {
  const Icon = item.icon;
  const entrance = getCardEntrance(direction, isInView, prefersReducedMotion, delay);
  const CardLink = motionLocked || prefersReducedMotion ? Link : MotionLink;
  const motionProps = motionLocked || prefersReducedMotion ? {} : entrance;

  return (
    <CardLink to={item.href} className={`group block h-full ${item.gridClassName || ""}`} {...motionProps}>
      <article
        className={`relative isolate flex h-full min-h-[195px] overflow-hidden rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)] ${
          item.tall ? "flex-col justify-between" : "flex-col justify-end"
        } ${item.className}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-7 top-3 z-0 font-sans text-[104px] font-extrabold leading-none md:text-[120px] ${item.numberClassName}`}
        >
          {item.number}
        </span>

        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-[11px] ${item.iconClassName}`}>
          <Icon size={26} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 mt-6 max-w-[340px]">
          <h3 className="max-w-[180px] text-[16px] font-medium leading-5 text-[#0A0A0A]">
            {item.title}
          </h3>
          <p className={`mt-[5px] max-w-[340px] text-[12px] leading-4 ${item.descriptionClassName}`}>
            {item.description}
          </p>
        </div>
      </article>
    </CardLink>
  );
}

function PostTaskTile({ postTaskHref, isInView, prefersReducedMotion, motionLocked, delay = 0 }) {
  const entrance = getCardEntrance("right", isInView, prefersReducedMotion, delay);
  const CardLink = motionLocked || prefersReducedMotion ? Link : MotionLink;
  const motionProps = motionLocked || prefersReducedMotion ? {} : entrance;

  return (
    <CardLink
      to={postTaskHref}
      className="group block h-full md:col-start-3 md:row-start-2"
      {...motionProps}
    >
      <article className="relative isolate flex h-full min-h-[195px] overflow-hidden rounded-[20px] bg-[#F3F6FA] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
        <span className="relative z-10 inline-flex h-[34px] min-w-[82px] items-center justify-center rounded-full bg-[#419B6D] px-7 text-[16px] font-medium text-white">
          Post
        </span>
        <div aria-hidden="true" className="absolute bottom-[-42px] right-[-4px] h-[180px] w-[220px]">
          {ROTATING_CHARS.map((char, index) => {
            const angle = -104 + index * 15;
            return (
              <span
                key={`${char}-${index}`}
                className="absolute left-1/2 top-1/2 origin-[0_88px] font-sans text-[18px] font-medium text-[#030213]"
                style={{ transform: `rotate(${angle}deg) translateY(-88px)` }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </article>
    </CardLink>
  );
}

export default function HomeTaskCategoriesShowcase({
  browseHref = "/tasks",
  postTaskHref = "/provider/post-task-manual",
  className = "",
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [motionLocked, setMotionLocked] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (!hasAnimated || prefersReducedMotion) return undefined;
    const lockTimer = window.setTimeout(() => {
      setMotionLocked(true);
    }, 1600);

    return () => window.clearTimeout(lockTimer);
  }, [hasAnimated, prefersReducedMotion]);

  return (
    <section ref={sectionRef} className={`mx-auto w-full max-w-[1116px] px-4 py-14 sm:px-6 lg:px-0 ${className}`}>
      <div className="mb-12 flex flex-col gap-6 md:h-[124px] md:flex-row md:items-end md:justify-between md:gap-4">
        <h2
          className="w-full max-w-[327px] text-[48px] font-normal leading-[1.05] text-[#1D1B20] md:text-[58.32px] md:leading-[61px]"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Any task,
          <span className="block font-bold italic text-[#419B6D]">any category</span>
        </h2>
        <p className="w-full max-w-[404px] pb-1 text-[22px] font-normal leading-[24px] text-[rgba(17,17,17,0.45)] md:text-[24px]">
          From everyday household chores to specialized professional work - post anything
          and find the right executor.
        </p>
      </div>

      <div className="grid gap-[10px] sm:grid-cols-2 md:grid-cols-[repeat(4,minmax(0,1fr))] md:grid-rows-[195px_195px]">
        <CategoryCard item={CATEGORY_ITEMS[0]} direction="right" isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0} />
        <CategoryCard item={CATEGORY_ITEMS[1]} direction="right" isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0.04} />
        <CategoryCard item={CATEGORY_ITEMS[2]} direction="left" isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0.08} />
        <CategoryCard item={CATEGORY_ITEMS[3]} direction="left" isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0.12} />
        <CategoryCard item={CATEGORY_ITEMS[4]} direction="left" isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0.16} />
        <PostTaskTile postTaskHref={postTaskHref} isInView={hasAnimated} prefersReducedMotion={prefersReducedMotion} motionLocked={motionLocked} delay={0.2} />
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to={browseHref}
          className="inline-flex min-h-[52px] items-center justify-center gap-4 rounded-full bg-[#419B6D] px-9 text-[15px] font-medium tracking-wide text-white transition hover:bg-[#348459] focus:outline-none focus:ring-4 focus:ring-[#419B6D]/20"
        >
          Browse all categories
          <ArrowRight size={20} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
