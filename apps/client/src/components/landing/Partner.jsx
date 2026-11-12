import React from "react";

function OracleLogo() {
  return (
    <div className="font-sans text-[26px] sm:text-[30px] font-semibold leading-none tracking-[-1.5px] text-[#EA1B22]">
      ORACLE
    </div>
  );
}

function MorpheusLogo() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <span className="relative flex h-[26px] w-[26px] sm:h-[28px] sm:w-[28px] items-center justify-center overflow-hidden rounded-full bg-[#3DB5E6]">
        <span className="absolute left-0 top-0 h-full w-1/2 bg-[#D8292F]" />
        <span className="relative h-[12px] w-[14px] rounded-t-full border-[3px] border-white border-b-0" />
      </span>
      <span className="font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[2px] text-[#3DB5E6]">
        MORPHEUS
      </span>
    </div>
  );
}

function SamsungLogo() {
  return (
    <div className="font-sans text-[24px] sm:text-[28px] font-bold uppercase leading-none tracking-[1.2px] text-[#1428A0]">
      SAMSUNG
    </div>
  );
}

function MondayLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-end gap-1">
        <span className="h-[9px] w-[6px] rotate-[32deg] rounded-full bg-[#F62B54]" />
        <span className="h-[9px] w-[6px] rotate-[32deg] rounded-full bg-[#FFCC00]" />
        <span className="h-[6px] w-[6px] rounded-full bg-[#00CA72]" />
      </span>
      <span className="font-sans text-[18px] sm:text-[21px] font-bold leading-none text-[#333333]">monday</span>
      <span className="font-sans text-[12px] sm:text-[13px] font-medium leading-none text-[#333333]">.com</span>
    </div>
  );
}

function SegmentLogo() {
  return (
    <div className="flex items-center gap-2 text-[#4FB58B]">
      <svg className="h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M7 9.5C8.8 6.4 12.1 4.5 15.9 4.5H21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M21 18.5C19.2 21.6 15.9 23.5 12.1 23.5H7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M5 14H18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M10 9.5H23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M5 18.5H18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[24px] sm:text-[28px] font-semibold leading-none tracking-[-1px]">segment</span>
    </div>
  );
}

const logos = [
  { name: "Oracle", component: OracleLogo },
  { name: "Morpheus", component: MorpheusLogo },
  { name: "Samsung", component: SamsungLogo },
  { name: "monday.com", component: MondayLogo },
  { name: "Segment", component: SegmentLogo },
];

export default function Partner() {
  return (
    <section
      className="relative min-h-[280px] w-full overflow-hidden bg-white py-12 sm:py-16"
      aria-labelledby="trusted-companies-heading"
    >
      <div
        className="pointer-events-none absolute left-[-42px] top-[-125px] h-[288px] w-[211px] rounded-[25px] bg-white shadow-[0_100px_80px_rgba(0,0,0,0.03),0_64.815px_46.852px_rgba(0,0,0,0.023),0_38.519px_25.481px_rgba(0,0,0,0.018),0_20px_13px_rgba(0,0,0,0.015),0_8.148px_6.519px_rgba(0,0,0,0.012),0_1.852px_3.148px_rgba(0,0,0,0.007)] [clip-path:polygon(0_0,100%_0,100%_76%,35%_100%,0_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-88px] top-[73px] h-[261px] w-[227px] rounded-[25px] bg-white shadow-[0_100px_80px_rgba(0,0,0,0.03),0_64.815px_46.852px_rgba(0,0,0,0.023),0_38.519px_25.481px_rgba(0,0,0,0.018),0_20px_13px_rgba(0,0,0,0.015),0_8.148px_6.519px_rgba(0,0,0,0.012),0_1.852px_3.148px_rgba(0,0,0,0.007)] [clip-path:polygon(0_0,100%_0,100%_100%,0_73%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-7 px-4 sm:px-6">
        <h2
          id="trusted-companies-heading"
          className="text-center font-sans text-[18px] sm:text-[22px] font-bold leading-[28px] sm:leading-[30px] text-black"
        >
          Trusted By Over 100+ Startups and freelance business
        </h2>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-10 lg:gap-12">
          {logos.map(({ name, component: Logo }) => (
            <div key={name} className="flex min-w-[110px] sm:min-w-[130px] items-center justify-center opacity-85 transition-opacity hover:opacity-100" aria-label={name}>
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
