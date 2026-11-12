import React from 'react';
import { motion } from 'framer-motion';
import g1 from "../assets/marketing/g1.jpeg";
import g2 from "../assets/marketing/g2.jpeg";
import a1 from "../assets/marketing/1.jpeg";
import g3 from "../assets/marketing/g3.JPG";
import a2 from "../assets/marketing/2.png";
import a3 from "../assets/marketing/3.jpeg";

const teamMembers = [
    { image: g2 },
    { image: a1 },
    { image: g1 },
    { image: g3 },
    { image: a2 },
    { image: a3 },
    { image: "/assets/1.png" },
    { image: "/assets/2.png" },
    { image: "/assets/3.png" }
];

const Team = () => {
    return (
        <section className="py-24 md:py-32 bg-[#fafafa] text-slate-800 px-4 md:px-8 relative overflow-hidden select-none border-t border-b border-slate-100/60">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Clean, Lightweight SaaS Header Section */}
                <div className="text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-900 mb-4 font-sans">
                            Our <span className="text-[var(--color-primary)]">Ground</span> Work
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-normal"
                    >
                        See our trusted performers in action—building local networks and executing micro-tasks with seamless precision.
                    </motion.p>
                </div>

                {/* Static Centered Flex Row of 9 Cards - Non-wrapping and elegantly sized to fit one row */}
                <div 
                    className="flex flex-nowrap justify-start md:justify-center gap-1.5 sm:gap-3 max-w-7xl mx-auto overflow-x-auto md:overflow-visible pb-8 md:pb-0 scrollbar-hide px-4 py-8"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    {teamMembers.map((item, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                                className="relative w-[50px] sm:w-[70px] md:w-[85px] lg:w-[100px] xl:w-[115px] hover:w-[100px] sm:hover:w-[140px] md:hover:w-[170px] lg:hover:w-[200px] xl:hover:w-[230px] h-[220px] rounded-[10px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden border border-slate-100 bg-white group/card shadow-[0_8px_24px_rgba(0,0,0,0.012)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] cursor-pointer flex-shrink-0"
                            >

                                {/* Pure portrait image layout with smooth hover cross-fade */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <img
                                        src={item.image}
                                        alt={`Ground team showcase ${index + 1}`}
                                        className={`w-full h-full object-cover select-none transition-all duration-500 ${item.hoverImage ? 'opacity-100 group-hover/card:opacity-0' : ''}`}
                                        draggable="false"
                                    />
                                    {item.hoverImage && (
                                        <img
                                            src={item.hoverImage}
                                            alt={`Ground team showcase ${index + 1} hover`}
                                            className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100"
                                            draggable="false"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Team;
