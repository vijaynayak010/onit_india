import React from "react";
import { Link } from "react-router-dom";
import { FileText, AlertCircle, CheckCircle } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const PROVIDER_RULES = [
  "Post lawful and safe tasks only.",
  "Provide accurate descriptions of scope, timelines, and compensation.",
  "Ensure your task and any instructions comply with applicable laws and regulations.",
];

const PERFORMER_RULES = [
  "Accept only tasks you are capable of completing.",
  "Perform tasks lawfully, safely, and professionally.",
  "Deliver work as agreed and respond to provider communication promptly.",
];

const PROHIBITED = [
  "Illegal or unlawful activities",
  "Hazardous or dangerous work",
  "Regulated services (e.g. medical, legal, or financial advice)",
  "Sexual services",
  "Child-related activities",
  "Weapons-related activities",
  "Gambling activities",
  "Political campaigning",
  "Activities requiring specific governmental licenses or regulatory approvals",
];

const TaskGuidelinesPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Task Guidelines & Posting Rules | FirstDoer"
      description="Task guidelines and posting rules for FirstDoer. What task providers and performers must do, and what tasks are prohibited. Follow these rules to keep the platform safe and fair."
      keywords="FirstDoer task guidelines, posting rules, prohibited tasks, task provider rules, task performer rules, acceptable use"
      canonical="https://www.firstdoer.com/task-guidelines"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/help"
          className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8"
        >
          ← Back to Help
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-medium text-[var(--color-primary)] mb-4">
            Task Guidelines & Posting Rules
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            To keep the platform safe and fair for everyone, task providers and performers must follow these guidelines. Tasks that violate these rules may be removed and accounts may be restricted.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <CheckCircle size={22} />
              Responsibilities of Task Providers
            </h2>
            <p className="text-gray-600 mb-3">When you post a task, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {PROVIDER_RULES.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <CheckCircle size={22} />
              Responsibilities of Task Performers
            </h2>
            <p className="text-gray-600 mb-3">When you complete a task, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {PERFORMER_RULES.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <AlertCircle size={22} />
              Prohibited Tasks
            </h2>
            <p className="text-gray-600 mb-3">
              The following types of tasks are not allowed on FirstDoer. Posting or accepting such tasks may result in removal of the task and restriction of your account.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {PROHIBITED.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-600 mt-4 text-sm">
              FirstDoer reserves the right to remove any task or restrict any account at its discretion to maintain safety and compliance.
            </p>
          </section>

          <section className="rounded-xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-[var(--color-primary)] mb-2 flex items-center gap-2">
              <FileText size={20} />
              Full terms
            </h2>
            <p className="text-gray-600 text-sm">
              These guidelines are a summary. The full rules are in our{" "}
              <Link to="/terms-and-conditions" className="text-[var(--color-primary)] font-medium hover:underline">
                Terms and Conditions
              </Link>
              . By using the platform, you agree to those terms.
            </p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TaskGuidelinesPage;
