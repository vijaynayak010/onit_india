import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Privacy Policy | FirstDoer"
        description="FirstDoer Privacy Policy. How we collect, process, store, and safeguard your personal data. Task marketplace India data protection. Effective 01 March 2026."
        keywords="FirstDoer privacy policy, data protection, personal data, task execution platform privacy, FirstDoer data, user privacy, India data protection"
        canonical="https://www.firstdoer.com/privacy-policy"
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              FirstDoer – PRIVACY POLICY
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Effective Date:</strong> 01 March 2026
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-4">
              FirstDoer is a technology-enabled task marketplace connecting individuals and businesses for digital and future hyperlocal task execution.
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              This Privacy Policy explains how FirstDoer collects, processes, stores, shares, and safeguards personal data when users access or use the platform.
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              By accessing or using FirstDoer, you consent to the practices described in this Privacy Policy.
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">1. ROLE OF FirstDoer</h2>
              <p>
                FirstDoer operates solely as an intermediary platform connecting independent users.
              </p>
              <p className="mt-2">
                FirstDoer does not provide services directly and does not employ Task Performers.
              </p>
              <p className="mt-2">
                Personal data is processed only for the purpose of operating, securing, and improving the marketplace ecosystem.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">2. INFORMATION WE COLLECT</h2>
              <p className="mb-2">We may collect the following categories of information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mobile number (for OTP authentication)</li>
                <li>Email address</li>
                <li>Profile details and skills</li>
                <li>Task descriptions</li>
                <li>Chat messages</li>
                <li>Ratings and reviews</li>
                <li>Approximate city-level location</li>
                <li>IP address and device information</li>
                <li>Transaction metadata</li>
              </ul>
              <p className="mt-3">
                Where required for fraud prevention or payout security, identity verification documents may be collected, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Aadhaar</li>
                <li>PAN</li>
                <li>Passport</li>
                <li>Driving Licence</li>
                <li>Voter ID</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">3. PAYMENT INFORMATION</h2>
              <p>
                FirstDoer collects transaction references, timestamps, and payment status.
              </p>
              <p className="mt-2">We do not store:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Card numbers</li>
                <li>CVV</li>
                <li>UPI PIN</li>
                <li>Banking credentials</li>
              </ul>
              <p className="mt-3">
                Payments are processed through compliant third-party payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">4. PURPOSE OF DATA PROCESSING</h2>
              <p className="mb-2">Personal data is processed for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>User authentication</li>
                <li>Fraud detection and prevention</li>
                <li>Task matching</li>
                <li>Payment processing</li>
                <li>Dispute resolution</li>
                <li>Platform performance improvement</li>
                <li>Legal compliance</li>
                <li>Defense of legal claims</li>
              </ul>
              <p className="mt-3">
                FirstDoer does not sell personal data and does not engage in behavioral advertising profiling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">5. USER VISIBILITY</h2>
              <p>
                Task Providers and Task Performers may view limited profile and task-related information necessary for task execution.
              </p>
              <p className="mt-2">
                Sensitive information such as government identification documents and financial credentials are never publicly displayed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">6. DATA SHARING</h2>
              <p className="mb-2">Personal data may be shared with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Payment processors</li>
                <li>Hosting providers</li>
                <li>Infrastructure and technology partners</li>
              </ul>
              <p className="mt-2">
                Such sharing is strictly limited to operational purposes.
              </p>
              <p className="mt-2">
                Aggregated and anonymized analytics data may be used to improve services.
              </p>
              <p className="mt-2">
                Personal data is not shared with advertising networks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">7. CROSS-BORDER PROCESSING</h2>
              <p>
                Data may be stored and processed in India or other jurisdictions where service providers operate, subject to reasonable safeguards and compliance with applicable Indian law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">8. DATA RETENTION</h2>
              <p className="mb-2">
                Personal data is retained only for as long as necessary for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Operational purposes</li>
                <li>Legal compliance</li>
                <li>Tax and audit requirements</li>
                <li>Dispute resolution</li>
              </ul>
              <p className="mt-2">
                Inactive data may be anonymized or securely deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">9. USER RIGHTS (Digital Personal Data Protection Act, 2023)</h2>
              <p className="mb-2">
                Subject to applicable law, users may:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion (subject to legal retention obligations)</li>
                <li>Withdraw consent for non-essential processing</li>
              </ul>
              <p className="mt-2">
                Withdrawal of essential consent may limit platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">10. SECURITY MEASURES</h2>
              <p className="mb-2">
                FirstDoer implements reasonable technical and organizational safeguards, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encryption in transit (HTTPS / TLS)</li>
                <li>Access controls</li>
                <li>Infrastructure monitoring</li>
                <li>Fraud detection systems</li>
              </ul>
              <p className="mt-2">
                While no system can guarantee absolute security, reasonable safeguards are maintained.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">11. DATA BREACH RESPONSE</h2>
              <p>
                In the event of a confirmed data breach, appropriate containment measures will be initiated promptly.
              </p>
              <p className="mt-2">
                Users or authorities may be notified where required under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">12. COMMUNICATION CONSENT</h2>
              <p className="mb-2">
                Users consent to receive service-related communications via:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email</li>
                <li>SMS</li>
                <li>Phone calls</li>
                <li>WhatsApp</li>
                <li>In-app notifications</li>
              </ul>
              <p className="mt-2">
                Marketing communications include opt-out options.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">13. CHILDREN'S DATA</h2>
              <p>
                FirstDoer is intended for individuals aged 18 years or older.
              </p>
              <p className="mt-2">
                We do not knowingly collect personal data from minors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">14. CHANGES TO THIS POLICY</h2>
              <p>
                This Privacy Policy may be updated periodically.
              </p>
              <p className="mt-2">
                Continued use of FirstDoer following any update constitutes acceptance of the revised Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">15. CONTACT & GRIEVANCE REDRESSAL</h2>
              <p className="mb-2">
                For privacy-related questions or grievances:
              </p>
              <p className="mb-2">
                <strong>Contact:</strong> Uday Gedam<br />
                <strong>Email:</strong> support@firstdoer.com
              </p>
              <p className="mb-2">
                <strong>Address:</strong> Tailors Colony, Adilabad, Telangana, India
              </p>
              <p className="mt-3">
                <strong>Response timeline:</strong>
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acknowledgement within 24 hours</li>
                <li>Initial review within 72 hours</li>
                <li>Resolution within 15 business days (subject to complexity)</li>
              </ul>
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

export default PrivacyPolicy;
