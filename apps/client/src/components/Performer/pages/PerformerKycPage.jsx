import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  FileText,
  BadgeCheck,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import { getMyKycStatus, submitKycIdDocument, submitKycSelfie } from "../services/api";
import { uploadFileViaPresignedUrl } from "../../../utils/fileUpload";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";

const StatusBadge = ({ status }) => {
  const configs = {
    VERIFIED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: BadgeCheck,
      label: "Account Verified",
      desc: "Your identity has been certified by OnIT India.",
    },
    PENDING: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      label: "Review in Progress",
      desc: "Our admins are currently reviewing your documents.",
    },
    REJECTED: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: AlertCircle,
      label: "Action Required",
      desc: "Your verification was not approved. Please re-upload.",
    },
    NOT_SUBMITTED: {
      color: "bg-slate-50 text-slate-600 border-slate-200",
      icon: Info,
      label: "Not Verified",
      desc: "Upload documents to get certified and boost your trust score.",
    },
  };

  const current = configs[status] || configs.NOT_SUBMITTED;
  const Icon = current.icon;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${current.color} shadow-sm transition-all`}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 shadow-sm backdrop-blur-sm">
          <Icon className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">{current.label}</h3>
          <p className="mt-1 text-sm font-medium opacity-90">{current.desc}</p>
        </div>
      </div>
    </div>
  );
};

const PerformerKycPage = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState({ kycStatus: "NOT_SUBMITTED", submissions: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [docType, setDocType] = useState("AADHAAR");
  const [kycStep, setKycStep] = useState(1);
  const [pendingSubmissionId, setPendingSubmissionId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const res = await getMyKycStatus();
      setKycData(res);
    } catch (err) {
      console.error("Failed to fetch KYC status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (kycStep === 2) setSelfieFile(e.dataTransfer.files[0]);
      else setIdFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (target === "selfie") setSelfieFile(file);
    else setIdFile(file);
  };

  const handleUploadId = async () => {
    if (!idFile) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const idDocumentUrl = await uploadFileViaPresignedUrl(idFile, {
        folder: "kyc-documents",
      });
      const res = await submitKycIdDocument({ docType, idDocumentUrl });
      const submissionId =
        res?.submissionId || res?.id || res?.data?.submissionId || res?.data?.id;
      if (!submissionId) {
        throw new Error("ID uploaded but no submission ID returned. Contact support.");
      }
      setPendingSubmissionId(submissionId);
      setKycStep(2);
      setIdFile(null);
      setSuccess(true);
      fetchKycStatus();
    } catch (err) {
      setError(err.message || "Failed to upload ID document.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadSelfie = async () => {
    if (!selfieFile || !pendingSubmissionId) return;
    setUploading(true);
    setError(null);

    try {
      const selfieUrl = await uploadFileViaPresignedUrl(selfieFile, {
        folder: "kyc-documents",
      });
      await submitKycSelfie({
        submissionId: pendingSubmissionId,
        selfieUrl,
      });
      setSuccess(true);
      setSelfieFile(null);
      setKycStep(1);
      setPendingSubmissionId(null);
      fetchKycStatus();
    } catch (err) {
      setError(err.message || "Failed to upload selfie.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
            <PerformerPageHeader
              title="KYC Verification"
              subtitle="Verify your identity to unlock higher payout limits and priority task access"
              backTo="/performer/account"
              backLabel="Back to Account Hub"
            />

            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-8">
                <StatusBadge status={kycData.kycStatus} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5">
                        <h2 className="flex items-center gap-2.5 text-[17px] font-bold text-[var(--color-text)]">
                          <Upload size={18} className="text-[var(--color-primary)]" />
                          {kycStep === 1 ? "Step 1 — Government ID" : "Step 2 — Selfie with ID"}
                        </h2>
                        <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                          {kycStep === 1
                            ? "Upload Aadhaar, PAN, or Passport (POST /taskers/me/kyc/id)."
                            : "Hold your ID next to your face (POST /taskers/me/kyc/selfie)."}
                        </p>
                      </div>

                      <div className="p-6 sm:p-8">
                        {kycStep === 1 ? (
                          <div className="mb-6">
                            <label className="mb-3 block text-sm font-bold text-[var(--color-text-subtle)]">Document Type</label>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                              {["AADHAAR", "PAN", "PASSPORT", "DRIVING_LICENSE"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setDocType(type)}
                                  className={`rounded-xl border-2 px-4 py-3 text-xs font-black transition-all ${docType === type
                                      ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]"
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          className={`relative flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border-2 border-dashed p-10 transition-all ${dragActive
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)]/30"
                              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50"
                            }`}
                        >
                          <input
                            type="file"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            onChange={(e) => handleFileChange(e, kycStep === 2 ? "selfie" : "id")}
                            accept={kycStep === 2 ? "image/*" : "image/*,.pdf"}
                          />

                          {(kycStep === 2 ? selfieFile : idFile) ? (
                            <div className="text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                                <FileText size={32} />
                              </div>
                              <p className="max-w-[200px] truncate text-sm font-bold text-[var(--color-text)]">
                                {(kycStep === 2 ? selfieFile : idFile).name}
                              </p>
                              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                {((kycStep === 2 ? selfieFile : idFile).size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <button
                                type="button"
                                onClick={() => (kycStep === 2 ? setSelfieFile(null) : setIdFile(null))}
                                className="mt-4 text-xs font-bold text-rose-500 hover:text-rose-600"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                                <Upload size={32} />
                              </div>
                              <p className="text-sm font-bold text-[var(--color-text)]">Click to upload or drag and drop</p>
                              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                {kycStep === 2 ? "Selfie photo (JPG/PNG)" : "PNG, JPG or PDF (max. 5MB)"}
                              </p>
                            </div>
                          )}
                        </div>

                        {error ? (
                          <div className="mt-6 flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
                            <AlertCircle size={16} />
                            {error}
                          </div>
                        ) : null}

                        {success ? (
                          <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-600">
                            <CheckCircle2 size={16} />
                            {kycStep === 2
                              ? "KYC submitted! Our team is reviewing it."
                              : "ID uploaded — now add your selfie."}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={(kycStep === 2 ? !selfieFile : !idFile) || uploading || (kycStep === 2 && !pendingSubmissionId)}
                          onClick={kycStep === 2 ? handleUploadSelfie : handleUploadId}
                          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-black text-white shadow-[0_8px_20px_-4px_rgba(43,169,96,0.3)] transition-all hover:scale-[1.01] hover:shadow-[0_12px_24px_-4px_rgba(43,169,96,0.4)] disabled:opacity-50"
                        >
                          {uploading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              {kycStep === 2 ? "Submit selfie" : "Upload ID & continue"}
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                        {kycStep === 2 ? (
                          <button
                            type="button"
                            onClick={() => { setKycStep(1); setSelfieFile(null); setSuccess(false); }}
                            className="mt-3 w-full text-center text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                          >
                            Back to ID upload
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                      <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Why Verify?</h3>
                      <ul className="space-y-4">
                        {[
                          { text: "Unlimited Withdrawals", icon: CheckCircle2 },
                          { text: "Priority Task Matching", icon: CheckCircle2 },
                          { text: "Certified Profile Badge", icon: CheckCircle2 },
                          { text: "Early Access to Features", icon: CheckCircle2 },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-[var(--color-text)]">
                            <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[var(--radius-3xl)] border border-amber-100 bg-amber-50/50 p-6">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                        <Info size={16} />
                        Important Note
                      </h3>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-amber-700">
                        Ensure the uploaded document is clear and all information is legible. Blurry images may lead to rejection.
                      </p>
                    </div>
                  </div>
                </div>

                {kycData.submissions?.length > 0 && (
                  <div className="rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5">
                      <h2 className="text-[17px] font-bold text-[var(--color-text)]">Submission History</h2>
                    </div>
                    <div className="divide-y divide-[var(--color-border)]">
                      {kycData.submissions.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-[var(--color-surface)] p-2">
                              <FileText className="h-5 w-5 text-[var(--color-text-subtle)]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--color-text)]">{sub.docType}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{new Date(sub.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                              sub.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                            {sub.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default PerformerKycPage;
