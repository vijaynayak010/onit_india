import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Plus, UserCheck } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Standard public links
  const publicNavItems = [
    { name: "About Us", target: "about" },
    { name: "Careers", target: "careers" },
    { name: "Blog", target: "blog" },
    { name: "Contact", target: "contact" },
    { name: "Why Choose Us", target: "why-choose-us" },
    { name: "Partner with us", target: "partner-with-us" },
  ];

  const dynamicNavItems = React.useMemo(() => {
    let items = [...publicNavItems];

    if (!isAuthenticated || !user) {
      items.push({ name: "Join as Performer", target: "join-performer" });
      return items;
    }

    const role = String(user.role).toUpperCase();

    if (role === "PROVIDER" || role === "ADMIN" || role === "SUPER_ADMIN") {
      items.unshift({ name: "Post Task", target: "post-task" });
      // If provider, they might still want to join as performer if they have dual role? 
      // But for now, let's keep it simple.
    }

    if (role === "TASKER" || role === "PERFORMER" || role === "ADMIN" || role === "SUPER_ADMIN") {
      items.unshift({ name: "Find Tasks", target: "find-tasks" });
    }

    return items;
  }, [isAuthenticated, user]);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll effect (passive so browser can keep scrolling smooth)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  };

  const letterVariants = {
    hidden: { y: 4, opacity: 1 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  };

  // Robust Scroll To Element Logic
  const tryFindElement = (id) => {
    if (!id) return null;
    const candidates = [
      id,
      "Campus",
      "OnitCampus",
      "ONITCampus",
      "onit-campus",
      id.replace(/\s+/g, ""), // remove spaces
      id.toLowerCase(),
    ];
    for (const c of candidates) {
      const el = document.getElementById(c);
      if (el) return el;
    }
    return document.querySelector(`[id*="${id.toLowerCase().replace(/\s/g, "")}"]`);
  };

  const handleScrollTo = (targetId) => {
    setMenuOpen(false);

    if (targetId === "about") {
      navigate("/about");
      return;
    }

    if (targetId === "why-choose-us") {
      navigate("/why-choose-us");
      return;
    }

    if (targetId === "what-is-onit-india") {
      navigate("/what-is-onit-india");
      return;
    }

    if (targetId === "how-it-works") {
      navigate("/how-it-works");
      return;
    }

    if (targetId === "tasks") {
      navigate("/tasks");
      return;
    }

    if (targetId === "careers") {
      navigate("/careers");
      return;
    }

    if (targetId === "blog") {
      navigate("/blog");
      return;
    }

    if (targetId === "contact") {
      navigate("/contact");
      return;
    }

    if (targetId === "partner-with-us") {
      navigate("/partner-with-us");
      return;
    }

    if (targetId === "join-performer") {
      navigate("/task-performers");
      return;
    }

    if (targetId === "post-task") {
      if (window.location.pathname === "/") {
        const el = document.getElementById("hero-post-task");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate("/provider/post-task-selection");
      }
      return;
    }

    if (targetId === "find-tasks") {
      navigate("/tasks");
      return;
    }

    if (targetId === "OnitCampus") {
      navigate("/campus-detail#campus");
      return;
    }

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = tryFindElement(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      const el = tryFindElement(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTaskPerformer = () => {
    navigate("/task-performers");
    setMenuOpen(false);
  };

  const handleLogin = (role = null) => {
    if (role) {
      localStorage.setItem('onit_selected_role', role);
    } else {
      localStorage.removeItem('onit_selected_role');
    }
    setMenuOpen(false);
    navigate("/auth", { state: { authMode: "signin" } });
  };

  const handleStartPosting = () => {
    setMenuOpen(false);
    localStorage.setItem('onit_selected_role', 'provider');
    if (window.location.pathname === "/") {
      const el = document.getElementById("hero-post-task");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/provider/post-task-selection");
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/auth";
    const role = String(user.role).toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/auth";
    if (role === "TASKER" || role === "PERFORMER") return "/performer/dashboard";
    return "/provider/dashboard";
  };

  const handleDashboard = () => {
    setMenuOpen(false);
    navigate(getDashboardLink());
  };

  return (
    <>
      <header
        className={`fixed top-10 left-0 right-0 w-full h-16 md:h-20 z-[9999] transition-all duration-300 ease-out ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_4px 24px -4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
          : "bg-white/70 backdrop-blur-xl shadow-[0_1px 3px_rgba(0,0,0,0.04)]"
          }`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent opacity-80" />

        {/* Inner container: full width so Login + Start posting sit at right edge */}
        <div className="mx-auto h-full w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* ================= BRAND WORDMARK ================= */}
          <div
            className="flex h-full min-h-[52px] md:min-h-[64px] items-center shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:opacity-90 active:scale-[0.98] py-1 ml-2 sm:ml-3"
            onClick={() => navigate("/")}
          >
            <img src="/logo.png" alt="OnIT India Logo" className="h-12 w-18 object-contain mr-2" />

          </div>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex gap-4 lg:gap-6 absolute left-1/2 transform -translate-x-1/2 items-center">
            {dynamicNavItems.map((item, index) => {
              const isSpecial = item.target === "join-performer" || item.target === "post-task" || item.target === "find-tasks";
              return (
                <motion.div
                  key={index}
                  className="relative cursor-pointer flex flex-col items-center group"
                  onClick={() => isSpecial ? handleScrollTo(item.target) : handleScrollTo(item.target)}
                  variants={containerVariants}
                  initial="hidden"
                  whileHover="visible"
                >
                  <div className="relative">
                    <div className="flex">
                      {item.name.split("").map((char, idx) => (
                        <motion.span
                          key={idx}
                          variants={letterVariants}
                          className="inline-block text-[15px] font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </div>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[var(--color-primary)] rounded-full group-hover:w-full transition-all duration-300 origin-left" />
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* ================= DESKTOP BUTTONS ================= */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Unified Login */}
                <button
                  onClick={() => handleLogin()}
                  className="text-[13px] font-bold text-slate-700 hover:text-white border border-slate-300 hover:bg-slate-800 px-5 py-2 rounded-full transition-all duration-200"
                >
                  Login / Sign up
                </button>

                <div className="w-[0.5px] h-4 bg-slate-200 mx-1" />

                <button
                  onClick={handleStartPosting}
                  className="hidden lg:inline-flex items-center gap-2 text-[13px] font-extrabold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-5 py-2 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,153,102,0.15)]"
                >
                  <Plus size={15} strokeWidth={3} aria-hidden />
                  Start Posting
                </button>
              </div>
            ) : (
              <button
                onClick={handleDashboard}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_4px_15px_rgba(0,153,102,0.25)] hover:shadow-[0_6px_20px_rgba(0,153,102,0.35)] hover:-translate-y-0.5 active:scale-95"
              >
                <UserCheck size={16} strokeWidth={2.5} />
                Dashboard
              </button>
            )}
          </div>
          {/* ================= MOBILE MENU BUTTON ================= */}
          <div className="md:hidden z-[1000]">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--color-border-subtle)] transition"
            >
              {menuOpen ? <X size={24} className="text-[var(--color-text)]" /> : <Menu size={24} className="text-[var(--color-text)]" />}
            </button>
          </div>
        </div>
        {/* ================= MOBILE DROPDOWN ================= */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-[4.5rem] left-0 w-full bg-white/95 backdrop-blur-xl shadow-[0_10px 40px -10px_rgba(0,0,0,0.1)] border-t border-[var(--color-border-subtle)] flex flex-col items-center py-6 space-y-4 md:hidden overflow-hidden"
            >
              {dynamicNavItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleScrollTo(item.target)}
                  className={`relative text-base font-medium transition-all ${item.target === "post-task" || item.target === "find-tasks"
                    ? "text-[var(--color-primary)] font-bold bg-[var(--color-primary-subtle)] px-6 py-2 rounded-full"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-semibold"
                    }`}
                >
                  {item.name}
                </button>
              ))}

              {!isAuthenticated ? (
                <div className="flex flex-col w-full px-6 gap-3 pt-2">
                  <button
                    onClick={() => handleLogin()}
                    className="w-full text-base font-bold text-slate-700 border-2 border-slate-300 py-3 rounded-full transition"
                  >
                    Login / Sign up
                  </button>

                  <button
                    onClick={handleStartPosting}
                    className="inline-flex items-center justify-center gap-2 w-full text-base font-bold text-white bg-[var(--color-primary)] py-3.5 rounded-full transition shadow-md mt-2"
                  >
                    <Plus size={18} strokeWidth={2.5} aria-hidden />
                    Start posting as Provider
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDashboard}
                  className="inline-flex items-center justify-center gap-2 w-full max-w-[220px] text-base font-bold text-white bg-[var(--color-primary)] px-6 py-3 rounded-full transition shadow-md"
                >
                  <UserCheck size={18} strokeWidth={2.5} />
                  Go to Dashboard
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Styles for slow pulse animation */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

export default Navbar;