import React from "react";
import { Link } from "react-router-dom";
import "./footerAnimations.css";

const footCols = [
  {
    h: "Categories",
    links: [
      { label: "Growth & Marketing", to: "/domains/content-design-marketing" },
      { label: "Design & Creative", to: "/domains/content-design-marketing" },
      { label: "Build & Develop", to: "/domains/tech-data-admin" },
      { label: "All Categories", to: "/tasks" },
    ],
  },
  {
    h: "Platform",
    links: [
      { label: "How it Works", to: "/#steps" },
      { label: "Live Tracking", to: "/#how" },
      { label: "Why firstDoer", to: "/#why" },
      { label: "Verified Performers", to: "/performers-directory" },
    ],
  },
  {
    h: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
      { label: "Contact Support", to: "/contact" },
    ],
  },
  {
    h: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms-and-conditions" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Trust & Safety", to: "/trust-safety" },
    ],
  },
  {
    h: "Support",
    links: [
      { label: "Help & FAQ", to: "/#faq" },
      { label: "Dispute Resolution", to: "/dispute-resolution-policy" },
      { label: "Pricing Overview", to: "/pricing" },
    ],
  },
];

function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        width: "calc(100% - 20px)",
        margin: "0 10px 10px",
        padding: 0,
        boxSizing: "border-box",
        fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: 0,
          borderRadius: "28px",
          background: "#DFF7F6",
          color: "#0D1210",
          padding: "44px clamp(24px, 3vw, 52px) 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "36px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 240px", maxWidth: "300px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
                <path
                  d="M11 2.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.4 0 5.6-2.4 8-8.5 2.4-6.1 4.6-8.5 8-8.5"
                  stroke="#29ADAC"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M19 19.5c4.7 0 8.5-3.8 8.5-8.5S23.7 2.5 19 2.5c-3.4 0-5.6 2.4-8 8.5"
                  stroke="#4CCDCC"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.04em" }}>
                firstDoer
              </span>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "14px", color: "#3F4A47" }}>
              Post your task. Get it done.
            </p>
            <a
              href="mailto:support@firstdoer.com"
              style={{
                display: "inline-block",
                marginTop: "12px",
                fontSize: "14px",
                color: "#10605F",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              support@firstdoer.com
            </a>

            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="fd-footer-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid #A2E7E7",
                  background: "#FFFFFF",
                  color: "#0D1210",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="fd-footer-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid #A2E7E7",
                  background: "#FFFFFF",
                  color: "#0D1210",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.2H7.5V12h2.8v10h3.7V12h2.8l.4-3.5z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="fd-footer-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid #A2E7E7",
                  background: "#FFFFFF",
                  color: "#0D1210",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="fd-footer-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid #A2E7E7",
                  background: "#FFFFFF",
                  color: "#0D1210",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.8 15.1V8.9l5.8 3.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div
            style={{
              flex: "3 1 560px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "24px 32px",
            }}
          >
            {footCols.map((c) => (
              <nav key={c.h} aria-label={c.h}>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#56615E",
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {c.h}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "12px 0 0",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link to={l.to} style={{ color: "#191F1D", textDecoration: "none" }}>
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} style={{ color: "#191F1D", textDecoration: "none" }}>
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            margin: "36px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid #A2E7E7",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "13px",
            color: "#3F4A47",
          }}
        >
          <span>© 2026 firstDoer</span>
          <span style={{ fontFeatureSettings: '"tnum" 1' }}>Verified performers only</span>
        </div>

        <div
          aria-hidden="true"
          className="fd-footer-px-x"
          style={{
            width: "100%",
            margin: "16px auto 0",
            fontSize: "clamp(52px, 12vw, 150px)",
            lineHeight: 0.82,
            fontWeight: 600,
            letterSpacing: "-0.07em",
            color: "rgba(16,96,95,.10)",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          firstDoer
        </div>
      </div>
    </footer>
  );
}

export default Footer;
