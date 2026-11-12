import React, { useState } from "react";
import { User, Phone, Mail, MapPin, Building, Loader2, Camera, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
    updateProviderProfile,
    getProviderProfile,
    createProviderProfile,
    onboardUser,
    uploadProfilePicture,
    updateUserMe,
    startProfileEmailVerification,
    verifyProfileEmail,
} from "../../services/api";
import { useEffect } from "react";

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const EditProfileForm = ({ onSave, onCancel }) => {
  const { user, updateUser, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    locationCity: "",
    organization: "",
  });
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [error, setError] = useState(null);

  // Email verification state (only used when user has no email)
  const [emailInput, setEmailInput] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState("input"); // "input" | "otp" | "verified"
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profilePicUrl || "");

  // Fetch the LATEST provider profile to ensure we aren't sending stale/empty data
  useEffect(() => {
    const loadProfile = async () => {
        try {
            setLoading(true);
            const profile = await getProviderProfile();
            setFormData({
                username: profile.username || user?.name || "",
                email: firstText(profile.user?.email, user?.email),
                phoneNumber: firstText(
                    profile.phoneNumber,
                    profile.phone,
                    profile.mobileNumber,
                    profile.contactNumber,
                    profile.user?.phoneNumber,
                    profile.user?.phone,
                    profile.user?.mobileNumber,
                    user?.phoneNumber,
                    user?.phone,
                    user?.mobileNumber,
                ),
                locationCity: profile.locationCity || "",
                organization: profile.organization || "",
            });
        } catch (err) {
            console.error("Failed to load profile for editing:", err);
            if (err.status === 404) {
                // If profile missing, just keep empty fields from user object
                setIsNewProfile(true);
                setFormData({
                    username: user?.name?.replace(/\s+/g, '').toLowerCase() || "",
                    email: firstText(user?.email),
                    phoneNumber: firstText(user?.phoneNumber, user?.phone, user?.mobileNumber),
                    locationCity: "",
                    organization: "",
                });
            } else {
                setError("Could not load current profile. Please refresh.");
            }
        } finally {
            setLoading(false);
        }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB");
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let finalProfilePicUrl = user?.profilePicUrl;

      // 1. Handle Image Upload if changed
      if (selectedFile) {
          try {
              const uploaded = await uploadProfilePicture(selectedFile);
              finalProfilePicUrl = uploaded.publicUrl || uploaded.url || finalProfilePicUrl;

              if (finalProfilePicUrl) {
                await updateUserMe({ profilePicUrl: finalProfilePicUrl });
              }
          } catch (uploadErr) {
              console.error("Image upload failed:", uploadErr);
              throw new Error("Failed to upload profile picture. Try again or skip for now.");
          }
      }

      const providerPayload = {
        username: formData.username,
        locationCity: formData.locationCity,
        organization: formData.organization,
      };

      // 2. Handle Provider Data
      let updatedProfile;
      if (isNewProfile) {
        // Create the Provider ID record first
        await createProviderProfile(providerPayload);
        // Ensure User role is set to PROVIDER
        if (user.role !== 'PROVIDER') {
          await onboardUser('PROVIDER');
        }
        updatedProfile = await getProviderProfile();
      } else {
        // Update existing profile
        updatedProfile = await updateProviderProfile(providerPayload);
      }
      
      // 3. Update local AuthContext via full refresh to ensure all nested fields are synced
      await refreshProfile();
      onSave();
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Better error messaging for common failures
      if (err.status === 409) {
          setError("Full Name/Username is already taken by another provider. Please choose another.");
      } else if (err.message) {
          setError(err.message);
      } else {
          setError("Failed to update profile. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput)) return;
    setEmailLoading(true);
    setEmailError(null);
    try {
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
      await verifyProfileEmail(emailInput.trim(), emailOtp.trim());
      setEmailStep("verified");
      setFormData((prev) => ({ ...prev, email: emailInput.trim() }));
      await refreshProfile();
    } catch (err) {
      setEmailError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-[var(--color-border)]/50">
        <div className="relative group">
            <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[var(--color-surface-elevated)] flex items-center justify-center">
                {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-[var(--color-text-subtle)]">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-bold mt-1">NO PHOTO</span>
                    </div>
                )}
            </div>
            <label className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>
        
        <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-[var(--color-text)] tracking-tight">Edit Profile</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
                Update your personal and business presence on FirstDoer.
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name/Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)] flex items-center gap-2">
              <User size={14} /> Full Name
            </label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)] flex items-center gap-2">
              <Phone size={14} /> Phone Number
            </label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                readOnly
                disabled
                title="Phone number can only be updated via the verification flow"
                placeholder="+91 00000 00000"
                className="w-full bg-transparent text-sm font-semibold text-[var(--color-text-muted)] outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)] flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            {formData.email ? (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3">
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  title="Email can only be updated via the verification flow"
                  className="w-full cursor-not-allowed bg-transparent text-sm font-semibold text-[var(--color-text-muted)] outline-none"
                />
              </div>
            ) : emailStep === "verified" ? (
              <div className="rounded-xl border border-[#29ADAC]/30 bg-[#EFFBFB] px-4 py-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#10605F] shrink-0" />
                <span className="text-sm font-semibold text-[#10605F]">{emailInput} — verified</span>
              </div>
            ) : emailStep === "otp" ? (
              <div className="space-y-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    maxLength={6}
                    className="w-full bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={emailLoading || !emailOtp.trim()}
                    className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                  >
                    {emailLoading ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                  </button>
                </div>
                <button type="button" onClick={() => setEmailStep("input")} className="text-[11px] font-semibold text-[var(--color-text-muted)] hover:underline">
                  ← Change email
                </button>
                {emailError && <p className="text-[11px] font-semibold text-red-600">{emailError}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 flex items-center gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={emailLoading || !/\S+@\S+\.\S+/.test(emailInput)}
                    className="shrink-0 rounded-lg bg-[#10605F] px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-[#083B3A] disabled:opacity-50"
                  >
                    {emailLoading ? <Loader2 size={12} className="animate-spin" /> : "Send OTP"}
                  </button>
                </div>
                {emailError && <p className="text-[11px] font-semibold text-red-600">{emailError}</p>}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)] flex items-center gap-2">
              <MapPin size={14} /> Location / City
            </label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
              <input
                type="text"
                name="locationCity"
                value={formData.locationCity}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, India"
                className="w-full bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)] flex items-center gap-2">
              <Building size={14} /> Organization (Optional)
            </label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6 border-t border-[var(--color-border)]/50">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? "Saving..." : "Update Details"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-[var(--color-border)] px-8 py-3.5 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-elevated)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
