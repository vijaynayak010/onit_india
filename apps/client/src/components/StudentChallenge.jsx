import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Briefcase,
    Share2,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MessageCircle, // Added for Scattered Opportunities
    Clock,         // Added for Work-Study Balance
} from "react-feather";
import { IndianRupee } from "lucide-react";

const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/campus";
const workImage = `${CDN}/work.webp`;
const portfolioImage = `${CDN}/protifilo.webp`;
const connectionImage = `${CDN}/connections.webp`;
const balanceImage = `${CDN}/studies.webp`;
const paymentImage = `${CDN}/money.webp`;

const challenges = [
    {
        id: "financial",
        icon: <Search className="w-5 h-5" />,
        title: "Finding Paid Work",
        heading: "Finding Paid Work",
        desc: "Hard to find real, legitimate paid work on campus that matches skill levels and respects academic schedules.",
        image: workImage,
        bgColor: "bg-green-50 border border-green-100"
    },
    {
        id: "experience",
        icon: <Briefcase className="w-5 h-5 " />,
        title: "Building Portfolios",
        heading: "Building Portfolios",
        desc: "Limited ways to build a verifiable portfolio that employers trust beyond standard academic projects.",
        image: portfolioImage,
        bgColor: "bg-green-50 border border-green-100"
    },
    {
        id: "network",
        icon: <Share2 className="w-5 h-5" />,
        title: "Limited Connections",
        heading: "Limited Connections",
        desc: "Few direct connections to industry professionals, startups, and mentors to guide career paths early on.",
        image: connectionImage, // Reusing connection image
        bgColor: "bg-green-50 border border-green-100"
    },
    {
        id: "schedule",
        icon: <Clock className="w-5 h-5" />, // Replacing TrendingUp with Clock
        title: "Work-Study Balance",
        heading: "Work-Study Balance",
        desc: "Traditional part-time jobs often have rigid hours that conflict with classes, exams, and study time.",
        image: balanceImage,
        bgColor: "bg-green-50 border border-green-100"
    },
    {
        id: "payment",
        icon: <IndianRupee className="w-5 h-5" />,
        title: "Payment Uncertainty",
        heading: "Payment Uncertainty",
        desc: "Frequent uncertainty about project scope, vague timelines, and lack of guaranteed payment for work done.",
        image: paymentImage,
        bgColor: "bg-green-50 border border-green-100"
    }
];

const cardVariants = {
    center: {
        x: 0,
        rotateY: 0,
        scale: 1,
        zIndex: 10,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    left: {
        x: "-85%", // Moved further left for wider central card
        rotateY: 45,
        scale: 0.7,
        zIndex: 5,
        opacity: 0.5,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    right: {
        x: "85%", // Moved further right
        rotateY: -45,
        scale: 0.7,
        zIndex: 5,
        opacity: 0.5,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    hiddenLeft: {
        x: "-120%",
        rotateY: 60,
        scale: 0.5,
        zIndex: 1,
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    hiddenRight: {
        x: "120%",
        rotateY: -60,
        scale: 0.5,
        zIndex: 1,
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
    }
};

const StudentChallenge = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % challenges.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + challenges.length) % challenges.length);
    };

    const getCardState = (index) => {
        const diff = (index - activeIndex + challenges.length) % challenges.length;
        if (diff === 0) return "center";
        if (diff === 1 || diff === challenges.length - 1) return diff === 1 ? "right" : "left";
        return diff > 1 ? "hiddenRight" : "hiddenLeft";
    };

    return (
        <section className="bg-[#f3f4f6] w-full py-10 md:py-16 px-4 md:px-8 overflow-hidden font-sans flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-[1400px] mx-auto w-full relative">

                {/* Main Heading */}
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-medium text-slate-900 tracking-tight">
                        Challenges for <span className="text-green-600">Students</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mt-4 text-sm md:text-lg">
                        Real problems require real solutions.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative w-full h-[380px] md:h-[450px] perspective-1000 flex items-center justify-center">

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 md:left-10 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:text-green-600 hover:scale-110 transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-10 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:text-green-600 hover:scale-110 transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
                    </button>

                    {/* Cards */}
                    {challenges.map((challenge, index) => {
                        const cardState = getCardState(index);
                        return (
                            <motion.div
                                key={challenge.id}
                                variants={cardVariants}
                                initial={cardState}
                                animate={cardState}
                                className={`
                                    absolute w-[90%] md:w-[800px] h-[340px] md:h-[400px] 
                                    rounded-[3rem] overflow-hidden
                                    shadow-2xl
                                    flex flex-col md:flex-row
                                `}
                            >
                                {/* Left Content Side */}
                                <div className={`w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-start text-left ${challenge.bgColor}`}>
                                    {/* Icon */}
                                    <div className="mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white flex items-center border-1 border-green-300 justify-center shadow-sm">
                                        <div className="text-green-600 scale-110">
                                            {challenge.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-lg md:text-3xl font-medium text-slate-900 mb-2 md:mb-4 leading-tight">
                                        {challenge.heading}
                                    </h3>

                                    <p className="text-slate-700 text-xs md:text-base leading-relaxed font-medium">
                                        {challenge.desc}
                                    </p>
                                </div>

                                {/* Right Image Side */}
                                <div className="w-full md:w-1/2 h-full relative">
                                    <img
                                        src={challenge.image}
                                        alt={challenge.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Optional Gradient Overlay for Image depth */}
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-8 gap-2">
                    {challenges.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-green-600 w-4 md:w-6" : "bg-slate-300 hover:bg-slate-400"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudentChallenge;