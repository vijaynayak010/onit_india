import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ChevronLeft,
  Settings,
  X,
  Sparkles,
  Plus,
  Link2,
  Award,
  Trash2,
  Check,
  CheckCircle2,
  Loader2,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Globe2,
  AlertCircle,
  ExternalLink,
  Save,
  Clock,
  CheckSquare,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import {
  getMyTaskerProfile,
  updateTaskerProfile,
  toggleTaskerAvailability,
  updateMe,
  uploadProfilePicture,
  startProfileEmailVerification,
  verifyProfileEmail,
} from "../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { isTestModeEnabled } from "../../../test-mode/testModeConfig";
import { mockDb } from "../../../test-mode/mockDatabase";

const SKILL_OPTIONS = [
  "UI/UX Design",
  "Graphic Design",
  "Web Development",
  "Mobile Development",
  "Content Writing",
  "Video Editing",
  "SEO",
  "Social Media Marketing",
  "Data Entry",
  "Research & Analysis",
  "Presentation Design",
  "Digital Marketing",
  "Copywriting",
  "Product Photography",
  "Customer Support",
];

const EXPERIENCE_OPTIONS = ["Beginner", "0-1 year", "1-2 years", "2-5 years", "5+ years"];

const EXPERIENCE_API_VALUES = {
  Beginner: "beginner",
  "0-1 year": "beginner",
  "1-2 years": "intermediate",
  "2-5 years": "intermediate",
  "5+ years": "expert",
  beginner: "beginner",
  intermediate: "intermediate",
  expert: "expert",
};

const EMPTY_PROFILE = {
  fullName: "",
  role: "Professional Performer",
  aboutMe: "",
  phone: "",
  email: "",
  location: "",
  languages: [],
  avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  skills: [],
  experienceLevel: "1-2 years",
  availability: "Available for tasks",
  isAvailable: true,
  portfolio: [],
  certifications: [],
  phoneVerified: false,
  emailVerified: false,
};

const firstText = (...values) =>
  values.find((v) => typeof v === "string" && v.trim()) || "";

// ─── Section Card Wrapper ──────────────────────────────────────────────────
function SectionCard({ title, subtitle, icon: Icon, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300/80 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFB] text-[#10605F]">
              <Icon size={16} strokeWidth={2.2} />
            </div>
          )}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-[12px] font-medium text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Modal Shell ───────────────────────────────────────────────────────────
