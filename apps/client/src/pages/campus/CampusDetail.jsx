import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../../components/seo/SEO";
import { Link, useLocation } from "react-router-dom";
import {
    Star,
    Check,
    Users,
    Zap,
    Briefcase,
    ArrowRight,
    BarChart2,
    FileText,
    Search,
    Code,
    TrendingUp,
    Layers, // Added for PPTs
    Grid,   // Added for Sheets
    Cpu,    // Added for AI
    PenTool // Added for Documentation/Writing
} from "react-feather";
import Footer from "../../components/layout/Footer";

// Ensure these components exist in your project folder
import StudentChallenge from "../../components/StudentChallenge";
import ScrollRevealSection from "../../components/ui/ScrollRevealSection";
import a3 from "../../assets/marketing/3.jpeg"
import a4 from "../../assets/marketing/4.jpeg"

const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing";
const s1 = `${CDN}/campus/s1.webp`;
const s2 = `${CDN}/campus/s2.webp`;
const s3 = `${CDN}/campus/s3.webp`;
const s4 = `${CDN}/campus/s4.webp`;
const a2 = `${CDN}/campus/2.webp`;
const a5 = `${CDN}/campus/7.webp`;
const g3 = `${CDN}/campus/g3.webp`;

const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {title}
        </h2>
        <p className="text-lg text-gray-500">{subtitle}</p>
    </div>
);



// ... (existing imports)

