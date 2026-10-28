import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function About() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      data-scroll
      data-scroll-section
      data-scroll-speed=".5"
      className="relative w-full h-screen bg-[#CDEA68] rounded-tr-3xl rounded-tl-3xl py-20 px-6 -mb-35 md:px-20 overflow-hidden"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="font-['Neue Montreal'] text-[4vw] md:text-5xl font-bold mb-6 text-center md:text-left"
      >
        About <span className="text-black">OnIT INDIA</span>
      </motion.h1>

      {/* Intro Text */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[2vw] md:text-xl leading-relaxed text-black text-center md:text-left mb-16"
      >
        OnIT INDIA is a hyperlocal task platform built for real life.
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
            className="text-2xl md:text-3xl font-semibold mb-4"
          >
            Our Approach:
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-base leading-relaxed mb-2"
          >
            From ordering food or groceries to finding a driver or tutor — simply type your need.
          </motion.p>

          {/* Read More */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden mt-2"
              >
                <p className="text-lg md:text-base leading-relaxed mt-2">
                  OnIT INDIA understands it, finds a nearby person ready to help, and gets it done.
                </p>
                <p className="text-sm md:text-base italic text-gray-800 mt-2">
                  “No catalogs. No middlemen. Just real help — powered by people near you.”
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMore(!showMore)}
            className="mt-6 w-max px-6 py-3 border border-black rounded-full uppercase font-medium text-sm bg-transparent hover:bg-black hover:text-white transition-all duration-300"
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
