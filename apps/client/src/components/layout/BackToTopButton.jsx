import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const SCROLL_TRIGGER = 200; // px before button appears

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > SCROLL_TRIGGER);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleScrollUp = () => {
    const el = document.getElementById("home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    show && (
      <button
        onClick={handleScrollUp}
        className="fixed bottom-8 right-8 z-[1000] bg-blue-600 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Back to top"
      >
        <FaArrowUp size={22} />
      </button>
    )
  );
}
