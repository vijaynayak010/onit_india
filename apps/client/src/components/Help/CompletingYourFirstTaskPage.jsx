import React from "react";
import { Link } from "react-router-dom";
import HelpArticleLayout from "./HelpArticleLayout";

const STEPS = [
  {
    step: 1,
    title: "Find tasks that match your skills",
    body: "Browse tasks on the platform (e.g. from the dashboard or task list). Use categories or search to find work you can do. Check the title, description, price, and deadline before showing interest.",
  },
  {
    step: 2,
    title: "Show interest at the provider’s price",
    body: "When you find a task you can complete, click to show interest. You’re agreeing to do the task at the price the provider set. Make sure you can deliver by the deadline and meet the requirements.",
  },
  {
    step: 3,
    title: "Chat with the provider",
    body: "The provider may chat with you to clarify scope, share files, or ask questions. Reply promptly and confirm what you’ll deliver and by when. This builds trust and reduces misunderstandings.",
  },
  {
    step: 4,
    title: "Get assigned and do the work",
    body: "If the provider chooses you, they’ll assign the task to you. Complete the work as agreed, and use the chat if you need to ask anything. Submit your deliverable through the platform (e.g. link or file) when done.",
  },
  {
    step: 5,
    title: "Get paid when the provider approves",
    body: "Once the provider reviews your work and approves it, payment is released to you. If they request changes, make the revisions and resubmit. Payment is only released after approval.",
  },
];

const CompletingYourFirstTaskPage = () => (
  <HelpArticleLayout
    title="Completing Your First Task | OnIT INDIA"
    description="For task performers: how to find tasks, show interest, chat with providers, and get paid when you complete work."
    slug="completing-your-first-task"
  >
    <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-6">
      Completing Your First Task
    </h1>
    <p className="text-gray-600 text-lg mb-10">
      This guide is for task performers: people who want to earn by completing tasks on OnIT INDIA. You find tasks, show interest at the provider’s price, get assigned, complete the work, and get paid when the provider approves.
    </p>

    <div className="space-y-8">
      {STEPS.map(({ step, title, body }) => (
        <div key={step} className="flex gap-4">
          <span className="shrink-0 w-10 h-10 rounded-full bg-[#004d43] text-white flex items-center justify-center font-bold text-sm">
            {step}
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#004d43] mb-2">{title}</h2>
            <p className="text-gray-600">{body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-12 rounded-xl bg-[#004d43]/5 border border-[#004d43]/15 p-6">
      <h2 className="text-lg font-bold text-[#004d43] mb-2">Tips for performers</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
        <li>Only show interest in tasks you can complete well and on time.</li>
        <li>Read the full description and deliver exactly what’s asked (and in the format requested).</li>
        <li>Respond to chat quickly so providers can assign and get started.</li>
        <li>Building a good profile and completion history helps you get more tasks.</li>
      </ul>
    </div>

    <p className="mt-10 text-gray-600">
      New to the platform? Read the <Link to="/help/getting-started" className="text-[#004d43] font-medium hover:underline">Getting Started Guide</Link>. Want to post work instead? See <Link to="/help/posting-your-first-task" className="text-[#004d43] font-medium hover:underline">Posting Your First Task</Link>.
    </p>
  </HelpArticleLayout>
);

export default CompletingYourFirstTaskPage;
