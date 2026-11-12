import React from "react";
import { Link } from "react-router-dom";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";
import TasksByDomain from "../pages/tasks/TasksByDomain";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="About firstDoer | Execution Infrastructure for the Modern Work Economy"
        description="firstDoer is building execution infrastructure that moves work from intent to completion faster. Learn about our mission, verified performer model, and payment protection."
        keywords="firstDoer, firstdoer, about firstDoer, execution infrastructure, task execution platform, modern work economy, task marketplace, verified performers"
        canonical="https://www.firstdoer.com/about"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "About firstDoer",
          "description": "firstDoer is building the execution infrastructure that enables marketing, design, and development work to move from intent to completion faster.",
          "url": "https://www.firstdoer.com/about"
        }}
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#10605F] mb-2">
              About firstDoer
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
              Building the Infrastructure for a Faster Work Economy
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              At firstDoer, we believe the speed at which work gets executed defines the speed at which businesses grow.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              Across startups, agencies, creators, and growing brands, critical tasks arise every day — targeted marketing campaigns, video reels, UI/UX designs, and responsive web applications. Yet despite living in a connected digital world, coordinating with freelancers often remains slow, uncertain, and unverified.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              Finding the right person, aligning checklists, and ensuring reliable execution often takes far longer than the work itself.
            </p>
            <p className="text-gray-700 font-medium mt-6">
              firstDoer is built to solve this fundamental coordination and trust problem.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-2">
              Our mission is to create the execution infrastructure that enables marketing, design, and development work to move from brief to completion faster and safer than ever before.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            {/* The Shift in How Work Happens */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                The Shift in How Work Happens
              </h2>
              <p className="text-gray-600 mb-4">
                The modern economy is driven by short-duration, high-impact tasks.
              </p>
              <p className="text-gray-600 mb-4">
                These are not year-long contracts or slow corporate hiring cycles. Instead, they are everyday execution needs such as launching an ad campaign, editing 10 reels, polishing a brand identity, or shipping a landing page.
              </p>
              <p className="text-gray-600 mb-4">
                While these tasks only require days or weeks to execute, legacy freelance platforms still subject clients to bidding wars, unresponsive applicants, and unvetted credentials.
              </p>
              <p className="text-gray-600">
                The result is an execution bottleneck between business demand and high-caliber talent.
              </p>
              <p className="text-gray-700 font-medium mt-4">
                At firstDoer, we are eliminating that bottleneck.
              </p>
            </section>

            {/* Our Approach */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                Our Approach
              </h2>
              <p className="text-gray-600 mb-6">
                We are building a platform designed specifically for structured, verifiable task execution.
              </p>
              <p className="text-gray-600 mb-4">Our approach focuses on three core pillars:</p>
              <ul className="space-y-4">
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">Verified Performers Only</strong>
                  <span className="text-gray-600 block mt-1">ID-checked, with past projects approved by our team, transparent trust scores, and verified star ratings.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">Protected Payments</strong>
                  <span className="text-gray-600 block mt-1">Funds are held safely in escrow and released milestone by milestone only when you review and approve the final work.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#10605F]/40">
                  <strong className="text-[#10605F]">AI-Powered Clarity</strong>
                  <span className="text-gray-600 block mt-1">Structured checklists and clear deliverables agreed upon before work starts, so nothing gets missed.</span>
                </li>
              </ul>
            </section>

            {/* Our Vision */}
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 mb-4">
                Our long-term vision is for firstDoer to become the global execution infrastructure where any digital task moves from idea to delivery friction-free.
              </p>
              <p className="text-gray-600">
                In doing so, we unlock a future where teams spend less time managing and searching for help, and more time building and scaling their visions.
              </p>
            </section>

            {/* Our Belief */}
            <section className="bg-[#10605F]/5 border border-[#10605F]/20 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">
                Our Belief
              </h2>
              <p className="text-lg md:text-xl font-medium text-gray-800 italic">
                Work should move as fast as ideas do.
              </p>
              <p className="text-gray-600 mt-3">
                At firstDoer, we are building the platform that makes that possible.
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Explore <Link to="/what-is-onit-india" className="text-[#10605F] hover:text-[#083B3A] font-medium">What is firstDoer</Link>, <Link to="/how-it-works" className="text-[#10605F] hover:text-[#083B3A] font-medium">How it works</Link>, or <Link to="/task-performers" className="text-[#10605F] hover:text-[#083B3A] font-medium">join as a performer</Link>.
            </p>
          </div>
        </div>
      </section>

      <TasksByDomain />

      <Footer />
    </div>
  );
};

export default AboutUs;
