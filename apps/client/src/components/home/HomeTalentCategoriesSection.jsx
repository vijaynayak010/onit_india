import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import avniImage from "../../assets/team/avni.png";
import kamalaImage from "../../assets/team/kamala.png";
import aviImage from "../../assets/team/avi.jpg";
import ambikImage from "../../assets/team/ambik.png";
import aruImage from "../../assets/team/aru.png";

const performers = [
  { name: "Ananya", role: "Web Design", image: avniImage, match: "96% match" },
  { name: "Kamala", role: "Content Writing", image: kamalaImage, match: "94% match" },
  { name: "Avi", role: "App Development", image: aviImage, match: "92% match" },
  { name: "Ambik", role: "Business Operations", image: ambikImage, match: "90% match" },
  { name: "Aru", role: "Graphic Design", image: aruImage, match: "89% match" },
];

export default function HomeTalentCategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-0 lg:py-[110px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:gap-12">
        <div className="flex min-h-[106px] items-center justify-between gap-6">
          <h2 className="max-w-[580px] font-['Montserrat',Poppins, sans-serif] text-[38px] font-medium leading-[110%] text-[#111111] sm:text-[44px] lg:text-[48px]">
            Find the <span className="text-[#009966]">perfect talent</span>
            <br />
            in minutes.
          </h2>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:thin] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          <div className="flex w-max items-start gap-5">
            {performers.map((performer) => (
              <article
                key={performer.name}
                className="flex h-[339px] w-[240px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[#E5E5E5] bg-white"
              >
                <img
                  src={performer.image}
                  alt={`${performer.name}, ${performer.role} performer on FirstDoer`}
                  className="h-[222px] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  width="240"
                  height="222"
                />
                <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-['Montserrat',Poppins, sans-serif] text-[18px] font-medium leading-[22px] text-[#111111]">
                      {performer.name}
                    </h3>
                    <p className="font-['Inter',sans-serif] text-[13px] font-normal leading-4 text-[#666666]">
                      {performer.role}
                    </p>
                  </div>
                  <div className="border-t border-dashed border-[#E5E5E5]" />
                  <div className="mt-auto flex items-center justify-between gap-3 font-['Inter',sans-serif]">
                    <span className="text-[12px] font-bold leading-[15px] text-[#009966]">{performer.match}</span>
                    <span className="text-[11px] font-normal leading-[13px] text-[#666666]">Available now</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/auth", { state: { tab: "signup" } })}
          className="flex h-16 w-fit items-center justify-center gap-3 rounded-full bg-[#009966] px-8 font-['Inter',sans-serif] text-[16px] font-medium text-white transition-colors hover:bg-[#008055]"
        >
          Explore Performers
          <ArrowRight size={19} strokeWidth={2.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
