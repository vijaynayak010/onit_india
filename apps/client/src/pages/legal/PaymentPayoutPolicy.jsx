import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const PaymentPayoutPolicy = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Payment & Payout Policy | FirstDoer"
      description="How payments and payouts work on FirstDoer. Escrow, release on completion, platform fees, GST, and payout methods for task performers."
      keywords="FirstDoer payment policy, payout policy, escrow, platform fees, task performer payout, task marketplace India payments"
      canonical="https://www.firstdoer.com/payment-payout-policy"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8">
          ← Back to Home
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-medium text-[var(--color-primary)] mb-4">
            Payment &amp; Payout Policy
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            <strong>Effective:</strong> 01 March 2026. This policy describes how payments and payouts work on the FirstDoer platform.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            See also our <Link to="/pricing" className="text-[var(--color-primary)] font-medium hover:underline">Pricing &amp; Fees</Link>, <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>, and <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link>.
          </p>
        </header>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">1. Payments by Task Providers</h2>
            <p>When a task is agreed and assigned, the task amount may be collected (or authorised) and held in <strong>escrow</strong> until the task is completed and approved, or until a dispute is resolved. Payments are processed through compliant third-party payment gateways. The provider pays the agreed task amount; platform fees (if any) and applicable taxes (e.g. GST) may apply as disclosed at the time of payment.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">2. When Funds Are Released to Performers</h2>
            <p>Funds in escrow are released to the task performer when:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The task provider approves the completed work (e.g. marks the task as complete), or</li>
              <li>FirstDoer resolves a dispute in favour of the performer (in whole or in part).</li>
            </ul>
            <p className="mt-3">Until then, funds remain held. If a dispute is raised, release is governed by our <Link to="/dispute-resolution-policy" className="text-[var(--color-primary)] font-medium hover:underline">Dispute Resolution Policy</Link> and <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">3. Platform Fees &amp; Taxes</h2>
            <p>FirstDoer may charge a <strong>platform fee</strong> for use of the platform (e.g. task posting, matching, escrow, communication tools). Platform fees are typically non-refundable once incurred. Applicable Goods and Services Tax (GST) may be charged on platform fees as required by law. Fee structure and timing are disclosed on the platform and on the <Link to="/pricing" className="text-[var(--color-primary)] font-medium hover:underline">Pricing</Link> page.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">4. Payouts to Task Performers</h2>
            <p>Amounts released to task performers (after any platform fee deduction) are paid out to the performer’s designated payout method (e.g. bank account or other enabled method). Payout timing may depend on verification, banking rules, and platform processing. Performers are responsible for providing accurate payout details and for any taxes on their earnings.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">5. No Off-Platform Payments</h2>
            <p>Payments and payouts must stay <strong>on the platform</strong>. Users must not move payments outside FirstDoer (e.g. direct bank transfer or cash to avoid fees). Off-platform transactions are not eligible for escrow protection, dispute resolution, or refunds. Violations may result in warnings, account restriction, or termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">6. Failed or Duplicate Transactions</h2>
            <p>In case of failed payment, duplicate debit, or technical error, the amount may be refunded or corrected after verification. Processing time depends on the payment gateway and banking systems. See <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link> for more detail.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">7. Full Terms</h2>
            <p>This page is a summary. The full rules are in our <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link> and <Link to="/refund-policy" className="text-[var(--color-primary)] font-medium hover:underline">Refund &amp; Cancellation Policy</Link>. By using the platform, you agree to those terms.</p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default PaymentPayoutPolicy;
