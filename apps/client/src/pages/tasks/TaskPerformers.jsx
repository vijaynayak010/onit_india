import React from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Shield,
  Briefcase,
  DollarSign,
  Clock,
  Award,
  Image,
  Cpu,
  CheckCircle,
  Plus,
  ArrowRight,
  ChevronRight,
} from "react-feather";
import Footer from "../../components/layout/Footer";
import SEO from "../../components/seo/SEO";
import FindTaskersNearbyTeaser from "../../pages/performers/FindTaskersNearbyTeaser";

const startSteps = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Provide basic information about your skills and areas of expertise.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Get Verified",
    description: "Complete the onboarding process to ensure quality and trust within the platform.",
    icon: Shield,
  },
  {
    step: 3,
    title: "Receive Task Opportunities",
    description: "Tasks relevant to your skills become available for you to accept and execute.",
    icon: Briefcase,
  },
  {
    step: 4,
    title: "Complete Tasks and Earn",
    description: "Deliver the required work, build your reputation, and receive payment for completed tasks.",
    icon: DollarSign,
  },
];

function Task_Performers() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="For Performers | Earn by Completing Tasks on FirstDoer"
        description="Join FirstDoer as a performer. Earn by completing tasks — research, design, content, data work. Task-based earning, flexible work, side income India, and execution platform for the future of work."
        keywords="FirstDoer, onitindia, task performer, earn by tasks, hire people for small tasks, micro task platform, flexible work India, task marketplace India, join as performer, side income India, part-time tasks, verified taskers"
        canonical="https://www.firstdoer.com/task-performers"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "For Performers — FirstDoer",
          "description": "Earn by completing tasks on FirstDoer. Join as a performer and get access to task-based work opportunities.",
          "url": "https://www.firstdoer.com/task-performers"
        }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto px-6 md:px-20 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li className="font-medium text-gray-900" aria-current="page">
              For performers
            </li>
          </ol>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 md:px-20 py-10 md:py-14">
        {/* Hero */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-[2.25rem] font-bold text-[var(--color-primary)] mb-3 tracking-tight">
            Earn by Completing Tasks on FirstDoer
          </h1>
          <p className="text-lg font-medium text-gray-700 mb-4">
            Turn your skills and time into opportunities.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">
            FirstDoer connects people who are ready to execute tasks with businesses and individuals who need work done. From research and data work to design, content, and operations — join a growing network of performers and earn by delivering results.
          </p>
          <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdjLQSxhukM9y99iIDBT8p86_ZLZi3gYuxseIC1kK0FbL31ag/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold px-5 py-3 rounded-full hover:bg-[#003d35] transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={18} strokeWidth={2.5} />
                Join as a performer
              </a>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold px-5 py-3 rounded-full hover:bg-[var(--color-primary)]/5 transition-colors"
              >
                How it works
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
          </div>
        </header>

        {/* Find taskers nearby */}
        <section className="mb-12" aria-labelledby="find-taskers-teaser-heading">
          <FindTaskersNearbyTeaser />
        </section>

        {/* Who Can Join */}
        <section className="mb-12 rounded-2xl border border-gray-200 bg-gray-50/50 p-6 md:p-8" aria-labelledby="who-can-join-heading">
            <h2 id="who-can-join-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-3">
              Who Can Join as a Performer
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FirstDoer is open to individuals who are capable of executing tasks reliably and professionally.
            </p>
            <p className="text-sm font-medium text-gray-500 mb-2">Typical performers on the platform include:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Students seeking flexible earning opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Freelancers looking for additional task-based work</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Skilled professionals offering specialized services</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Individuals exploring part-time or side-hustle opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Job seekers who want to build experience and a work history</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Whether you specialize in creative work, research, operations, or technical tasks, FirstDoer provides a platform where skills can translate into real opportunities.
            </p>
          </section>

        {/* Types of Tasks */}
        <section className="mb-12" aria-labelledby="types-of-tasks-heading">
            <h2 id="types-of-tasks-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-3">
              Types of Tasks Available
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tasks on FirstDoer are typically short-duration, outcome-based assignments that require clear execution.
            </p>
            <p className="text-sm font-medium text-gray-500 mb-4">Examples of common task categories include:</p>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 p-5 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Briefcase size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Business and Operational Tasks</h3>
                </div>
                <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {["Lead generation and research", "Data entry and spreadsheet organization", "Market and competitor research", "CRM updates and administrative support"].map((item) => (
                    <li key={item}>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-gray-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Image size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Content and Creative Work</h3>
                </div>
                <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {["Graphic design and visual content", "Video editing and short-form content creation", "Social media post design", "Presentation and document formatting"].map((item) => (
                    <li key={item}>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-gray-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Cpu size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Data and Technical Tasks</h3>
                </div>
                <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {["Website updates and basic technical fixes", "Data processing and organization", "Automation or workflow support"].map((item) => (
                    <li key={item}>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-gray-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mt-4">
              These tasks often take minutes to a few hours, allowing performers to complete multiple assignments depending on their availability and skills.
            </p>
          </section>

        {/* Flexible Work */}
        <section className="mb-12 rounded-2xl border border-gray-200 bg-gray-50/50 p-6 md:p-8" aria-labelledby="flexible-work-heading">
            <h2 id="flexible-work-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
              <Clock size={22} />
              Flexible Work That Fits Your Schedule
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              One of the core advantages of working through FirstDoer is flexibility.
            </p>
            <p className="text-sm font-medium text-gray-500 mb-2">Performers can:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Choose tasks that match their skills</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Work from anywhere for digital tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Accept tasks based on their availability</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Build a flexible workflow around studies, freelance work, or other commitments</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              This model allows individuals to earn without committing to fixed working hours, making it ideal for people seeking adaptable earning opportunities.
            </p>
          </section>

        {/* Build Your Reputation */}
        <section className="mb-12 rounded-2xl border border-gray-200 bg-gray-50/50 p-6 md:p-8" aria-labelledby="reputation-heading">
            <h2 id="reputation-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
              <Award size={22} />
              Build Your Reputation Through Execution
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Trust and reliability are central to the FirstDoer ecosystem.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Each task completed contributes to a performer’s work history and reputation on the platform.
            </p>
            <p className="text-sm font-medium text-gray-500 mb-2">Our system helps ensure transparency through:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Ratings and feedback from task providers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Visible task completion history</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span>Performance-based reputation growth</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Over time, performers who consistently deliver high-quality work gain greater visibility and access to more opportunities.
            </p>
          </section>

        {/* How to Start Earning */}
        <section className="mb-12" aria-labelledby="how-to-start-heading">
            <h2 id="how-to-start-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-4">
              How to Start Earning on FirstDoer
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Getting started as a performer is straightforward.
            </p>
            <div className="space-y-4">
              {startSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.step}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:border-[var(--color-primary)]/20 transition-colors items-start sm:items-center"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        Step {item.step}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

        {/* Growing Opportunities */}
        <section className="mb-12" aria-labelledby="growing-opportunities-heading">
            <h2 id="growing-opportunities-heading" className="text-xl font-semibold text-[var(--color-primary)] mb-3">
              Growing Opportunities on the Platform
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              As the FirstDoer ecosystem expands, performers will gain access to a growing range of task opportunities across multiple domains.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our long-term goal is to create a platform where individuals can continuously discover work opportunities, develop experience, and earn through reliable task execution.
            </p>
          </section>

        {/* Final CTA */}
        <section className="p-5 sm:p-8 rounded-2xl bg-[var(--color-primary)] text-white text-center" aria-labelledby="final-cta-heading">
            <h2 id="final-cta-heading" className="text-xl md:text-2xl font-semibold mb-2">
              Join the FirstDoer Performer Network
            </h2>
            <p className="text-white/90 mb-4 max-w-xl mx-auto">
              If you are someone who values flexible work, skill-based opportunities, and reliable execution, FirstDoer offers a platform where your time and abilities can translate into real outcomes.
            </p>
            <p className="text-white/90 mb-6">
              Join the growing network of performers helping businesses and individuals get work done faster.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdjLQSxhukM9y99iIDBT8p86_ZLZi3gYuxseIC1kK0FbL31ag/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Start completing tasks
              <ArrowRight size={18} strokeWidth={2.5} />
            </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Task_Performers;
