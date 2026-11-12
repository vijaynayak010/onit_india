import React from "react";
import { Link } from "react-router-dom";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

const faqs = [
  {
    id: 1,
    question: "What is FirstDoer?",
    answer: (
      <>
        FirstDoer is a digital task marketplace that connects <strong>Task Providers</strong> who need work done with <strong>Task Performers</strong> who can complete those tasks. The platform facilitates matching, communication, secure payments, and dispute resolution.
      </>
    ),
    answerText: "FirstDoer is a digital task marketplace that connects Task Providers who need work done with Task Performers who can complete those tasks. The platform facilitates matching, communication, secure payments, and dispute resolution.",
  },
  {
    id: 2,
    question: "How do I post a task?",
    answer: "Switch to Task Provider mode, create a task, add a clear description, set your budget, and publish it. Task Performers can then review and apply.",
  },
  {
    id: 3,
    question: "How do I accept a task?",
    answer: "Task Performers can browse available tasks, review details, submit an offer, and begin work once the Task Provider confirms.",
  },
  {
    id: 4,
    question: "How does payment work?",
    answer: (
      <>
        FirstDoer uses an escrow-based payment system.
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Payment is secured when a task is confirmed</li>
          <li>Funds remain protected while work is in progress</li>
          <li>Payment is released when the task is marked complete</li>
        </ul>
        <p className="mt-3">This protects both Task Providers and Task Performers.</p>
      </>
    ),
    answerText: "FirstDoer uses an escrow-based payment system. Payment is secured when a task is confirmed, funds remain protected while work is in progress, and payment is released when the task is marked complete. This protects both Task Providers and Task Performers.",
  },
  {
    id: 5,
    question: "Why is my payment held in escrow?",
    answer: (
      <>
        Escrow ensures fairness and trust. Funds are held securely so that:
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Task Providers are protected until work is delivered</li>
          <li>Task Performers know payment is reserved for them</li>
        </ul>
        <p className="mt-3">No payment is released until completion or resolution.</p>
      </>
    ),
    answerText: "Escrow ensures fairness and trust. Task Providers are protected until work is delivered, and Task Performers know payment is reserved for them. No payment is released until completion or resolution.",
  },
  {
    id: 6,
    question: "Can a task be cancelled?",
    answer: (
      <>
        Yes. Tasks may be cancelled depending on the stage of work.
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Before work starts → refund may apply</li>
          <li>After work begins → outcome depends on work completed and review</li>
        </ul>
        <p className="mt-3">Details are governed by the <Link to="/refund-policy" className="text-[var(--color-primary)] hover:text-green-600 underline">Refund & Cancellation Policy</Link>.</p>
      </>
    ),
    answerText: "Yes. Tasks may be cancelled depending on the stage of work. Before work starts a refund may apply; after work begins the outcome depends on work completed and review. Details are governed by the Refund & Cancellation Policy.",
  },
  {
    id: 7,
    question: "What happens if there is a dispute?",
    answer: (
      <>
        If something goes wrong, either party can raise a dispute inside the platform.
        <p className="mt-3">FirstDoer reviews:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Task details</li>
          <li>Communication history</li>
          <li>Evidence provided</li>
        </ul>
        <p className="mt-3">Funds remain protected in escrow until a decision is made.</p>
      </>
    ),
    answerText: "If something goes wrong, either party can raise a dispute inside the platform. FirstDoer reviews task details, communication history, and evidence provided. Funds remain protected in escrow until a decision is made.",
  },
  {
    id: 8,
    question: "Are users verified?",
    answer: "Yes. Users may be required to complete identity verification before posting or accepting tasks to improve trust and reduce fraud. Verification confirms identity but does not guarantee behaviour or task outcomes.",
  },
  {
    id: 9,
    question: "Can I pay or communicate outside FirstDoer?",
    answer: "No. Payments must remain inside the platform. Off-platform payments are not protected and may void dispute or refund support.",
  },
  {
    id: 10,
    question: "How are ratings and reviews used?",
    answer: "After each completed task, both sides can leave feedback. Ratings help maintain quality, build trust, and improve visibility for reliable users.",
  },
  {
    id: 11,
    question: "Is FirstDoer responsible for task outcomes?",
    answer: "No. FirstDoer is a technology intermediary. Tasks are performed independently between users. The platform facilitates connection, payment security, and dispute resolution but does not provide services directly.",
  },
  {
    id: 12,
    question: "How can I contact support?",
    answer: "Support is available through the platform's help section or via official contact channels listed in the Terms & Conditions. Please include task details and relevant information when requesting help.",
  },
];

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": typeof faq.answer === "string" ? faq.answer : (faq.answerText || ""),
    },
  })),
};

const FAQs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Frequently Asked Questions | FirstDoer"
        description="FAQs about FirstDoer: posting tasks, payments, escrow, cancellations, disputes, and support. Task execution platform help."
        keywords="firstdoer, FirstDoer FAQ, tasks, payments, escrow, support, task marketplace India FAQ, how to post task, how to pay"
        canonical="https://www.firstdoer.com/faqs"
        additionalSchemas={[faqPageSchema]}
      />

      <section className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-green-600 font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">
              FirstDoer – Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Quick answers about the platform, tasks, payments, and support.
            </p>
          </header>

          <div className="space-y-10">
            {faqs.map((faq, index) => (
              <article
                key={faq.id}
                className="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="text-lg md:text-xl font-semibold text-[var(--color-primary)] mb-3">
                  {index + 1}. {faq.question}
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            Need more? See <Link to="/terms-and-conditions" className="text-[var(--color-primary)] hover:underline">Terms & Conditions</Link> or <Link to="/refund-policy" className="text-[var(--color-primary)] hover:underline">Refund & Cancellation Policy</Link>.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
