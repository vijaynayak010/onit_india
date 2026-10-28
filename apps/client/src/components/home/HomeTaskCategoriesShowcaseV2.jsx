import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    title: "Content & Marketing",
    description: "Post tasks for content creation, social media, copywriting, SEO, branding, campaigns, and digital marketing. Find skilled professionals to bring your ideas to life and grow your brand.",
  },
  {
    title: "Design & Creative",
    description: "Creative tasks for graphic design, UI/UX, branding, illustration, motion graphics, and visual content. Find skilled creatives to turn your ideas into compelling designs and experiences.",
  },
  {
    title: "Build & Develop",
    description: "Tech tasks for web development, app development, software engineering, automation, APIs, and technical solutions. Find skilled developers to build, improve, and scale your digital products.",
  },
];

export default function HomeTaskCategoriesShowcaseV2({ className = "" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className={`bg-white px-6 py-20 sm:px-8 lg:py-24 ${className}`}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-14 lg:gap-16">
        <header className="flex flex-col justify-between gap-7 lg:h-[123px] lg:flex-row lg:items-center">
          <h2 className="w-full max-w-[680px] font-['Inter',sans-serif] text-[42px] font-[800] leading-[105%] text-[#111111] sm:text-[48px] lg:text-[56px]">
            <span className="block">Any task.</span>
            <span className="block text-[#009966]">Any category.</span>
          </h2>
          <p className="w-full max-w-[522px] pt-0 text-left font-['Inter',sans-serif] text-[18px] font-normal leading-[155%] text-[#6E6D68] sm:text-[20px] lg:pt-3 lg:text-right lg:text-[24px]">
            From everyday household chores to specialized professional work – post anything and find the right executor.
          </p>
        </header>

        <div
          className="grid gap-5 md:grid-cols-3 lg:mx-2 lg:flex lg:h-[420px] lg:w-[calc(100%-16px)] lg:gap-6"
          onMouseLeave={() => setActiveIndex(null)}
        >
          {CATEGORIES.map((category, index) => {
            const isActive = activeIndex === index;

            return (
              <Link
                key={category.title}
                to="/auth"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`group relative flex min-h-[320px] overflow-hidden rounded-[30px] bg-black p-7 text-white transition-[flex-basis,flex-grow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] md:min-h-[380px] lg:h-[420px] lg:min-h-0 lg:p-10 ${
                  isActive ? "lg:flex-[0_0_612px]" : "lg:flex-1"
                }`}
              >
                <div className={`relative z-10 flex h-full w-full ${isActive ? "items-start gap-6" : "items-end justify-between gap-4"}`}>
                  <h3 className={`font-['Outfit',Inter,sans-serif] font-semibold leading-[1.25] text-white ${isActive ? "w-[168px] shrink-0 text-[28px] lg:text-[36px]" : "max-w-[180px] text-[28px] lg:text-[36px]"}`}>
                    {category.title}
                  </h3>

                  <p
                    className={`max-w-[371px] font-['Inter',sans-serif] text-[18px] font-normal leading-[1.32] text-white transition-opacity duration-300 lg:text-[26px] ${
                      isActive ? "opacity-100 delay-150" : "pointer-events-none absolute opacity-0"
                    }`}
                  >
                    {category.description}
                  </p>
                </div>

                <span className={`absolute z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white transition-all duration-500 ${isActive ? "right-10 bottom-9 text-[#009966]" : "right-10 bottom-9 text-black"}`}>
                  <ArrowUpRight className={`h-9 w-9 transition-transform duration-300 ${isActive ? "rotate-45" : ""}`} strokeWidth={3} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
