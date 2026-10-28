import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const PricingPagePublic = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Pricing & Fees | OnIT INDIA"
        description="Transparent pricing for task posters and task performers. Post tasks for free; pay when work is done. Clear fees and secure payment flow. Task marketplace India pricing."
        keywords="OnIT INDIA pricing, task marketplace fees, post task cost, task performer earnings, OnIT INDIA fees, task execution platform pricing, how much to post task"
        canonical="https://www.onitindia.com/pricing"
      />
      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-4">
              Pricing &amp; Fees
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              OnIT INDIA is designed to be transparent and fair for both task
              posters and task performers. Below is a simple overview of how
              pricing and fees work on the platform.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <div className="rounded-2xl border border-[#004d43]/15 bg-[#004d43]/5 p-6">
              <h2 className="text-xl font-bold text-[#004d43] mb-2">
                For task posters
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Posting a task on OnIT INDIA is typically free. You only pay
                when you accept an offer and the work is completed.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>No or low posting fees.</li>
                <li>Clear visibility of total cost before confirming.</li>
                <li>Secure online payment with digital records.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#004d43]/15 bg-[#004d43]/5 p-6">
              <h2 className="text-xl font-bold text-[#004d43] mb-2">
                For task performers
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Task performers earn money for each completed task. A small
                service fee may apply per transaction to keep the platform
                running.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Transparent service fee per completed task.</li>
                <li>Payouts to your preferred payment method.</li>
                <li>Downloadable history for tax and invoicing.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-10">
            <h2 className="text-lg md:text-xl font-bold text-[#004d43] mb-3">
              Secure payment flow
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              <li>You agree on a price with the task performer.</li>
              <li>The payment is authorized and held securely.</li>
              <li>The task performer completes the work.</li>
              <li>You review the work and approve completion.</li>
              <li>Funds are released to the task performer minus fees.</li>
            </ol>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6 mb-10">
            <h2 className="text-lg md:text-xl font-bold text-[#004d43] mb-3">
              ⚠️ Platform fees
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              A platform fee may apply when tasks are completed. This helps us run the platform, support payments, and keep the service secure. Applicable Goods and Services Tax (GST) may be charged on platform fees as required by law.
            </p>
            <p className="text-gray-600 text-sm">
              Platform fees are non-refundable once incurred. For full details on when fees apply, refunds, and cancellations, see our{" "}
              <Link to="/refund-policy" className="text-[#004d43] font-medium hover:underline">
                Refund &amp; Cancellation Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center px-5 py-3 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors"
            >
              Post a task
            </Link>
            <Link
              to="/task-performers"
              className="inline-flex items-center px-5 py-3 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors"
            >
              Join as performer
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPagePublic;
