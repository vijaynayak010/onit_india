import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaEnvelope, FaApple, FaGooglePlay, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

import { API_BASE } from "../../config";

// App store links – replace with your live URLs when apps are published
const APP_LINKS = {
  taskProvider: {
    android: "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share",
  },
  taskPerformer: {
    android: "https://play.google.com/store/apps/details?id=com.onitconsumer.india&pcampaignid=web_share",
  },
};

function Footer({ onShowPrivacyPolicy }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter an email");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {

        setEmail("");
      } else {

      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <footer className="w-full bg-[#004d43] text-white pt-10 md:pt-20 pb-10 px-6 md:px-20 relative overflow-hidden rounded-t-[3rem]">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 relative z-10">
        {/* Left Section: Brand & Newsletter */}
        <div className="w-full lg:w-5/12 space-y-8">
          {/* Brand Tagline */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
              Post work. Get it executed.
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed max-w-md">
              <span className="text-black font-bold">On</span><span className="text-green-500 font-bold">IT</span> India connects people who need work done with performers ready to execute tasks quickly. Building execution infrastructure for the modern work economy.
            </p>
          </div>

          

        </div>

        {/* Right Section: Link columns — structured for clarity */}
        <div className="w-full lg:w-7/12 flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* 1. Platform */}
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-widest">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-zinc-300 hover:text-white transition-colors text-sm">How it Works</Link></li>
                <li><Link to="/what-is-onit-india" className="text-zinc-300 hover:text-white transition-colors text-sm">What is OnIT INDIA</Link></li>
                <li><Link to="/execution-infrastructure" className="text-zinc-300 hover:text-white transition-colors text-sm">Execution Infrastructure</Link></li>
                <li><Link to="/services" className="text-zinc-300 hover:text-white transition-colors text-sm">Services</Link></li>
                <li><Link to="/tasks" className="text-zinc-300 hover:text-white transition-colors text-sm">Task categories</Link></li>
                <li><Link to="/performers-directory" className="text-zinc-300 hover:text-white transition-colors text-sm">Performers directory</Link></li>
                <li><Link to="/community" className="text-zinc-300 hover:text-white transition-colors text-sm">Community</Link></li>
                <li><Link to="/pricing" className="text-zinc-300 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link to="/contact" className="text-zinc-300 hover:text-white transition-colors text-sm">Contact</Link></li>
                <li><Link to="/partner-with-us" className="text-zinc-300 hover:text-white transition-colors text-sm">Partner with us</Link></li>
              </ul>
            </div>
            {/* 2. Get Started */}
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-widest">Get Started</h3>
              <ul className="space-y-2">
                <li><Link to="/for-providers" className="text-zinc-300 hover:text-white transition-colors text-sm">For task providers</Link></li>
                <li><Link to="/for-performers" className="text-zinc-300 hover:text-white transition-colors text-sm">For task performers</Link></li>
                <li><Link to="/freelancing" className="text-zinc-300 hover:text-white transition-colors text-sm">Freelancing in India</Link></li>
                <li><Link to="/use-cases" className="text-zinc-300 hover:text-white transition-colors text-sm">Use cases</Link></li>
              </ul>
            </div>
            {/* 3. Company */}
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-widest">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-zinc-300 hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link to="/blog" className="text-zinc-300 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link to="/careers" className="text-zinc-300 hover:text-white transition-colors text-sm">Careers</Link></li>
              </ul>
            </div>
            {/* 4. Legal & Policies */}
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-widest">Legal & Policies</h3>
              <ul className="space-y-2">
                <li><Link to="/terms-and-conditions" className="text-zinc-300 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
                <li><Link to="/privacy-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/cookie-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
                <li><Link to="/refund-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Refund & Cancellation</Link></li>
                <li><Link to="/dispute-resolution-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Dispute Resolution</Link></li>
                <li><Link to="/payment-payout-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Payment & Payout</Link></li>
                <li><Link to="/prohibited-tasks-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Prohibited Tasks</Link></li>
                <li><Link to="/task-completion-proof-policy" className="text-zinc-300 hover:text-white transition-colors text-sm">Task Completion & Proof</Link></li>
                <li><Link to="/trust-safety" className="text-zinc-300 hover:text-white transition-colors text-sm">Trust & Safety</Link></li>
                <li><Link to="/task-guidelines" className="text-zinc-300 hover:text-white transition-colors text-sm">Task Guidelines</Link></li>
                <li><Link to="/performer-verification-onboarding" className="text-zinc-300 hover:text-white transition-colors text-sm">Performer Verification</Link></li>
              </ul>
            </div>
            {/* 5. Support */}
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-widest">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-zinc-300 hover:text-white transition-colors text-sm">Help & Guides</Link></li>
                <li><Link to="/faqs" className="text-zinc-300 hover:text-white transition-colors text-sm">FAQs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Three cards in a row: Connect | Task Provider | Task Performer */}
      <div className="w-full mt-10 md:mt-14 pt-8 md:pt-10 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Connect card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5">
            <p className="text-white font-medium text-sm mb-3">Connect</p>
            <p className="text-zinc-400 text-xs mb-4">Reach us or follow for updates.</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="mailto:support@onitindia.com"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-all min-w-[120px] justify-center"
              >
                <FaEnvelope className="text-lg shrink-0" />
                <span className="truncate">Email us</span>
              </a>
              <a
                href="https://www.linkedin.com/company/onitindia/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 transition-all duration-300 shrink-0"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a
                href="https://www.instagram.com/onitindia?igsh=MXA0emY2MzYybGY4aw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 transition-all duration-300 shrink-0"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61578441929542"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 transition-all duration-300 shrink-0"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="https://x.com/OnITIndia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 transition-all duration-300 shrink-0"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="https://www.youtube.com/@OnITIndia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 transition-all duration-300 shrink-0"
              >
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>
          {/* Task Provider card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5">
            <p className="text-white font-medium text-sm mb-3">Task Provider</p>
            <p className="text-zinc-400 text-xs mb-4">Post tasks and get help from experts.</p>
            <div className="flex flex-wrap gap-2">
              
              <a
                href={APP_LINKS.taskProvider.android}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Task Provider on Google Play"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-all min-w-[120px] justify-center"
              >
                <FaGooglePlay className="text-lg shrink-0" />
                <span>Google Play</span>
              </a>
            </div>
          </div>
          {/* Task Performer card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5">
            <p className="text-white font-medium text-sm mb-3">Task Performer</p>
            <p className="text-zinc-400 text-xs mb-4">Find tasks and earn by completing them.</p>
            <div className="flex flex-wrap gap-2">
              
              
              <a
                href={APP_LINKS.taskPerformer.android}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Task Performer on Google Play"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-all min-w-[120px] justify-center"
              >
                <FaGooglePlay className="text-lg shrink-0" />
                <span>Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/10 mt-12 pt-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
          <p className="order-2 sm:order-1">© 2026 OnIT INDIA. All rights reserved.</p>
          {/* <span className="text-[2.5rem] sm:text-[4rem] font-black text-white/5 tracking-tighter select-none pointer-events-none leading-none order-1 sm:order-2" aria-hidden="true">
            
          </span> */}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
