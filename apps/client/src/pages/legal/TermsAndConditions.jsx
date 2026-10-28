import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Terms of Use & Platform Agreement | ONIT INDIA"
        description="ONIT INDIA Terms of Use and Platform Agreement. Rules for using the task execution platform and task marketplace India. Effective 01 March 2026."
        keywords="OnIT INDIA terms, terms of use, platform agreement, user agreement, task marketplace terms, OnIT INDIA legal"
        canonical="https://www.onitindia.com/terms-and-conditions"
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-4">
              ONIT INDIA – TERMS OF USE & PLATFORM AGREEMENT
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Effective From:</strong> 01 March 2026
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              <strong>Platform Name:</strong> ONIT INDIA
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              <strong>Operated By:</strong> Uday Gedam (Founder of ONIT INDIA)
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              <strong>Correspondence Address:</strong> Tailors Colony, Adilabad, Telangana, India
            </p>
          </header>

          <div className="space-y-10 text-justify leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">1. INTRODUCTION</h2>
              <p>
                Welcome to ONIT INDIA ("ONIT INDIA", "we", "us", or "our").
              </p>
              <p className="mt-2">
                These Terms of Use ("Terms") govern your access to and use of the ONIT INDIA website, mobile applications, and related services (collectively, the "Platform").
              </p>
              <p className="mt-2">
                By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be legally bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">2. PLATFORM ROLE (INTERMEDIARY STATUS)</h2>
              <p>
                ONIT INDIA operates solely as a technology intermediary marketplace that connects independent users.
              </p>
              <p className="mt-2">
                ONIT INDIA does not provide tasks, employ Task Performers, or supervise task execution. All tasks constitute agreements entered into directly between users.
              </p>
              <p className="mt-2">
                Nothing contained in these Terms shall be construed as creating any employment, agency, partnership, or joint venture relationship between ONIT INDIA and any User.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">3. DEFINITIONS</h2>
              <p className="mb-2">For the purposes of these Terms:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>"User"</strong> means any individual or entity accessing or using the Platform.</li>
                <li><strong>"Task Provider"</strong> means a verified User who posts a Task on the Platform.</li>
                <li><strong>"Task Performer"</strong> means a verified User who accepts and executes a Task.</li>
                <li><strong>"Task"</strong> means any service, job, or assignment listed on the Platform.</li>
                <li><strong>"Platform Fee"</strong> means the fee charged by ONIT INDIA for facilitating use of the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">4. ELIGIBILITY & ACCOUNT RULES</h2>
              <p>
                Users must be at least eighteen (18) years of age and legally competent under applicable Indian law.
              </p>
              <p className="mt-2">
                Each User may maintain only one account unless expressly approved by ONIT INDIA in writing.
              </p>
              <p className="mt-2">
                ONIT INDIA reserves the right to suspend or terminate any account containing false, misleading, or inaccurate information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">5. IDENTITY VERIFICATION (MANDATORY)</h2>
              <p>
                Identity verification is mandatory in order to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Post Tasks</li>
                <li>Accept Tasks</li>
                <li>Receive payouts</li>
              </ul>
              <p className="mt-3">
                Verification may require submission of valid government-issued identification, including but not limited to Aadhaar, PAN, Passport, Driving Licence, or Voter ID.
              </p>
              <p className="mt-2">
                Verification confirms only the submission and review of documents and does not guarantee a User's reliability, skill level, qualifications, or conduct.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">6. TASK GUIDELINES & USER RESPONSIBILITIES</h2>
              <h3 className="text-lg font-medium text-[#004d43] mt-4 mb-2">6.1 Responsibilities of Task Providers</h3>
              <p>Task Providers shall:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Post lawful and safe Tasks</li>
                <li>Provide accurate descriptions of scope, timelines, and compensation</li>
                <li>Ensure compliance with applicable laws and regulations</li>
              </ul>
              <h3 className="text-lg font-medium text-[#004d43] mt-4 mb-2">6.2 Responsibilities of Task Performers</h3>
              <p>Task Performers shall:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Accept only those Tasks they are capable of completing</li>
                <li>Perform Tasks lawfully, safely, and professionally</li>
              </ul>
              <p className="mt-3">
                ONIT INDIA may remove Tasks or restrict accounts at its sole discretion and without assuming control over Task execution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">7. PROHIBITED OR RESTRICTED TASKS</h2>
              <p className="mb-2">The following categories of Tasks are strictly prohibited:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Illegal or unlawful activities</li>
                <li>Hazardous or dangerous work</li>
                <li>Regulated services (including medical, legal, or financial advice)</li>
                <li>Sexual services</li>
                <li>Child-related activities</li>
                <li>Weapons-related activities</li>
                <li>Gambling activities</li>
                <li>Political campaigning</li>
                <li>Activities requiring specific governmental licenses or regulatory approvals</li>
              </ul>
              <p className="mt-3">
                ONIT INDIA retains absolute discretion in enforcing this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">8. PAYMENTS, ESCROW & PLATFORM FEES</h2>
              <p>
                Payments for Tasks may be collected prior to commencement and held until Task completion or dispute resolution.
              </p>
              <p className="mt-2">
                Payments are processed through compliant third-party payment gateways under the operator's registered payment account.
              </p>
              <p className="mt-2">
                Platform Fees may apply to Users. Applicable Goods and Services Tax (GST) shall be charged on Platform Fees as required by law.
              </p>
              <p className="mt-2">
                Refunds, if any, shall be processed on a case-by-case basis based on evidence, platform policies, and User conduct.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">9. OFF-PLATFORM TRANSACTIONS</h2>
              <p>
                Users shall not move payments or transactions outside the ONIT INDIA Platform.
              </p>
              <p className="mt-2">
                A first violation may result in a warning. Repeated violations may result in suspension or permanent termination of the User's account.
              </p>
              <p className="mt-2">
                ONIT INDIA shall not provide protection, support, or dispute resolution for transactions conducted outside the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">10. RATINGS, REVIEWS & CONTENT</h2>
              <p>
                Users may submit ratings and reviews following Task completion.
              </p>
              <p className="mt-2">
                False, misleading, abusive, retaliatory, defamatory, or manipulated content is strictly prohibited.
              </p>
              <p className="mt-2">
                ONIT INDIA reserves the right to moderate, edit, or remove content at its sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">11. SUSPENSION & TERMINATION</h2>
              <p>
                ONIT INDIA may suspend or terminate User accounts in cases involving:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Repeated disputes or misuse of the Platform</li>
                <li>Conduct detrimental to the Platform or its Users</li>
              </ul>
              <p className="mt-3">
                Such action may extend to linked accounts, devices, and payment methods. ONIT INDIA is under no obligation to reinstate any account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">12. INDEPENDENT CONTRACTOR STATUS</h2>
              <p>
                Task Performers act as independent contractors and not as employees, agents, or representatives of ONIT INDIA.
              </p>
              <p className="mt-2">
                ONIT INDIA is not responsible for wages, taxes, insurance, employee benefits, or statutory compliance obligations of Users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">13. DISCLAIMER OF WARRANTIES</h2>
              <p>
                The Platform is provided on an "as is" and "as available" basis.
              </p>
              <p className="mt-2">
                ONIT INDIA makes no representations or warranties regarding:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Platform availability or uptime</li>
                <li>Task completion or quality</li>
                <li>User conduct or reliability</li>
              </ul>
              <p className="mt-2">
                Use of the Platform is at the User's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">14. LIMITATION OF LIABILITY</h2>
              <p>
                To the maximum extent permitted by law, ONIT INDIA shall not be liable for any indirect, incidental, special, or consequential damages.
              </p>
              <p className="mt-2">
                In all cases, total liability shall not exceed the total Platform Fees paid by the User during the preceding six (6) months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">15. INDEMNIFICATION</h2>
              <p>
                Users agree to indemnify, defend, and hold harmless ONIT INDIA and its operator from and against any claims, losses, damages, liabilities, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Their use of the Platform</li>
                <li>Any Task or related activity</li>
                <li>Violation of applicable law</li>
                <li>Breach of these Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">16. FORCE MAJEURE</h2>
              <p>
                ONIT INDIA shall not be liable for any delay or failure in performance resulting from events beyond its reasonable control, including but not limited to internet outages, payment gateway failures, governmental actions, or natural disasters.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">17. COMMUNICATION CONSENT</h2>
              <p>
                Users consent to receive transactional, security, and service-related communications via email, SMS, phone calls, WhatsApp, and in-app notifications, subject to applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">18. DISPUTE RESOLUTION</h2>
              <p>
                All disputes arising out of or relating to these Terms shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.
              </p>
              <p className="mt-2">
                <strong>Seat and Venue:</strong> New Delhi, India<br />
                <strong>Language:</strong> English
              </p>
              <p className="mt-2">
                Courts located in New Delhi shall have jurisdiction solely for the purpose of interim relief.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">19. GOVERNING LAW</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">20. POLICY HIERARCHY & CHANGES</h2>
              <p>
                These Terms shall prevail over any conflicting platform policies unless expressly stated otherwise.
              </p>
              <p className="mt-2">
                ONIT INDIA reserves the right to amend or update these Terms at any time. Continued use of the Platform following any update constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">21. STARTUP-SAFE ADDITIONAL PROTECTIONS</h2>
              <p>
                ONIT INDIA may use automated systems or artificial intelligence for matching, categorization, fraud detection, and recommendations. Such outputs are advisory only.
              </p>
              <p className="mt-2">
                ONIT INDIA does not guarantee Task matching or outcomes.
              </p>
              <p className="mt-2">
                ONIT INDIA may hold or reverse funds in cases involving fraud, chargebacks, or compliance checks.
              </p>
              <p className="mt-2">
                Users remain responsible for taxes, licenses, and regulatory compliance.
              </p>
              <p className="mt-2">
                To the extent permitted by law, Users waive participation in class-action or representative proceedings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">22. CONTACT & GRIEVANCE REDRESSAL</h2>
              <p className="mb-2">
                <strong>Grievance Contact:</strong> Uday Gedam<br />
                <strong>Email:</strong> support@onitindia.com
              </p>
              <p className="mb-2">
                <strong>Address:</strong> Tailors Colony, Adilabad, Telangana, India
              </p>
              <p className="mt-3">
                <strong>Response Timeline:</strong>
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acknowledgement within 24 hours</li>
                <li>Initial review within 72 hours</li>
                <li>Resolution within 15 business days (subject to complexity)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">23. DATA PRIVACY & DIGITAL PERSONAL DATA COMPLIANCE</h2>
              <p>
                ONIT INDIA collects, processes, and stores User data solely for purposes including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Platform operation</li>
                <li>Identity verification</li>
                <li>Safety and fraud prevention</li>
                <li>Payment processing</li>
                <li>Service improvement</li>
              </ul>
              <p className="mt-3">
                Users acknowledge and consent to such processing in accordance with applicable Indian data protection laws, including the Digital Personal Data Protection Act, 2023.
              </p>
              <p className="mt-2">
                ONIT INDIA may retain, delete, or anonymize data in accordance with legal and operational requirements. Users may request correction or deletion subject to regulatory obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">24. NO EMPLOYMENT OR CONTROL RELATIONSHIP (EXPANDED)</h2>
              <p>
                Task Performers retain full discretion over:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The manner and method of completing Tasks</li>
                <li>Tools and resources used</li>
                <li>Schedule and availability</li>
                <li>Acceptance or rejection of Tasks</li>
              </ul>
              <p className="mt-3">
                ONIT INDIA does not supervise, direct, or control Task execution and does not guarantee minimum earnings, workload, or continued access to Tasks.
              </p>
              <p className="mt-2">
                Platform features such as ratings or matching tools are informational only and do not constitute managerial control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">25. AI SYSTEMS & AUTOMATED RECOMMENDATIONS</h2>
              <p>
                ONIT INDIA may use automated systems or artificial intelligence tools to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Suggest Task matches</li>
                <li>Assist in Task structuring</li>
                <li>Provide pricing insights</li>
                <li>Detect risk or fraud</li>
              </ul>
              <p className="mt-3">
                All outputs are advisory only. Final decisions remain solely with Users. ONIT INDIA does not guarantee the accuracy or suitability of automated outputs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">26. HYPERLOCAL & PHYSICAL TASK LIABILITY DISCLAIMER</h2>
              <p>
                For Tasks involving physical or on-ground activities, Users acknowledge that ONIT INDIA:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Does not supervise execution</li>
                <li>Does not provide insurance</li>
                <li>Does not provide safety guarantees or workplace protections</li>
              </ul>
              <p className="mt-3">
                Users participate at their own risk. ONIT INDIA shall not be liable for injuries, accidents, property damage, or third-party claims arising from such Tasks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">27. TAXATION & REGULATORY RESPONSIBILITY</h2>
              <p>
                Users are solely responsible for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment of applicable taxes (including GST and income tax)</li>
                <li>Compliance with invoicing requirements</li>
                <li>Deduction and reporting obligations (including TDS where applicable)</li>
              </ul>
              <p className="mt-3">
                ONIT INDIA acts solely as an intermediary and assumes no responsibility for User tax compliance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#004d43] mb-3">28. FRAUD PREVENTION & COMPLIANCE MONITORING</h2>
              <p>
                ONIT INDIA reserves the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Conduct additional identity or compliance verification</li>
                <li>Temporarily hold or reverse funds in cases of suspected fraud or chargebacks</li>
                <li>Restrict or terminate accounts engaged in unlawful or suspicious activity</li>
              </ul>
              <p className="mt-3">
                Such actions may be taken without prior notice where necessary for safety or legal compliance.
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

export default TermsAndConditions;
