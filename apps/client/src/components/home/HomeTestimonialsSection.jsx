import React, { useEffect, useState } from "react";
import { MessageSquare } from "react-feather";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const testimonials = [
  {
    id: "customer-posting",
    quote:
      "Posting a task felt as simple as describing it out loud. FirstDoer structured everything and matched us with the right performer within the day.",
    author: "FirstDoer Customer",
  },
  {
    id: "performer-pricing",
    quote: "The task breakdown saved us hours of back-and-forth on scope and pricing.",
    author: "FirstDoer Performer",
  },
  {
    id: "customer-execution",
    quote: "Finding execution support for smaller jobs used to be the hardest part - not anymore.",
    author: "FirstDoer Customer",
  },
];

export default function HomeTestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const featured = testimonials[activeIndex];
  const supportingTestimonials = [1, 2].map((offset) => {
    const originalIndex = (activeIndex + offset) % testimonials.length;

    return {
      testimonial: testimonials[originalIndex],
      originalIndex,
    };
  });
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.78, ease: [0.22, 1, 0.36, 1] };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#111210] px-5 py-16 text-white sm:px-8 lg:px-[104px] lg:py-[110px]">
      <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-10 lg:gap-14">
        <h2 className="font-['Outfit',Inter,sans-serif] text-[36px] font-bold leading-[125%] text-white sm:text-[42px] lg:text-[48px] lg:leading-[60px]">
          What people say about us.
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,680px)_400px] lg:gap-24">
          <div className="flex min-w-0 flex-col items-start gap-6">
            <MessageSquare aria-hidden="true" className="h-9 w-9 text-[#009966]" strokeWidth={2} />
            <div className="relative min-h-[260px] w-full lg:min-h-[220px]">
              <AnimatePresence initial={false} mode="sync">
                <motion.article
                  key={featured.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 88, y: -54, scale: 0.86 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={transition}
                  className="absolute inset-x-0 top-0 w-full"
                >
                  <p className="font-['Outfit',Inter,sans-serif] text-[29px] font-semibold leading-[1.27] text-white sm:text-[32px] lg:text-[34px] lg:leading-[43px]">
                    {featured.quote}
                  </p>
                  <p className="mt-6 font-['DM_Sans',Inter,sans-serif] text-[14px] font-medium leading-[18px] text-[#8E908A]">
                    - {featured.author}
                  </p>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <div className="border-l border-[#262723] pl-6 lg:pl-8">
            {supportingTestimonials.map(({ testimonial, originalIndex }, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  onClick={() => setActiveIndex(originalIndex)}
                  className={`block w-full text-left transition-opacity duration-200 hover:opacity-80 ${
                    index === 0 ? "pb-10" : "border-t border-[#262723] pt-10"
                  }`}
                >
                  <p className="font-['DM_Sans',Inter,sans-serif] text-[15px] font-normal leading-5 text-[#8E908A]">
                    {testimonial.quote}
                  </p>
                  <p className="mt-3 font-['DM_Sans',Inter,sans-serif] text-[12px] font-medium leading-4 text-[#8E908A]/70">
                    - {testimonial.author}
                  </p>
                </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
