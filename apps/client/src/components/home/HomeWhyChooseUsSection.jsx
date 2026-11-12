import React from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import avatarAnanya from "../../assets/home/testimonials/avatar-mayank.png";
import avatarRohit from "../../assets/home/testimonials/avatar-ramesh.png";
import avatarPriya from "../../assets/home/testimonials/avatar-dinesh.png";

const talents = [
  { name: "Ananya", role: "Web Design", avatar: avatarAnanya, bg: "#FFAA00" },
  { name: "Rohit", role: "Web Design", avatar: avatarRohit, bg: "#009E9D" },
  { name: "Priya", role: "UI/UX", avatar: avatarPriya, bg: "#0091D0" },
];

const benefits = [
  "Verified Performers",
  "Secured payments",
  "Easy Task Management",
  "Direct Communication",
];

function TalentRow({ talent }) {
  return (
    <div className="flex items-center gap-[17px]">
      <div
        className="h-[50px] w-[50px] overflow-hidden rounded-full"
        style={{ backgroundColor: talent.bg }}
      >
        <img src={talent.avatar} alt="" className="h-full w-full object-cover grayscale" />
      </div>
      <div>
        <p className="font-sans text-[18px] font-medium leading-[25px] text-[#111235]">
          {talent.name}
        </p>
        <p className="font-sans text-[12px] font-semibold leading-4 text-[#6C6C6C]">
          {talent.role}
        </p>
      </div>
    </div>
  );
}

function VerifiedTalentCards() {
  return (
    <div className="relative h-[499px] w-[586px] max-w-full max-md:h-[520px] max-md:w-full">
      <div className="absolute left-[-52px] top-[-10px] h-[500px] w-[430px] rounded-[40px] bg-black/[0.03] blur-[70px] max-md:left-[-20px]" />
      <div className="absolute left-[170px] top-[132px] h-[330px] w-[410px] rounded-[36px] bg-black/[0.035] blur-[60px] max-md:left-[40px]" />

      <div className="absolute left-0 top-[47px] h-[388px] w-[342px] rounded-[22px] border border-[#DFDFDF] bg-white shadow-[0_64px_194px_rgba(0,0,0,0.10)] max-md:left-0 max-md:w-[calc(100%-28px)]">
        <h3 className="absolute left-[34px] top-[30px] font-sans text-[24px] font-medium leading-[33px] text-[#111235]">
          10K+ Verified Talents
        </h3>

        <div className="absolute left-[34px] top-[97px] flex flex-col gap-6">
          {talents.map((talent) => (
            <TalentRow key={talent.name} talent={talent} />
          ))}
        </div>

        <button
          type="button"
          className="absolute bottom-[27px] left-[34px] flex items-center gap-1 font-['Poppins'] text-[18px] font-medium leading-[27px] text-[#FF6160]"
        >
          <span>Explore Performers</span>
          <ArrowRight size={17} strokeWidth={1.6} />
        </button>
      </div>

      <div className="absolute left-[302px] top-[7px] z-30 flex h-20 w-20 items-center justify-center rounded-full bg-[#009966] max-md:left-[calc(100%-96px)]">
        <ShieldCheck size={44} fill="white" className="text-[#009966]" strokeWidth={2.4} />
      </div>

      <div className="absolute left-[216px] top-[204px] z-20 flex h-[302px] w-[370px] flex-col items-center rounded-[22px] border border-[#DFDFDF] bg-white px-8 pt-[26px] shadow-[0_64px_194px_rgba(0,0,0,0.10)] max-md:left-[14px] max-md:top-[246px] max-md:w-[calc(100%-28px)]">
        <div className="h-[100px] w-[100px] overflow-hidden rounded-full bg-[#FF7900]">
          <img src={avatarPriya} alt="" className="h-full w-full object-cover grayscale" />
        </div>
        <h3 className="mt-[22px] font-sans text-[20px] font-medium leading-[27px] text-[#111235]">
          AR Shakir
        </h3>
        <p className="mt-2 font-sans text-[14px] font-medium leading-[19px] text-[#6C6C6C]">
          Mentor of Web Development
        </p>
        <button
          type="button"
          className="mt-[33px] h-[42px] w-[166px] rounded-full bg-[#009966] font-['Poppins'] text-[16px] font-medium leading-6 text-white"
        >
          CONTACT
        </button>
      </div>
    </div>
  );
}

function BenefitItem({ label }) {
  return (
    <li className="flex items-center gap-[11px] font-sans text-[19px] font-medium leading-[30px] tracking-[-0.02em] text-[#5E6282]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#009966]">
        <Check size={15} className="text-white" strokeWidth={3} />
      </span>
      {label}
    </li>
  );
}

export default function HomeWhyChooseUsSection() {
  return (
    <section className="bg-white px-6 py-20 max-md:px-4 max-md:py-14">
      <div className="mx-auto grid w-full max-w-[1152px] grid-cols-[586px_490px] items-center gap-[76px] max-lg:grid-cols-1 max-lg:gap-12">
        <VerifiedTalentCards />

        <div className="flex w-full max-w-[490px] flex-col items-start gap-[26px] max-lg:max-w-none">
          <div className="flex flex-col gap-[3px]">
            <p className="font-['Inter'] text-[24px] font-normal uppercase leading-[29px] text-[#3734A9]">
              Why Choose Us
            </p>
            <h2 className="font-sans text-[50px] font-medium leading-[60px] tracking-[-0.03em] text-black max-md:text-[38px] max-md:leading-[46px]">
              Thirty for remove plenty regard you summer though.
            </h2>
          </div>

          <p className="max-w-[446px] font-sans text-[18px] font-medium leading-[30px] tracking-[-0.02em] text-[#5E6282]">
            The its enable direct men depend highly. Ham windows sixteen who inquiry fortune demands.
          </p>

          <div className="h-px w-full bg-[#E6E6E6]" />

          <ul className="flex flex-col gap-[13px]">
            {benefits.map((benefit) => (
              <BenefitItem key={benefit} label={benefit} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
