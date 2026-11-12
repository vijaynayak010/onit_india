import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import avatarSiddhu from "../../assets/home/testimonials/avatar-mayank.png";
import avatarAnu from "../../assets/home/testimonials/avatar-ramesh.png";
import avatarPriyanka from "../../assets/home/testimonials/avatar-dinesh.png";
import avatarNicolas from "../../assets/home/avatars/nicolas-horn.jpg";
import avatarJoel from "../../assets/home/avatars/joel-mott.jpg";
import avatarEvan from "../../assets/home/avatars/evan-clay.jpg";
import avatarDiego from "../../assets/home/avatars/diego-hernandez.jpg";
import avatarAlex from "../../assets/home/avatars/alex-suprun.jpg";
import avatarAbdul from "../../assets/home/avatars/abdul-quiyum.jpg";

const taskerAvatars = [avatarNicolas, avatarJoel, avatarEvan, avatarDiego, avatarAlex, avatarAbdul];

const portraitForPerformer = (initials = "") => {
  const portraitIndex = [...String(initials)].reduce((total, character) => total + character.charCodeAt(0), 0);
  return taskerAvatars[portraitIndex % taskerAvatars.length];
};

const ANALYSIS_STEPS = [
  "Analyzing your request...",
  "Thinking through the details...",
  "Structuring the task...",
  "Formatting your brief...",
  "Finding the right performers...",
];

const performerProfiles = {
  AK: { name: "Siddhu Reddy", avatar: avatarSiddhu },
  RD: { name: "Anu Reddy", avatar: avatarAnu },
  NS: { name: "Priyanka", avatar: avatarPriyanka },
  VS: { name: "Vikram Shah", avatar: avatarSiddhu },
  PM: { name: "Pooja Mehta", avatar: avatarAnu },
  SJ: { name: "Sanjay Jain", avatar: avatarPriyanka },
  AR: { name: "Aarav Rao", avatar: avatarSiddhu },
  KM: { name: "Kavya Menon", avatar: avatarAnu },
  RV: { name: "Riya Verma", avatar: avatarPriyanka },
  DV: { name: "Dev Verma", avatar: avatarSiddhu },
  HP: { name: "Harsh Patel", avatar: avatarAnu },
  MS: { name: "Meera Singh", avatar: avatarPriyanka },
  NT: { name: "Nisha Thomas", avatar: avatarSiddhu },
  SA: { name: "Sana Ali", avatar: avatarAnu },
  PK: { name: "Pranav Kumar", avatar: avatarPriyanka },
  RG: { name: "Rohan Gupta", avatar: avatarSiddhu },
  VN: { name: "Vidya Nair", avatar: avatarAnu },
  IR: { name: "Ishita Roy", avatar: avatarSiddhu },
  TJ: { name: "Tarun Joshi", avatar: avatarPriyanka },
  YS: { name: "Yash Sinha", avatar: avatarSiddhu },
  KR: { name: "Kiran Rao", avatar: avatarAnu },
  AD: { name: "Aditi Das", avatar: avatarPriyanka },
  SM: { name: "Sahil Malhotra", avatar: avatarSiddhu },
  VR: { name: "Vaishnavi Rao", avatar: avatarAnu },
  PC: { name: "Parth Chawla", avatar: avatarPriyanka },
  AM: { name: "Aman Mehra", avatar: avatarSiddhu },
  RS: { name: "Rhea Sharma", avatar: avatarAnu },
  DK: { name: "Deepak Kumar", avatar: avatarPriyanka },
};

