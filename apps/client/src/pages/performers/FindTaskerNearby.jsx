import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Search, Star, ArrowRight, CheckCircle, Zap, X, LogIn } from "react-feather";

export const sampleTaskers = [
  // Bengaluru
  {
    name: "Market research specialist",
    domain: "Business Operations & Research",
    location: "Koramangala, Bengaluru",
    city: "bengaluru",
    rating: 4.9,
    jobs: "1.2k",
    distance: "2.1 km",
  },
  {
    name: "Content & design generalist",
    domain: "Content, Design & Marketing",
    location: "HSR Layout, Bengaluru",
    city: "bengaluru",
    rating: 4.8,
    jobs: "980",
    distance: "3.4 km",
  },
  {
    name: "Data & Excel operator",
    domain: "Tech, Data and Admin",
    location: "Indiranagar, Bengaluru",
    city: "bengaluru",
    rating: 4.9,
    jobs: "1.1k",
    distance: "4.0 km",
  },
  // Mumbai
  {
    name: "Brand tracking researcher",
    domain: "Business Operations & Research",
    location: "Andheri West, Mumbai",
    city: "mumbai",
    rating: 4.8,
    jobs: "1.3k",
    distance: "2.5 km",
  },
  {
    name: "Social media designer",
    domain: "Content, Design & Marketing",
    location: "Bandra, Mumbai",
    city: "mumbai",
    rating: 4.9,
    jobs: "1.5k",
    distance: "3.1 km",
  },
  {
    name: "On-ground merchandiser",
    domain: "On-Ground & Local Assistance",
    location: "Powai, Mumbai",
    city: "mumbai",
    rating: 4.7,
    jobs: "920",
    distance: "4.2 km",
  },
  // Delhi NCR
  {
    name: "Excel & reporting analyst",
    domain: "Tech, Data and Admin",
    location: "Gurugram, Delhi NCR",
    city: "delhi",
    rating: 4.8,
    jobs: "1.1k",
    distance: "3.3 km",
  },
  {
    name: "Academic writing assistant",
    domain: "Academic & Knowledge Support",
    location: "South Delhi",
    city: "delhi",
    rating: 4.9,
    jobs: "1.0k",
    distance: "2.7 km",
  },
  {
    name: "Retail audit tasker",
    domain: "On-Ground & Local Assistance",
    location: "Noida Sector 18",
    city: "delhi",
    rating: 4.7,
    jobs: "780",
    distance: "3.9 km",
  },
  // Hyderabad
  {
    name: "Lead research specialist",
    domain: "Business Operations & Research",
    location: "Hitech City, Hyderabad",
    city: "hyderabad",
    rating: 4.8,
    jobs: "1.2k",
    distance: "2.2 km",
  },
  {
    name: "Video editing executor",
    domain: "Content, Design & Marketing",
    location: "Gachibowli, Hyderabad",
    city: "hyderabad",
    rating: 4.9,
    jobs: "1.3k",
    distance: "3.0 km",
  },
  {
    name: "Data operations executive",
    domain: "Tech, Data and Admin",
    location: "Madhapur, Hyderabad",
    city: "hyderabad",
    rating: 4.8,
    jobs: "950",
    distance: "3.6 km",
  },
  // Chennai
  {
    name: "Thesis formatting helper",
    domain: "Academic & Knowledge Support",
    location: "Adyar, Chennai",
    city: "chennai",
    rating: 4.9,
    jobs: "870",
    distance: "2.4 km",
  },
  {
    name: "Local verification runner",
    domain: "On-Ground & Local Assistance",
    location: "T. Nagar, Chennai",
    city: "chennai",
    rating: 4.8,
    jobs: "910",
    distance: "3.1 km",
  },
  {
    name: "Spreadsheet automation aide",
    domain: "Tech, Data and Admin",
    location: "OMR, Chennai",
    city: "chennai",
    rating: 4.7,
    jobs: "800",
    distance: "4.3 km",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function FindTaskerNearby() {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const canUseGeolocation = typeof navigator !== "undefined" && "geolocation" in navigator;

  const results = useMemo(() => {
    // Only show taskers once we have either a typed location or detected coordinates.
    if (!location && !coords) return [];

    // In a real implementation this would call the backend with location/coords.
    // For now we filter our sample data by location / city / domain text if available.
    let base = sampleTaskers;
    if (location && location !== "your current location") {
      const q = location.toLowerCase();
      const filtered = base.filter(
        (t) =>
          t.location.toLowerCase().includes(q) ||
          (t.city && t.city.toLowerCase().includes(q)) ||
          t.domain.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      );
      if (filtered.length) {
        base = filtered;
      }
    }
    return base;
  }, [location, coords]);

  const handleUseMyLocation = () => {
    if (!canUseGeolocation) {
      setStatus("Location not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setStatus("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocation("your current location");
        setStatus("Location detected. Showing taskers near you.");
        setIsLocating(false);
      },
      () => {
        setStatus("Couldn't access location. Please search by area or pincode.");
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const value = locationInput.trim();
    if (!value) return;
    setLocation(value);
    setStatus(`Showing taskers near "${value}".`);
  };

  return (
    <section
      aria-labelledby="find-taskers-heading"
      className="relative w-full overflow-hidden bg-[var(--color-surface)]"
    >
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[1px] w-[80%] max-w-md -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[300px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        <div className="absolute top-1/2 left-[-5%] w-[280px] h-[280px] rounded-full bg-teal-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-24">
        {/* Section header - structured block */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-10 sm:mb-12 md:mb-14 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] shadow-sm"
          >
            <MapPin size={14} className="text-[var(--color-primary)]" aria-hidden />
            Hyperlocal discovery
          </motion.div>

          <motion.h2
            id="find-taskers-heading"
            variants={itemVariants}
            className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl lg:text-[2.25rem]"
          >
            Find Performers Nearby You
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base"
          >
            Search by area or use your current location to discover verified taskers around you—then post a task and get matched quickly.
          </motion.p>
        </motion.div>

        {/* Main content grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-stretch"
        >
          {/* Left: Value props - structured list */}
          <div className="flex flex-col justify-center lg:max-w-[420px] lg:mx-auto lg:w-full">
            <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
              Why use nearby search
            </p>
            <ul className="space-y-3" role="list">
              {[
                { icon: Star, label: "Rated & reviewed", desc: "Only verified taskers with real reviews" },
                { icon: Navigation, label: "Nearby results", desc: "Sorted by distance for faster help" },
                { icon: Zap, label: "Post in minutes", desc: "Get matched and start your task quickly" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-white p-4 shadow-sm transition hover:border-[var(--color-primary)]/20 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)]">
                      <Icon size={20} className="text-[var(--color-primary)]" aria-hidden />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-[var(--color-text)]">{item.label}</span>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right: Search card - structured block */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] overflow-hidden ring-1 ring-black/5">
            {/* Card accent bar */}
            <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-500" />

            <div className="border-b border-[var(--color-border-subtle)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[var(--color-text)]">Search nearby</span>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={!canUseGeolocation || isLocating}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/50 hover:bg-white hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Navigation size={14} aria-hidden />
                  {isLocating ? "Locating…" : "Use my location"}
                </button>
              </div>

              <form onSubmit={handleLocationSubmit} className="mt-4 flex flex-col gap-3">
                <label className="flex items-center gap-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-3 transition focus-within:border-[var(--color-primary)] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(5,150,105,0.08)]">
                  <Search size={18} className="shrink-0 text-[var(--color-primary)]" aria-hidden />
                  <input
                    type="search"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter your area, landmark or pincode"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none"
                    aria-label="Enter your location to find nearby taskers"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] hover:shadow-[0_2px_8px_-2px_rgba(5,150,105,0.4)]"
                  >
                    Find taskers nearby
                    <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              </form>

              {status ? (
                <p
                  className={`mt-3 flex items-center gap-2 text-xs ${
                    status.startsWith("Location detected")
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                  role="status"
                >
                  {status.startsWith("Location detected") && (
                    <CheckCircle size={14} className="shrink-0" aria-hidden />
                  )}
                  {status}
                </p>
              ) : (
                <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
                  {coords || location
                    ? `Showing representative nearby taskers${
                        location && location !== "your current location" ? ` for "${location}".` : "."
                      }`
                    : "Tip: enter your area or use your location for more accurate nearby results."}
                </p>
              )}
            </div>

            <div className="bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[var(--color-text)]">Suggested taskers</span>
                <span className="text-xs text-[var(--color-text-subtle)]">
                  {results.length} nearby option{results.length !== 1 ? "s" : ""}
                  {location && location !== "your current location"
                    ? ` around "${location}"`
                    : coords
                    ? " near you"
                    : ""}
                </span>
              </div>

              {results.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-white/60 px-4 py-5 text-xs text-[var(--color-text-subtle)]">
                  <p className="font-semibold text-[var(--color-text)] mb-1">No nearby taskers yet.</p>
                  <p>Enter your area or use your current location to view taskers that typically serve that region.</p>
                </div>
              ) : (
                <div className="mt-4 max-h-60 sm:max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  <ul className="grid gap-3" role="list">
                    {results.map((t, i) => (
                      <motion.li
                        key={t.name}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3.5 shadow-sm transition hover:border-[var(--color-primary)]/30 hover:shadow-md">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                                {t.name}
                              </p>
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                {t.domain}
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                              <MapPin size={11} className="shrink-0 text-[var(--color-primary)]" aria-hidden />
                              <span className="truncate">{t.location}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-text-muted)]">
                              <span className="inline-flex items-center gap-1">
                                <Star size={12} className="shrink-0 text-[var(--color-primary)]" aria-hidden />
                                {t.rating}
                              </span>
                              <span className="text-[var(--color-text-subtle)]" aria-hidden>·</span>
                              <span>{t.jobs}+ jobs completed</span>
                              <span className="text-[var(--color-text-subtle)]" aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} className="shrink-0 text-[var(--color-primary)]" aria-hidden />
                                {t.distance} away
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowLoginModal(true)}
                            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-hover)] hover:shadow-[0_2px_8px_-2px_rgba(5,150,105,0.4)] w-full sm:w-auto"
                          >
                            View profile
                            <ArrowRight size={14} aria-hidden />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex justify-center sm:justify-end">
                <Link
                  to={
                    location && location !== "your current location"
                      ? `/performers-directory?city=${encodeURIComponent(location)}`
                      : "/performers-directory"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition w-full sm:w-auto text-center"
                >
                  Explore more performers by domain
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Login required modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-white shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center pt-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] mb-4">
                  <LogIn size={24} />
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                  Please login to continue
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                  Sign in or create an account to view tasker profiles and post tasks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate("/auth", { state: { authMode: "login" } });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition"
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
