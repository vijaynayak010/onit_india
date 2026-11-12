import React from "react";
import { Link } from "react-router-dom";
import HelpArticleLayout from "./HelpArticleLayout";

const STEPS = [
  {
    step: 1,
    title: "Go to Post a task",
    body: "From the provider dashboard or the homepage, click “Post a task” or “Start posting”. You’ll be taken to the task creation flow.",
  },
  {
    step: 2,
    title: "Choose how to create your task",
    body: "You can write the task manually (title, description, budget, deadline) or use AI assist to generate a draft from a short brief. Edit the result to match what you need.",
  },
  {
    step: 3,
    title: "Set your price and details",
    body: "Set the amount you’re willing to pay for the task. Add a clear title and description, preferred timeline, and any skills or requirements. This helps the right performers find your task.",
  },
  {
    step: 4,
    title: "Publish and wait for interest",
    body: "Once published, performers can see your task and show interest at your price. You’ll see a list of interested performers with their profiles and ratings.",
  },
  {
    step: 5,
    title: "Chat, confirm, and assign",
    body: "Use chat to clarify scope, share files, and answer questions. When you’re ready, assign the task to one performer. Only one performer can be assigned per task.",
  },
  {
    step: 6,
    title: "Review work and release payment",
    body: "When the performer submits the work, review it. If you’re satisfied, approve it and payment is released to the performer. If something’s missing, use chat to request revisions.",
  },
];

const PostingYourFirstTaskPage = () => (
  <HelpArticleLayout
    title="Posting Your First Task | FirstDoer"
    description="Step-by-step guide for task providers: how to describe your task, set a budget, and get matched with performers who can deliver."
    slug="posting-your-first-task"
  >
    <h1 className="text-3xl md:text-4xl font-medium text-[var(--color-primary)] mb-6">
      Posting Your First Task
    </h1>
    <p className="text-gray-600 text-lg mb-10">
      This guide walks you through posting a task on FirstDoer so you can get work done by verified performers. You set the price; performers show interest; you choose, chat, assign, and pay when the work is done.
    </p>

    <div className="space-y-8">
      {STEPS.map(({ step, title, body }) => (
        <div key={step} className="flex gap-4">
          <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
            {step}
          </span>
          <div>
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-2">{title}</h2>
            <p className="text-gray-600">{body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-12 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 p-6">
      <h2 className="text-lg font-medium text-[var(--color-primary)] mb-2">Tips for a successful task</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
        <li>Write a clear, specific title (e.g. “Research competitors in X industry” instead of “Need research”).</li>
        <li>Describe deliverables and any format you need (e.g. “One-page summary in Google Doc”).</li>
        <li>Set a realistic price and deadline so performers can commit confidently.</li>
        <li>Respond to chat messages promptly so you can assign and get the work started quickly.</li>
      </ul>
    </div>

    <p className="mt-10 text-gray-600">
      Ready to post? <Link to="/provider/post-task-selection" className="text-[var(--color-primary)] font-medium hover:underline">Go to Post a task</Link>. New to the platform? See our <Link to="/help/getting-started" className="text-[var(--color-primary)] font-medium hover:underline">Getting Started Guide</Link>.
    </p>
  </HelpArticleLayout>
);

export default PostingYourFirstTaskPage;