const workflowScenarios = [
  { request: "I need someone to redesign my startup's brand identity by next week...", title: "Brand Identity Redesign", budget: "₹10,000", duration: "5 Days", tags: ["Figma", "Branding"], performers: [{ initials: "AK", match: 95 }, { initials: "RD", match: 92 }, { initials: "NS", match: 88 }] },
  { request: "I need a responsive website for my consulting business...", title: "Business Website Build", budget: "₹18,000", duration: "10 Days", tags: ["React", "Responsive"], performers: [{ initials: "VS", match: 96 }, { initials: "PM", match: 91 }, { initials: "SJ", match: 87 }] },
  { request: "I need a memorable logo and starter brand kit for my cafe...", title: "Logo & Brand Kit", budget: "₹6,500", duration: "4 Days", tags: ["Logo Design", "Illustrator"], performers: [{ initials: "AR", match: 97 }, { initials: "KM", match: 93 }, { initials: "RV", match: 89 }] },
  { request: "I need backend APIs for a new booking and payments product...", title: "Backend API Development", budget: "₹25,000", duration: "14 Days", tags: ["Node.js", "PostgreSQL"], performers: [{ initials: "DV", match: 96 }, { initials: "HP", match: 92 }, { initials: "MS", match: 90 }] },
  { request: "I need social creatives for our upcoming product launch...", title: "Social Media Creative Pack", budget: "₹8,000", duration: "6 Days", tags: ["Social Media", "Canva"], performers: [{ initials: "NT", match: 94 }, { initials: "SA", match: 91 }, { initials: "PK", match: 86 }] },
  { request: "I need a Shopify store set up with payments and product pages...", title: "Shopify Store Setup", budget: "₹15,000", duration: "8 Days", tags: ["Shopify", "E-commerce"], performers: [{ initials: "RG", match: 97 }, { initials: "AK", match: 93 }, { initials: "VN", match: 88 }] },
  { request: "I need a clean pitch deck for investor conversations next month...", title: "Investor Pitch Deck", budget: "₹12,000", duration: "7 Days", tags: ["Presentation", "Pitch Deck"], performers: [{ initials: "IR", match: 95 }, { initials: "MS", match: 90 }, { initials: "TJ", match: 87 }] },
  { request: "I need short-form videos edited for our weekly content plan...", title: "Short-Form Video Editing", budget: "₹9,000", duration: "5 Days", tags: ["Reels", "Premiere Pro"], performers: [{ initials: "YS", match: 96 }, { initials: "KR", match: 92 }, { initials: "AD", match: 89 }] },
  { request: "I need keyword research and SEO content for my SaaS website...", title: "SEO Content Strategy", budget: "₹11,000", duration: "9 Days", tags: ["SEO", "Copywriting"], performers: [{ initials: "SM", match: 95 }, { initials: "VR", match: 91 }, { initials: "PC", match: 88 }] },
  { request: "I need help fixing bugs and improving my mobile app performance...", title: "Mobile App Bug Fixes", budget: "₹7,500", duration: "4 Days", tags: ["React Native", "Debugging"], performers: [{ initials: "AM", match: 96 }, { initials: "RS", match: 93 }, { initials: "DK", match: 90 }] },
];

function TypewriterText({ text, delay = 350, onComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const [visibleText, setVisibleText] = useState(prefersReducedMotion ? text : "");
  const completedRef = useRef(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleText(text);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return undefined;
    }
    if (completedRef.current) return undefined;
    if (!isInView) return undefined;

    let index = 0;
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));
        if (index >= text.length) {
          completedRef.current = true;
          onComplete?.();
          window.clearInterval(intervalId);
        }
      }, 28);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [delay, isInView, onComplete, prefersReducedMotion, text]);

  return (
    <p
      ref={ref}
      className="min-h-[22px] w-full text-[16px] font-medium leading-[140%] text-white"
    >
      {visibleText}
      {!prefersReducedMotion && visibleText.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 animate-pulse bg-white" />
      )}
    </p>
  );
}

function TerminalDots() {
  return (
    <div className="flex h-2 items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
      <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
      <span className="h-2 w-2 rounded-full bg-[#009966]" />
    </div>
  );
}

