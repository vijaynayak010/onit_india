import React from "react";
import { Link } from "react-router-dom";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const WhatIsOnITIndia = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="What is firstDoer? | Task Execution Platform & Marketplace"
        description="firstDoer is a modern SaaS task execution marketplace. Post tasks, get matched with verified performers, and get work executed quickly. Pay only when it’s done."
        keywords="firstDoer, firstdoer, what is firstDoer, task execution platform, task marketplace, micro task platform, instant task execution, get work done, post task hire performer"
        canonical="https://www.firstdoer.com/what-is-onit-india"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "What is firstDoer?",
          "description": "firstDoer is a task execution platform that helps individuals and businesses get work completed faster with verified performers.",
          "url": "https://www.firstdoer.com/what-is-onit-india"
        }}
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#10605F] hover:text-[#083B3A] font-medium text-sm mb-8 transition-colors"
          >
            ← Back to Home
          </Link>

          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#10605F] mb-2">
              What is firstDoer?
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
              A Platform Built for Faster Work Execution
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              firstDoer is a task execution platform designed to help individuals and businesses get marketing, design, and development work completed faster.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              In today's economy, a significant portion of work consists of focused tasks that require quick execution — from lead generation and content creation to design, website updates, and operational support. While these tasks may take hours or days to complete, finding the right verified person to execute them often takes much longer.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              Most existing platforms are built for traditional hiring cycles or bloated freelance projects, which makes them inefficient for fast execution needs.
            </p>
            <p className="text-gray-700 font-medium mt-4">
              firstDoer addresses this gap by enabling a system where tasks can move from brief to completion quickly, safely, and reliably.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            {/* The Problem firstDoer Solves */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                The Problem firstDoer Solves
              </h2>
              <p className="text-gray-600 mb-4">
                Across startups, creators, and growing businesses, work often slows down because of coordination delays and unvetted freelancers.
              </p>
              <p className="text-gray-600 mb-4">
                Teams frequently encounter situations where they need help with tasks such as:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>targeted marketing campaigns and copywriting</li>
                <li>editing reels, videos, and media</li>
                <li>creating UI/UX designs and logos</li>
                <li>building responsive websites and apps</li>
                <li>handling operational or technical tasks</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Although skilled individuals capable of completing these tasks exist in large numbers, connecting demand with vetted, trustworthy performers quickly remains a challenge.
              </p>
              <p className="text-gray-600 mb-4">
                This creates an execution gap where work gets delayed even when budget is available.
              </p>
              <p className="text-gray-700 font-medium">
                firstDoer solves this problem by providing structured AI briefs, verified performers with trust scores, and milestone-protected escrow payments.
              </p>
            </section>

            {/* How firstDoer Works */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                How firstDoer Works
              </h2>
              <p className="text-gray-600 mb-6">
                firstDoer simplifies getting work done through a secure, structured 3-step workflow:
              </p>
              <ol className="space-y-4">
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">1. Post a Task</strong>
                  <span className="text-gray-600 block mt-1">Describe what you need in seconds with AI, manually, or from a proven template.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">2. Choose Your Verified Performer</strong>
                  <span className="text-gray-600 block mt-1">Review vetted applicants with verified trust scores, ratings, and past approved projects.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">3. Track Live & Release Payment</strong>
                  <span className="text-gray-600 block mt-1">Collaborate in real-time chat, review milestones, and approve deliverables. Funds are released only when you approve the final work.</span>
                </li>
              </ol>
            </section>

            {/* Types of Tasks on firstDoer */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                Types of Tasks on firstDoer
              </h2>
              <p className="text-gray-600 mb-4">
                Tasks on the platform are typically short-duration assignments with clear deliverables and milestones:
              </p>

              <div className="space-y-4 mb-4">
                <div>
                  <h3 className="font-semibold text-[#10605F] mb-2">Growth & Marketing</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>targeted social media & Instagram campaigns</li>
                    <li>performance marketing & ad management</li>
                    <li>copywriting, email funnels & content marketing</li>
                    <li>SEO keyword research & competitive audits</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#10605F] mb-2">Design & Creative Work</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>UI/UX design, wireframes & Figma prototypes</li>
                    <li>video editing, YouTube thumbnails & short-form reels</li>
                    <li>brand identity kits, logos & vector assets</li>
                    <li>presentation decks and promotional graphics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#10605F] mb-2">Build & Develop</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>responsive websites and landing pages</li>
                    <li>frontend app components and bug fixes</li>
                    <li>automation workflows and API integrations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Who Uses firstDoer */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                Who Uses firstDoer
              </h2>
              <p className="text-gray-600 mb-4">
                firstDoer is built for businesses and individuals who value speed, quality, and payment security:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
                <li>startup founders and fast-moving teams</li>
                <li>creative and marketing agencies</li>
                <li>D2C and growing brands</li>
                <li>small business owners</li>
                <li>verified performers and talented specialists seeking trusted client work</li>
              </ul>
            </section>

            {/* The Vision Behind firstDoer */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                The Vision Behind firstDoer
              </h2>
              <p className="text-gray-600 mb-4">
                firstDoer is built on the belief that economic acceleration requires friction-free execution infrastructure.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission is to help work move from intent to completion seamlessly — eliminating administrative delays, ensuring verified quality, and guaranteeing payment safety at every step.
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center space-y-4">
            <p className="text-sm text-gray-500">
              <Link to="/how-it-works" className="text-[#10605F] hover:text-[#083B3A] font-medium">How firstDoer works</Link> · <Link to="/task-performers" className="text-[#10605F] hover:text-[#083B3A] font-medium">Join as a performer</Link> · <Link to="/tasks" className="text-[#10605F] hover:text-[#083B3A] font-medium">Browse tasks</Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#10605F] hover:text-[#083B3A] font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatIsOnITIndia;
