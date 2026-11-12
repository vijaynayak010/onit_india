import React from "react";
import { motion } from "framer-motion";
import { Send, Search, MessageCircle, CheckCircle } from "react-feather";

const cards = [
  {
    number: "1",
    title: "Post",
    description: "Quickly post your task or request in just a few taps.",
    icon: <Send className="text-[#1a1a1a] w-5 h-5 sm:w-10 sm:h-10" />,
  },
  {
    number: "2",
    title: "Find",
    description: "Nearby helpers instantly see and accept your request.",
    icon: <Search className="text-[#1a1a1a] w-5 h-5 sm:w-10 sm:h-10" />,
  },
  {
    number: "3",
    title: "Connect",
    description: "Chat, track progress, and stay updated in real time.",
    icon: <MessageCircle className="text-[#1a1a1a] w-5 h-5 sm:w-10 sm:h-10" />,
  },
  {
    number: "4",
    title: "Complete",
    description: "Task done on time with secure payment and feedback.",
    icon: <CheckCircle className="text-[#1a1a1a] w-5 h-5 sm:w-10 sm:h-10" />,
  },
];

function Task_see() {
  return (
    <div className="w-full py-8 md:min-h-screen px-4 sm:px-18 md:px-18 flex flex-col items-center md:justify-center">
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-9">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-800 font-sans">
          How it works in On<span className="text-[var(--color-primary)]">IT</span> India?
        </h2>
        <p className="text-gray-600 mt-6 sm:mt-4 text-base sm:text-lg">
          Get Anything Done. Just Ask.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl px-2 sm:px-0">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-md 
                       border-2 border-green-200
                       bg-gradient-to-br from-white via-white to-[#dcfce7]
                       flex flex-col justify-between
                       w-full min-h-[200px] sm:min-h-[270px]"
          >
            {/* Background Number - lights up on card hover */}
            <span className="absolute text-[5rem] sm:text-[6rem] md:text-[8rem] font-bold text-green-200/70 bottom-[-1rem] right-[1rem] sm:bottom-[-1rem] sm:left-6 md:left-8 select-none transition-all duration-300 ease-out group-hover:text-green-400 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]">
              {card.number}
            </span>
            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-1.5 sm:mb-3 text-black font-sans">
                  {card.title}
                </h2>
                <motion.div transition={{ type: "spring", stiffness: 200 }} className="-mt-1">
                  {card.icon}
                </motion.div>
              </div>
              <p className="text-gray-700 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed max-w-[90%]">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Task_see;
