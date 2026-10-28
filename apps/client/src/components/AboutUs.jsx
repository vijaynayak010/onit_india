import React from "react";
import { Link } from "react-router-dom";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";
import TasksByDomain from "../pages/tasks/TasksByDomain";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="About OnIT INDIA | Execution Infrastructure for the Modern Work Economy"
        description="OnIT INDIA is building execution infrastructure that moves work from intent to completion faster. Learn about our mission, task execution platform, hyperlocal focus, and vision for the future of work in India."
        keywords="OnIT INDIA, onitindia, about OnIT INDIA, execution infrastructure, task execution platform, modern work economy, task marketplace India, future of work, hyperlocal platform, gig economy India"
        canonical="https://www.onitindia.com/about"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "About OnIT INDIA",
          "description": "OnIT INDIA is building the execution infrastructure that enables work to move from intent to completion faster.",
          "url": "https://www.onitindia.com/about"
        }}
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-2">
              About OnIT INDIA
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
              Building the Infrastructure for a Faster Work Economy
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              At OnIT INDIA, we believe the speed at which work gets executed defines the speed at which economies grow.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              Across startups, small businesses, creators, and organizations, millions of tasks arise every day — research that needs to be done, content that needs to be created, data that needs to be organized, operations that need to move forward. Yet despite living in a highly connected digital world, the coordination required to get work done often remains slow and inefficient.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-4">
              Finding the right person, aligning expectations, and ensuring reliable execution can take far longer than the work itself.
            </p>
            <p className="text-gray-700 font-medium mt-6">
              OnIT INDIA is being built to solve this fundamental coordination problem.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mt-2">
              Our mission is to create the execution infrastructure that enables work to move from intent to completion faster than ever before.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            {/* The Shift in How Work Happens */}
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-4">
                The Shift in How Work Happens
              </h2>
              <p className="text-gray-600 mb-4">
                The modern economy is increasingly driven by short-duration, high-frequency tasks.
              </p>
              <p className="text-gray-600 mb-4">
                These are not long projects or traditional hiring decisions. Instead, they are everyday execution needs such as designing a visual, editing a video, researching information, organizing data, or supporting operational workflows.
              </p>
              <p className="text-gray-600 mb-4">
                While these tasks may only require minutes or hours to complete, the systems available today are still built around long hiring cycles and complex freelance marketplaces.
              </p>
              <p className="text-gray-600">
                The result is a gap between the demand for instant execution and the supply of available talent.
              </p>
              <p className="text-gray-700 font-medium mt-4">
                At OnIT INDIA, we are closing that gap.
              </p>
            </section>

            {/* Our Approach */}
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-4">
                Our Approach
              </h2>
              <p className="text-gray-600 mb-6">
                We are building a platform designed specifically for structured, real-time task execution.
              </p>
              <p className="text-gray-600 mb-6">
                By enabling faster coordination between individuals who need work completed and those ready to execute it, we aim to make everyday work significantly easier to complete.
              </p>
              <p className="text-gray-600 mb-4">Our approach focuses on three core principles:</p>
              <ul className="space-y-4">
                <li className="pl-4 border-l-4 border-[#004d43]/30">
                  <strong className="text-[#004d43]">Execution Speed</strong>
                  <span className="text-gray-600 block mt-1">Reducing the friction between identifying a task and getting it completed.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#004d43]/30">
                  <strong className="text-[#004d43]">Reliable Coordination</strong>
                  <span className="text-gray-600 block mt-1">Creating systems that ensure clarity, trust, and accountability in task execution.</span>
                </li>
                <li className="pl-4 border-l-4 border-[#004d43]/30">
                  <strong className="text-[#004d43]">Marketplace Liquidity</strong>
                  <span className="text-gray-600 block mt-1">Building strong supply–demand density so work can move efficiently across the network.</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-6">
                Rather than attempting to serve every possible use case immediately, we focus on specific domains where task frequency is highest, allowing us to build strong execution reliability before expanding further.
              </p>
            </section>

            {/* Our Vision */}
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 mb-4">
                Our long-term vision is for OnIT INDIA to become the infrastructure layer that powers how work gets executed.
              </p>
              <p className="text-gray-600 mb-4">
                Today, we begin with digital tasks that help founders, creators, and businesses move faster. Over time, we envision expanding this coordination layer into hyperlocal ecosystems, enabling real-world work to be organized and executed with the same efficiency as digital tasks.
              </p>
              <p className="text-gray-600 mb-4">
                By combining technology, structured workflows, and network effects, OnIT INDIA aims to create a system where any task — digital or physical — can move from request to completion seamlessly.
              </p>
              <p className="text-gray-600">
                In doing so, we hope to unlock a future where people spend less time searching for help and more time building, creating, and progressing.
              </p>
            </section>

            {/* Still Early. Still Focused. */}
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-4">
                Still Early. Still Focused.
              </h2>
              <p className="text-gray-600 mb-4">
                We are at the beginning of this journey.
              </p>
              <p className="text-gray-600 mb-4">
                Today, our focus remains on disciplined execution, strong marketplace fundamentals, and building a reliable foundation for long-term scale.
              </p>
              <p className="text-gray-600">
                As the platform grows, we aim to strengthen the network effects that will ultimately enable OnIT INDIA to power a faster, more responsive work economy.
              </p>
            </section>

            {/* Our Belief */}
            <section className="bg-[#004d43]/5 border border-[#004d43]/20 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">
                Our Belief
              </h2>
              <p className="text-lg md:text-xl font-medium text-gray-800 italic">
                Work should move as fast as ideas do.
              </p>
              <p className="text-gray-600 mt-3">
                At OnIT INDIA, we are building the systems that make that possible.
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Explore <Link to="/what-is-onit-india" className="text-[#004d43] hover:text-green-600 font-medium">What is OnIT INDIA</Link>, <Link to="/how-it-works" className="text-[#004d43] hover:text-green-600 font-medium">How it works</Link>, or <Link to="/task-performers" className="text-[#004d43] hover:text-green-600 font-medium">join as a performer</Link>.
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
