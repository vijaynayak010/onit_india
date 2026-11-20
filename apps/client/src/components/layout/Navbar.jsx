import React, { useState, useEffect, useRef } from "react";
import { Menu, X, UserCheck, ChevronDown, ArrowRight } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORY_GROUPS = [
  {
    heading: "Business & Operations",
    items: [
      { label: "Business Operations", to: "/tasks/business" },
      { label: "Admin Support", to: "/tasks/admin" },
      { label: "Research", to: "/domains/business-operations-research" },
    ],
  },
  {
    heading: "Content, Design & Marketing",
    items: [
      { label: "Content", to: "/tasks/content" },
      { label: "Design", to: "/services/instagram-post-design-services" },
      { label: "Creative Services", to: "/tasks/creative" },
      { label: "Marketing", to: "/domains/content-design-marketing" },
      { label: "Events", to: "/tasks/events" },
    ],
  },
  {
    heading: "Technology & Academic Support",
    items: [
      { label: "Technology", to: "/domains/tech-data-admin" },
      { label: "Data Support", to: "/tasks/tech" },
      { label: "Academic Support", to: "/domains/academic-knowledge-support" },
      { label: "Knowledge Services", to: "/services/market-research-assistance" },
    ],
  },
  {
    heading: "Local Tasks",
    items: [
      { label: "On-ground Assistance", to: "/domains/on-ground-local-assistance" },
      { label: "Local Tasks", to: "/tasks" },
      { label: "Nearby Performers", to: "/performers-directory" },
    ],
  },
];

