import React from "react";
import { Link } from "react-router-dom";
import HelpArticleLayout from "./HelpArticleLayout";

const GettingStartedGuidePage = () => (
  <HelpArticleLayout
    title="Getting Started Guide | FirstDoer"
    description="New to FirstDoer? Learn how the platform works, create your account, and understand the basics of posting or completing tasks."
    slug="getting-started"
  >
    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
      Getting Started Guide
    </h1>
    <p className="text-gray-600 text-lg mb-10">
      FirstDoer connects people who need work done (task providers) with people who can do it (task performers). This guide covers the basics so you can use the platform with confidence.
    </p>

    <div className="prose prose-gray max-w-none">
      <h2 className="text-xl font-bold text-[var(--color-primary)] mt-8 mb-3">What is FirstDoer?</h2>
      <p className="text-gray-600 mb-4">
        FirstDoer is a task execution platform. You can either <strong>post tasks</strong> (describe what you need done and pay when it&apos;s complete) or <strong>complete tasks</strong> (find work that matches your skills and get paid). No long-term contracts — everything is task-based.
      </p>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mt-8 mb-3">Create your account</h2>
      <p className="text-gray-600 mb-4">
        To get started, you need an account. Go to the <Link to="/auth" className="text-[var(--color-primary)] font-medium hover:underline">Sign up / Log in</Link> page, enter your email, and complete verification. Once you&apos;re in, you can post tasks (as a provider) or browse and complete tasks (as a performer).
      </p>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mt-8 mb-3">Two ways to use the platform</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
        <li><strong>Task provider:</strong> You have work that needs to be done. You post a task, set a price, review interested performers, assign the work, and pay when it&apos;s done.</li>
        <li><strong>Task performer:</strong> You want to earn by completing tasks. You browse tasks, show interest at the provider&apos;s price, chat to confirm scope, complete the work, and get paid when the provider approves.</li>
      </ul>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mt-8 mb-3">Key things to know</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
        <li><strong>Payment:</strong> Providers set the price when posting. Payment is released only after the provider approves the completed work.</li>
        <li><strong>Chat:</strong> Use in-app chat to clarify requirements, share files, and confirm details before and during the task.</li>
        <li><strong>Trust:</strong> Performers can be verified; providers can review profiles and ratings before assigning.</li>
      </ul>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mt-8 mb-3">Next steps</h2>
      <p className="text-gray-600 mb-4">
        If you&apos;re posting work, read our guide on <Link to="/help/posting-your-first-task" className="text-[var(--color-primary)] font-medium hover:underline">Posting Your First Task</Link>. If you&apos;re completing work, see <Link to="/help/completing-your-first-task" className="text-[var(--color-primary)] font-medium hover:underline">Completing Your First Task</Link>. For more detail on the flow, visit <Link to="/how-it-works" className="text-[var(--color-primary)] font-medium hover:underline">How it works</Link>.
      </p>
    </div>
  </HelpArticleLayout>
);

export default GettingStartedGuidePage;
