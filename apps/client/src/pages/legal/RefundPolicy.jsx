import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Refund & Cancellation Policy | FirstDoer"
        description="FirstDoer Refund & Cancellation Policy. Cancellations, refunds, disputes, and payment reversals for the task execution platform. Effective 01 March 2026."
        keywords="FirstDoer refund policy, cancellation policy, payment refund, task marketplace refund, dispute resolution, FirstDoer payments"
        canonical="https://www.firstdoer.com/refund-policy"
      />

      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-6 sm:mb-8"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-6 sm:pb-8 mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[var(--color-primary)] mb-3 tracking-tight">
              FirstDoer – REFUND & CANCELLATION POLICY
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              <strong>Effective Date:</strong> 01 March 2026
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">
              This Refund & Cancellation Policy ("Policy") governs cancellations, refunds, disputes, failed transactions, chargebacks, and payment reversals on the FirstDoer platform.
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              This Policy forms an integral part of the FirstDoer Terms & Conditions and applies to all users of the platform.
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              By using FirstDoer, you agree to this Policy.
            </p>
          </header>

          <div className="space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-heading font-medium text-[var(--color-primary)] mb-2 sm:mb-3">1. ROLE OF FirstDoer</h2>
              <p>
                FirstDoer is a technology-enabled marketplace platform connecting independent users.
              </p>
              <p className="mt-3">FirstDoer:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Does not provide services directly</li>
                <li>Does not supervise or control task execution</li>
                <li>Does not guarantee task outcomes</li>
              </ul>
              <p className="mt-3">
                All services are performed independently between Task Providers and Task Performers.
              </p>
              <p className="mt-3">
                Refund decisions relate only to platform-facilitated transactions and are subject strictly to this Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">2. PLATFORM FEES (NON-REFUNDABLE)</h2>
              <p>FirstDoer may charge a Platform Fee for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access to the marketplace</li>
                <li>Task discovery and matching</li>
                <li>Communication tools</li>
                <li>Escrow facilitation</li>
                <li>Dispute support</li>
              </ul>
              <p className="mt-3">Once these services are provided:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Platform Fees are non-refundable</li>
                <li>Payment gateway charges are non-refundable</li>
                <li>Applicable taxes (including GST) are non-refundable unless required by law</li>
              </ul>
              <p className="mt-3">
                Platform Fees are charged for use of the platform infrastructure and not for task outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">3. CANCELLATION BY TASK PROVIDER</h2>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mt-4 mb-2">A. Before Task Acceptance</h3>
              <p>If a task is cancelled before a Task Performer accepts:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The task amount may be refunded (if already paid)</li>
                <li>Platform Fees, gateway charges, and taxes remain non-refundable</li>
              </ul>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mt-4 mb-2">B. After Task Acceptance (Before Work Begins)</h3>
              <p>Cancellation may be permitted only if:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The Task Performer agrees, or</li>
                <li>FirstDoer determines that work has not commenced.</li>
              </ul>
              <p className="mt-2">If approved:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Refund may apply only to the task amount</li>
                <li>Platform Fees remain non-refundable</li>
                <li>Refunds are processed on a case-by-case basis.</li>
              </ul>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mt-4 mb-2">C. After Work Has Started</h3>
              <p>
                Once work has begun, no automatic refund applies.
              </p>
              <p className="mt-2">Refund decisions depend on:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Work completed</li>
                <li>Evidence provided</li>
                <li>Communication history</li>
                <li>Platform rules</li>
              </ul>
              <p className="mt-2">
                Partial refunds may apply where partial work has been delivered.
              </p>
              <p className="mt-2">
                Platform Fees remain non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">4. CANCELLATION BY TASK PERFORMER</h2>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mt-2 mb-2">Before Work Starts</h3>
              <p>
                The task amount may be refunded to the Task Provider.
              </p>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mt-4 mb-2">After Work Starts</h3>
              <p>Refund decisions depend on:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Work delivered</li>
                <li>Evidence submitted</li>
                <li>Platform review</li>
              </ul>
              <p className="mt-3">
                Repeated cancellations by Task Performers may result in:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Warnings</li>
                <li>Account restrictions</li>
                <li>Account suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">5. DISPUTES & ESCROW PROTECTION</h2>
              <p>
                FirstDoer may use an escrow mechanism for payment protection.
              </p>
              <p className="mt-3">If a dispute arises:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>A dispute must be raised within the platform</li>
                <li>Escrow funds may remain locked during review</li>
                <li>Both parties must submit relevant evidence</li>
              </ul>
              <p className="mt-3">FirstDoer may review:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Task scope</li>
                <li>Messages</li>
                <li>Deliverables</li>
                <li>Timeline</li>
                <li>Conduct of both parties</li>
              </ul>
              <p className="mt-3">
                Refund decisions are made case-by-case and are final, subject to applicable law.
              </p>
              <p className="mt-2">
                FirstDoer acts as a dispute facilitator and does not guarantee refunds.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">6. NON-REFUNDABLE SCENARIOS</h2>
              <p>
                Refunds will generally not be provided in situations including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Change of mind after work has started</li>
                <li>Dissatisfaction without objective evidence</li>
                <li>Delays caused by the Task Provider</li>
                <li>Usable partial work delivered</li>
                <li>Off-platform communication or payment</li>
                <li>Violation of platform policies</li>
                <li>Force majeure events</li>
                <li>Failure to review work within a reasonable time</li>
              </ul>
              <p className="mt-3">
                Platform Fees remain non-refundable in all such situations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">7. OFF-PLATFORM PAYMENTS</h2>
              <p>Payments conducted outside FirstDoer:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Are not eligible for refunds</li>
                <li>Are not eligible for dispute resolution</li>
                <li>Are not covered under escrow protection</li>
              </ul>
              <p className="mt-2">
                FirstDoer bears no responsibility for off-platform transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">8. FAILED OR DUPLICATE TRANSACTIONS</h2>
              <p>In case of:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Failed payment</li>
                <li>Duplicate debit</li>
                <li>Technical error</li>
              </ul>
              <p className="mt-2">
                The debited amount may be refunded to the original payment method after verification.
              </p>
              <p className="mt-2">
                Processing time depends on payment gateway and banking systems.
              </p>
              <p className="mt-2">
                Platform Fees already incurred may not be refundable where services were rendered.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">9. REFUND PROCESSING TIMELINE</h2>
              <p>If a refund is approved:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Processing time: 5–7 business days</li>
                <li>Final credit time depends on banks or payment providers</li>
              </ul>
              <p className="mt-2">
                FirstDoer is not responsible for delays caused by third-party financial institutions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">10. CHARGEBACKS & PAYMENT REVERSALS</h2>
              <p>
                Users must not initiate chargebacks or payment reversals without first raising a dispute on FirstDoer.
              </p>
              <p className="mt-3">
                Unauthorized or abusive chargebacks may result in:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Refund denial</li>
                <li>Recovery from future payouts</li>
                <li>Account suspension</li>
                <li>Permanent account termination</li>
              </ul>
              <p className="mt-2">
                FirstDoer reserves the right to recover funds lost due to fraudulent chargebacks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">11. FORCE MAJEURE</h2>
              <p>
                Refund obligations may be delayed or suspended due to events beyond reasonable control, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment gateway failures</li>
                <li>Banking system outages</li>
                <li>Internet disruptions</li>
                <li>Government actions</li>
                <li>Natural disasters</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">12. FINAL AUTHORITY</h2>
              <p>
                All refund and cancellation decisions are governed by:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>This Policy</li>
                <li>The FirstDoer Terms & Conditions</li>
                <li>Applicable Indian law</li>
              </ul>
              <p className="mt-2">
                Nothing in this Policy creates an obligation to issue a refund unless legally required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">13. CONTACT & SUPPORT</h2>
              <p className="mb-2">
                For refund or cancellation queries:
              </p>
              <p className="mb-2">
                <strong>Email:</strong> support@firstdoer.com
              </p>
              <p className="mt-3 mb-2">
                For formal grievances:
              </p>
              <p className="mb-2">
                <strong>Contact:</strong> Uday Gedam<br />
                <strong>Email:</strong> support@firstdoer.com
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            Last Updated: 01 March 2026 · FirstDoer
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