const ModalShell = ({ title, subtitle, children, onClose, onSave, saveLabel = "Save" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-4 sm:items-center backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto px-6 py-4.5 [scrollbar-width:thin]">{children}</div>
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-3.5 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-[#10605F] px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#083B3A] active:scale-95"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Project Card ──────────────────────────────────────────────────────────
const ProjectCard = ({ project, onRemove }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:bg-white hover:border-slate-300">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      <Link2 size={16} strokeWidth={2.2} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13.5px] font-bold text-slate-900 leading-tight">{project.title}</p>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 truncate text-[11.5px] font-medium text-blue-600 hover:underline"
        >
          <span className="truncate">{project.url}</span>
          <ExternalLink size={10} className="shrink-0" />
        </a>
      )}
    </div>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${project.title}`}
      className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
    >
      <Trash2 size={14} strokeWidth={2.2} />
    </button>
  </div>
);

// ─── Certification Card ────────────────────────────────────────────────────
const CertCard = ({ cert, onRemove }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:bg-white hover:border-slate-300">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
      <Award size={16} strokeWidth={2.2} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13.5px] font-bold text-slate-900 leading-tight">{cert.title}</p>
      {cert.issuer && (
        <p className="mt-1 text-[11.5px] font-medium text-slate-500">{cert.issuer}</p>
      )}
    </div>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${cert.title}`}
      className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
    >
      <Trash2 size={14} strokeWidth={2.2} />
    </button>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
const PerformerProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const initialProfileRef = useRef(null);

  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "work"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [languageInput, setLanguageInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  // Modals
  const [activeModal, setActiveModal] = useState(null); // "skills" | "project" | "certification"
  const [draftSkills, setDraftSkills] = useState([]);
  const [draftProject, setDraftProject] = useState({ title: "", url: "" });
  const [draftCertification, setDraftCertification] = useState({ title: "", issuer: "" });

  // Email OTP state
  const [emailInput, setEmailInput] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState("input"); // "input" | "otp" | "verified"
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const fileInputRef = useRef(null);

  // ─── Fetch Profile ─────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyTaskerProfile();
      if (res) {
        const d = res.data || res;
        const initialData = {
          fullName: d.displayName || user?.displayName || user?.name || "Rahul Sharma",
          role: d.profession || "Professional Performer",
          aboutMe: d.bio || "",
          phone: firstText(
            d.phoneNumber, d.phone, d.mobileNumber, d.contactNumber,
            d.user?.phoneNumber, d.user?.phone, d.user?.mobileNumber,
            user?.phoneNumber, user?.phone, user?.mobileNumber,
            "+91 98765 43210"
          ),
          email: firstText(d.user?.email, user?.email, "performer@onitindia.com"),
          location: d.locationCity || "India",
          languages: Array.isArray(d.languages) && d.languages.length ? d.languages : ["English", "Hindi"],
          avatarUrl: d.user?.profilePicUrl || d.user?.avatar || user?.avatar || EMPTY_PROFILE.avatarUrl,
          skills: Array.isArray(d.skills) && d.skills.length ? d.skills : ["UI/UX Design", "Content Writing"],
          experienceLevel: d.experienceLevel || "1-2 years",
          isAvailable: d.isAvailable !== undefined ? Boolean(d.isAvailable) : true,
          availability: d.isAvailable ? "Available for tasks" : "Currently unavailable",
          portfolio: Array.isArray(d.portfolio) ? d.portfolio : [],
          certifications: Array.isArray(d.certifications) ? d.certifications : [],
          phoneVerified: Boolean(
            d.phoneVerified || d.isPhoneVerified || d.phoneNumberVerifiedAt ||
            d.user?.phoneVerified || d.user?.isPhoneVerified ||
            user?.phoneVerified || user?.isPhoneVerified
          ),
          emailVerified: Boolean(d.user?.email || user?.email),
        };
        setProfile(initialData);
        initialProfileRef.current = JSON.stringify(initialData);
      }
    } catch (err) {
      console.error("Failed to load performer profile", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─── Dirty Check ───────────────────────────────────────────────────────────
  const isDirty = useMemo(() => {
    if (!initialProfileRef.current) return false;
    return JSON.stringify(profile) !== initialProfileRef.current;
  }, [profile]);

  // Warn on navigation if dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ─── Profile Completion Calculation ───────────────────────────────────────
  const workSectionsFilled = useMemo(() => {
    let count = 0;
    if (profile.skills.length > 0) count += 1;
    if (profile.experienceLevel) count += 1;
    if (profile.isAvailable) count += 1;
    if (profile.portfolio.length > 0) count += 1;
    if (profile.certifications.length > 0) count += 1;
    return count;
  }, [profile]);
  const completionPct = Math.round((workSectionsFilled / 5) * 100);

  // ─── Avatar Upload Handler ────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size must be less than 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      const previewUrl = URL.createObjectURL(file);

      if (isTestModeEnabled()) {
        // Safe mock handling: local preview without hitting production uploads
        setProfile((prev) => ({ ...prev, avatarUrl: previewUrl }));
        updateUser({ ...user, avatar: previewUrl });
        mockDb.updateCurrentUser({ profilePicUrl: previewUrl });
        return;
      }

      const uploaded = await uploadProfilePicture(file);
      const url = uploaded.publicUrl || uploaded.url;
      if (!url) throw new Error("Upload failed");
      await updateMe({ profilePicUrl: url });
      setProfile((prev) => ({ ...prev, avatarUrl: url }));
      updateUser({ ...user, avatar: url });
    } catch (err) {
      alert("Avatar upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ─── Save Profile ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setValidationError("");
    if (!profile.fullName.trim()) {
      setValidationError("Full Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        displayName: profile.fullName.trim(),
        profession: profile.role.trim(),
        bio: profile.aboutMe.trim(),
        locationCity: profile.location.trim(),
        skills: profile.skills,
        experienceLevel: EXPERIENCE_API_VALUES[profile.experienceLevel] || profile.experienceLevel,
        languages: profile.languages,
        portfolio: profile.portfolio,
        certifications: profile.certifications,
        isAvailable: profile.isAvailable,
      };

      if (isTestModeEnabled()) {
        // Test mode save: persist in mockDb and updateUser
        mockDb.updateCurrentUser({
          displayName: profile.fullName.trim(),
          name: profile.fullName.trim(),
          location: profile.location.trim(),
          headline: profile.aboutMe.trim(),
          taskers: payload,
        });
        updateUser({
          ...user,
          name: profile.fullName.trim(),
          displayName: profile.fullName.trim(),
          location: profile.location.trim(),
          headline: profile.aboutMe.trim(),
        });
      } else {
        await updateTaskerProfile(payload);
        updateUser({
          ...user,
          name: profile.fullName.trim(),
          location: profile.location.trim(),
          headline: profile.aboutMe.trim(),
        });
      }

      initialProfileRef.current = JSON.stringify(profile);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2500);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Save failed: " + (err.message || "Please check your network and try again."));
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle Availability ──────────────────────────────────────────────────
  const handleToggleAvailability = async () => {
    try {
      const next = !profile.isAvailable;
      setProfile((prev) => ({
        ...prev,
        isAvailable: next,
        availability: next ? "Available for tasks" : "Currently unavailable",
      }));
      await toggleTaskerAvailability();
    } catch (err) {
      console.warn("Could not sync availability toggle to server", err);
    }
  };

  // ─── Language Helpers ─────────────────────────────────────────────────────
  const addLanguage = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = languageInput.trim();
    if (!val || profile.languages.includes(val)) return;
    setProfile((prev) => ({ ...prev, languages: [...prev.languages, val] }));
    setLanguageInput("");
  };

  const removeLanguage = (lang) => {
    setProfile((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  };

  // ─── Skill Helpers ────────────────────────────────────────────────────────
  const addInlineSkill = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = skillInput.trim();
    if (!val || profile.skills.includes(val)) return;
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, val] }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // ─── Modals Logic ─────────────────────────────────────────────────────────
  const openModal = (type) => {
    setActiveModal(type);
    if (type === "skills") setDraftSkills([...profile.skills]);
    if (type === "project") setDraftProject({ title: "", url: "" });
    if (type === "certification") setDraftCertification({ title: "", issuer: "" });
  };
  const closeModal = () => setActiveModal(null);

  const saveModal = () => {
    if (activeModal === "skills") {
      setProfile((prev) => ({ ...prev, skills: draftSkills }));
    }
    if (activeModal === "project" && draftProject.title.trim()) {
      setProfile((prev) => ({ ...prev, portfolio: [...prev.portfolio, { ...draftProject }] }));
    }
    if (activeModal === "certification" && draftCertification.title.trim()) {
      setProfile((prev) => ({ ...prev, certifications: [...prev.certifications, { ...draftCertification }] }));
    }
    closeModal();
  };

  const toggleDraftSkill = (skill) => {
    setDraftSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const removeProject = (index) => {
    setProfile((prev) => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== index) }));
  };

  const removeCertification = (index) => {
    setProfile((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  // ─── Mock Test Phone Verification ─────────────────────────────────────────
  const handleTestVerifyPhone = () => {
    setProfile((prev) => ({ ...prev, phoneVerified: true }));
    if (isTestModeEnabled()) {
      mockDb.updateCurrentUser({ phoneVerified: true });
    }
  };

  // ─── Email Verification Handlers ──────────────────────────────────────────
  const handleSendEmailOtp = async () => {
    if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput)) return;
    setEmailLoading(true);
    setEmailError(null);
    try {
      if (isTestModeEnabled()) {
        setEmailStep("otp");
        return;
      }
      await startProfileEmailVerification(emailInput.trim());
      setEmailStep("otp");
    } catch (err) {
      setEmailError(err?.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim()) return;
    setEmailLoading(true);
    setEmailError(null);
    try {
      if (isTestModeEnabled()) {
        setEmailStep("verified");
        setProfile((prev) => ({ ...prev, email: emailInput.trim(), emailVerified: true }));
        return;
      }
      await verifyProfileEmail(emailInput.trim(), emailOtp.trim());
      setEmailStep("verified");
      setProfile((prev) => ({ ...prev, email: emailInput.trim(), emailVerified: true }));
    } catch (err) {
      setEmailError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const initials = (profile.fullName || "P").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-10 lg:py-8">
        <div className="mx-auto w-full max-w-4xl space-y-6">

          {/* ── Page Header / Sticky Navigation Bar ── */}
          <PerformerPageHeader
            title="Performer Profile"
            subtitle="Update public presence, skills, and portfolio"
            backTo="/performer/account"
            backLabel="Back to Account Hub"
            actions={
              <>
                {isDirty && (
                  <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600 sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved changes
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/performer/settings", { state: { from: "/performer/profile", fromLabel: "Back to Profile" } })}
                  aria-label="Account Settings"
                  title="Account Settings"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <Settings size={17} strokeWidth={2} />
                </button>

                <button
                  type="button"
                  disabled={saving || loading}
                  onClick={handleSave}
                  className={`flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold transition shadow-xs disabled:opacity-50 active:scale-95 ${
                    savedOk
                      ? "bg-[#EFFBFB] text-[#10605F] border border-[#29ADAC]/30"
                      : isDirty
                      ? "bg-[#10605F] text-white hover:bg-[#083B3A]"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : savedOk ? (
                    <>
                      <Check size={14} strokeWidth={2.5} className="text-[#10605F]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} strokeWidth={2} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            }
          />

          {validationError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
              <AlertCircle size={15} />
              <span>{validationError}</span>
            </div>
          )}

          {/* ── Profile Summary Hero Card ── */}
          <div className="relative overflow-hidden rounded-3xl border border-[#29ADAC]/20/80 bg-gradient-to-r from-[#EFFBFB]/60 via-white to-[#EFFBFB]/40 p-5 shadow-xs sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Avatar & Identity */}
              <div className="flex items-center gap-4.5">
                <div className="relative shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#10605F] text-2xl font-black text-white shadow-md ring-4 ring-white">
                    {uploadingAvatar ? (
                      <Loader2 size={24} className="animate-spin text-white" />
                    ) : profile.avatarUrl && !profile.avatarUrl.includes("gravatar.com/avatar/000") ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    aria-label="Upload profile picture"
                    title="Change profile picture"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white bg-slate-900 text-white shadow-sm transition hover:bg-[#10605F] hover:scale-105 active:scale-95"
                  >
                    <Camera size={13} strokeWidth={2.2} />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                      {profile.fullName || "Performer"}
                    </h2>
                    {profile.phoneVerified && (
                      <span className="flex items-center gap-0.5 rounded-full bg-[#DFF7F6] px-2 py-0.5 text-[10px] font-bold text-[#083B3A]">
                        <ShieldCheck size={11} className="text-[#10605F]" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-[#10605F]">
                    {profile.role || "Professional Performer"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <MapPin size={11} className="text-slate-400" />
                    {profile.location || "India"}
                    <span className="mx-1">·</span>
                    <Clock size={11} className="text-slate-400" />
                    {profile.isAvailable ? "Open for Tasks" : "Unavailable"}
                  </p>
                </div>
              </div>

              {/* Profile Completion Indicator */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#29ADAC]/20 bg-white/80 p-3.5 shadow-xs sm:w-64 sm:flex-col sm:items-stretch">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#10605F]" />
                    <span className="text-xs font-bold text-slate-800">Profile Readiness</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#10605F]">{completionPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#10605F] transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-slate-400 hidden sm:block">
                  {workSectionsFilled} of 5 sections complete
                </p>
              </div>

            </div>
          </div>

          {/* ── Tab Switcher ── */}
          <div className="flex rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xs">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition duration-150 ${
                activeTab === "personal"
                  ? "bg-[#10605F] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User size={15} strokeWidth={2.2} />
              <span>Personal Details</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "work"}
              onClick={() => setActiveTab("work")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition duration-150 ${
                activeTab === "work"
                  ? "bg-[#10605F] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Briefcase size={15} strokeWidth={2.2} />
              <span>Work & Portfolio</span>
              {profile.portfolio.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {profile.portfolio.length}
                </span>
              )}
            </button>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── TAB 1: Personal Details ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "personal" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Card 1: Basic Information */}
              <SectionCard
                title="Basic Information"
                subtitle="Your public identity displayed to clients"
                icon={User}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Full Stack Developer, Market Auditor"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      Location / City
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                        placeholder="e.g. Bengaluru, Karnataka, India"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Card 2: Contact & Verification */}
              <SectionCard
                title="Contact & Verification"
                subtitle="Manage verified email and phone number"
                icon={Phone}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Phone Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      {profile.phoneVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DFF7F6] px-2 py-0.5 text-[10px] font-bold text-[#083B3A]">
                          <Check size={10} strokeWidth={3} /> Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleTestVerifyPhone}
                          className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 hover:bg-amber-100 transition"
                        >
                          Verify Phone
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profile.phone}
                        disabled
                        className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 pl-10 pr-3.5 text-sm font-semibold text-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      {profile.emailVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DFF7F6] px-2 py-0.5 text-[10px] font-bold text-[#083B3A]">
                          <Check size={10} strokeWidth={3} /> Verified
                        </span>
                      )}
                    </div>
                    {profile.email ? (
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 pl-10 pr-3.5 text-sm font-semibold text-slate-500 outline-none"
                        />
                      </div>
                    ) : emailStep === "otp" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="h-11 flex-1 rounded-xl border border-slate-200 px-3.5 text-sm font-mono tracking-widest outline-none focus:border-[#10605F]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            disabled={emailLoading || !emailOtp.trim()}
                            className="h-11 rounded-xl bg-[#10605F] px-4 text-xs font-bold text-white transition hover:bg-[#083B3A] disabled:opacity-50"
                          >
                            {emailLoading ? "..." : "Verify"}
                          </button>
                        </div>
                        {emailError && <p className="text-[11px] font-semibold text-red-500">{emailError}</p>}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="name@example.com"
                            className="h-11 flex-1 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold outline-none focus:border-[#10605F]"
                          />
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={emailLoading || !/\S+@\S+\.\S+/.test(emailInput)}
                            className="h-11 rounded-xl bg-[#10605F] px-3.5 text-xs font-bold text-white transition hover:bg-[#083B3A] disabled:opacity-50"
                          >
                            {emailLoading ? "..." : "Send OTP"}
                          </button>
                        </div>
                        {emailError && <p className="text-[11px] font-semibold text-red-500">{emailError}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Card 3: About Me & Languages */}
              <SectionCard
                title="About Me & Languages"
                subtitle="Provide details on your experience and communication preferences"
                icon={Globe2}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Biography / Overview</label>
                      <span className="text-[11px] font-medium text-slate-400">
                        {profile.aboutMe.length} / 500 characters
                      </span>
                    </div>
                    <textarea
                      value={profile.aboutMe}
                      onChange={(e) => setProfile((p) => ({ ...p, aboutMe: e.target.value.slice(0, 500) }))}
                      rows={4}
                      placeholder="Highlight your domain strengths, past work execution, and why clients should select you for micro-tasks..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Languages Known</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-xs font-bold text-slate-700"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            aria-label={`Remove language ${lang}`}
                            className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-500"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onKeyDown={addLanguage}
                        placeholder="Type a language and press Enter (e.g. Hindi, English, Tamil)"
                        className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = languageInput.trim();
                          if (val && !profile.languages.includes(val)) {
                            setProfile((prev) => ({ ...prev, languages: [...prev.languages, val] }));
                            setLanguageInput("");
                          }
                        }}
                        className="h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── TAB 2: Work & Portfolio ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "work" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Card 1: Skills */}
              <SectionCard
                title="Skills & Expertise"
                subtitle="Select tags that match your capabilities"
                icon={CheckSquare}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("skills")}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#29ADAC]/30 bg-[#EFFBFB]/80 px-3 py-1.5 text-xs font-bold text-[#10605F] hover:bg-[#DFF7F6] transition active:scale-95"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Browse Skills
                  </button>
                }
              >
                <div className="space-y-3">
                  {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#29ADAC]/30/80 bg-[#EFFBFB]/60 px-3 py-1 text-xs font-bold text-[#10605F]"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove skill ${skill}`}
                            className="rounded-full p-0.5 text-[#10605F] hover:bg-emerald-200 hover:text-emerald-900"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-400">No skills added yet.</p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addInlineSkill}
                      placeholder="Add a custom skill and press Enter"
                      className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-[#10605F] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = skillInput.trim();
                        if (val && !profile.skills.includes(val)) {
                          setProfile((prev) => ({ ...prev, skills: [...prev.skills, val] }));
                          setSkillInput("");
                        }
                      }}
                      className="h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </SectionCard>

              {/* Card 2: Experience Level */}
              <SectionCard
                title="Experience Level"
                subtitle="Select your current background tier"
                icon={Award}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {EXPERIENCE_OPTIONS.map((lvl) => {
                    const isSelected = profile.experienceLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setProfile((p) => ({ ...p, experienceLevel: lvl }))}
                        className={`rounded-xl border p-3 text-center transition ${
                          isSelected
                            ? "border-[#10605F] bg-[#EFFBFB]/80 font-bold text-[#10605F] shadow-xs"
                            : "border-slate-200 bg-slate-50/50 font-semibold text-slate-600 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <p className="text-xs">{lvl}</p>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Card 3: Availability */}
              <SectionCard
                title="Task Availability"
                subtitle="Show whether you are currently ready to receive task invitations"
                icon={Clock}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {profile.isAvailable ? "Available for Tasks" : "Currently Unavailable"}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {profile.isAvailable
                        ? "Providers can discover your profile and invite you to tasks."
                        : "You will not appear in performer discovery searches."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAvailability}
                    aria-label="Toggle availability"
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      profile.isAvailable ? "bg-[#10605F]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        profile.isAvailable ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </SectionCard>

              {/* Card 4: Projects */}
              <SectionCard
                title="Portfolio Projects"
                subtitle="Showcase verified project examples and links to build credibility"
                icon={Link2}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("project")}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#10605F] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#083B3A] transition active:scale-95 shadow-xs"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Add Project
                  </button>
                }
              >
                {profile.portfolio.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.portfolio.map((proj, i) => (
                      <ProjectCard key={i} project={proj} onRemove={() => removeProject(i)} />
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openModal("project")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-6 text-xs font-bold text-slate-400 transition hover:border-[#10605F] hover:text-[#10605F] hover:bg-[#EFFBFB]/20"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add your first project link
                  </button>
                )}
              </SectionCard>

              {/* Card 5: Certifications */}
              <SectionCard
                title="Certifications & Badges"
                subtitle="Highlight accredited coursework and industry credentials"
                icon={Award}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("certification")}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#10605F] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#083B3A] transition active:scale-95 shadow-xs"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Add Certification
                  </button>
                }
              >
                {profile.certifications.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.certifications.map((cert, i) => (
                      <CertCard key={i} cert={cert} onRemove={() => removeCertification(i)} />
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openModal("certification")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-6 text-xs font-bold text-slate-400 transition hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/20"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add a professional certification
                  </button>
                )}
              </SectionCard>
            </div>
          )}

        </div>
      </main>

      {/* ── Modals ── */}
      {activeModal === "skills" && (
        <ModalShell
          title="Browse & Select Skills"
          subtitle="Choose relevant domain capabilities"
          onClose={closeModal}
          onSave={saveModal}
          saveLabel="Apply Skills"
        >
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {SKILL_OPTIONS.map((skill) => {
              const selected = draftSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleDraftSkill(skill)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition ${
                    selected
                      ? "bg-[#EFFBFB] text-[#10605F] border border-[#29ADAC]/30"
                      : "text-slate-700 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <span>{skill}</span>
                  {selected && <Check size={14} strokeWidth={3} className="text-[#10605F]" />}
                </button>
              );
            })}
          </div>
        </ModalShell>
      )}

      {activeModal === "project" && (
        <ModalShell
          title="Add Portfolio Project"
          subtitle="Include project title and public reference URL"
          onClose={closeModal}
          onSave={saveModal}
          saveLabel="Add Project"
        >
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Project Title *</label>
              <input
                type="text"
                value={draftProject.title}
                onChange={(e) => setDraftProject((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. E-Commerce Redesign, Market Audit Report"
                className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold outline-none focus:border-[#10605F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Project Link (URL)</label>
              <input
                type="url"
                value={draftProject.url}
                onChange={(e) => setDraftProject((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://example.com/project"
                className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold outline-none focus:border-[#10605F]"
              />
            </div>
          </div>
        </ModalShell>
      )}

      {activeModal === "certification" && (
        <ModalShell
          title="Add Certification"
          subtitle="Specify credential name and issuing entity"
          onClose={closeModal}
          onSave={saveModal}
          saveLabel="Add Credential"
        >
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Certification Name *</label>
              <input
                type="text"
                value={draftCertification.title}
                onChange={(e) => setDraftCertification((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Certified Scrum Master, Google Analytics"
                className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold outline-none focus:border-[#10605F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Issuing Organization</label>
              <input
                type="text"
                value={draftCertification.issuer}
                onChange={(e) => setDraftCertification((p) => ({ ...p, issuer: e.target.value }))}
                placeholder="e.g. Google, Coursera, Meta"
                className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold outline-none focus:border-[#10605F]"
              />
            </div>
          </div>
        </ModalShell>
      )}

    </div>
  );
};

export default PerformerProfilePage;
