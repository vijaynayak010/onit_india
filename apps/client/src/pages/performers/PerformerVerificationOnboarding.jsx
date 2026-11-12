import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import {
  CheckCircle,
  FileText,
  Award,
  Shield,
  UserCheck,
  Briefcase,
  ArrowRight,
} from "react-feather";

const PerformerVerificationOnboarding = () => {
  const steps = [
    { num: 1, title: "Sign up & profile", desc: "Create your performer account and complete your profile." },
    { num: 2, title: "KYC verification", desc: "Submit identity documents for verification." },
    { num: 3, title: "Skills & background", desc: "Add skills and complete background checks." },
    { num: 4, title: "Badge & go live", desc: "Earn badges and start accepting tasks." },
  ];

  const kycItems = [
    "Government-issued ID (Aadhaar, PAN, or Passport)",
    "Recent photograph matching ID",
    "Address proof if required",
    "Phone and email verification",
  ];

  const skillAreas = [
    "Domain expertise (e.g. content, design, research, tech)",
    "Self-declared skills with optional proof (portfolio, certificates)",
    "Platform skill tags aligned to task categories",
    "Ongoing skill updates as you complete tasks",
  ];

  const bgCheckItems = [
    "Identity cross-check with KYC documents",
    "No serious criminal or fraud flags in our checks",
    "Consent-based; we do not run checks without your permission",
  ];

  const badgeTypes = [
    { name: "Verified Identity", desc: "Awarded after successful KYC.", icon: UserCheck },
    { name: "Skill Verified", desc: "Skills validated for specific domains.", icon: Briefcase },
    { name: "Background Cleared", desc: "Background verification completed.", icon: Shield },
    { name: "Top Performer", desc: "Earned from high ratings and completed tasks.", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Performer Verification & Onboarding | FirstDoer"
        description="FirstDoer performer onboarding: KYC, skills verification, background checks, and badges. Become a verified task performer and start earning."
        keywords="FirstDoer performer verification, task performer onboarding, KYC for performers, skill verification, background check, performer badges, join as performer"
        canonical="https://www.firstdoer.com/performer-verification-onboarding"
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          {/* Header */}
          <header className="border-b border-gray-200 pb-8 mb-12">
            <h1 className="text-3xl md:text-4xl font-medium text-[var(--color-primary)] mb-4">
              Performer Verification & Onboarding
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl">
              To maintain trust and quality on the platform, every task performer goes through a structured verification and onboarding process. This includes KYC, skills assessment, background verification, and badges based on your profile and work.
            </p>
          </header>

          {/* Process overview */}
          <section className="mb-14">
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-6 flex items-center gap-2">
              <CheckCircle size={22} className="text-[var(--color-primary)]" />
              Onboarding journey
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 flex flex-col"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold mb-3">
                    {s.num}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-xs leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* KYC */}
          <section className="mb-14">
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <FileText size={22} className="text-[var(--color-primary)]" />
              1. KYC (Know Your Customer)
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
              Identity verification ensures that performers on the platform are who they claim to be. This protects task providers and keeps the marketplace safe.
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">
                What we need
              </h3>
              <ul className="space-y-2">
                {kycItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-gray-500 text-xs">
                Documents are processed securely and in line with our Privacy Policy. Verification usually completes within 1–3 business days.
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-14">
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <Briefcase size={22} className="text-[var(--color-primary)]" />
              2. Skills verification
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
              Your skills help match you with the right tasks and help providers choose performers with the right expertise.
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">
                How skills work
              </h3>
              <ul className="space-y-2">
                {skillAreas.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Background verification */}
          <section className="mb-14">
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <Shield size={22} className="text-[var(--color-primary)]" />
              3. Background verification
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
              We run consent-based background checks to ensure platform safety. This step is required to become a verified performer.
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">
                What we check
              </h3>
              <ul className="space-y-2">
                {bgCheckItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-gray-500 text-xs">
                We do not share detailed background reports with third parties. See our Privacy Policy for how we use and protect your data.
              </p>
            </div>
          </section>

          {/* Badges */}
          <section className="mb-14">
            <h2 className="text-xl font-medium text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <Award size={22} className="text-[var(--color-primary)]" />
              4. Badges (skills & work done)
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
              Badges are earned through verification and performance. They appear on your profile and help providers trust and choose you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgeTypes.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.name}
                    className="rounded-xl border border-gray-200 bg-white p-5 flex gap-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{b.name}</h3>
                      <p className="text-gray-600 text-xs leading-snug">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-gray-500 text-xs">
              Top Performer and other performance-based badges are updated as you complete tasks and receive positive ratings.
            </p>
          </section>

          {/* Summary & CTA */}
          <section className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6 md:p-8">
            <h2 className="text-lg font-medium text-[var(--color-primary)] mb-3">Ready to become a performer?</h2>
            <p className="text-gray-700 text-sm mb-6 max-w-2xl">
              Complete sign-up, KYC, skills, and background verification to get verified and earn badges. Once onboarded, you can browse and accept tasks that match your skills.
            </p>
            <Link
              to="/task-performers"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#003d36] transition-colors"
            >
              Join as a Task Performer
              <ArrowRight size={16} />
            </Link>
          </section>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            Last updated: March 2026 · FirstDoer
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PerformerVerificationOnboarding;