const WHY_FIRSTDOER_GROUPS = [
  {
    heading: "For Providers",
    items: [
      { label: "Provider Overview", to: "/for-providers" },
      { label: "Provider Benefits", to: "/why-choose-us" },
      { label: "Post a Task", to: "/provider/post-task-selection" },
      { label: "Posting Your First Task", to: "/help/posting-your-first-task" },
    ],
  },
  {
    heading: "For Performers",
    items: [
      { label: "Performer Overview", to: "/for-performers" },
      { label: "Performer Benefits", to: "/task-performers" },
      { label: "Find Tasks", to: "/tasks" },
      { label: "Verification & Onboarding", to: "/performer-verification-onboarding" },
    ],
  },
  {
    heading: "Company & Trust",
    items: [
      { label: "About FirstDoer", to: "/about" },
      { label: "Trust & Safety", to: "/trust-safety" },
      { label: "Partnerships", to: "/partner-with-us" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];

const RESOURCES_ITEMS = [
  { label: "Blog & Insights", desc: "Articles on work & execution", to: "/blog" },
  { label: "Help Center", desc: "Guides for providers & performers", to: "/help" },
  { label: "FAQs", desc: "Answers to common questions", to: "/faqs" },
  { label: "Community", desc: "Success stories & top performers", to: "/community" },
  { label: "Use Cases", desc: "For startups, agencies & creators", to: "/use-cases" },
  { label: "Services", desc: "Managed execution categories", to: "/services" },
  { label: "Pricing & Fees", desc: "Transparent payment & fee guide", to: "/pricing" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSection, setMobileSection] = useState(null);

  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const currentPath = location.pathname.toLowerCase();
  const isHomePage = currentPath === "/" || currentPath === "/home";
  const userRole = user?.role ? String(user.role).toUpperCase() : "";
  const isProviderRole =
    isAuthenticated && (userRole === "PROVIDER" || userRole === "ADMIN" || userRole === "SUPER_ADMIN");
  const isPerformerRole =
    isAuthenticated && (userRole === "TASKER" || userRole === "PERFORMER" || userRole === "ADMIN" || userRole === "SUPER_ADMIN");

  const isCategoriesActive =
    currentPath.startsWith("/domains") ||
    currentPath.startsWith("/tasks") ||
    currentPath === "/performers-directory";
  const isWhyActive =
    currentPath === "/for-providers" ||
    currentPath === "/for-performers" ||
    currentPath === "/task-performers" ||
    currentPath === "/why-choose-us" ||
    currentPath === "/performer-verification-onboarding";
  const isHowItWorksActive = currentPath === "/how-it-works";
  const isCareersActive = currentPath.startsWith("/careers");
  const isResourcesActive =
    currentPath.startsWith("/blog") ||
    currentPath.startsWith("/help") ||
    currentPath === "/faqs" ||
    currentPath.startsWith("/community") ||
    currentPath.startsWith("/use-cases") ||
    currentPath.startsWith("/services") ||
    currentPath === "/pricing";

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setMobileSection(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = (key) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 120);
  };

  const handleLogin = (role = null) => {
    if (role) {
      localStorage.setItem("onit_selected_role", role);
    } else {
      localStorage.removeItem("onit_selected_role");
    }
    setMenuOpen(false);
    setOpenDropdown(null);
    navigate("/auth", { state: { authMode: "signin" } });
  };

  const handlePostTask = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    localStorage.setItem("onit_selected_role", "provider");
    if (isHomePage) {
      if (!isAuthenticated) {
        navigate("/auth", { state: { tab: "signup" } });
      } else if (userRole === "PROVIDER") {
        navigate("/provider/post-task-manual");
      } else {
        navigate("/auth");
      }
      return;
    }
    navigate("/provider/post-task-selection");
  };

  const getDashboardLink = () => {
    if (!user) return "/auth";
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") return "/auth";
    if (userRole === "TASKER" || userRole === "PERFORMER") return "/performer/dashboard";
    return "/provider/dashboard";
  };

  const handleDashboard = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    navigate(getDashboardLink());
  };

  const pillLinkClass = (active) =>
    `inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 2xl:px-3.5 py-2 text-[14px] transition-colors duration-200 ${
      active
        ? "bg-[#F1F3F3] text-[#0D1210] font-medium"
        : "text-[#3F4A47] hover:bg-[#0D1210]/5 hover:text-[#0D1210]"
    }`;

  return (
    <header
      ref={navRef}
      style={{
        position: isHomePage ? "sticky" : "fixed",
        top: isHomePage ? "12px" : "48px",
        left: 0,
        right: 0,
        zIndex: 9999,
        height: isHomePage ? 0 : undefined,
        padding: "0 clamp(16px, 3.5vw, 48px)",
        width: "100%",
        fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <nav
        aria-label="Main"
        style={{
          position: "relative",
          margin: isHomePage ? "14px auto 0" : "0 auto",
          maxWidth: "1480px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "10px 14px 10px 24px",
          borderRadius: "999px",
          border: "1px solid #E4E7E6",
          background: "rgba(255,255,255,0.92)",
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 16px rgba(0,20,13,0.06)",
        }}
      >
        {/* ================= BRAND WORDMARK ================= */}
        <Link
          to="/"
          aria-label="firstDoer home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            color: "#0D1210",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "21px", fontWeight: 600, letterSpacing: "-0.04em" }}>
            firstDoer
          </span>
        </Link>

        {/* ================= DESKTOP CENTER NAV ================= */}
        <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2">
          {/* 1. Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("categories")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              aria-expanded={openDropdown === "categories"}
              aria-haspopup="true"
              onClick={() => setOpenDropdown(openDropdown === "categories" ? null : "categories")}
              className={pillLinkClass(isCategoriesActive || openDropdown === "categories")}
            >
              Categories
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openDropdown === "categories" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "categories" && (
              <div
                role="menu"
                aria-label="Categories menu"
                className="absolute left-0 top-full mt-3 w-[680px] rounded-2xl border border-[#E4E7E6] bg-white p-6 shadow-[0_20px_50px_-12px_rgba(0,20,13,0.14)] z-[10000]"
              >
                <div className="grid grid-cols-2 gap-6">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#10605F]">
                        {group.heading}
                      </div>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              role="menuitem"
                              to={item.to}
                              onClick={() => setOpenDropdown(null)}
                              className={`block rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors ${
                                currentPath === item.to
                                  ? "bg-[#EFFBFB] text-[#10605F]"
                                  : "text-[#191F1D] hover:bg-[#EFFBFB] hover:text-[#10605F]"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#DFF7F6] pt-4">
                  <span className="text-xs text-[#56615E]">Explore task scopes across all FirstDoer domains</span>
                  <Link
                    to="/tasks"
                    onClick={() => setOpenDropdown(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10605F] hover:text-[#083B3A]"
                  >
                    Browse all categories
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 2. Why FirstDoer Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("why")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              aria-expanded={openDropdown === "why"}
              aria-haspopup="true"
              onClick={() => setOpenDropdown(openDropdown === "why" ? null : "why")}
              className={pillLinkClass(isWhyActive || openDropdown === "why")}
            >
              Why FirstDoer
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openDropdown === "why" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "why" && (
              <div
                role="menu"
                aria-label="Why FirstDoer menu"
                className="absolute left-1/2 top-full mt-3 w-[680px] -translate-x-1/2 rounded-2xl border border-[#E4E7E6] bg-white p-6 shadow-[0_20px_50px_-12px_rgba(0,20,13,0.14)] z-[10000]"
              >
                <div className="grid grid-cols-3 gap-5">
                  {WHY_FIRSTDOER_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#10605F]">
                        {group.heading}
                      </div>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              role="menuitem"
                              to={item.to}
                              onClick={() => setOpenDropdown(null)}
                              className={`block rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium transition-colors ${
                                currentPath === item.to
                                  ? "bg-[#EFFBFB] text-[#10605F]"
                                  : "text-[#191F1D] hover:bg-[#EFFBFB] hover:text-[#10605F]"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. How It Works */}
          <Link to="/how-it-works" className={pillLinkClass(isHowItWorksActive)}>
            How It Works
          </Link>

          {/* 4. Careers */}
          <Link to="/careers" className={pillLinkClass(isCareersActive)}>
            Careers
          </Link>

          {/* 5. Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("resources")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              aria-expanded={openDropdown === "resources"}
              aria-haspopup="true"
              onClick={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
              className={pillLinkClass(isResourcesActive || openDropdown === "resources")}
            >
              Resources
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openDropdown === "resources" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "resources" && (
              <div
                role="menu"
                aria-label="Resources menu"
                className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-[#E4E7E6] bg-white p-2.5 shadow-[0_20px_50px_-12px_rgba(0,20,13,0.14)] z-[10000]"
              >
                {RESOURCES_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    role="menuitem"
                    to={item.to}
                    onClick={() => setOpenDropdown(null)}
                    className={`block rounded-xl px-3.5 py-2 transition-colors ${
                      currentPath === item.to
                        ? "bg-[#EFFBFB] text-[#10605F]"
                        : "hover:bg-[#EFFBFB]"
                    }`}
                  >
                    <div className="text-[13.5px] font-semibold text-[#0D1210]">{item.label}</div>
                    <div className="text-[11.5px] text-[#56615E]">{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= DESKTOP RIGHT ACTIONS ================= */}
        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => handleLogin()}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] text-[#3F4A47] transition-colors hover:bg-[#0D1210]/5 hover:text-[#0D1210]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handlePostTask}
                className="inline-flex whitespace-nowrap items-center rounded-full bg-[#0D1210] px-5 py-2.5 text-[14px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#191F1D]"
              >
                Post a Task
              </button>
            </>
          ) : (
            <>
              {isPerformerRole && !isProviderRole ? (
                <Link
                  to="/tasks"
                  className="whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium text-[#3F4A47] transition-colors hover:bg-[#0D1210]/5 hover:text-[#0D1210]"
                >
                  Find Tasks
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handlePostTask}
                  className="whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium text-[#3F4A47] transition-colors hover:bg-[#0D1210]/5 hover:text-[#0D1210]"
                >
                  Post a Task
                </button>
              )}
              <button
                type="button"
                onClick={handleDashboard}
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#0D1210] px-5 py-2.5 text-[14px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#191F1D]"
              >
                <UserCheck size={15} strokeWidth={2.2} aria-hidden="true" />
                Dashboard
              </button>
            </>
          )}
        </div>

        {/* ================= MOBILE / TABLET CONTROLS ================= */}
        <div className="flex xl:hidden items-center gap-2 shrink-0">
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={handlePostTask}
              className="hidden sm:inline-flex whitespace-nowrap items-center rounded-full bg-[#0D1210] px-4 py-2 text-[13px] font-medium text-white"
            >
              Post a Task
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDashboard}
              className="hidden sm:inline-flex whitespace-nowrap items-center gap-1.5 rounded-full bg-[#0D1210] px-4 py-2 text-[13px] font-medium text-white"
            >
              <UserCheck size={14} strokeWidth={2.2} aria-hidden="true" />
              Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full p-2 text-[#0D1210] transition hover:bg-[#0D1210]/5"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE / TABLET DRAWER ================= */}
      {menuOpen && (
        <div className="xl:hidden mx-auto mt-2 max-w-[1480px] rounded-2xl border border-[#E4E7E6] bg-white p-5 shadow-[0_20px_50px_-12px_rgba(0,20,13,0.16)] max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex flex-col space-y-1.5">
            {/* Categories Accordion */}
            <div>
              <button
                type="button"
                aria-expanded={mobileSection === "categories"}
                onClick={() => setMobileSection(mobileSection === "categories" ? null : "categories")}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[#0D1210] hover:bg-[#EFFBFB] hover:text-[#10605F]"
              >
                <span>Categories</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${mobileSection === "categories" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "categories" && (
                <div className="mt-1 space-y-3 rounded-xl bg-[#EFFBFB]/60 p-3.5">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#10605F]">
                        {group.heading}
                      </div>
                      <div className="flex flex-col space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium text-[#191F1D] hover:bg-white hover:text-[#10605F]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why FirstDoer Accordion */}
            <div>
              <button
                type="button"
                aria-expanded={mobileSection === "why"}
                onClick={() => setMobileSection(mobileSection === "why" ? null : "why")}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[#0D1210] hover:bg-[#EFFBFB] hover:text-[#10605F]"
              >
                <span>Why FirstDoer</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${mobileSection === "why" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "why" && (
                <div className="mt-1 space-y-3 rounded-xl bg-[#EFFBFB]/60 p-3.5">
                  {WHY_FIRSTDOER_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#10605F]">
                        {group.heading}
                      </div>
                      <div className="flex flex-col space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium text-[#191F1D] hover:bg-white hover:text-[#10605F]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium ${
                isHowItWorksActive
                  ? "bg-[#EFFBFB] text-[#10605F]"
                  : "text-[#0D1210] hover:bg-[#EFFBFB] hover:text-[#10605F]"
              }`}
            >
              How It Works
            </Link>

            <Link
              to="/careers"
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium ${
                isCareersActive
                  ? "bg-[#EFFBFB] text-[#10605F]"
                  : "text-[#0D1210] hover:bg-[#EFFBFB] hover:text-[#10605F]"
              }`}
            >
              Careers
            </Link>

            {/* Resources Accordion */}
            <div>
              <button
                type="button"
                aria-expanded={mobileSection === "resources"}
                onClick={() => setMobileSection(mobileSection === "resources" ? null : "resources")}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[#0D1210] hover:bg-[#EFFBFB] hover:text-[#10605F]"
              >
                <span>Resources</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${mobileSection === "resources" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "resources" && (
                <div className="mt-1 flex flex-col space-y-1 rounded-xl bg-[#EFFBFB]/60 p-3">
                  {RESOURCES_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-2.5 py-2 text-[14px] font-medium text-[#191F1D] hover:bg-white hover:text-[#10605F]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-[#E4E7E6] pt-4">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="w-full rounded-full border border-[#E4E7E6] bg-white py-2.5 text-[14px] font-medium text-[#0D1210]"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handlePostTask}
                  className="w-full rounded-full bg-[#0D1210] py-2.5 text-[14px] font-medium text-white"
                >
                  Post a Task
                </button>
              </>
            ) : (
              <>
                {isPerformerRole && !isProviderRole ? (
                  <Link
                    to="/tasks"
                    onClick={() => setMenuOpen(false)}
                    className="w-full rounded-full border border-[#E4E7E6] bg-white py-2.5 text-center text-[14px] font-medium text-[#0D1210]"
                  >
                    Find Tasks
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handlePostTask}
                    className="w-full rounded-full border border-[#E4E7E6] bg-white py-2.5 text-[14px] font-medium text-[#0D1210]"
                  >
                    Post a Task
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0D1210] py-2.5 text-[14px] font-medium text-white"
                >
                  <UserCheck size={16} strokeWidth={2.2} aria-hidden="true" />
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