function TerminalPrompt() {
  return (
    <div className="flex items-start gap-2 font-['IBM_Plex_Mono',monospace] text-[14px] font-semibold leading-[18px]">
      <span className="text-[#8F9088]">$</span>
      <span className="text-white">new_task --describe</span>
    </div>
  );
}

function PerformerMatchRow({ performer, delay, prefersReducedMotion }) {
  const profile = performerProfiles[performer.initials] || {
    name: "Verified performer",
    avatar: avatarSiddhu,
  };

  return (
    <div className="grid w-full grid-cols-[150px_1fr_36px] items-center gap-0">
      <div className="flex min-w-0 items-center gap-2">
        <img src={portraitForPerformer(performer.initials)} alt="" className="h-8 w-8 shrink-0 rounded-full border border-white/20 object-cover" />
        <span className="truncate font-['IBM_Plex_Mono',monospace] text-[13px] font-medium leading-[17px] text-white">
          {profile.name}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#22221F]">
        <motion.div
          className="h-full rounded-full bg-[#009966]"
          initial={prefersReducedMotion ? false : { width: 0 }}
          whileInView={{ width: `${performer.match}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut", delay }}
        />
      </div>
      <span className="text-right font-['IBM_Plex_Mono',monospace] text-[12px] font-semibold leading-4 text-[#8F9088]">
        {performer.match}%
      </span>
    </div>
  );
}

function OutputCard({ prefersReducedMotion, scenario, onComplete }) {
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete?.();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => onComplete?.(), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [onComplete, prefersReducedMotion]);

  const reveal = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, ease: "easeOut", delay },
  });

  return (
    <motion.div
      className="flex w-full flex-col items-start gap-6 rounded-2xl border border-[#272724] bg-[#151513] p-7 lg:h-[351px]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.4 }}
    >
      <motion.h3 className="text-[20px] font-medium leading-6 text-white" {...reveal(0.12)}>
        {scenario.title}
      </motion.h3>

      <motion.div className="flex w-full items-start justify-between gap-5" {...reveal(0.34)}>
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-[10px] font-bold uppercase leading-3 text-[#8F9088]">Est. Budget</span>
          <span className="text-[18px] font-medium leading-[22px] text-[#009966]">{scenario.budget}</span>
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-[10px] font-bold uppercase leading-3 text-[#8F9088]">Duration</span>
          <span className="text-[18px] font-medium leading-[22px] text-[#009966]">{scenario.duration}</span>
        </div>
      </motion.div>

      <motion.div className="flex flex-wrap gap-2" {...reveal(0.56)}>
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#272724] bg-[#1E1E1C] px-3 py-1.5 text-[12px] font-medium leading-[15px] text-[#8F9088]"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      <motion.div className="flex w-full flex-col items-start gap-4" {...reveal(0.78)}>
        <span className="text-[10px] font-bold uppercase leading-3 text-[#8F9088]">Matched Performers</span>
        <div className="flex w-full flex-col gap-4">
          {scenario.performers.map((performer, index) => (
            <PerformerMatchRow
              key={performer.initials}
              performer={performer}
              delay={1.25 + index * 0.12}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function WorkflowTerminal({ onStageChange }) {
  const prefersReducedMotion = useReducedMotion();
  const [scenario] = useState(
    () => workflowScenarios[Math.floor(Math.random() * workflowScenarios.length)],
  );
  const [typingComplete, setTypingComplete] = useState(Boolean(prefersReducedMotion));
  const [analysisComplete, setAnalysisComplete] = useState(Boolean(prefersReducedMotion));
  const [analysisStep, setAnalysisStep] = useState(0);
  const handleTypingComplete = useCallback(() => {
    setTypingComplete(true);
    onStageChange?.(1);
  }, [onStageChange]);
  const handleOutputComplete = useCallback(() => {
    onStageChange?.(3);
  }, [onStageChange]);

  useEffect(() => {
    if (!typingComplete) return undefined;
    if (prefersReducedMotion) {
      setAnalysisComplete(true);
      onStageChange?.(2);
      return undefined;
    }

    const stepTimers = ANALYSIS_STEPS.slice(1).map((_, index) => window.setTimeout(() => {
      setAnalysisStep(index + 1);
    }, (index + 1) * 720));
    const timeoutId = window.setTimeout(() => {
      setAnalysisComplete(true);
      onStageChange?.(2);
    }, 3800);

    return () => {
      stepTimers.forEach(window.clearTimeout);
      window.clearTimeout(timeoutId);
    };
  }, [onStageChange, prefersReducedMotion, typingComplete]);

  useEffect(() => {
    if (prefersReducedMotion) onStageChange?.(3);
  }, [onStageChange, prefersReducedMotion]);
  const reveal = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.42, ease: "easeOut", delay },
  });

  return (
    <motion.div
      className="flex w-full max-w-[680px] flex-col items-start gap-6 rounded-[24px] border border-[#272724] bg-[#0B0B0A] p-6 sm:p-8 lg:h-[576px]"
      initial={prefersReducedMotion ? false : { opacity: 0, x: 34 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <TerminalDots />

      <div className="flex w-full flex-col items-start gap-4">
        <TerminalPrompt />

      <motion.div className="w-full" {...reveal(0.35)}>
        <TypewriterText text={scenario.request} onComplete={handleTypingComplete} />
      </motion.div>

        <div className="h-px w-full bg-[#1D1D1C]" />

        {typingComplete && !analysisComplete && (
          <motion.div className="flex w-full flex-col gap-3" {...reveal(0.1)}>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#009966]" />
              <motion.span
                key={ANALYSIS_STEPS[analysisStep]}
                className="font-['IBM_Plex_Mono',monospace] text-[13px] font-medium leading-[17px] text-[#009966]"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {ANALYSIS_STEPS[analysisStep]}
              </motion.span>
            </div>
            {!analysisComplete && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#1D2A25]">
                <motion.div
                  className="h-full rounded-full bg-[#009966]"
                  initial={prefersReducedMotion ? false : { width: "4%" }}
                  animate={{ width: `${Math.min(100, ((analysisStep + 1) / ANALYSIS_STEPS.length) * 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {analysisComplete && (
        <OutputCard
          prefersReducedMotion={prefersReducedMotion}
          scenario={scenario}
          onComplete={handleOutputComplete}
        />
      )}
    </motion.div>
  );
}

export default function HomePlainEnglishSection({ className = "" }) {
  const [workflowStage, setWorkflowStage] = useState(0);
  const headlineLines = ["Describe your", "work in plain", "English."];

  return (
    <section className={`bg-[#0F100D] ${className}`}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-0 sm:px-6 lg:min-h-[768px] lg:grid-cols-[480px_680px] lg:gap-10 lg:px-[82px] lg:pb-8 lg:pt-0">
        <div className="flex w-full max-w-[480px] flex-col items-start gap-7">
          <div className="flex w-full flex-col items-start gap-3">
            <span className="rounded-full bg-[#272724] px-4 py-2 text-[11px] font-bold uppercase leading-[13px] text-white">
              How It Works
            </span>
            <div className="h-1 w-full bg-[#272724]" />
          </div>

          <h2 className="text-[42px] font-medium leading-[1.08] sm:text-[56px]">
            {headlineLines.map((line, index) => (
              <motion.span
                key={line}
                className="block"
                animate={{ color: workflowStage >= index + 1 ? "#FFFFFF" : "#73736F" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {line}
              </motion.span>
            ))}
          </h2>

          <p className="text-[16px] font-normal leading-[160%] text-[#8F9088]">
            Our AI converts your idea into a complete task - with pricing, timeline, skills,
            and requirements - ready to post in seconds.
          </p>

        </div>

        <WorkflowTerminal onStageChange={setWorkflowStage} />
      </div>
    </section>
  );
}