export default function CampusDetail() {
    const [persona, setPersona] = useState("students");
    const { pathname, hash } = useLocation();

    // UPDATED SCROLL LOGIC
    // Scroll logic removed to allow browser native scroll restoration on refresh and prevent jumping
    /*
    useEffect(() => {
        // If there is a hash (like #campus), scroll to it
        if (hash === "#campus") {
            const element = document.getElementById("campus");
            if (element) {
                element.scrollIntoView({ behavior: "instant", block: "start" });
            }
        } else {
            // Otherwise just go to top
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname, hash]);
    */

    return (
        <div className=" bg-[#f3f4f6] min-h-screen font-sans">
            <SEO
                title="OnIT INDIA Campus | Local Tasks for Students"
                description="Join OnIT INDIA Campus to find flexible, local work or get help instantly. Connect with students and task performers nearby. Campus jobs and student internships India."
                keywords="onitindia, OnIT INDIA Campus, campus jobs, student tasks, local freelance, flexible work, student internships, campus partnership India, student earning"
                canonical="https://www.onitindia.com/campus-detail"
            />
            {/* Added id="campus" here for the target */}
            <section
                id="campus"
                className="relative pt-32 pb-0 lg:pt-30 lg:pb-30 px-6 overflow-hidden min-h-auto flex flex-col items-center justify-center bg-[#f3f4f6] -mb-24 lg:mt-0 lg:mb-0"
            >
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-green-50/60 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
                    {/* Floating Portraits (Responsive) */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none">
                        {/* Top Left */}
                        <div className="absolute top-4 left-2 lg:top-0 lg:left-0 lg:-ml-12 lg:mt-8 animate-float-slow">
                            <div className="relative w-24 h-20 lg:w-64 lg:h-52 bg-slate-200 rounded-xl lg:rounded-[2rem] overflow-hidden shadow-2xl border-2 lg:border-4 border-green-600 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 hover:scale-105">
                                <img
                                    src={s1}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 lg:bottom-6 lg:left-6 bg-white/90 backdrop-blur-sm px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-lg flex items-center gap-1 lg:gap-2">
                                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-[10px] lg:text-xs font-bold text-black">₹</span>
                                    </div>
                                    <span className="text-[10px] lg:text-base font-bold text-slate-900">1200</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Right */}
                        <div className="absolute top-6 right-2 lg:top-0 lg:right-0 lg:-mr-12 lg:mt-12 animate-float-slower">
                            <div className="relative w-24 h-20 lg:w-64 lg:h-52 bg-slate-200 rounded-xl lg:rounded-[2rem] overflow-hidden shadow-2xl border-2 lg:border-4 border-green-600 rotate-[6deg] hover:rotate-0 transition-transform duration-500 hover:scale-105">
                                <img
                                    src={s2}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 lg:bottom-6 lg:right-6 bg-white/90 backdrop-blur-sm px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-lg flex items-center gap-1 lg:gap-2">
                                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-green-400 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-white" />
                                    </div>
                                    <span className="text-[10px] lg:text-base font-bold text-slate-900">₹900</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Left */}
                        <div className="absolute bottom-24 left-2 lg:bottom-10 lg:left-20 animate-float-reverse">
                            <div className="relative w-20 h-16 lg:w-56 lg:h-52 bg-slate-200 rounded-xl lg:rounded-[2rem] overflow-hidden shadow-2xl border-2 lg:border-4 border-green-600 rotate-[3deg] hover:rotate-0 transition-transform duration-500 hover:scale-105">
                                <img
                                    src={s4}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 lg:bottom-6 lg:left-6 bg-white/90 backdrop-blur-sm px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-lg flex items-center gap-1 lg:gap-2">
                                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <Briefcase className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-black" />
                                    </div>
                                    <span className="text-[10px] lg:text-base font-bold text-slate-900">Intern</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Right */}
                        <div className="absolute bottom-20 right-2 lg:bottom-0 lg:right-10 lg:-mt-22 lg:-mb-8 animate-float-medium">
                            <div className="relative w-20 h-16 lg:w-60 lg:h-52 bg-slate-200 rounded-xl lg:rounded-[2rem] overflow-hidden shadow-2xl border-2 lg:border-4 border-green-600 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 hover:scale-105">
                                <img
                                    src={s3}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 lg:bottom-6 lg:right-6 bg-white/90 backdrop-blur-sm px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-lg flex items-center gap-1 lg:gap-2">
                                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-[10px] lg:text-xs font-bold text-black">₹</span>
                                    </div>
                                    <span className="text-[10px] lg:text-base font-bold text-slate-900">350</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Headings */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 max-w-4xl mx-auto"
                    >
                        <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-4 lg:mb-8 drop-shadow-sm">
                            On<span className="text-transparent bg-clip-text bg-green-600 to-emerald-500">IT</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                CAMPUS
                            </span>
                            <br />
                            INITIATIVE
                        </h1>

                        <p className="max-w-2xl mx-auto text-xl md:text-2xl ml-6 text-slate-500 mb-6 lg:mb-12 font-medium leading-relaxed">
                            A task platform where real work meets proven talent.{" "}
                            <b className="text-slate-900">Earn,learn,</b> {" "}
                            <b className="text-slate-900">and grow  through {" "}</b>meaningful work
                            and opportunities.
                        </p>

                        <div className="flex flex-row items-center justify-center gap-4 mt-8 md:mt-0 mb-4 lg:mb-16">
                            <Link
                                to="/task-performers"
                                className="px-4 py-2 md:px-8 md:py-3.5 bg-green-600 text-white rounded-full font-bold text-sm md:text-xl shadow-xl hover:bg-green-700 hover:shadow-2xl w-auto"
                            >
                                Get Started
                            </Link>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("introduction")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                                className="px-4 py-2 md:px-8 md:py-3.5 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-sm md:text-xl shadow-sm hover:bg-black hover:text-white hover:border-slate-300 transition-all duration-300 w-auto"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Mobile Only: Student Cards Visual */}
                        <div className="lg:hidden w-full px-2 mb-6">
                            <div className="flex justify-center gap-4">
                                {/* Card 1 */}
                                <div className="relative w-36 h-28 md:w-56 md:h-40 bg-slate-200 rounded-2xl overflow-hidden shadow-lg border-2 border-green-500 rotate-[-3deg]">
                                    <img src={s1} alt="Student" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-2">
                                        <div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <span className="text-[10px] md:text-sm font-bold text-black">₹</span>
                                        </div>
                                        <span className="text-[10px] md:text-sm font-bold text-slate-900">1200</span>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="relative w-36 h-28 md:w-56 md:h-40 bg-slate-200 rounded-2xl overflow-hidden shadow-lg border-2 border-green-500 rotate-[3deg]">
                                    <img src={s2} alt="Student" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-2">
                                        <div className="w-4 h-4 md:w-6 md:h-6 bg-green-400 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-2.5 h-2.5 md:w-4 md:h-4 text-white" />
                                        </div>
                                        <span className="text-[10px] md:text-sm font-bold text-slate-900">Intern</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Replaced the original grid section with StudentChallenge component */}
            <div id="problem">
                <StudentChallenge />
            </div>

            <div id="introduction">
                <ScrollRevealSection />
            </div>
            {/* Our Journey Section */}
            <section className="py-24 px-6 mt-5 bg-[#f3f4f6] overflow-hidden">
                <SectionTitle
                    title={
                        <span>
                            Our <span className="text-green-600">Journey</span>
                        </span>
                    }
                    subtitle="Capturing moments of collaboration, learning, and growth."
                />

                <div className="max-w-7xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Image 1 - Large */}
                    <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-lg h-[300px] md:h-[400px]">
                        <img src={g3} alt="Event 1" className="w-full h-full object-cover transition-transform duration-700 " />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 flex items-end p-6">

                        </div>
                    </div>
                    {/* Image 2 */}
                    <div className="relative group overflow-hidden rounded-2xl shadow-lg h-[150px] md:h-[190px]">
                        <img src={a2} alt="Event 2" className="w-full h-full object-cover transition-transform duration-700" />
                    </div>
                    {/* Image 3 */}
                    <div className="relative group overflow-hidden rounded-2xl shadow-lg h-[150px] md:h-[190px]">
                        <img src={a3} alt="Event 3" className="w-full h-full object-fill transition-transform duration-700 " />
                    </div>
                    {/* Image 4 */}
                    <div className="relative group overflow-hidden rounded-2xl shadow-lg h-[150px] md:h-[190px]">
                        <img src={a4} alt="Event 3" className="w-full h-full object-fill transition-transform duration-700 " />
                    </div>
                    <div className="relative group overflow-hidden rounded-2xl shadow-lg h-[150px] md:h-[190px]">
                        <img src={a5} alt="Event 3" className="w-full h-full object-fill transition-transform duration-700" />
                    </div>
                </div>
            </section>
            <section className="py-24 px-6 bg-[#f3f4f6] overflow-hidden">
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
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-900 rounded-full transition-all duration-300 ease-out shadow-md ${persona === "students" ? "left-1" : "left-[calc(50%+2px)]"
                                    }`}
                            />

                            {/* Students Button */}
                            <button
                                onClick={() => setPersona("students")}
                                className={`relative z-10 px-4 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg transition-colors duration-300 min-w-[130px] md:min-w-[180px] ${persona === "students"
                                    ? "text-white"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                For Task Performers
                            </button>

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
                            className="max-w-6xl mx-auto space-y-24 relative" // Spacing between steps
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
                                            />{" "}
                                            {/* green-200 */}
                                            <stop
                                                offset="50%"
                                                stopColor="#16a34a"
                                                stopOpacity="1"
                                            />{" "}
                                            {/* green-600 */}
                                            <stop
                                                offset="100%"
                                                stopColor="#128017ff"
                                                stopOpacity="1"
                                            />{" "}
                                            {/* slate-800 */}
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M25,10 C 60,10 50,35 75,35 C 100,35 50,60 25,60 C 25,80 50,80 75,85"
                                        fill="none"
                                        stroke="url(#gradientLine)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                        className="shadow-sm"
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
                                    className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Visual Side */}
                                    <div className="flex-1 w-full">{item.visual}</div>

                                    {/* Text Side */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 text-xl font-bold text-slate-900 mb-6 shadow-sm">
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
                                            />{" "}
                                            {/* green-200 */}
                                            <stop
                                                offset="50%"
                                                stopColor="#16a34a"
                                                stopOpacity="1"
                                            />{" "}
                                            {/* green-600 */}
                                            <stop
                                                offset="100%"
                                                stopColor="#1e293b"
                                                stopOpacity="1"
                                            />{" "}
                                            {/* slate-800 */}
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M25,10 C 60,10 50,35 75,35 C 100,35 50,60 25,60 C 25,80 50,80 75,85"
                                        fill="none"
                                        stroke="url(#gradientLine2)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                        className="shadow-sm"
                                    />
                                </svg>
                            </div>

                            {[
                                {
                                    step: 1,
                                    title: "Post your requirement.",
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
                                    className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Visual Side */}
                                    <div className="flex-1 w-full">{item.visual}</div>

                                    {/* Text Side */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 text-xl font-bold text-slate-900 mb-6 shadow-sm">
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
            <section className="py-24 px-6 bg-gray-50 overflow-hidden">
                {/* CSS Styles for Marquee Animation & Hover Pause */}
                <style>{`
        @keyframes scrollLeft {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
        }
        .marquee-container:hover {
            animation-play-state: paused;
        }
    `}</style>

                <SectionTitle
                    title="Types of Tasks Available"
                    subtitle="From simple gigs to professional projects. Find work that fits your schedule and skills."
                />

                <div className="space-y-8 md:space-y-14 mt-10 md:mt-16">
                    {/* Row 1: Left Scroll */}
                    <div className="overflow-hidden">
                        <div
                            className="flex gap-4 md:gap-6 w-max marquee-container"
                            style={{
                                animation: "scrollLeft 40s linear infinite",
                            }}
                        >
                            {/* Render content multiple times for seamless loop */}
                            <MarqueeRow
                                items={[
                                    {
                                        icon: <Layers />,
                                        title: "PPTs & Notes",
                                        desc: "Presentations, notes digitization, and form filling.",
                                        gradient: "from-blue-50 to-indigo-50"
                                    },
                                    {
                                        icon: <BarChart2 />,
                                        title: "Excel & Sheets",
                                        desc: "Data entry, dashboards, and spreadsheet automation.",
                                        gradient: "from-emerald-50 to-green-50"
                                    },
                                    {
                                        icon: <Search />,
                                        title: "Research & Ideation",
                                        desc: "Market research, analysis, and brainstorming.",
                                        gradient: "from-purple-50 to-pink-50"
                                    },
                                ]}
                            />
                            <MarqueeRow
                                items={[
                                    {
                                        icon: <Layers />,
                                        title: "PPTs & Notes",
                                        desc: "Presentations, notes digitization, and form filling.",
                                        gradient: "from-blue-50 to-indigo-50"
                                    },
                                    {
                                        icon: <BarChart2 />,
                                        title: "Excel & Sheets",
                                        desc: "Data entry, dashboards, and spreadsheet automation.",
                                        gradient: "from-emerald-50 to-green-50"
                                    },
                                    {
                                        icon: <Search />,
                                        title: "Research & Ideation",
                                        desc: "Market research, analysis, and brainstorming.",
                                        gradient: "from-purple-50 to-pink-50"
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Row 2: Right Scroll */}
                    <div className="overflow-hidden">
                        <div
                            className="flex gap-4 md:gap-6 w-max marquee-container"
                            style={{
                                animation: "scrollRight 45s linear infinite",
                            }}
                        >
                            <MarqueeRow
                                items={[
                                    {
                                        icon: <Code />,
                                        title: "Web & AI Projects",
                                        desc: "Web development, AI assistance, and coding tasks.",
                                        gradient: "from-orange-50 to-amber-50"
                                    },
                                    {
                                        icon: <PenTool />,
                                        title: "Documentation",
                                        desc: "Technical writing, reports, and proofreading.",
                                        gradient: "from-teal-50 to-cyan-50"
                                    },
                                    {
                                        icon: <Briefcase />,
                                        title: "Internships",
                                        desc: "Long-term roles with startups and partners.",
                                        gradient: "from-rose-50 to-red-50"
                                    },
                                ]}
                            />
                            <MarqueeRow
                                items={[
                                    {
                                        icon: <Code />,
                                        title: "Web & AI Projects",
                                        desc: "Web development, AI assistance, and coding tasks.",
                                        gradient: "from-orange-50 to-amber-50"
                                    },
                                    {
                                        icon: <PenTool />,
                                        title: "Documentation",
                                        desc: "Technical writing, reports, and proofreading.",
                                        gradient: "from-teal-50 to-cyan-50"
                                    },
                                    {
                                        icon: <Briefcase />,
                                        title: "Internships",
                                        desc: "Long-term roles with startups and partners.",
                                        gradient: "from-rose-50 to-red-50"
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-32 px-6 bg-[#f3f4f6] relative overflow-hidden">
                {/* Background Glow - Subtle Green on White */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-80/50 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Top Decorative Pill */}

                    {/* Main Layout Grid */}
                    {/* Main Layout Grid - 4 Corner Satellite */}
                    <div className="grid lg:grid-cols-12 gap-y-16 gap-x-8 items-center relative">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-3 flex flex-col gap-24 ml-12 mt-12 hidden lg:flex">
                            {/* Card 1: Internships (Top Left - Moved from bottom) */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                    <Star size={28} fill="currentColor" />
                                </div>
                                <div className="text-5xl font-black text-white mb-2">10+</div>
                                <div className="text-sm text-white font-bold tracking-wide uppercase">
                                    Internship Roles
                                </div>
                            </div>

                            {/* Card 2: Tasks (Bottom Left) */}
                            <div className="bg-zinc-800 w-70 backdrop-blur-xl -ml-20 border border-white/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group translate-x-8">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                    <Check size={28} strokeWidth={3} />
                                </div>
                                <div className="text-5xl font-black text-white mb-2">80+</div>
                                <div className="text-sm text-white font-bold tracking-wide uppercase">
                                    Tasks Delivered
                                </div>
                            </div>
                        </div>

                        {/* CENTER COLUMN (Headline) */}
                        <div className="lg:col-span-6 text-center z-10 hidden lg:block">
                            <h2 className="text-5xl md:text-7xl lg:text-7xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-8 drop-shadow-sm">
                                EARLY
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                    IMPACT
                                </span>
                                <br />& MOMENTUM
                            </h2>
                            <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed font-medium">
                                Validated success through our pilot programs. The potential is
                                real.
                            </p>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-3 flex flex-col gap-24 ml-12 mt-12 hidden lg:flex">
                            {/* Card 3: Students (Top Right) */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group -translate-x-8">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                    <Users size={28} strokeWidth={3} />
                                </div>
                                <div className="text-5xl font-black text-white mb-2">200+</div>
                                <div className="text-sm text-white font-bold tracking-wide uppercase">
                                    Students Onboarded
                                </div>
                            </div>

                            {/* Card 4: Interest (Bottom Right - Moved from bottom) */}
                            <div className="bg-zinc-800 backdrop-blur-xl -mr-10 mt-6 border border-white/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                    <Zap size={28} fill="currentColor" />
                                </div>
                                <div className="text-5xl font-black text-white mb-2">High</div>
                                <div className="text-sm text-white font-bold tracking-wide uppercase">
                                    Campus Interest
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile "Satellite" Layout (Scaled Down) */}
                    <div className="lg:hidden flex flex-col gap-6 mt-8">
                        {/* Top Row: Internships & Students */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* Card 1: Internships */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-sm text-center">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-2 text-green-600 mx-auto">
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <div className="text-2xl font-black text-white mb-0.5">10+</div>
                                <div className="text-[9px] text-white/80 font-bold tracking-wider uppercase leading-tight">
                                    Internship
                                    <br />
                                    Roles
                                </div>
                            </div>

                            {/* Card 3: Students */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-sm text-center">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-2 text-green-600 mx-auto">
                                    <Users size={16} strokeWidth={3} />
                                </div>
                                <div className="text-2xl font-black text-white mb-0.5">200+</div>
                                <div className="text-[9px] text-white/80 font-bold tracking-wider uppercase leading-tight">
                                    Students
                                    <br />
                                    Onboarded
                                </div>
                            </div>
                        </div>

                        {/* Center Headline (Mobile) */}
                        <div className="text-center z-10 py-2">
                            <h2 className="text-4xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-2 drop-shadow-sm">
                                EARLY
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                    IMPACT
                                </span>
                            </h2>
                            <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed font-medium">
                                Validated success pilot programs.
                            </p>
                        </div>

                        {/* Bottom Row: Tasks & Interest */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* Card 2: Tasks & Delivered */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-sm text-center">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-2 text-green-600 mx-auto">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                                <div className="text-2xl font-black text-white mb-0.5">80+</div>
                                <div className="text-[9px] text-white/80 font-bold tracking-wider uppercase leading-tight">
                                    Tasks
                                    <br />
                                    Delivered
                                </div>
                            </div>

                            {/* Card 4: Interest */}
                            <div className="bg-zinc-800 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-sm text-center">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-2 text-green-600 mx-auto">
                                    <Zap size={16} fill="currentColor" />
                                </div>
                                <div className="text-2xl font-black text-white mb-0.5">High</div>
                                <div className="text-[9px] text-white/80 font-bold tracking-wider uppercase leading-tight">
                                    Campus
                                    <br />
                                    Interest
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
}

const MarqueeRow = ({ items }) => (
    <>
        {items.map((card, index) => (
            <div
                key={index}
                className="group/card w-[240px] md:w-[400px] flex-shrink-0 bg-[#f3f4f6] p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-green-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mx-2 md:mx-5 flex flex-col items-start gap-3 md:gap-6 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-[60px] -mr-20 -mt-20 transition-all opacity-0 group-hover/card:opacity-100"></div>

                <div className="w-10 h-10 md:w-16 md:h-16 bg-green-50 text-green-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm group-hover/card:bg-green-600 group-hover/card:text-white transition-all duration-300 relative z-10">
                    <div className="scale-75 md:scale-100">
                        {card.icon}
                    </div>
                </div>
                <div className="relative z-10">
                    <h4 className="text-base md:text-2xl font-bold text-slate-900 mb-1.5 md:mb-3 group-hover/card:text-green-700 transition-colors">
                        {card.title}
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-xs md:text-base font-medium">
                        {card.desc}
                    </p>
                </div>
            </div>
        ))}
    </>
);
