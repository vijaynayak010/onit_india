import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing";

const differenceCards = [
  {
    title: "Simple Task Posting",
    description: "Tell us what you need. Set your budget and deadline. Post your task in minutes.",
    image: `${CDN}/difference/simple-task-posting-v2.png`,
    imageWebp: `${CDN}/difference/simple-task-posting-v2.webp`,
    imageClassName: "h-[270px] -translate-y-5",
  },
  {
    title: "Skilled Professionals",
    description: "Discover the right performer for you. Explore profiles, skills, and ratings. Choose the best match for your task.",
    image: `${CDN}/difference/skilled-professionals-v2.png`,
    imageWebp: `${CDN}/difference/skilled-professionals-v2.webp`,
    imageClassName: "h-[224px] translate-y-4",
  },
  {
    title: "Transparent Process",
    description: "Stay in control from start to finish. Track progress, chat, and review the work. Get your task completed with ease.",
    image: `${CDN}/difference/transparent-process-v2.png`,
    imageWebp: `${CDN}/difference/transparent-process-v2.webp`,
    imageClassName: "h-[230px] translate-y-2",
  },
];

function useLargeScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsLargeScreen(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isLargeScreen;
}

export default function HomeOnitDifferenceSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isLargeScreen = useLargeScreen();
  const [revealedCards, setRevealedCards] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.22], [112, 0]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isLargeScreen || prefersReducedMotion) return;
    const nextCardCount = progress >= 0.76 ? 3 : progress >= 0.56 ? 2 : progress >= 0.36 ? 1 : 0;
    setRevealedCards((current) => (current === nextCardCount ? current : nextCardCount));
  });

  const titleStyle = isLargeScreen && !prefersReducedMotion
    ? { y: headingY }
    : undefined;

  return (
    <section ref={sectionRef} className="relative bg-white text-black xl:h-[250vh]">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-5 py-16 sm:px-6 xl:sticky xl:top-0 xl:h-screen xl:max-w-none xl:overflow-hidden xl:px-6 xl:py-0 2xl:px-[82px]">
        <motion.header
          className="relative z-10 flex w-full max-w-[640px] flex-col items-start xl:absolute xl:left-6 xl:top-[64px] 2xl:left-[82px]"
          style={titleStyle}
        >
          <h2 className="shrink-0 font-['Montserrat',Poppins, sans-serif] text-[40px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[54px] xl:text-[64px]">
            What Makes On<span className="text-[#009966]">IT</span>
            <br />
            Different
          </h2>
        </motion.header>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 pb-4 sm:grid-cols-2 xl:absolute xl:left-1/2 xl:bottom-[48px] xl:mt-0 xl:w-[calc(100%_-_3rem)] xl:max-w-[1280px] xl:-translate-x-1/2 xl:grid-cols-3 xl:gap-8 xl:pb-0">
          {differenceCards.map((card, index) => {
            const isVisible = !isLargeScreen || prefersReducedMotion || index < revealedCards;
            return (
              <motion.article
                key={card.title}
                className="flex min-h-[498px] min-w-0 w-full flex-col items-start gap-8 rounded-[32px] border border-white/50 bg-black p-8 shadow-[0_24px_48px_rgba(0,0,0,0.25098)] sm:p-10 xl:p-[54px]"
                initial={false}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  x: 0,
                  y: isVisible ? 0 : 96,
                  scale: isVisible ? 1 : 0.97,
                }}
                transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-white">
                  <picture>
                    <source type="image/webp" srcSet={card.imageWebp} />
                    <img
                      src={card.image}
                      alt={`${card.title} on FirstDoer`}
                      className={`w-[215px] max-w-none object-contain ${card.imageClassName}`}
                      loading="lazy"
                      decoding="async"
                      width="215"
                      height="240"
                    />
                  </picture>
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <h3 className="font-['Poppins', Poppins, sans-serif] text-[24px] font-medium leading-[160%] text-white">
                    {card.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] text-[16px] font-normal leading-6 text-white">
                    {card.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
