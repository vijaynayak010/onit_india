import { motion } from "framer-motion";

function AnimatedNumber({ to = 50, duration = 2, size = "text-4xl sm:text-5xl md:text-6xl" }) {
  return (
    <motion.span
      initial={{ number: 0 }}
      animate={{ number: to }}
      transition={{ duration, ease: "easeOut" }}
      style={{ display: "inline-block" }}
    >
      {({ number }) =>
        <span className={size + " font-extrabold text-green-600"}>
          {Math.floor(number)}+
        </span>
      }
    </motion.span>
  );
}

export default AnimatedNumber;
