import React from "react";
import { Link } from "react-router-dom";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const TrustAndSafety = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Trust & Safety | firstDoer"
        description="firstDoer Trust & Safety: ID verification, trust scores, protected escrow payments, dispute resolution, and community guidelines."
        keywords="firstDoer trust and safety, verified performers, escrow payments, identity verification, safe task platform, firstDoer safety"
        canonical="https://www.firstdoer.com/trust-safety"
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#10605F] hover:text-[#083B3A] font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#10605F] mb-4">
              firstDoer – TRUST & SAFETY
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Effective Date:</strong> 01 March 2026
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-4">
              firstDoer is committed to providing a secure and reliable marketplace where businesses can connect with verified performers and get tasks completed safely. This page outlines the safeguards designed to protect clients, performers, and payment integrity.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">1. What firstDoer Is</h2>
              <p>
                firstDoer is a task execution platform and marketplace that connects independent Task Providers with verified Task Performers.
              </p>
              <p className="mt-3">firstDoer:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Does not provide freelance services directly</li>
                <li>Does not employ Task Performers as staff</li>
                <li>Provides infrastructure, escrow safeguards, and communication tools</li>
              </ul>
              <p className="mt-3">
                Agreements, scopes, and final sign-offs are established transparently between users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">2. Performer Verification & Trust Scores</h2>
              <p>To protect clients and maintain exceptional service quality:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Performers undergo government ID checks and identity confirmation</li>
                <li>Past project portfolios are reviewed and verified by firstDoer</li>
                <li>Every performer profile displays an objective Trust Score, star rating, and completed task history</li>
                <li>Only approved, verified performers are permitted to apply for tasks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">3. Protected Payments & Escrow</h2>
              <p>
                All task payments made through firstDoer are held securely in protected escrow before work begins.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Funds are only released when the client reviews and approves the delivered milestones</li>
                <li>If a task cannot be completed or is cancelled according to platform policy, funds are returned safely to the client's firstDoer wallet</li>
                <li>Off-platform payments bypass these protections and are strictly prohibited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">4. Dispute Resolution</h2>
              <p>If an issue arises regarding deliverables or timelines:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Users first review agreed checklists and version histories in the task conversation thread</li>
                <li>If unresolved, either party can raise a dispute to firstDoer mediation support</li>
                <li>Our team reviews all timestamped drafts, milestones, and communications to reach a fair resolution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">5. Prohibited Conduct</h2>
              <p>Users must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Post illegal, fraudulent, or harmful work</li>
                <li>Misrepresent skills, identities, or project deliverables</li>
                <li>Attempt to conduct transactions outside firstDoer escrow protections</li>
                <li>Engage in harassment or unprofessional communication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#10605F] mb-3">6. Support & Reporting</h2>
              <p>For inquiries, safety reports, or mediation assistance:</p>
              <p className="mt-2">
                <strong>Support Email:</strong> support@firstdoer.com
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            Last Updated: 01 March 2026 · firstDoer
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrustAndSafety;
