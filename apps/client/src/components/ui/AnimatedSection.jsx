import React from "react";
import { motion } from "framer-motion";

/**
 * Wraps a section so it animates into view when the user scrolls to it.
 * Use for consistent scroll-to-section UX across the landing page.
 *
 * @param {string} id - Section id (for anchor links)
 * @param {string} [className] - Optional class for the section
 * @param {React.ReactNode} children - Section content
 * @param {"up"|"left"|"right"|"fade"} [variant="up"] - Direction section enters from
 * @param {number} [delay=0] - Delay in seconds before animation starts
 * @param {boolean} [noAnimation=false] - Skip animation (e.g. for hero)
 */
const variants = {
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

const transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

export default function AnimatedSection({
  id,
  className = "",
  children,
  variant = "up",
  delay = 0,
  noAnimation = false,
}) {
  const v = variants[variant] || variants.up;

  if (noAnimation) {
    return (
      <motion.section
        id={id}
        className={className}
        initial={{ opacity: 1 }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "-40px 0px -40px 0px" }}
      variants={v}
      transition={{ ...transition, delay }}
    >
      {children}
    </motion.section>
  );
}
