import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const DisputeResolutionPolicy = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Dispute Resolution Policy | FirstDoer"
      description="How disputes between task providers and performers are handled on FirstDoer. Escrow, evidence, review process, and resolution. Part of platform trust and safety."
      keywords="FirstDoer dispute resolution, task dispute, escrow, dispute policy, refund dispute, task marketplace India"
      canonical="https://www.firstdoer.com/dispute-resolution-policy"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8">
          ← Back to Home
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
            Dispute Resolution Policy
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            <strong>Effective:</strong> 01 March 2026. This policy explains how disputes between task providers and task performers are handled on the FirstDoer platform.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            This policy works together with our <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link> and <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link>.
          </p>
        </header>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">1. Role of FirstDoer</h2>
            <p>FirstDoer operates as a technology intermediary. We do not employ task performers or supervise task execution. When a dispute arises, we act as a <strong>dispute facilitator</strong>: we review evidence, apply our policies, and help determine how escrowed funds should be released. We do not guarantee any particular outcome (e.g. full refund to provider or full release to performer).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">2. Raising a Dispute</h2>
            <p className="mb-2">Disputes must be raised <strong>within the platform</strong> using the available dispute or support flow. Both task provider and task performer should:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Raise the dispute as soon as the issue is clear (e.g. non-delivery, quality, scope, or cancellation)</li>
              <li>Provide a clear description of the issue</li>
              <li>Submit all relevant evidence (messages, deliverables, screenshots, files) through the platform</li>
            </ul>
            <p className="mt-3">Off-platform communications or payments are not part of our dispute process and are not protected.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">3. Escrow During Review</h2>
            <p>When a dispute is raised, funds held in escrow for that task may remain <strong>locked</strong> until the review is complete. We will not release funds to either party until a resolution decision is made, except where required by law or our Refund &amp; Cancellation Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">4. What We Review</h2>
            <p className="mb-2">Our review may include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Task scope and description</li>
              <li>In-app messages and communication</li>
              <li>Deliverables submitted by the performer</li>
              <li>Timeline (deadlines, submission time)</li>
              <li>Conduct of both parties</li>
              <li>Applicable platform policies (including Task Completion &amp; Proof Policy and Refund Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">5. Resolution and Finality</h2>
            <p>Decisions are made <strong>case-by-case</strong> based on the evidence and our policies. Possible outcomes include full release to the performer, full refund to the provider, or partial release/refund. Platform fees are non-refundable. Our resolution decision is final subject to applicable law. We do not provide arbitration or appeal outside what is required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">6. Full Terms</h2>
            <p>This page is a summary. The full rules are in our <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link> and <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>. By using the platform, you agree to those terms.</p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default DisputeResolutionPolicy;
