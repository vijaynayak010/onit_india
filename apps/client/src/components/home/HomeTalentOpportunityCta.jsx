import React from "react";
import { useNavigate } from "react-router-dom";

const opportunities = [
  {
    eyebrow: "Hire talent",
    kicker: "For business",
    title: "Hire Talent",
    description: "Get the work done",
    action: "Post a Task",
    role: "PROVIDER",
    cardClass: "border-white/[0.15] bg-black text-white",
    mutedClass: "text-white/[0.7]",
    actionClass: "bg-[#009966] text-[#181816] hover:bg-[#00ad74]",
  },
  {
    eyebrow: "Become a performer",
    kicker: "For executors",
    title: "Become a Performer",
    description: "Find work. Execute. Earn.",
    action: "Start Working",
    role: "TASKER",
    cardClass: "border-transparent bg-[#F1F5F9] text-black",
    mutedClass: "text-black/[0.7]",
    actionClass: "bg-[#181816] text-white hover:bg-black",
  },
];

export default function HomeTalentOpportunityCta() {
  const navigate = useNavigate();

  const handleAction = (role) => {
    navigate("/auth", { state: { tab: "signup", role } });
  };

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-0 lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1240px]">
        <h2 className="max-w-[620px] font-['Manrope',Inter,sans-serif] text-[46px] font-bold leading-[1.08] text-[#090909] sm:text-[56px] lg:text-[72px]">
          One platform
          <br />
          for everyone.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
          {opportunities.map((opportunity) => (
            <article
              key={opportunity.role}
              className={`flex min-h-[251px] flex-col items-start justify-between rounded-[28px] border p-8 sm:p-9 ${opportunity.cardClass}`}
            >
              <div className="flex items-center gap-2 font-['Manrope',Inter,sans-serif] text-[14px] font-medium leading-[19px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#009966]" aria-hidden="true" />
                {opportunity.eyebrow}
              </div>

              <div className="flex flex-col items-start gap-6">
                <div className="flex flex-col items-start gap-3">
                  <p className={`font-['Manrope',Inter,sans-serif] text-[12px] font-bold uppercase leading-4 ${opportunity.mutedClass}`}>
                    {opportunity.kicker}
                  </p>
                  <div className="flex flex-col items-start gap-1.5">
                    <h3 className="font-['Manrope',Inter,sans-serif] text-[30px] font-bold leading-[120%] sm:text-[32px]">
                      {opportunity.title}
                    </h3>
                    <p className={`font-['Manrope',Inter,sans-serif] text-[15px] font-normal leading-[140%] ${opportunity.mutedClass}`}>
                      {opportunity.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(opportunity.role)}
                  className={`flex h-[43px] items-center justify-center rounded-full px-6 font-['Manrope',Inter,sans-serif] text-[14px] font-bold leading-[19px] transition-colors ${opportunity.actionClass}`}
                >
                  {opportunity.action}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
