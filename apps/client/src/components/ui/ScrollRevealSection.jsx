import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Zap,
    Shield,
    Users,
    CheckCircle,
    Coins,
    Hammer,
    MapPin
} from "lucide-react";
const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/scrollreveal";
const i1 = `${CDN}/i1.webp`;
const i2 = `${CDN}/i2.webp`;
const i3 = `${CDN}/i3.webp`;
const i4 = `${CDN}/i4.webp`;

// Content adapted for the "FirstDoer Campus" intro, but in the requested tabbed format
const features = [
    {
        id: "learn-earn",
        icon: <Coins className="w-5 h-5" />,
        color: "bg-green-100 text-[var(--color-primary)]",
        btnColor: "bg-slate-900",
        title: "Learn & Earn",
        heading: "Learn & Earn",
        desc: "Students stop paying for theoretical courses and start getting paid for executing tasks. Learning funded by execution.",
        image: i1
    },
    {
        id: "real-work",
        icon: <Hammer className="w-5 h-5" />,
        color: "bg-green-100 text-[var(--color-primary)]",
        btnColor: "bg-slate-900",
        title: "Real Work",
        heading: "Real Work",
        desc: "Moving beyond theoretical case studies. Students work on live projects that actually impact business outcomes.",
        image: i2
    },
    {
        id: "micro-tasks",
        icon: <Zap className="w-5 h-5" />,
        color: "bg-green-100 text-[var(--color-primary)]",
        btnColor: "bg-slate-900",
        title: "Flexible Micro-Tasks",
        heading: "Flexible Micro-Tasks",
        desc: "Short-term commitments (hours/days) fitting student schedules, unlike rigid 6-month full-time internships.",
        image: i3
    },
    {
        id: "hyperlocal",
        icon: <MapPin className="w-5 h-5" />,
        color: "bg-green-100 text-[var(--color-primary)]",
        btnColor: "bg-slate-900",
        title: "Hyperlocal Trust",
        heading: "Hyperlocal Trust",
        desc: "Connecting local talent with local businesses builds accountability and stronger professional networks.",
        image: i4
    }
];

const ScrollRevealSection = () => {
    const [activeTab, setActiveTab] = useState("learn-earn");
    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = React.useRef(null);
    const tabsRef = React.useRef({});
    const activeContent = features.find(c => c.id === activeTab) || features[0];

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveTab((current) => {
                const currentIndex = features.findIndex(c => c.id === current);
                const nextIndex = (currentIndex + 1) % features.length;
                return features[nextIndex].id;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [activeTab, isHovered]);

    // Auto-scroll active tab into view
    useEffect(() => {
        const container = scrollContainerRef.current;
        const activeBtn = tabsRef.current[activeTab];

        if (container && activeBtn) {
            const containerWidth = container.offsetWidth;
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;

            // Calculate scroll position to center the button
            const scrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth"
            });
        }
    }, [activeTab]);

    return (
        <section id="introduction" className="bg-[#f3f4f6] mb-5 min-h-[500px] sm:min-h-screen flex flex-col justify-center py-8 sm:py-10 px-8 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">

                {/* Section Heading */}
                <div className="text-center mb-6 sm:mb-8">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider text-xs uppercase mb-2 block">
                        The Solution
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-3 leading-tight">
                        Introducing <span className="text-[var(--color-primary)]">FirstDoer Campus</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                        We bridge the gap between education and employment by turning real-world business needs into paid learning opportunities.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div
                    ref={scrollContainerRef}
                    className="flex flex-nowrap overflow-x-auto sm:overflow-visible justify-start sm:justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-1 pb-2 sm:pb-0 scrollbar-hide scroll-smooth"
                >
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            ref={el => tabsRef.current[feature.id] = el}
                            onClick={() => setActiveTab(feature.id)}
                            onMouseEnter={() => setActiveTab(feature.id)}
                            className={`
                                    flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border whitespace-nowrap flex-shrink-0
                                ${activeTab === feature.id
                                    ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"}
                            `}
                        >
                            <span className="scale-75 sm:scale-80">{feature.icon}</span>
                            <span className="uppercase">{feature.title}</span>
                        </button>
                    ))}
                </div>
                {/* Content Display - Split Layout */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-0 md:gap-0 items-stretch"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >

                    {/* Left Column: Text Content */}
                    <div className="bg-white rounded-t-2xl rounded-b-none md:rounded-3xl md:rounded-r-none p-5 md:p-12 shadow-xl border border-slate-100 flex flex-col justify-center relative overflow-hidden group min-h-[220px]">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <motion.div
                                key={activeContent.id + "-bg-icon"}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {React.cloneElement(activeContent.icon, { size: 120 })}
                            </motion.div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeContent.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="z-10"
                            >
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 ${activeContent.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner`}>
                                    {React.cloneElement(activeContent.icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                                </div>

                                <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 sm:mb-4 leading-tight">
                                    {activeContent.heading}
                                </h3>

                                <p className="text-slate-600 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                                    {activeContent.desc}
                                </p>


                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative rounded-b-2xl rounded-t-none md:rounded-3xl md:rounded-l-none overflow-hidden h-[180px] sm:h-[350px] md:h-auto shadow-2xl bg-slate-900">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeContent.id + "-img"}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img
                                    src={activeContent.image}
                                    alt={activeContent.title}
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScrollRevealSection;
