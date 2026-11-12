import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/whatsapp-uploads/WhatsApp Image 2025-10-30 at 20.06.13_feaacb46.jpg";
import img2 from "../assets/whatsapp-uploads/WhatsApp Image 2025-10-30 at 20.06.27_20b3e035.jpg";
import img4 from "../assets/whatsapp-uploads/WhatsApp Image 2025-10-30 at 20.09.25_4389ea86.jpg";
import img5 from "../assets/whatsapp-uploads/WhatsApp Image 2025-10-30 at 20.09.44_b48879c0.jpg";
import img6 from "../assets/whatsapp-uploads/WhatsApp Image 2025-10-30 at 20.11.27_5ac1d41d.jpg";
import img7 from "../assets/team/avi.jpg";
import p1 from "../assets/marketing/p1.jpeg";
import p2 from "../assets/marketing/2.png";
import g1 from "../assets/marketing/g1.jpeg";
import g2 from "../assets/marketing/g2.jpeg";
import a1 from "../assets/marketing/1.jpeg";
import t1 from "../assets/icons/t1.png";
import re1 from "../re1.jpeg";
import re2 from "../re2.jpeg";
import re3 from "../re3.jpeg";
import re4 from "../re4.png";
import re5 from "../re5.png";
import re6 from "../re6.png";
import ree from "../ree.png";

const testimonials = [
  { name: "Janine", profession: "Entrepreneur", text: "Found reliable performers for my startup in designing!", img: img6 },
  { name: "Avinash", profession: "Student", text: "My group project was saved when I got design help overnight. Smooth process!", img: img7 },
  { name: "Abhi Reddy", profession: "Private job", text: "FirstDoer helped me to get my research work done.", img: img2 },
  { name: "Kiran Das", profession: "Cafe Owner", text: "Found someone to design menu and videographer to make content.", img: img4 },
  { name: "Bunny", profession: "Freelancer", text: "Work got faster and convenient.", img: ree, imgPosition: "center 25%" },
  { name: "Vikram Mehta", profession: "Event Planner", text: "Helped me find local assistants for my events, making setup and coordination so much easier.", img: img1 },
];

const testimonialsRow2 = [
  { name: "Priya Sharma", profession: "Content Creator", text: "FirstDoer connected me with editors and designers. My workflow has never been smoother!", img: re3 },
  { name: "Rahul Nair", profession: "Startup Founder", text: "Got branding and web design done within budget. Highly recommend the platform.", img: re4 },
  { name: "Sneha K.", profession: "Marketing Manager", text: "Found talented freelancers for our campaigns. Quality and turnaround were impressive.", img: re2 },
  { name: "Arjun Patel", profession: "Small Business Owner", text: "From logos to social media—everything I needed was available on one platform.", img: re1 },
  { name: "Meera Iyer", profession: "Educator", text: "Used FirstDoer for workshop materials and presentation design. Professional and quick.", img: re6 },
  { name: "Deepak R.", profession: "Tech Lead", text: "Sourced UI/UX help for our side project. The talent pool here is genuinely skilled.", img: re5 },
];

function TestimonialCard({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-[280px] sm:w-[340px] min-h-[180px] sm:min-h-[220px] bg-white border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)]/40 transition-all flex flex-col justify-between"
    >
      <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed italic line-clamp-3 sm:line-clamp-4 mb-4">
        "{item.text}"
      </p>
      <div className="flex items-center gap-3">
        <img
          src={item.img}
          alt={item.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--color-primary)] object-cover flex-shrink-0"
          style={item.imgPosition ? { objectPosition: item.imgPosition } : undefined}
        />
        <div>
          <p className="font-semibold text-[var(--color-text)] text-sm sm:text-base">{item.name}</p>
          <p className="text-[var(--color-text-subtle)] text-xs sm:text-sm">{item.profession}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonials() {
  const row1Items = [...testimonials, ...testimonials];
  const row2Items = [...testimonialsRow2, ...testimonialsRow2];

  return (
    <section className="relative w-full py-10 md:py-16 flex flex-col justify-center items-center bg-[var(--color-surface)] overflow-hidden">
      <style>{`
        @keyframes testimonialScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes testimonialScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .testimonial-marquee-row:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-6 md:mb-10 px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)]">
            Real Stories from <span className="text-[var(--color-primary)]">FirstDoer</span>
          </h2>
        <p className="text-[var(--color-text-muted)] mt-3 sm:mt-4 text-base sm:text-lg">
          Hear what our users have to say about their experience.
        </p>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 w-20 sm:w-40 h-full bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 sm:w-40 h-full bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none" />

      {/* Two-row marquee */}
      <div className="relative w-full space-y-4 sm:space-y-6">
        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 w-max testimonial-marquee-row px-4 sm:px-8"
            style={{ animation: "testimonialScrollLeft 50s linear infinite" }}
          >
            {row1Items.map((item, i) => (
              <TestimonialCard key={`r1-${i}`} item={item} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 w-max testimonial-marquee-row px-4 sm:px-8"
            style={{ animation: "testimonialScrollRight 55s linear infinite" }}
          >
            {row2Items.map((item, i) => (
              <TestimonialCard key={`r2-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-center mt-6 md:mt-8 px-4">
        <p className="text-[var(--color-text-muted)] italic text-base sm:text-lg">
          "Real people. Real impact. One platform —{" "}
          <span className="text-[var(--color-text)] font-semibold">
            first<span className="text-[var(--color-primary)] font-semibold">Doer</span>
          </span>
          ."
        </p>
      </div>
    </section>
  );
}

export default Testimonials;
