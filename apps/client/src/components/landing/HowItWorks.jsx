import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Check,
    Zap,
    Briefcase,
    ArrowRight,
    BarChart2,
    Search,
    Code,
    TrendingUp,
    Layers,
    Grid,
    Cpu,
    PenTool
} from "react-feather";

const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-gray-900 mb-3 sm:mb-4">
            {title}
        </h2>
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed">{subtitle}</p>
    </div>
);

const HowItWorks = () => {
    const [persona, setPersona] = useState("posters");
    const sectionRef = useRef(null);
    const pathRef = useRef(null);
    const stepRefs = useRef([]);
    const [pathLength, setPathLength] = useState(0);
    const [visibleLength, setVisibleLength] = useState(0);
    const rafRef = useRef(null);
    const lastVisibleRef = useRef(-1);

    const setPathRef = (el) => {
        pathRef.current = el;
        if (el) {
            const len = el.getTotalLength();
            if (len > 0) setPathLength(len);
        }
    };

    useLayoutEffect(() => {
        const path = pathRef.current;
        if (path) {
            const len = path.getTotalLength();
            if (len > 0) setPathLength(len);
        }
    }, [persona]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const updateProgress = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const windowHeight = window.innerHeight;
                const viewportCenter = windowHeight * 0.4;

                let activeStep = 0;
                let progress = 0;

                for (let i = 0; i < 4; i++) {
                    const el = stepRefs.current[i];
                    if (!el) continue;
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                        activeStep = i;
                        progress = (windowHeight - rect.top) / (rect.height + windowHeight);
                        progress = Math.max(0, Math.min(1, progress));
                        break;
                    }
                    if (rect.bottom < viewportCenter) activeStep = Math.min(i + 1, 3);
                }

                const L = pathRef.current?.getTotalLength() || pathLength;
                if (L <= 0) {
                    rafRef.current = null;
                    return;
                }

                // 4 segments: one line per step transition (including 3-4)
                const segmentLen = L / 4;
                let visible = 0;
                if (activeStep === 0) visible = segmentLen * progress;
                else if (activeStep === 1) visible = segmentLen + segmentLen * progress;
                else if (activeStep === 2) visible = 2 * segmentLen + segmentLen * progress;
                else visible = 3 * segmentLen + segmentLen * progress;

                if (activeStep === 3 && progress >= 1) visible = L;

                if (progress === 0 && activeStep === 0) {
                    const sr = sectionRef.current?.getBoundingClientRect();
                    if (sr && sr.bottom < 0) visible = L;
                }

                // Only update state when value changes meaningfully to avoid scroll jank
                if (Math.abs(visible - lastVisibleRef.current) > 0.5) {
                    lastVisibleRef.current = visible;
                    setVisibleLength(visible);
                }
                rafRef.current = null;
            });
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, [pathLength]);

    return (
        <section ref={sectionRef} className="py-24 px-4 bg-[#f3f4f6] overflow-hidden">
            <SectionTitle
                title={
                    <span>
                        <span className="text-black">How</span> It <span className="text-green-600">Works</span>
                    </span>
                }
                subtitle="Connect, collaborate, and succeed in four simple steps."
            />

            {/* Toggle Button - Premium Segmented Control */}
            <div className="flex justify-center mb-24">
                <div className="relative p-[1px] rounded-full bg-gradient-to-r from-green-200 via-emerald-200 to-slate-200 shadow-sm">
                    <div className="relative flex bg-white rounded-full p-1">
                        {/* Sliding Background Pill */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-900 rounded-full transition-all duration-300 ease-out shadow-md ${persona === "posters" ? "left-1" : "left-[calc(50%+2px)]"
                                }`}
                        />

                        {/* Posters Button */}
                        <button
                            onClick={() => setPersona("posters")}
                            className={`relative z-10 px-4 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg transition-colors duration-300 min-w-[130px] md:min-w-[180px] ${persona === "posters"
                                ? "text-white"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            For Task Providers
                        </button>

                        {/* Performers Button */}
                        <button
                            onClick={() => setPersona("students")}
                            className={`relative z-10 px-4 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg transition-colors duration-300 min-w-[130px] md:min-w-[180px] ${persona === "students"
                                ? "text-white"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            For Task Performers
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {persona === "students" && (
                    <motion.div
                        key="students"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-6xl mx-auto space-y-24 relative"
                    >
                        {/* Thread Line - Only visible on desktop */}
                        <div className="absolute top-0 left-0 bottom-0 w-full hidden md:block pointer-events-none z-0">
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient
                                        id="gradientLine"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#1f8743ff"
                                            stopOpacity="0.2"
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                        <stop
                                            offset="75%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                    </linearGradient>
                                </defs>
                                <path
                                    ref={setPathRef}
                                    d="M25,10 C 60,10 50,35 75,35 C 100,35 50,60 25,60 C 25,80 50,80 75,85"
                                    fill="none"
                                    stroke="url(#gradientLine)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    {...(pathLength > 0 && {
                                        strokeDasharray: pathLength,
                                        strokeDashoffset: pathLength - visibleLength,
                                    })}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>

                        {[
                            {
                                step: 1,
                                title: "Build your profile.",
                                desc: "Create a verified student profile highlighting your skills, academic year, and interests.",
                                visual: (
                                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto relative transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg md:text-xl">
                                                AV
                                            </div>
                                            <div>
                                                <div className="h-6 md:h-7 w-24 md:w-32 bg-blue-100 text-blue-600 font-bold rounded mb-1.5 md:mb-2 px-2 md:px-3 text-xs md:text-sm flex items-center">Jack</div>
                                                <div className="h-6 md:h-7 w-28 md:w-32 bg-slate-50 rounded text-[10px] md:text-xs flex items-center px-1 text-slate-400">MERN Developer</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:space-y-3 mt-3 md:mt-5 ">
                                            <div className="flex gap-2 mt-3 md:mt-5 ">
                                                <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-50 text-blue-600 text-[10px] md:text-xs rounded-full font-medium mt-3 md:mt-5 ">
                                                    React
                                                </span>
                                                <span className="px-2 py-1 md:px-3 md:py-1 bg-purple-50 text-purple-600 text-[10px] md:text-xs rounded-full font-medium mt-3 md:mt-5 ">
                                                    Design
                                                </span>
                                            </div>
                                            <div className="h-1.5 md:h-2 w-full bg-slate-50 rounded"></div>
                                            <div className="h-1.5 md:h-2 w-3/4 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                step: 2,
                                title: "Choose your domain.",
                                desc: "Select the types of tasks you want to see—from coding and design to research and marketing.",
                                visual: (
                                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto relative transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                        <h4 className="font-bold text-slate-800 mb-4">
                                            I'm interested in:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Web Dev",
                                                "Content",
                                                "Data Entry",
                                                "Event Mgmt",
                                                "Tutor",
                                            ].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 md:px-4 md:py-2 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-600 hover:bg-green-300 cursor-pointer"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                step: 3,
                                title: "Find work nearby.",
                                desc: "Browse a feed of verified tasks posted by students, startups, and faculty on your campus.",
                                visual: (
                                    <div className="bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 ">
                                        {[1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4 last:mb-0 p-2 md:p-3 bg-slate-50 rounded-xl"
                                            >
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 md:h-3 w-20 md:w-24 bg-slate-200 rounded mb-1"></div>
                                                    <div className="h-1.5 md:h-2 w-12 md:w-16 bg-slate-100 rounded"></div>
                                                </div>
                                                <button className="text-[10px] md:text-xs bg-green-200 text-green-600 px-2 py-0.5 md:px-3 md:py-1 rounded">
                                                    Accept
                                                </button>
                                                <button className="text-[10px] md:text-xs bg-red-200 text-red-600 px-2 py-0.5 md:px-3 md:py-1 rounded">
                                                    Reject
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                step: 4,
                                title: "Get paid securely.",
                                desc: "Payments are held in escrow and released instantly to your wallet upon task completion.",
                                visual: (
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 h-[220px] md:h-[280px] rounded-2xl shadow-xl w-full max-w-sm mx-auto text-white text-center transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="text-3xl md:text-4xl font-bold pt-6 md:pt-10 mb-1">
                                            ₹ 2,500
                                        </div>
                                        <div className="text-green-100 text-xs md:text-sm mb-4 md:mb-6 mt-6 md:mt-10">
                                            Available Balance
                                        </div>
                                        <button className="w-[130px] md:w-[160px] bg-white text-green-700 font-bold py-1.5 md:py-2 rounded-lg text-xs md:text-sm">
                                            Withdraw
                                        </button>
                                    </div>
                                ),
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                ref={(el) => { stepRefs.current[idx] = el; }}
                                className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Visual Side */}
                                <div className="flex-1 w-full">
                                    {item.visual}
                                </div>

                                {/* Text Side */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-2 border-slate-300 text-xl font-bold text-slate-900 mb-6 shadow-sm">
                                        {item.step}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {persona === "posters" && (
                    <motion.div
                        key="posters"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-6xl mx-auto space-y-24 relative"
                    >
                        {/* Thread Line - Only visible on desktop */}
                        <div className="absolute top-0 left-0 bottom-0 w-full hidden md:block pointer-events-none z-0">
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient
                                        id="gradientLine2"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#bbf7d0"
                                            stopOpacity="0.2"
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                        <stop
                                            offset="75%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#16a34a"
                                            stopOpacity="1"
                                        />
                                    </linearGradient>
                                </defs>
                                <path
                                    ref={setPathRef}
                                    d="M25,10 C 60,10 50,35 75,35 C 100,35 50,60 25,60 C 25,80 50,80 75,85"
                                    fill="none"
                                    stroke="url(#gradientLine2)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    {...(pathLength > 0 && {
                                        strokeDasharray: pathLength,
                                        strokeDashoffset: pathLength - visibleLength,
                                    })}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>

                        {[
                            {
                                step: 1,
                                title: "Post your task.",
                                desc: "Describe what you need done, set a budget, and specify the deadline.",
                                visual: (
                                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="flex justify-between items-center mb-4 text-slate-400">
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                New Task
                                            </span>
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div className="h-8 w-3/4 bg-slate-100 rounded mb-3"> Need An Landing Page</div>

                                        <div className="h-4 w-1/2 bg-slate-50 rounded mb-6"></div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 rounded bg-green-50 text-green-700 text-xs font-bold">
                                                ₹ 6000
                                            </div>
                                            <div className="px-3 py-1 rounded bg-slate-50 text-slate-600 text-xs font-bold">
                                                Urgent
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                step: 2,
                                title: "Find nearby Task Performers.",
                                desc: "Your task is broadcasted to verified students on campus who match your requirements.",
                                visual: (
                                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto relative transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-50 rounded-full animate-ping opacity-20"></div>
                                        <div className="relative z-10 text-center">
                                            <div className="w-16 h-16 bg-slate-900 rounded-full mx-auto flex items-center justify-center text-white mb-3">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <div className="text-sm font-bold text-slate-700">
                                                Searching...
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                24 nearby
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                step: 3,
                                title: "Connect & Chat.",
                                desc: "Review profiles and chat directly with applicants to finalize the details.",
                                visual: (
                                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm mx-auto transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                R
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-bold text-slate-900">
                                                    Rahul (Student)
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    I can do this by 5 PM!
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                className="flex-1 bg-slate-50 text-xs p-2 rounded-lg"
                                                disabled
                                            />
                                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                step: 4,
                                title: "Task Complete.",
                                desc: "Approve the work and payments are released automatically. Rate your experience.",
                                visual: (
                                    <div className="bg-white p-8 rounded-2xl shadow-xl h-[280px] border border-slate-100 w-full max-w-sm mx-auto text-center transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mt-10 flex items-center justify-center text-green-600 mb-4">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <div className="text-xl font-bold text-slate-900  mb-1">
                                            Success Your Task Done!
                                        </div>
                                        <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                ),
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                ref={(el) => { stepRefs.current[idx] = el; }}
                                className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Visual Side */}
                                <div className="flex-1 w-full">
                                    {item.visual}
                                </div>

                                {/* Text Side */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-2 border-slate-300 text-xl font-bold text-slate-900 mb-6 shadow-sm">
                                        {item.step}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HowItWorks;
