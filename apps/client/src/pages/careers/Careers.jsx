import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowRight, Calendar, Clock, FileText, List, X, Upload, CheckCircle } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import { API_BASE } from "../../config";
import { getApiUrl } from "../../config/apiBase";

const FALLBACK_POSITIONS = [
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "India (Remote / Hybrid)",
    postedDate: "2025-02-15",
    deadline: "2025-04-15",
    description:
      "Design, build, and maintain scalable backend services and APIs that power our task marketplace. You will work with modern stacks, ensure system reliability, and collaborate with product and frontend teams.",
    responsibilities: [
      "Design and develop robust APIs and microservices",
      "Ensure security, performance, and scalability of backend systems",
      "Participate in code reviews and technical planning",
    ],
    requirements: [
      "2+ years of experience in backend development (Node.js, Python, or Go)",
      "Strong understanding of REST APIs, databases (SQL/NoSQL), and cloud services",
      "Experience with version control (Git) and CI/CD",
      "Good communication skills and ability to work in a fast-paced team",
    ],
    applicationProcess: [
      "Send your resume and cover letter to support@firstdoer.com with subject 'Application: Backend Engineer'",
      "Our team will review and shortlist candidates within 5–7 working days",
      "Shortlisted candidates will be invited for a phone/video screening",
      "Technical round (coding/design) with the engineering team",
      "Final discussion with the hiring manager; offer and onboarding details shared thereafter",
    ],
  },
  {
    id: "relationship-manager",
    title: "Relationship Manager",
    department: "Business & Partnerships",
    type: "Full-time",
    location: "India (Remote / Hybrid)",
    postedDate: "2025-02-20",
    deadline: "2025-04-20",
    description:
      "Own and grow relationships with task providers, task performers, campus partners, and key accounts. You will drive adoption, resolve issues, and help shape our go-to-market and partnership strategy.",
    responsibilities: [
      "Build and maintain strong relationships with clients and partners",
      "Identify growth opportunities and drive retention",
      "Coordinate with internal teams to deliver on commitments",
    ],
    requirements: [
      "1+ years of experience in client relationship management, partnerships, or business development",
      "Excellent verbal and written communication",
      "Comfortable with CRM tools and basic data tracking",
      "Self-driven and able to manage multiple stakeholders",
    ],
    applicationProcess: [
      "Email your resume and a short note on why you fit this role to support@firstdoer.com with subject 'Application: Relationship Manager'",
      "We will review applications and respond to shortlisted candidates within 5–7 working days",
      "First round: phone/video call to discuss your experience and the role",
      "Second round: case discussion or scenario-based conversation with the team",
      "Final round with leadership; successful candidates receive offer and onboarding details",
    ],
  },
  {
    id: "flutter-developer",
    title: "Flutter Developer",
    department: "Engineering",
    type: "Full-time",
    location: "India (Remote / Hybrid)",
    postedDate: "2026-03-01",
    deadline: "2026-05-31",
    description:
      "Build and ship polished cross-platform mobile experiences for our task marketplace. You will own features end-to-end on Flutter, collaborate on APIs and app architecture, and help maintain quality through testing and code review.",
    responsibilities: [
      "Develop and maintain Flutter apps for Android and iOS",
      "Integrate REST/GraphQL APIs and handle state management cleanly",
      "Improve performance, accessibility, and reliability of the mobile experience",
    ],
    requirements: [
      "Strong Dart and Flutter experience; at least one app shipped to stores or production",
      "Solid understanding of mobile UI patterns, async programming, and debugging",
      "Familiarity with Git and working in a team environment",
      "Bonus: experience with Firebase, push notifications, or CI for mobile",
    ],
    applicationProcess: [
      "Send your resume, links to apps or GitHub, and a short cover note to support@firstdoer.com with subject 'Application: Flutter Developer'",
      "We review applications and reply to shortlisted candidates within 5–7 working days",
      "Technical conversation on Flutter and past projects",
      "Short take-home or live coding exercise if needed",
      "Final chat with engineering leadership; offer and onboarding for selected candidates",
    ],
  },
  {
    id: "social-media-manager",
    title: "Social Media Manager",
    department: "Marketing & Communications",
    type: "Full-time",
    location: "India (Remote / Hybrid)",
    postedDate: "2026-03-01",
    deadline: "2026-05-31",
    description:
      "Grow our brand and community across social channels. You will plan content, engage audiences, and work with design and product to tell the FirstDoer story clearly and consistently.",
    responsibilities: [
      "Own content calendar and posting across major social platforms",
      "Write captions, brief creatives, and coordinate with designers or creators",
      "Track metrics, run experiments, and report on growth and engagement",
    ],
    requirements: [
      "1+ years managing social media for a brand, startup, or agency",
      "Strong written communication and understanding of platform norms (Reels, Shorts, etc.)",
      "Comfortable with analytics; basic design sense is a plus",
      "Self-starter who can balance brand voice with performance",
    ],
    applicationProcess: [
      "Email your resume and links to accounts or portfolios you have managed to support@firstdoer.com with subject 'Application: Social Media Manager'",
      "We will review and respond to shortlisted candidates within 5–7 working days",
      "Intro call to discuss your approach and our brand",
      "Short content or campaign exercise",
      "Final discussion with leadership; offer details shared with successful applicants",
    ],
  },
  {
    id: "founders-office-intern",
    title: "Founders Office Intern",
    department: "Founders Office",
    type: "Internship",
    location: "India (Remote / Hybrid)",
    postedDate: "2026-03-01",
    deadline: "2026-05-31",
    description:
      "Work directly with founders and core team on strategy, operations, and special projects. Ideal if you want exposure to how an early-stage platform scales across product, partnerships, and community.",
    responsibilities: [
      "Support research, documentation, and follow-ups on founder-led initiatives",
      "Assist with decks, dashboards, and light operational workflows",
      "Coordinate across teams and help execute time-sensitive priorities",
    ],
    requirements: [
      "Currently pursuing or recently completed a degree in business, technology, or related field",
      "Excellent organization, written communication, and discretion",
      "High ownership; comfortable with ambiguity and fast iteration",
      "Availability for a defined internship period (duration discussed during hiring)",
    ],
    applicationProcess: [
      "Send your resume and a short note on what you want to learn to support@firstdoer.com with subject 'Application: Founders Office Intern'",
      "We review applications and reach out to shortlisted candidates within 5–7 working days",
      "Conversation with the founder or core team about fit and goals",
      "Possible short task or scenario discussion",
      "Offer and internship timeline for selected candidates",
    ],
  },
];

