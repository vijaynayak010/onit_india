import React from "react";
import { motion } from "framer-motion";
import t1 from "../assets/icons/t1.png";
import t2 from "../assets/icons/t2.png";
import t3 from "../assets/icons/t3.png";
import t4 from "../assets/icons/t4.png";
import t5 from "../assets/icons/t5.png";
import t6 from "../assets/icons/t6.png";




const knowAboutUsCards = [
  {
    seekerQ: "Build a list of 200 companies with contact details in Excel.",
    performerA: "I can research and compile an accurate, well-structured list for you",
    seekerAvatar: t3,
    performerAvatar: t1, // plumber avatar
  },
  {
    seekerQ: "Create 10 social media posts using this Canva template",
    performerA: "I can design these posts quickly and neatly",
    seekerAvatar: t4,
    performerAvatar: t2, // mover avatar
  },
  {
    seekerQ: "Create a PPT from these notes",
    performerA: "I can make a clear and professional presentation.",
    seekerAvatar: t6,
    performerAvatar: t5, // tech installer
  },
  {
    seekerQ: "Clean and fix formulas in this Excel sheet.",
    performerA: "I can organize and correct the sheet properly.",
    seekerAvatar: t5,
    performerAvatar: t2, // gardener
  },
  {
    seekerQ: "I need a tutor to help my kid with math homework.",
    performerA: "I’m a student teacher and can teach math after school hours.",
    seekerAvatar: t6,
    performerAvatar: t4, // teacher
  },
  {
    seekerQ: "Visit this store and take product shelf photos",
    performerA: "I can visit and share the photos.",
    seekerAvatar: t1,
    performerAvatar: t6, // cleaner
  },
];

const KnowUserSection = () => {
  return (
    <div className="w-full h-screen bg-[#f3f4f6] flex flex-col justify-center items-center px-4">
      {/* Cards container */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-3 
          gap-6 
          w-full 
          max-w-6xl 
          px-4 
          overflow-y-auto
          lg:overflow-hidden
        "
      >
        {knowAboutUsCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-gradient-to-br from-zinc-50 to-green-50 border-2 border-green-200 rounded-2xl p-6 flex flex-col gap-4 items-center shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Task Seeker */}
            <div className="flex items-start w-full">
              <img
                src={card.seekerAvatar}
                alt="Task Seeker"
                className="w-10 h-10 rounded-full mr-3 border-2 border-[#004d43]"
              />
              <div className="bg-white/80 border border-zinc-200 text-black rounded-2xl rounded-tl-none px-4 py-3 w-full shadow-sm">
                <p className="font-bold text-xs mb-1 text-[#004d43] uppercase tracking-wide">Task Seeker</p>
                <p className="text-sm text-zinc-800 leading-relaxed">{card.seekerQ}</p>
              </div>
            </div>

            {/* Task Performer */}
            <div className="flex items-start w-full justify-end">
              <div className="bg-[#004d43] text-white rounded-2xl rounded-tr-none px-4 py-3 w-full shadow-sm">
                <p className="font-bold text-xs mb-1 text-green-300 uppercase tracking-wide">Task Performer</p>
                <p className="text-sm leading-relaxed">{card.performerA}</p>
              </div>
              <img
                src={card.performerAvatar}
                alt="Task Performer"
                className="w-10 h-10 rounded-full ml-3 border-2 border-green-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flaticon Credit */}

    </div>
  );
};

export default KnowUserSection;
