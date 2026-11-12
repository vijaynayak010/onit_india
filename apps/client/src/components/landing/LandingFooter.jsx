import React from "react";
import { Link } from "react-router-dom";

const NAV_COLS = [
  {
    heading: "Categories",
    links: [
      { label: "Growth & Marketing", to: "/domains/content-design-marketing" },
      { label: "Design & Creative", to: "/domains/content-design-marketing" },
      { label: "Build & Develop", to: "/domains/tech-data-admin" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "How it Works", to: "/how-it-works" },
      { label: "Pricing", to: "/pricing" },
      { label: "Performers", to: "/performers-directory" },
      { label: "Partner with us", to: "/partner" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
      { label: "Refunds", to: "/refunds" },
      { label: "Trust & Safety", to: "/trust-safety" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help & Guides", to: "/help" },
      { label: "FAQs", to: "/faq" },
      { label: "support@firstdoer.com", href: "mailto:support@firstdoer.com" },
    ],
  },
];

const SOCIALS = [
  { char: "in", href: "#", label: "LinkedIn" },
  { char: "◎", href: "#", label: "Instagram" },
  { char: "f",  href: "#", label: "Facebook" },
  { char: "𝕏",  href: "#", label: "X" },
  { char: "▶",  href: "#", label: "YouTube" },
];

const LINK_STYLE = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontSize: 13,
  lineHeight: "20px",
  color: "#66716D",
  textDecoration: "none",
};

export default function LandingFooter() {
  return (
    <footer
      style={{
        background: "#FFFFFF",
        paddingTop: "clamp(64px, 9vw, 110px)",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>

        {/* ── Main grid: logo + 5 nav columns ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(20px, 3.5vw, 42px)",
            paddingBottom: "clamp(40px, 6vw, 78px)",
            flexWrap: "wrap",
          }}
        >
          {/* Logo + socials */}
          <div style={{ width: 175, flexShrink: 0 }}>
            {/* Wordmark */}
            <Link
              to="/"
              style={{
                display: "block",
                position: "relative",
                width: 175,
                height: 32,
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 21,
                  lineHeight: "32px",
                  letterSpacing: "-0.7px",
                  color: "#111716",
                }}
              >
                FirstDoer
              </span>
              <span
                style={{
                  position: "absolute",
                  left: 52.67,
                  top: 13.4,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 9,
                  lineHeight: "14px",
                  letterSpacing: 3,
                  color: "#77817E",
                }}
              >
                INDIA
              </span>
            </Link>

            {/* Social circles */}
            <div style={{ display: "flex", gap: 10, marginTop: 34, flexWrap: "wrap" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 27,
                    height: 27,
                    border: "0.8px solid #E4E9E7",
                    borderRadius: 13.5,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      lineHeight: "18px",
                      color: "#717C78",
                      userSelect: "none",
                    }}
                  >
                    {s.char}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div
              key={col.heading}
              style={{
                flex: "1 1 100px",
                display: "flex",
                flexDirection: "column",
                gap: 19,
                minWidth: 90,
              }}
            >
              {/* Column heading */}
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  lineHeight: "20px",
                  color: "#111716",
                  margin: 0,
                  paddingBottom: 8,
                }}
              >
                {col.heading}
              </p>

              {/* Column links */}
              {col.links.map((link) =>
                link.href ? (
                  <a key={link.label} href={link.href} style={LINK_STYLE}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.to} style={LINK_STYLE}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "0.8px solid #E4E9E7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 90,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 11,
              lineHeight: "16px",
              color: "#6F7976",
            }}
          >
            © 2026 FirstDoer · Made in India
          </span>
          <a
            href="mailto:support@firstdoer.com"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 11,
              lineHeight: "16px",
              color: "#6F7976",
              textDecoration: "none",
            }}
          >
            support@firstdoer.com
          </a>
        </div>

      </div>
    </footer>
  );
}
