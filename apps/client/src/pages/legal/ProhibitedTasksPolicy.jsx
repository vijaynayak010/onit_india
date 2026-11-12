import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const PROHIBITED = [
  "Illegal or unlawful activities",
  "Hazardous or dangerous work",
  "Regulated services (including medical, legal, or financial advice)",
  "Sexual services",
  "Child-related activities",
  "Weapons-related activities",
  "Gambling activities",
  "Political campaigning",
  "Activities requiring specific governmental licenses or regulatory approvals",
];

const ProhibitedTasksPolicy = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Prohibited Tasks Policy | FirstDoer"
      description="Tasks that are not allowed on FirstDoer. Prohibited categories include illegal, hazardous, regulated, and other restricted activities. Enforcement and account consequences."
      keywords="FirstDoer prohibited tasks, restricted tasks, task policy, acceptable use, platform rules, task marketplace India"
      canonical="https://www.firstdoer.com/prohibited-tasks-policy"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8">
          ← Back to Home
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-medium text-[var(--color-primary)] mb-4">
            Prohibited Tasks Policy
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            <strong>Effective:</strong> 01 March 2026. This policy lists categories of tasks that are not allowed on the FirstDoer platform.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            See also <Link to="/task-guidelines" className="text-[var(--color-primary)] font-medium hover:underline">Task Guidelines &amp; Posting Rules</Link> and <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link>.
          </p>
        </header>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">1. Prohibited Categories</h2>
            <p className="mb-4">The following categories of tasks are <strong>strictly prohibited</strong> on FirstDoer. Posting, accepting, or completing such tasks is a violation of our terms.</p>
            <ul className="list-disc pl-6 space-y-2">
              {PROHIBITED.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">2. Enforcement</h2>
            <p>FirstDoer retains <strong>absolute discretion</strong> in enforcing this policy. We may:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Remove any task that falls within or appears to fall within a prohibited category</li>
              <li>Restrict or suspend the accounts of users who post or accept prohibited tasks</li>
              <li>Permanently terminate accounts in case of serious or repeated violations</li>
            </ul>
            <p className="mt-3">We are not obligated to give prior notice before removing a task or restricting an account, though we may do so where appropriate.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">3. Other Rules</h2>
            <p>Task providers and performers must also follow our general <Link to="/task-guidelines" className="text-[var(--color-primary)] font-medium hover:underline">Task Guidelines &amp; Posting Rules</Link> (e.g. lawful and safe tasks, accurate descriptions). Violations of those guidelines can also lead to task removal and account action.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-3">4. Full Terms</h2>
            <p>This page is a summary. The full rules are in our <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">Terms and Conditions</Link> (including Section 7 on Prohibited or Restricted Tasks). By using the platform, you agree to those terms.</p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default ProhibitedTasksPolicy;
