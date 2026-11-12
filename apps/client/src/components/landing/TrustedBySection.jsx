import React from "react";

const BRANDS = ["Kalpa", "nimbus", "Tarang", "VERVE", "saffronpay", "Northwind"];

export default function TrustedBySection() {
  return (
    <section
      className="flex flex-col items-center justify-center"
      style={{ padding: "48px 0" }}
    >
      {/* heading */}
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(22px, 3vw, 36px)",
          lineHeight: "1.25",
          color: "#808A87",
          textAlign: "center",
        }}
      >
        Trusted by growing businesses
      </p>

      {/* brand names */}
      <div
        className="flex flex-wrap items-center justify-center px-4 md:px-[39px] gap-6 md:gap-[105px]"
        style={{ marginTop: 36 }}
      >
        {BRANDS.map((name) => (
          <span
            key={name}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "27px",
              letterSpacing: "0.54px",
              color: "#808A87",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
