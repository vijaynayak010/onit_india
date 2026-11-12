import React from "react";
import { motion } from "framer-motion";

const BANNER_TEXT =
  "firstDoer — Post marketing, design or development work in seconds  ·  Pay only when it’s done  ·  Verified performers only";

function ScrollingInfo() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[10000] h-10 w-full bg-[#10605F] text-white overflow-hidden border-b border-[#29ADAC]/30"
      role="marquee"
      aria-live="polite"
    >
      <motion.div
        className="flex whitespace-nowrap h-full items-center will-change-transform"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          ease: "linear",
          repeat: Infinity,
          duration: 35,
        }}
      >
        <span className="inline-flex items-center text-sm font-medium tracking-wide pl-8 pr-16 py-2.5">
          {BANNER_TEXT}
        </span>
        <span className="inline-flex items-center text-sm font-medium tracking-wide pl-8 pr-16 py-2.5">
          {BANNER_TEXT}
        </span>
      </motion.div>
    </div>
  );
}

export default ScrollingInfo;
