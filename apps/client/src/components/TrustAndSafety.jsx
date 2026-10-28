import React from "react";
import { Link } from "react-router-dom";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const TrustAndSafety = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Trust & Safety | ONIT INDIA"
        description="ONIT INDIA Trust & Safety: identity verification, escrow, dispute resolution, prohibited conduct, and user responsibility. Safe task marketplace India."
        keywords="OnIT INDIA trust and safety, verified taskers, escrow payments, identity verification, safe task platform, OnIT INDIA safety"
        canonical="https://www.onitindia.com/trust-safety"
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-4">
              ONIT INDIA – TRUST & SAFETY
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Effective Date:</strong> 01 March 2026
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-4">
              ONIT INDIA is committed to creating a secure and reliable marketplace where users can connect, collaborate, and complete tasks responsibly. This page outlines the principles and safeguards designed to protect users and maintain platform integrity.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">1. What ONIT INDIA Is</h2>
              <p>
                ONIT INDIA is a technology marketplace that connects independent Task Providers and Task Performers.
              </p>
              <p className="mt-3">ONIT INDIA:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Does not provide services directly</li>
                <li>Does not employ Task Performers</li>
                <li>Does not supervise or control task execution</li>
              </ul>
              <p className="mt-3">
                All tasks, agreements, and outcomes are solely between users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">2. Identity Verification</h2>
              <p>To help protect users and reduce fraud:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Identity verification may be required</li>
                <li>Only verified users may be allowed to post or accept tasks</li>
                <li>False or misleading information may result in suspension or permanent account termination</li>
              </ul>
              <p className="mt-3">
                Verification confirms identity only and does not guarantee behavior, skill level, or task outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">3. Secure Payments</h2>
              <p>
                Payments made through the platform are processed through trusted third-party payment gateways.
              </p>
              <p className="mt-3">Where applicable:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payments may be secured before work begins</li>
                <li>Funds may be released after task completion or dispute resolution</li>
              </ul>
              <p className="mt-3">
                Payments made outside the platform are not protected and may not qualify for dispute assistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">4. Dispute Resolution</h2>
              <p>If an issue arises between users:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Users should first communicate through platform messaging or agreed channels</li>
                <li>If unresolved, a dispute may be raised through ONIT INDIA support</li>
                <li>Relevant evidence may be reviewed including messages, task descriptions, and timelines</li>
                <li>Decisions are made based on available information and applicable platform policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">5. Prohibited Conduct</h2>
              <p>Users must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Post illegal, unsafe, or harmful tasks</li>
                <li>Engage in fraud or misrepresentation</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Attempt to bypass platform payments or protections</li>
              </ul>
              <p className="mt-3">
                Violations may result in warnings, account restrictions, suspension, or permanent removal from the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">6. Platform Independence</h2>
              <p>
                Task Performers operate as independent contractors.
              </p>
              <p className="mt-3">ONIT INDIA:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Does not guarantee income</li>
                <li>Does not set working hours</li>
                <li>Does not control pricing between users</li>
                <li>Does not provide employment benefits</li>
              </ul>
              <p className="mt-3">
                Users participate at their own discretion and risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">7. User Responsibility</h2>
              <p>Users are responsible for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Accurate task descriptions</li>
                <li>Lawful conduct</li>
                <li>Compliance with applicable laws and regulations</li>
                <li>Their own safety and judgment during task execution</li>
              </ul>
              <p className="mt-3">
                ONIT INDIA facilitates connections and payment infrastructure only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">8. Enforcement</h2>
              <p>To maintain platform safety and compliance, ONIT INDIA may:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Remove tasks or content</li>
                <li>Freeze or review accounts</li>
                <li>Temporarily hold payments during investigations</li>
                <li>Suspend or permanently terminate platform access</li>
              </ul>
              <p className="mt-3">
                These actions may be taken with or without prior notice when necessary to protect users or comply with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">9. Support & Reporting</h2>
              <p>If you experience:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment issues</li>
                <li>Fraud or misuse</li>
                <li>Safety concerns</li>
                <li>Platform violations</li>
              </ul>
              <p className="mt-3">
                Please contact the official support channel listed in the Terms of Use.
              </p>
              <p className="mt-2">
                <strong>Support Email:</strong> support@onitindia.com
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            Last Updated: 01 March 2026 · ONIT INDIA
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrustAndSafety;
