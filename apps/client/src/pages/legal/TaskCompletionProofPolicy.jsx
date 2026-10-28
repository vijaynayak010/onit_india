import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const TaskCompletionProofPolicy = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Task Completion & Proof Policy | OnIT INDIA"
      description="How task completion and proof of work work on OnIT INDIA. Deliverables, provider approval, release of payment, and revisions. Part of platform trust and safety."
      keywords="OnIT INDIA task completion, proof of work, deliverables, task approval, payment release, task marketplace India"
      canonical="https://www.onitindia.com/task-completion-proof-policy"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8">
          ← Back to Home
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-4">
            Task Completion &amp; Proof Policy
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            <strong>Effective:</strong> 01 March 2026. This policy explains how task completion and proof of work are handled on the OnIT INDIA platform.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            See also our <Link to="/payment-payout-policy" className="text-[#004d43] font-medium hover:underline">Payment &amp; Payout Policy</Link>, <Link to="/dispute-resolution-policy" className="text-[#004d43] font-medium hover:underline">Dispute Resolution Policy</Link>, and <Link to="/terms-and-conditions" className="text-[#004d43] font-medium hover:underline">Terms and Conditions</Link>.
          </p>
        </header>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">1. What Counts as Completion</h2>
            <p>A task is treated as complete when the <strong>task performer</strong> has submitted the agreed deliverable(s) through the platform and the <strong>task provider</strong> has approved the work (e.g. by marking the task as complete or accepting the delivery). Until the provider approves, the task is not considered complete for the purpose of releasing payment.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">2. Deliverables and Proof</h2>
            <p className="mb-2">Task performers must submit deliverables in the way agreed with the provider (e.g. link, file upload, or form) and within the platform so that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The provider can review the work</li>
              <li>OnIT INDIA can review evidence in case of a dispute</li>
            </ul>
            <p className="mt-3">Proof of work (e.g. screenshots, photos, documents) should be submitted on the platform. Deliverables or proof shared only off-platform (e.g. email or WhatsApp) may not be considered in dispute resolution.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">3. Provider Review and Approval</h2>
            <p>Task providers are expected to review submitted work within a <strong>reasonable time</strong>. If the work meets the agreed scope and quality, the provider should approve completion so that payment can be released to the performer. If the work does not meet the agreed scope, the provider may request revisions (see below) or raise a dispute.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">4. Revisions</h2>
            <p>If the provider and performer have agreed on revisions (e.g. in the task description or in chat), the performer should submit revised deliverable(s) through the platform. Approval and payment release follow the same process: the provider approves once satisfied. If the parties cannot agree on whether the work is complete, either may raise a dispute under our <Link to="/dispute-resolution-policy" className="text-[#004d43] font-medium hover:underline">Dispute Resolution Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">5. Release of Payment</h2>
            <p>Once the provider approves the task as complete, funds held in escrow are released to the performer (minus any platform fees). If a dispute is raised before approval, funds remain locked until the dispute is resolved. See our <Link to="/payment-payout-policy" className="text-[#004d43] font-medium hover:underline">Payment &amp; Payout Policy</Link> and <Link to="/refund-policy" className="text-[#004d43] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">6. Partial Completion</h2>
            <p>If only part of the work has been delivered or approved, resolution (including partial release or refund) is handled on a case-by-case basis, including through our dispute process. Platform fees remain non-refundable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#004d43] mb-3">7. Full Terms</h2>
            <p>This page is a summary. The full rules are in our <Link to="/terms-and-conditions" className="text-[#004d43] font-medium hover:underline">Terms and Conditions</Link> and <Link to="/refund-policy" className="text-[#004d43] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>. By using the platform, you agree to those terms.</p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TaskCompletionProofPolicy;
