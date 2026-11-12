import React from "react";
import { BriefcaseBusiness, Code2, Palette, PenTool, Smartphone, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const rows = [
  ["Software Engineer", "Recruitment Administrator", "Employer Branding Associate", "Senior Android Developer", "UI/UX Designer"],
  ["Backend Engineer", "DevOps Engineer", "Frontend Engineer", "Content Writer", "Senior Accountant"],
  ["Brand Strategist", "Creative Producer", "Product Manager", "Category Manager", "Business Analyst"],
];

const icons = [Code2, Users, BriefcaseBusiness, Smartphone, PenTool, Palette];

export default function HomeTalentCategoryMarquee() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-0 lg:py-[72px]">
      <div className="relative mx-auto h-[370px] w-full max-w-[1240px] overflow-hidden rounded-[24px] bg-[#05151C] px-5 py-10 sm:px-10 lg:h-[459px] lg:px-16 lg:py-12">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center gap-1 text-center">
          <h2 className="font-['Montserrat',Poppins, sans-serif] text-[28px] font-medium leading-[120%] text-white sm:text-[34px] lg:text-[38px]">
            Millions of Job Categories
          </h2>
          <p className="font-['Montserrat',Poppins, sans-serif] text-[28px] font-medium italic leading-[120%] text-[#108A4E] sm:text-[34px] lg:text-[38px]">
            are Waiting for You!
          </p>
        </div>

        <div className="absolute left-1/2 top-[174px] flex w-[1080px] -translate-x-1/2 flex-col gap-4 lg:top-[212px] lg:w-[1500px]">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex h-[42px] w-max gap-3 whitespace-nowrap"
              aria-hidden="true"
              initial={{ x: rowIndex === 1 ? "-33.333%" : 0 }}
              animate={prefersReducedMotion ? undefined : { x: rowIndex === 1 ? 0 : "-33.333%" }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: [27, 33, 29][rowIndex],
                      ease: "linear",
                      repeat: Infinity,
                    }
              }
            >
              {[...row, ...row, ...row].map((label, index) => {
                const Icon = icons[(index + rowIndex) % icons.length];
                const active = (index + rowIndex * 2) % 6 === 1;

                return (
                  <div
                    key={`${rowIndex}-${index}-${label}`}
                    className={`flex h-[42px] shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-medium ${
                      active
                        ? "border-[#108A4E] bg-[#108A4E]/10 text-[#108A4E]"
                        : "border-white/15 bg-white/[0.02] text-white"
                    }`}
                  >
                    <Icon size={15} strokeWidth={2.2} className={active ? "text-[#108A4E]" : "text-[#9EABB3]"} />
                    {label}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
