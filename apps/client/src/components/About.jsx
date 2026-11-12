import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function About() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      data-scroll
      data-scroll-section
      data-scroll-speed=".5"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#10605F] to-[#0A4241] text-white rounded-tr-3xl rounded-tl-3xl py-20 px-6 -mb-35 md:px-20 overflow-hidden"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium mb-6 text-center md:text-left text-white"
      >
        About <span className="text-[#7EDEDD]">FirstDoer</span>
      </motion.h1>

      {/* Intro Text */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[2vw] md:text-xl leading-relaxed text-[#EFFBFB] text-center md:text-left mb-16"
      >
        FirstDoer is India&apos;s on-demand task execution infrastructure built for real-world speed and accountability.
      </motion.p>

      {/* Left + Right Sections */}
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Left */}
        <div className="md:w-1/2 flex flex-col">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-medium mb-4 text-[#7EDEDD]"
          >
            Our Approach:
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-base leading-relaxed mb-2 text-white/90"
          >
            From field research and store audits to digital verification and skilled tasks — simply describe what needs doing.
          </motion.p>

          {/* Read More */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden mt-2 text-white/80"
              >
                <p className="text-lg md:text-base leading-relaxed mt-2">
                  FirstDoer routes the brief to verified local performers, protects payment in milestone escrow, and delivers structured GPS-verified proof of completion.
                </p>
                <p className="text-sm md:text-base italic text-[#7EDEDD] mt-2">
                  “No delays. No guesswork. Just verified execution — powered by reliable performers across India.”
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMore(!showMore)}
            className="mt-6 w-max px-6 py-3 border border-[#7EDEDD] text-[#7EDEDD] rounded-full uppercase font-medium text-sm bg-transparent hover:bg-[#7EDEDD] hover:text-[#0D1210] transition-all duration-300"
          >
            {showMore ? "Read Less" : "Read More"}
          </motion.button>
        </div>

        {/* Right */}
        <div className="md:w-1/2 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full h-[60vh] md:h-[70vh] rounded-3xl bg-[url('https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-1326x939.jpg')] bg-cover bg-center shadow-xl"
          ></motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;
