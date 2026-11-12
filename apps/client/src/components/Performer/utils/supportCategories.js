import {
  ClipboardList,
  UserX,
  HeartPulse,
  Smile,
  CreditCard,
  Briefcase,
} from "lucide-react";

/**
 * Static performer support help categories + FAQs (UI-only; no API).
 */
export const SUPPORT_CATEGORIES = [
  {
    id: "task-issues",
    title: "Task Issues",
    shortDescription: "Problems with task details",
    subtitle: "Requirements, deadlines & deliverables",
    Icon: ClipboardList,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    faqs: [
      {
        q: "Where can I view the complete task details?",
        a: "Tap the task card at the top of this screen or go to My Task in the bottom nav. Full details including requirements, attachments, and milestones are shown there.",
      },
      {
        q: "The task requirements are unclear.",
        a: "Open Chat on your active task and ask the client clarifying questions. You can also review Files & Documents for briefs and attachments shared by the provider.",
      },
      {
        q: "Can the provider update the task after I start?",
        a: "Providers may clarify scope in chat. Material changes to budget, deadline, or deliverables should be agreed in writing in the task chat before you proceed.",
      },
      {
        q: "What happens if I miss the deadline?",
        a: "Contact the provider as early as possible to renegotiate. Repeated missed deadlines can affect ratings. If you cannot complete the work, use support to discuss next steps.",
      },
      {
        q: "How do I track my task progress?",
        a: "Use the Check List tab on My Task to tick items as you finish them. Progress and status updates stay visible to you and help keep the client informed.",
      },
    ],
  },
  {
    id: "provider-issues",
    title: "Provider Issues",
    shortDescription: "Issues with the client",
    subtitle: "Chat, clarification & no response",
    Icon: UserX,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    faqs: [
      {
        q: "The provider isn't responding.",
        a: "Send a polite follow-up in task chat. If there is no reply after a reasonable wait (usually 24–48 hours), chat with Support and we can help escalate.",
      },
      {
        q: "How do I ask questions about the task?",
        a: "Open the Chat tab on your active task page and message the provider directly. Keep questions clear and reference specific deliverables when possible.",
      },
      {
        q: "I received inappropriate messages.",
        a: "Do not engage further. Use Safety & Reporting or Chat with Support immediately so our team can review and take action.",
      },
      {
        q: "Can I report the provider?",
        a: "Yes. Open Safety & Reporting for steps, or Chat with Support and share screenshots or chat context so we can investigate.",
      },
      {
        q: "How long should I wait for a reply?",
        a: "Most providers reply within a business day. If urgency is high (deadline risk), message Support after 24 hours of no response.",
      },
    ],
  },
  {
    id: "submission-issues",
    title: "Submission Issues",
    shortDescription: "Uploads, revisions & completion",
    subtitle: "Uploads, revisions & completion",
    Icon: HeartPulse,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    faqs: [
      {
        q: "How do I submit my completed task?",
        a: "On My Task, open Files & Documents or the submission section, upload your deliverables, add notes or a work link if needed, then submit for client review.",
      },
      {
        q: "My files won't upload.",
        a: "Check your connection and file size. Try a smaller file or a different format. If uploads still fail, note the error and Chat with Support under Technical Issues.",
      },
      {
        q: "What file formats are supported?",
        a: "Common formats such as PDF, DOC/DOCX, PNG, JPG, ZIP, and typical design or code files are supported. Prefer widely used formats for client review.",
      },
      {
        q: "Can I edit my submission after sending?",
        a: "Once submitted, wait for client feedback. If revisions are requested, upload updated files and resubmit. Contact Support if you submitted the wrong file by mistake.",
      },
      {
        q: "The provider requested revisions. What should I do?",
        a: "Review their feedback carefully, update the deliverables, and resubmit. Use chat to confirm scope if anything is unclear before redoing large pieces of work.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    shortDescription: "Billing or payment concerns",
    subtitle: "Escrow, payment release & refunds",
    Icon: Smile,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    faqs: [
      {
        q: "When will my payment be released?",
        a: "Payment is typically released after the client approves your submitted work. You can track releases under My earnings / Wallet.",
      },
      {
        q: "Why is my payment pending?",
        a: "Pending usually means the task is still in review, escrow has not been released yet, or a payout method still needs verification. Check task status and your bank details.",
      },
      {
        q: "What is the platform fee?",
        a: "FirstDoer may deduct a platform fee from task earnings. The net payout shown in your wallet reflects fees after a successful release.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds are handled according to dispute outcomes and platform policy. Contact Support with your task ID if you believe a refund or payment correction is needed.",
      },
      {
        q: "Where can I view my payment status?",
        a: "Go to My earnings or Wallet transactions. Each release or pending payout is listed with status and amount.",
      },
    ],
  },
  {
    id: "safety-reporting",
    title: "Safety & Reporting",
    shortDescription: "Report abuse or fraud behaviour",
    subtitle: "Report abuse, fraud or inappropriate behaviour",
    Icon: CreditCard,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    faqs: [
      {
        q: "How do I report abusive behaviour?",
        a: "Save screenshots of the chat, then Chat with Support and share the task ID plus evidence. Our team reviews reports confidentially.",
      },
      {
        q: "How do I report fraud?",
        a: "Do not share payment outside the platform. Report suspected fraud to Support with details of the request, user, and any links or accounts involved.",
      },
      {
        q: "What happens after I submit a report?",
        a: "Support reviews the case, may ask for more details, and can warn, suspend, or remove offending accounts. You will get an update when action is taken.",
      },
      {
        q: "Can I block a user?",
        a: "Contact Support to request limited interaction or escalation. Avoid continuing chat if you feel unsafe; report immediately instead.",
      },
      {
        q: "Will the reported user know it was me?",
        a: "We handle reports carefully and do not reveal unnecessary personal details. Focus on facts and evidence when filing a report.",
      },
    ],
  },
  {
    id: "technical-issues",
    title: "Technical Issues",
    shortDescription: "App errors, uploads & notifications",
    subtitle: "App errors, uploads & notifications",
    Icon: Briefcase,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    faqs: [
      {
        q: "The page won't load or keeps refreshing.",
        a: "Refresh the browser, clear cache, or try another browser. If the issue continues, note the page URL and Chat with Support.",
      },
      {
        q: "I am not receiving notifications.",
        a: "Check your browser notification permission and spam folder for email alerts. You can also open the bell icon in the header for in-app notifications.",
      },
      {
        q: "Uploads fail with an error.",
        a: "Confirm file size and format, then retry. If it still fails, try a different network and share the exact error message with Support.",
      },
      {
        q: "Chat messages are not sending.",
        a: "Check your connection and try again. If the failure persists, reopen the Chat tab or contact Support with the task ID.",
      },
      {
        q: "Something else is broken.",
        a: "Describe what you expected vs what happened, include screenshots if possible, and Chat with Support so we can investigate quickly.",
      },
    ],
  },
];