const BACKEND_API_BASE = getApiUrl();
const WHY_JOIN = [
  "Meaningful impact on how people work and earn locally",
  "Inclusive, collaborative culture with room to grow",
  "Flexible work—remote and hybrid where possible",
  "Low-commission ethos reflected in how we operate",
];

const formatDate = (isoDate) => {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split("\n").map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeJob = (job) => ({
  ...job,
  responsibilities: normalizeList(job?.responsibilities),
  requirements: normalizeList(job?.requirements),
  applicationProcess: normalizeList(job?.applicationProcess),
});

const JobDetailModal = ({ role, onClose, onApply }) => {
  if (!role) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[var(--color-border)] bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 h-1.5 flex-shrink-0 bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-500 rounded-t-2xl" />
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 sm:p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-2.5 py-1 rounded-lg">
                  {role.department}
                </span>
                <span className="text-xs text-[var(--color-text-subtle)]">{role.type}</span>
                <span className="text-[var(--color-text-subtle)]">·</span>
                <span className="text-xs text-[var(--color-text-subtle)]">{role.location}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-[var(--color-text)] mb-4 pr-10">
                {role.title}
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed mb-6">
                {role.description}
              </p>

              {/* Posted date & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                  <Calendar size={18} className="text-[var(--color-primary)] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-subtle)]">Posted on</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{formatDate(role.postedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                  <Clock size={18} className="text-[var(--color-primary)] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-subtle)]">Application deadline</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{formatDate(role.deadline)}</p>
                  </div>
                </div>
              </div>

              {/* Application process - moved up so it's visible without scrolling */}
              {role.applicationProcess?.length > 0 && (
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-base font-medium text-[var(--color-text)] mb-3">
                    <List size={18} className="text-[var(--color-primary)]" />
                    How to apply – Process
                  </h4>
                  <ol className="space-y-3">
                    {role.applicationProcess.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-[var(--color-text-muted)] text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Requirements */}
              {role.requirements?.length > 0 && (
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-base font-medium text-[var(--color-text)] mb-3">
                    <FileText size={18} className="text-[var(--color-primary)]" />
                    Requirements
                  </h4>
                  <ul className="list-disc list-inside text-[var(--color-text-muted)] text-sm space-y-1.5">
                    {role.requirements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {role.responsibilities?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-base font-medium text-[var(--color-text)] mb-3">Responsibilities</h4>
                  <ul className="list-disc list-inside text-[var(--color-text-muted)] text-sm space-y-1.5">
                    {role.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

          {/* Sticky footer with Apply - always visible */}
          <div className="sticky bottom-0 flex-shrink-0 border-t border-[var(--color-border)] bg-white p-4 sm:p-6 rounded-b-2xl">
            <button
              type="button"
              onClick={() => onApply(role)}
              className="inline-flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition shadow-[var(--shadow-glow)]"
            >
              Apply for this role <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ApplicationFormModal = ({ role, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionNote, setSubmissionNote] = useState("");

  const parseErrorMessage = async (response, fallbackMessage) => {
    try {
      const parsed = await response.json();
      if (parsed?.error) return parsed.error;
      if (parsed?.message) return parsed.message;
    } catch {
      try {
        const text = await response.text();
        if (text?.trim()) return text.slice(0, 240);
      } catch {
        // ignore read errors
      }
    }
    return fallbackMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmissionNote("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!portfolioFile) {
      setError("Please upload your portfolio (PDF, DOC, or image).");
      return;
    }

    // ⭐ Strict file size check to avoid 413 (Request Entity Too Large) errors
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (portfolioFile.size > MAX_FILE_SIZE) {
      setError(`The resume file is too large (${(portfolioFile.size / (1024 * 1024)).toFixed(2)}MB). Please upload a file smaller than 5MB (e.g. a compressed PDF).`);
      return;
    }

    setIsSubmitting(true);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCoverNote = coverNote.trim();
    const normalizedJobId = typeof role.id === "string" ? role.id.trim() : "";
    const normalizedJobTitle = (role.title || "").trim();

    try {
      let finalPortfolioUrl = "";
      let finalPortfolioName = portfolioFile.name;

      // 1. Try to upload resume to S3 via pre-signed URL
      try {
        console.log("[Careers] Requesting pre-signed URL for resume...");
        const fileExtension = portfolioFile.name.split('.').pop().toLowerCase();
        const presignedRes = await fetch(`${BACKEND_API_BASE}/uploads/presigned-url/career-resumes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            extension: fileExtension,
            // Omit empty/unknown types so the backend derives the MIME type from the extension.
            ...(portfolioFile.type ? { contentType: portfolioFile.type } : {})
          })
        });

        if (presignedRes.ok) {
          // Use the EXACT contentType/s3Key the backend signed. The PUT Content-Type must
          // match the signed value or S3 rejects the upload with 403 SignatureDoesNotMatch.
          const { uploadUrl, publicUrl, s3Key, contentType } = await presignedRes.json();
          console.log("[Careers] Uploading file to S3...", { s3Key, contentType });

          const s3Res = await fetch(uploadUrl, {
            method: "PUT",
            body: portfolioFile,
            headers: { "Content-Type": contentType }
          });

          if (s3Res.ok) {
            console.log("[Careers] S3 Upload successful:", publicUrl);
            finalPortfolioUrl = publicUrl;
            if (s3Key) finalPortfolioName = s3Key;
          } else {
            const errBody = await s3Res.text().catch(() => "");
            console.error("[Careers] S3 PUT failed:", s3Res.status, errBody);
          }
        } else {
          const errBody = await presignedRes.text().catch(() => "");
          console.error("[Careers] Pre-signed URL request failed:", presignedRes.status, errBody);
        }
      } catch (uploadError) {
        // Most often this is an S3 bucket CORS rejection or a network error on the direct PUT.
        // The resume will NOT be in S3 if this fires — surface it instead of hiding it.
        console.error("[Careers] Resume upload to S3 failed; application will be saved WITHOUT the resume file.", uploadError);
      }

      // 2. Submit the application to the backend
      const appBody = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        ...(normalizedJobId ? { jobId: normalizedJobId } : {}),
        ...(normalizedJobTitle ? { jobTitle: normalizedJobTitle } : {}),
        coverNote: trimmedCoverNote,
        portfolioFileName: finalPortfolioName,
        portfolioFileUrl: finalPortfolioUrl,
        source: "website-v2"
      };

      console.log("[Careers] Submitting application data...");
      const response = await fetch(`${BACKEND_API_BASE}/careers/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appBody)
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, "Submission failed.");
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      setSubmissionNote(
        finalPortfolioUrl 
          ? "Application and resume successfully saved!" 
          : "Application details saved. Our team will contact you if we need your resume file again."
      );

      await response.json().catch(() => ({}));
    } catch (proxyError) {
      console.error("[Careers] Total submission failure:", proxyError);
      setError(proxyError?.message || "Failed to save application. Please check your network.");
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 2000);
  };

  if (!role) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-[var(--color-border)] bg-white shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6 sm:p-8">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-medium text-[var(--color-text)] mb-1 pr-10">
              Apply for {role.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Share your details and portfolio. We'll get in touch with shortlisted candidates.
            </p>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] mb-4">
                  <CheckCircle size={28} />
                </div>
                <p className="font-semibold text-[var(--color-text)]">Application submitted</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Your application and resume were saved successfully. We will review and contact shortlisted candidates.
                </p>
                {submissionNote && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                    {submissionNote}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Cover note <span className="text-[var(--color-text-subtle)]">(optional)</span>
                  </label>
                  <textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Why do you want to join us? Any relevant experience?"
                    rows={3}
                    className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Portfolio / Resume <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="portfolio-upload"
                    />
                    <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 cursor-pointer hover:border-[var(--color-primary)]/50 transition">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)]">
                        <Upload size={20} className="text-[var(--color-primary)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {portfolioFile ? portfolioFile.name : "Click to upload portfolio or resume"}
                        </p>
                        <p className="text-xs text-[var(--color-text-subtle)]">
                          PDF, DOC, DOCX, PNG, JPG (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl border-2 border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] transition disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white hover:bg-[var(--color-primary-hover)] transition shadow-[var(--shadow-glow)] disabled:opacity-70"
                  >
                    {isSubmitting ? "Saving…" : "Submit application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Careers = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicationRole, setApplicationRole] = useState(null);
  const [openPositions, setOpenPositions] = useState(FALLBACK_POSITIONS);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        // Correct path: remove /api since the NestJS backend doesn't use it
        const response = await fetch(`${BACKEND_API_BASE}/careers`);
        if (!response.ok) throw new Error("Job fetch failed");
        const data = await response.json();
        setOpenPositions(
          Array.isArray(data)
            ? data.map(normalizeJob)
            : data.data?.map(normalizeJob) || FALLBACK_POSITIONS
        );
      } catch (err) {
        console.error('Error fetching careers:', err);
        // Fallback to static data is already set in initial state
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const roleTitles = openPositions.map((role) => role.title).filter(Boolean);
  const dynamicRoleText = roleTitles.length > 0 ? roleTitles.join(", ") : "product, engineering, operations, and growth";

  return (

    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      <SEO
        title="Careers | FirstDoer"
        description={`Join FirstDoer and explore open roles in ${dynamicRoleText}. Build your career with a hyperlocal task and opportunity platform.`}
        keywords={`firstdoer, FirstDoer careers, jobs, hiring, ${dynamicRoleText}, work at FirstDoer, task platform jobs India`}
        canonical="https://www.firstdoer.com/careers"
      />

      {/* Soft gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 w-[100%] max-w-[700px] h-[50vh] -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--color-primary)]/10 via-[var(--color-primary)]/3 to-transparent blur-3xl" />
        <div className="absolute top-[30%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[var(--color-primary)]/6 blur-3xl" />
        <div className="absolute top-[40%] left-[-10%] w-[300px] h-[300px] rounded-full bg-teal-400/8 blur-3xl" />
      </div>

      {/* Extra space below fixed chrome (global pt-28 / md:pt-32) without stacking huge pt-* like before */}
      <section className="relative z-10 pt-5 sm:pt-6 md:pt-7 pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Hero header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center pb-10 sm:pb-12 md:pb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-medium leading-[1.1] tracking-tight text-[var(--color-text)]">
              Careers at{" "}
              <span className="text-[var(--color-text)]">On</span>
              <span className="text-[var(--color-primary)]">IT</span> INDIA
            </h1>
            <p className="mx-auto mt-3 sm:mt-4 md:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed px-2">
              We are building a hyperlocal task and opportunity platform that connects people who need help with those ready to help—instantly, locally, and with low commission.
            </p>
            {/* Currently hiring strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 sm:mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)]/80 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-text)]"
            >
              <Briefcase size={18} className="text-[var(--color-primary)] flex-shrink-0" />
              {loading ? (
                <span className="text-[var(--color-primary)] opacity-70">Loading open roles...</span>
              ) : openPositions.length === 0 ? (
                <span className="text-[var(--color-text-subtle)]">No positions currently open. Check back later!</span>
              ) : openPositions.length === 2 ? (
                <>
                  <span className="font-medium text-[var(--color-primary)]">{openPositions[0].title}</span>
                  <span className="text-[var(--color-text-subtle)]"> and </span>
                  <span className="font-medium text-[var(--color-primary)]">{openPositions[1].title}</span>
                </>
              ) : (
                openPositions.map((role, i) => (
                  <React.Fragment key={role.id || i}>
                    {i > 0 &&
                      (i === openPositions.length - 1 ? (
                        <span className="text-[var(--color-text-subtle)]">, and </span>
                      ) : (
                        <span className="text-[var(--color-text-subtle)]">, </span>
                      ))}
                    <span className="font-medium text-[var(--color-primary)]">{role.title}</span>
                  </React.Fragment>
                ))
              )}
            </motion.div>
          </motion.header>

          {/* Open positions */}
          <section className="mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-xl sm:text-2xl font-heading font-medium text-[var(--color-text)] mb-6 sm:mb-8">
              Open positions
            </h2>
            {loading ? (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent flex-shrink-0 rounded-full" />
              </div>
            ) : openPositions.length === 0 ? (
              <div className="text-center p-8 sm:p-12 bg-white rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <Briefcase size={40} className="mx-auto text-[var(--color-text-subtle)] mb-4" />
                <h3 className="text-lg font-heading font-medium text-[var(--color-text)] mb-2">No open positions</h3>
                <p className="text-[var(--color-text-muted)] text-sm sm:text-base">We are not currently actively hiring for any roles, but we're always looking for great talent. Feel free to reach out to support@firstdoer.com.</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {openPositions.map((role, index) => (
                  <motion.article
                    key={role.id || index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] ring-2 ring-transparent ring-offset-2 ring-offset-[var(--color-surface)] transition-all duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1),0_0_60px_-16px_rgba(5,150,105,0.08)] hover:ring-[var(--color-primary)]/20"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-500" />
                    <div className="p-4 sm:p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-2.5 py-1 rounded-lg">
                          {role.department}
                        </span>
                        <span className="text-xs text-[var(--color-text-subtle)]">{role.type}</span>
                        <span className="text-[var(--color-text-subtle)]">·</span>
                        <span className="text-xs text-[var(--color-text-subtle)]">{role.location}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-heading font-medium text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed mb-2">
                        {role.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-subtle)] mb-4">
                        <span>Posted: {formatDate(role.postedDate)}</span>
                        <span>Deadline: {formatDate(role.deadline)}</span>
                      </div>
                      {role.responsibilities?.length > 0 && (
                        <ul className="list-disc list-inside text-[var(--color-text-muted)] text-sm space-y-1 mb-6">
                          {role.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm hover:gap-3 transition-all min-h-[44px]"
                      >
                        View details & apply <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}          </section>

          {/* Why join us */}
          <section className="mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-xl sm:text-2xl font-heading font-medium text-[var(--color-text)] mb-6 sm:mb-8">
              Why join us
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {WHY_JOIN.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="flex gap-3 p-4 sm:p-5 rounded-xl border border-[var(--color-border-subtle)] bg-white/80 shadow-[var(--shadow-sm)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-sm font-bold text-[var(--color-primary)]">
                    {i + 1}
                  </span>
                  <span className="text-[var(--color-text)] text-sm sm:text-base leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* How to apply */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-md)]"
          >
            <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-emerald-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-muted)]">
                  <CheckCircle size={20} className="text-[var(--color-primary)]" />
                </div>
                <h2 className="text-lg sm:text-xl font-medium text-[var(--color-text)]">
                  How to apply
                </h2>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed mb-2">
                Open any role, tap Apply for this role, and submit the form with your resume directly on this page.
              </p>
              <p className="text-[var(--color-text-subtle)] text-sm">
                Your submission is saved instantly, and our team will review shortlisted profiles.
              </p>
            </div>
          </motion.section>

          <p className="mt-12 text-center text-sm text-[var(--color-text-subtle)]">
            FirstDoer
          </p>
        </div>
      </section>

      <AnimatePresence>
        {selectedRole && (
          <JobDetailModal
            key="job-detail-modal"
            role={selectedRole}
            onClose={() => setSelectedRole(null)}
            onApply={(role) => setApplicationRole(role)}
          />
        )}
        {applicationRole && (
          <ApplicationFormModal
            key="application-form-modal"
            role={applicationRole}
            onClose={() => setApplicationRole(null)}
            onSubmit={() => {
              setApplicationRole(null);
              setSelectedRole(null);
              navigate("/careers/thank-you");
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Careers;
