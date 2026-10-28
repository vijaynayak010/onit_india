import React from "react";
import { motion } from "framer-motion";

function Marquee() {
  return (
    <div data-scroll data-scroll-section data-scroll-speed=".2" className="w-full py-6  mb-10  bg-[#004D43] overflow-hidden ">
      <div className="flex text-white whitespace-nowrap  border-t-2 border-b-2 border-zinc-300">
        <motion.h1
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            ease: "linear",
            repeat: Infinity,
            duration: 10,
          }}
          className="inline-block text-[13vw] leading-none font['Founders_Grotesk_X-Condensed'] font-bold  px-5 -mb-5 "
        >
          We Are OnIT
        </motion.h1>

        <motion.h1
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            ease: "linear",
            repeat: Infinity,
            duration: 10,
          }}
          className="inline-block text-[13vw] leading-none font-bold font['Founders_Grotesk_X-Condensed'] px-5"
        >
          We Are OnIT
        </motion.h1>
        <motion.h1
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            ease: "linear",
            repeat: Infinity,
            duration: 10,
          }}
          className="inline-block text-[13vw] leading-none font-bold font['Founders_Grotesk_X-Condensed'] px-5"
        >
          We Are OnIT
        </motion.h1>
        <motion.h1
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            ease: "linear",
            repeat: Infinity,
            duration: 10,
          }}
          className="inline-block text-[17vw] leading-none font-bold font['Founders_Grotesk_X-Condensed']  px-5"
        >
          We Are OnIT
        </motion.h1>
      </div>
    </div>
  );
}

export default Marquee;
