import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, ArrowRight, Loader, ShieldCheck, Zap,
    Briefcase, User, ArrowLeft,
    CheckCircle2, Lock, X, AlertCircle, Smartphone
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import { checkAccountExists, getUserProfile, onboardUser, createProviderProfile } from "../services/api";
import { createTaskerProfile } from "../../Performer/services/api";
import { getApiUrl } from "../../../config/apiBase";
import { apiFetch } from "../../../utils/apiFetch";
import {
    clearAuthSession,
    isIdentityConflictError,
    parseAuthError,
    AUTH_ERROR_CODES,
} from "../../../utils/authErrors";
import AuthErrorPanel from "../../shared/AuthErrorPanel";
import {
    fetchBackendProfile,
    finalizeAuthSession,
    prepareAuthForRole,
    requireSelectedRole,
    assertTokenMatchesRole,
} from "../../../utils/authSession";
import {
    loadMsg91Widget,
    sendMsg91Otp,
    verifyMsg91Otp,
    extractMsg91AccessToken,
} from "../../../utils/msg91Loader";
import { getMsg91Identifier } from "../../../utils/phoneIdentifier";
import {
    sendEmailOtp,
    verifyEmailOtp,
    persistAuthTokens,
} from "../../../services/emailAuth";
import { PHONE_OTP_ENABLED } from "../../../config/authFeatures";
import { isTestModeEnabled, setTestRole, TEST_ROLES } from "../../../test-mode/testModeConfig";
import { mockDb } from "../../../test-mode/mockDatabase";

const loginImage = "/assets/login_image.png";
const OTP_LENGTH = 6;

const AccountExistsNotice = ({ detail, onLogin }) => (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-amber-950">Account already exists</p>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-amber-800">
                    {detail?.userMessage || "This account is already registered. Please continue with Login."}
                </p>
            </div>
            <button
                type="button"
                onClick={onLogin}
                className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--color-primary)] shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
                Login
            </button>
        </div>
    </div>
);

const OtpInvalidNotice = ({ detail, onDismiss }) => (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-red-950">Incorrect OTP</p>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-red-800">
                    {detail?.userMessage || "Please check the code and try again."}
                </p>
            </div>
            {onDismiss ? (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 text-xs font-bold text-red-600 hover:underline"
                >
                    Dismiss
                </button>
            ) : null}
        </div>
    </div>
);

const GoogleIcon = () => (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const performRoleRedirection = (role, navigate, taskData = null) => {
    const r = String(role || "").toUpperCase();
    if (taskData) {
        if (r === "PROVIDER") {
            navigate("/provider/post-task-manual", {
                state: {
                    aiGeneratedData: taskData
                },
                replace: true
            });
            return;
        } else {
            navigate("/auth", {
                state: {
                    error: "Only Provider accounts can post tasks. Please log in with a Provider account."
                },
                replace: true
            });
            return;
        }
    }
    if (r === "TASKER" || r === "PERFORMER") {
        navigate("/performer/dashboard", { replace: true });
    } else if (r === "PROVIDER") {
        navigate("/provider/dashboard", { replace: true });
    } else if (r === "ADMIN" || r === "SUPER_ADMIN") {
        navigate("/admin", { replace: true });
    } else {
        navigate("/auth", { replace: true });
    }
};

const GOOGLE_AUTH_PENDING_KEY = "onit_google_auth_pending";

// ── Shared post-token login (Google redirect + email OTP) ───────────────────
async function completeSessionAfterToken({
    token,
    selectedRole,
    taskData,
    getUserProfile,
    onboardUser,
    createProviderProfile,
    createTaskerProfile,
    refreshProfile,
    login,
    navigate,
    setError,
}) {
    const role = requireSelectedRole(selectedRole);
    localStorage.setItem("onit_token", token);

    const profile = await fetchBackendProfile(role, getUserProfile);
    const backendRole = String(profile.role || "").toUpperCase();
    const isPending = backendRole === "PENDING" || !backendRole;
    const isAdmin = backendRole === "ADMIN" || backendRole === "SUPER_ADMIN";
    const selectedIsProvider = selectedRole === "PROVIDER";
    const selectedIsTasker = selectedRole === "TASKER";

    if (isAdmin) {
        login(profile, token);
        localStorage.setItem("userRole", profile.role);
        setTimeout(() => navigate("/admin", { replace: true }), 300);
        return;
    }

    if (isPending && selectedRole) {
        let onboardErr = null;
        try {
            await onboardUser(role);
            if (selectedIsProvider) {
                await createProviderProfile({});
            } else {
                await createTaskerProfile({});
            }
        } catch (err) {
            onboardErr = err;
            console.warn("[AUTH] Onboard error (may be race condition):", err?.message || err);
            await new Promise((r) => setTimeout(r, 300));
        }
        try {
            const fresh = await refreshProfile();
            const freshRole = String(fresh.role || "").toUpperCase();
            if (!freshRole || freshRole === "PENDING") {
                if (onboardErr) throw onboardErr;
                setError("Account setup incomplete. Please refresh and try again.");
                localStorage.removeItem("onit_token");
                return;
            }
            login(fresh, token);
            localStorage.setItem("userRole", fresh.role);
            setTimeout(() => performRoleRedirection(freshRole, navigate, taskData), 300);
        } catch (refreshErr) {
            console.error("[AUTH] Profile refresh failed:", refreshErr?.message || refreshErr);
            if (isIdentityConflictError(refreshErr)) {
                clearAuthSession();
                setError(refreshErr, { phase: "getUserProfile" });
                return;
            }
            setError(
                {
                    message: "Failed to load your account. Please check your connection and try again.",
                    code: AUTH_ERROR_CODES.NETWORK_ERROR,
                },
                { phase: "getUserProfile" }
            );
        }
        return;
    }

    login(profile, token);
    localStorage.setItem("userRole", profile.role);
    setTimeout(() => performRoleRedirection(backendRole, navigate, taskData), 300);
}

function reportGoogleAuthError(err, setError) {
    const normalized = {
        message:
            err?.error_description ||
            err?.message ||
            (typeof err?.error === "string" ? err.error : "Google sign-in failed."),
        status: err?.status ?? err?.statusCode ?? null,
        code: err?.code,
        error: err?.error,
    };
    if (isIdentityConflictError(err) || err?.code === AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT) {
        clearAuthSession();
        setError(normalized, { phase: "google_auth" });
    } else if (normalized.status === 401 || String(normalized.message).includes("401")) {
        setError(
            { message: "Authentication failed. Please try again.", code: AUTH_ERROR_CODES.UNAUTHORIZED },
            { phase: "google_auth" }
        );
    } else if (!navigator.onLine) {
        setError(
            { code: AUTH_ERROR_CODES.NETWORK_ERROR, message: "No internet connection." },
            { phase: "google_auth" }
        );
    } else {
        setError(normalized, { phase: "google_auth" });
    }
}

/** Redirect flow — avoids Auth0 popup 403 on /oauth/token (same pattern as admin login). */
async function startGoogleRedirectAuth({
    loginWithRedirect,
    selectedRole,
    mode,
    taskData,
    setError,
    setIsSubmitting,
}) {
    setIsSubmitting(true);
    try {
        const role = requireSelectedRole(selectedRole);
        finalizeAuthSession(role);
        sessionStorage.setItem(
            GOOGLE_AUTH_PENDING_KEY,
            JSON.stringify({ role, mode, taskData: taskData || null })
        );
        await loginWithRedirect({
            authorizationParams: {
                connection: "google-oauth2",
                prompt: "select_account",
            },
        });
    } catch (err) {
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        reportGoogleAuthError(err, setError);
        setIsSubmitting(false);
    }
}

async function finishGoogleRedirectAuth({
    pending,
    getAccessTokenSilently,
    getUserProfile,
    onboardUser,
    createProviderProfile,
    createTaskerProfile,
    refreshProfile,
    login,
    navigate,
    setError,
    setIsSubmitting,
}) {
    setIsSubmitting(true);
    try {
        const audience = String(import.meta.env.VITE_AUTH0_AUDIENCE ?? "").trim();
        const scope = `${import.meta.env.VITE_AUTH0_SCOPE || "openid profile email"} offline_access`;
        let token;
        try {
            token = await getAccessTokenSilently({
                authorizationParams: {
                    ...(audience ? { audience } : {}),
                    scope,
                },
            });
        } catch (tokenErr) {
            if (audience) {
                token = await getAccessTokenSilently({ authorizationParams: { scope } });
            } else {
                throw tokenErr;
            }
        }
        await completeSessionAfterToken({
            token,
            selectedRole: pending.role,
            taskData: pending.taskData,
            getUserProfile,
            onboardUser,
            createProviderProfile,
            createTaskerProfile,
            refreshProfile,
            login,
            navigate,
            setError,
        });
    } catch (err) {
        reportGoogleAuthError(err, setError);
    } finally {
        setIsSubmitting(false);
    }
}

const AuthPage = ({ initialMode }) => {
    const { login, refreshProfile } = useAuth();
    const {
        loginWithRedirect,
        getAccessTokenSilently,
        isAuthenticated: isAuth0Authenticated,
        isLoading: isAuth0Loading,
    } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const googleFinishRef = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Steps: 'ROLE_SELECTION', 'ENTRY', 'PHONE_OTP', 'COMPLETE_PROFILE'
    const [step, setStep] = useState("ROLE_SELECTION");
    const [isSignupMode, setIsSignupMode] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname.toLowerCase();
        const isSignupPath = path.startsWith("/signup") || path.startsWith("/register");
        const mode = initialMode || location.state?.mode || location.state?.authMode || location.state?.tab || params.get("mode") || (isSignupPath ? "signup" : "");
        if (mode === "login" || mode === "signin") return false;
        if (mode === "signup") return true;
        return false;
    });

    // Inputs
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [modalOtp, setModalOtp] = useState(Array(OTP_LENGTH).fill(""));

    // Profile inputs
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [selectedRole, setSelectedRole] = useState(() => {
        const urlRole = location.state?.role;
        return urlRole ? String(urlRole).toUpperCase() : "PROVIDER";
    });

    const handleRoleSelect = (roleKey) => {
        const targetRole = String(roleKey || "").toUpperCase() === "PROVIDER" ? "PROVIDER" : "TASKER";
        clearAuthError();
        prepareAuthForRole(targetRole);
        setSelectedRole(targetRole);

        if (isTestModeEnabled()) {
            const testRoleConst = targetRole === "TASKER" ? TEST_ROLES.PERFORMER : TEST_ROLES.PROVIDER;
            setTestRole(testRoleConst);
            const mockUser = mockDb.getCurrentUser(testRoleConst);
            if (mockUser) {
                login(mockUser, `mock_token_${mockUser.role.toLowerCase()}`);
            }
        } else {
            localStorage.setItem("userRole", targetRole);
            try {
                const raw = localStorage.getItem("onit_user");
                if (raw) {
                    const u = JSON.parse(raw);
                    u.role = targetRole;
                    localStorage.setItem("onit_user", JSON.stringify(u));
                }
            } catch (e) {
                // ignore parse error
            }
        }

        performRoleRedirection(targetRole, navigate, location.state?.taskData || null);
    };

    useEffect(() => {
        const urlRole = location.state?.role;
        if (urlRole) {
            const normalized = String(urlRole).toUpperCase();
            handleRoleSelect(normalized);
        }
    }, [location.state?.role, location.key]);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const refCode = params.get("ref") || params.get("referral") || params.get("referralCode") || params.get("code");
            if (refCode && refCode.trim()) {
                localStorage.setItem("pending_referral_code", refCode.trim().toUpperCase());
            }
        } catch (e) {
            console.warn("[AUTH] Failed to parse referral param:", e);
        }
    }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const presetEmail = String(location.state?.email || params.get("email") || "").trim();
        if (presetEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(presetEmail)) {
            setEmailOrPhone(presetEmail);
            setStep("ENTRY");
            setIsSignupMode(false);
        }
    }, [location.search, location.state?.email]);

    // Status states
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isVerifyingModalOtp, setIsVerifyingModalOtp] = useState(false);
    const [primaryOtpInvalid, setPrimaryOtpInvalid] = useState(false);
    const [modalOtpInvalid, setModalOtpInvalid] = useState(false);
    const [primaryTimer, setPrimaryTimer] = useState(20);
    const [modalTimer, setModalTimer] = useState(20);
    const [authError, setAuthError] = useState(null);

    const reportAuthError = (err, extra = {}) => {
        const detail = parseAuthError(err, { selectedRole, step, ...extra });
        setAuthError(detail);
        if (
            detail.code === AUTH_ERROR_CODES.IDENTITY_CONFLICT ||
            detail.code === AUTH_ERROR_CODES.SESSION_EXPIRED ||
            detail.code === AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT
        ) {
            clearAuthSession();
        }
    };

    const setError = (err, extra = {}) => {
        if (typeof err === "string") {
            reportAuthError({ message: err, ...extra }, extra);
        } else {
            reportAuthError(err, extra);
        }
    };

    const clearAuthError = () => setAuthError(null);

    const isAccountExistsError =
        authError?.code === AUTH_ERROR_CODES.SIGNUP_ACCOUNT_EXISTS ||
        authError?.code === AUTH_ERROR_CODES.SIGNUP_EMAIL_EXISTS;

    const isOtpInvalidError =
        authError?.code === AUTH_ERROR_CODES.AUTH0_OTP_INVALID ||
        String(authError?.backendMessage || authError?.userMessage || "")
            .toLowerCase()
            .includes("incorrect otp");

    const renderAuthError = () => {
        if (!authError) return null;
        if (isAccountExistsError) {
            return (
                <AccountExistsNotice
                    detail={authError}
                    onLogin={() => {
                        setIsSignupMode(false);
                        clearAuthError();
                    }}
                />
            );
        }
        if (isOtpInvalidError) {
            return <OtpInvalidNotice detail={authError} onDismiss={clearAuthError} />;
        }
        return <AuthErrorPanel detail={authError} onDismiss={clearAuthError} />;
    };

    const getAppParamForRole = (role = selectedRole) =>
        String(role).toUpperCase() === "TASKER" ? "tasker" : "provider";

    const checkExistingAccountBeforeSignup = async () => {
        if (!isSignupMode) return false;
        const response = await checkAccountExists({
            identifier: emailOrPhone,
            app: getAppParamForRole(),
        });
        const result = response?.data || response;
        if (result?.exists) {
            // An existing user should never have to manually switch modes.
            // Continue with the same OTP/login route using the value entered.
            setIsSignupMode(false);
            clearAuthError();
            return false;
        }
        return false;
    };

    const showOtpInvalid = (type, message, phase) => {
        setError(message || "Incorrect OTP. Please check the code and try again.", { phase });
        if (type === "modal") {
            setModalOtpInvalid(true);
            window.setTimeout(() => setModalOtpInvalid(false), 650);
            return;
        }
        setPrimaryOtpInvalid(true);
        window.setTimeout(() => setPrimaryOtpInvalid(false), 650);
    };

    // Complete Google login after Auth0 redirect returns to /auth
    useEffect(() => {
        if (isAuth0Loading || !isAuth0Authenticated) return;
        const raw = sessionStorage.getItem(GOOGLE_AUTH_PENDING_KEY);
        if (!raw || googleFinishRef.current) return;

        let pending;
        try {
            pending = JSON.parse(raw);
        } catch {
            sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
            return;
        }
        if (!pending?.role) {
            sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
            return;
        }

        googleFinishRef.current = true;
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        setSelectedRole(pending.role);
        setStep("ENTRY");

        finishGoogleRedirectAuth({
            pending,
            getAccessTokenSilently,
            getUserProfile,
            onboardUser,
            createProviderProfile,
            createTaskerProfile,
            refreshProfile,
            login,
            navigate,
            setError,
            setIsSubmitting,
        }).finally(() => {
            googleFinishRef.current = false;
        });
    }, [
        isAuth0Loading,
        isAuth0Authenticated,
        getAccessTokenSilently,
        login,
        refreshProfile,
        navigate,
    ]);

    const [otpModalOpen, setOtpModalOpen] = useState(false);

    // OTP Input Refs
    const otpRefs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));
    const modalOtpRefs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

    const [msg91Active, setMsg91Active] = useState(false);

    // Validation helpers — must be defined before isInitialEmail which uses isEmail
    const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = (val) => /^\+?(\d[\s-]?){9,13}\d$/.test(val.replace(/\s+/g, ''));

    // Symmetrical flow flag — must be defined before primaryOtpLength/modalOtpLength
    const isInitialEmail = isEmail(emailOrPhone);
    const isPhoneEntry =
        emailOrPhone.replace(/\D/g, "").length >= 10 &&
        !isEmail(emailOrPhone);

    // Load MSG91 only when phone OTP is enabled
    const shouldLoadMsg91 = PHONE_OTP_ENABLED && (
        isPhoneEntry ||
        (step === "PHONE_OTP" && !isInitialEmail) ||
        step === "COMPLETE_PROFILE" ||
        otpModalOpen
    );

    // 4-digit SMS OTP, 6-digit email OTP
    const primaryOtpLength =
        isPhoneEntry || (step === "PHONE_OTP" && !isInitialEmail) ? 4 : 6;
    const modalOtpLength = msg91Active && isInitialEmail ? 4 : 6;

    useEffect(() => {
        setOtp(Array(primaryOtpLength).fill(""));
    }, [primaryOtpLength]);

    useEffect(() => {
        setModalOtp(Array(modalOtpLength).fill(""));
    }, [modalOtpLength]);

    // Load MSG91 only when phone OTP is needed
    useEffect(() => {
        if (!shouldLoadMsg91) {
            setMsg91Active(false);
            return undefined;
        }

        let cancelled = false;
        const timer = setTimeout(() => {
            loadMsg91Widget().then((active) => {
                if (!cancelled) setMsg91Active(active);
            });
        }, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [shouldLoadMsg91, isPhoneEntry]);

    // Timers
    useEffect(() => {
        let pInterval, mInterval;
        if (step === "PHONE_OTP" && primaryTimer > 0) {
            pInterval = setInterval(() => setPrimaryTimer(prev => prev - 1), 1000);
        }
        if (otpModalOpen && modalTimer > 0) {
            mInterval = setInterval(() => setModalTimer(prev => prev - 1), 1000);
        }
        return () => {
            clearInterval(pInterval);
            clearInterval(mInterval);
        };
    }, [step, primaryTimer, otpModalOpen, modalTimer]);

    // Validation helpers (isEmail & isPhone declared earlier)
    const isEntryValid = PHONE_OTP_ENABLED
        ? isEmail(emailOrPhone) || emailOrPhone.replace(/\D/g, "").length >= 10
        : isEmail(emailOrPhone);
    const isPrimaryOtpComplete = otp.every(digit => digit !== "") && otp.length === primaryOtpLength;
    const isModalOtpComplete = modalOtp.every(digit => digit !== "") && modalOtp.length === modalOtpLength;

    // (isInitialEmail is declared earlier, before primaryOtpLength/modalOtpLength)

    const isEmailInputValid = isEmail(email);
    const isPhoneInputValid = phoneNumberInput.replace(/\D/g, '').length >= 10;

    // Focus shifting triggers
    useEffect(() => {
        if (step === "PHONE_OTP") {
            setTimeout(() => otpRefs.current[0]?.current?.focus(), 100);
        }
    }, [step]);

    useEffect(() => {
        if (otpModalOpen) {
            setTimeout(() => modalOtpRefs.current[0]?.current?.focus(), 100);
        }
    }, [otpModalOpen]);

    // Clean phone number format
    const formatPhoneNumber = (val) => {
        const cleaned = val.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return val;
    };

    const handleEntrySubmit = async (e) => {
        e.preventDefault();
        if (!isEntryValid) return;

        clearAuthError();
        setIsSubmitting(true);

        try {
            const role = requireSelectedRole(selectedRole);
            finalizeAuthSession(role);

            // Do not block the OTP screen on the account-existence lookup.
            // That request can cold-start the API and made signup take 10–20s
            // before the user could even see the OTP input. Auth0 verification
            // plus the backend profile lookup below already handles both an
            // existing account (login) and a new account (onboarding).
            if (isInitialEmail) {
                await sendEmailOtp(emailOrPhone, role);
                setPrimaryTimer(30);
                setOtp(Array(6).fill(""));
                setStep("PHONE_OTP");
            } else if (isPhoneEntry) {
                let active = msg91Active;
                if (!active) {
                    active = await loadMsg91Widget();
                    setMsg91Active(active);
                }
                if (!active) {
                    throw Object.assign(
                        new Error(
                            "Phone OTP could not load. Disable ad blocker or use email login."
                        ),
                        { code: "MSG91_NOT_READY" }
                    );
                }
                const sendRes = await sendMsg91Otp(getMsg91Identifier(emailOrPhone));
                if (!sendRes?.reqId) {
                    throw Object.assign(
                        new Error("OTP was not queued by MSG91 (missing request id)."),
                        { code: "MSG91_SEND_FAILED", raw: sendRes }
                    );
                }
                console.info("[AUTH] Phone OTP queued. reqId=", sendRes.reqId);
                setPrimaryTimer(30);
                setOtp(Array(primaryOtpLength).fill(""));
                setStep("PHONE_OTP");
            } else {
                setError("Enter a valid email or 10-digit phone number.", { phase: "auth0_passwordless" });
            }
        } catch (err) {
            if (String(err?.code || "").startsWith("MSG91_")) {
                setError(err, { phase: "msg91" });
            } else {
                setError(err, { phase: "auth0_passwordless" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index, value, type) => {
        if (value && !/^\d$/.test(value)) return;
        const currentOtp = type === "primary" ? otp : modalOtp;
        const setMethod = type === "primary" ? setOtp : setModalOtp;
        const refs = type === "primary" ? otpRefs : modalOtpRefs;
        const activeLength = type === "primary" ? primaryOtpLength : modalOtpLength;

        const next = [...currentOtp];
        next[index] = value;
        setMethod(next);
        clearAuthError();
        if (type === "primary") {
            setPrimaryOtpInvalid(false);
        } else {
            setModalOtpInvalid(false);
        }

        if (value && index < activeLength - 1) {
            refs.current[index + 1]?.current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e, type) => {
        const refs = type === "primary" ? otpRefs : modalOtpRefs;
        const activeLength = type === "primary" ? primaryOtpLength : modalOtpLength;
        const currentOtp = type === "primary" ? otp : modalOtp;

        if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
            refs.current[index - 1]?.current?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.current?.focus();
        if (e.key === "ArrowRight" && index < activeLength - 1) refs.current[index + 1]?.current?.focus();
    };

    const handleOtpPaste = (e, type) => {
        e.preventDefault();
        const activeLength = type === "primary" ? primaryOtpLength : modalOtpLength;
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, activeLength);
        if (!pasted) return;

        const setMethod = type === "primary" ? setOtp : setModalOtp;
        const refs = type === "primary" ? otpRefs : modalOtpRefs;

        const next = Array(activeLength).fill("");
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setMethod(next);

        const focusIdx = Math.min(pasted.length, activeLength - 1);
        refs.current[focusIdx]?.current?.focus();
    };

    const handleVerifyPrimaryOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length !== primaryOtpLength) return;

        setIsVerifyingOtp(true);
        clearAuthError();

        if (isInitialEmail) {
            let accessToken = null;
            try {
                const tokens = await verifyEmailOtp({
                    email: emailOrPhone,
                    otp: fullOtp,
                    role: selectedRole,
                });
                accessToken = tokens.accessToken;
                persistAuthTokens(tokens);
            } catch (err) {
                showOtpInvalid("primary", "Incorrect OTP. Please check the code and try again.", "auth0_otp");
                setOtp(Array(primaryOtpLength).fill(""));
                otpRefs.current[0]?.current?.focus();
                setIsVerifyingOtp(false);
                return;
            }

            try {
                const profile = await fetchBackendProfile(selectedRole, getUserProfile);
                const backendRole = String(profile.role || "").toUpperCase();
                const isPending = backendRole === "PENDING" || !backendRole;

                if (!isSignupMode && isPending) {
                    // New user who came through the login path — collect name/email before onboarding
                    setStep("COMPLETE_PROFILE");
                    setIsVerifyingOtp(false);
                    return;
                }

                if (!isPending) {
                    profile.email = profile.email || emailOrPhone;
                    login(profile, accessToken);
                    localStorage.setItem("userRole", profile.role);
                    performRoleRedirection(backendRole, navigate, location.state?.taskData);
                } else if (!PHONE_OTP_ENABLED && isSignupMode) {
                    try {
                        await onboardUser(selectedRole);
                        if (selectedRole === "PROVIDER") {
                            await createProviderProfile({});
                        } else {
                            await createTaskerProfile({});
                        }
                        const fresh = await refreshProfile();
                        fresh.email = fresh.email || emailOrPhone;
                        login(fresh, accessToken);
                        localStorage.setItem("userRole", fresh.role);
                        performRoleRedirection(
                            String(fresh.role || selectedRole).toUpperCase(),
                            navigate,
                            location.state?.taskData
                        );
                    } catch (onboardErr) {
                        console.warn("[AUTH] Signup auto-onboard failed, collecting profile name:", onboardErr);
                        setStep("COMPLETE_PROFILE");
                    }
                } else {
                    setStep("COMPLETE_PROFILE");
                }
            } catch (err) {
                if (
                    isIdentityConflictError(err) ||
                    err?.code === AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT
                ) {
                    clearAuthSession();
                    setError(err, { phase: "getUserProfile" });
                    setStep("ROLE_SELECTION");
                } else {
                    setError(err, { phase: "getUserProfile" });
                }
                setOtp(Array(primaryOtpLength).fill(""));
                otpRefs.current[0]?.current?.focus();
            } finally {
                setIsVerifyingOtp(false);
            }
        } else if (msg91Active) {
            let data, token;
            try {
                data = await verifyMsg91Otp(fullOtp);
                token = extractMsg91AccessToken(data);
                if (!token) {
                    setError("OTP verified but no access token returned. Check MSG91 widget token in .env.", { phase: "msg91" });
                    setIsVerifyingOtp(false);
                    return;
                }
            } catch (err) {
                setOtp(Array(primaryOtpLength).fill(""));
                showOtpInvalid("primary", "Incorrect OTP. Please check the code and try again.", "msg91");
                otpRefs.current[0]?.current?.focus();
                setIsVerifyingOtp(false);
                return;
            }

            try {
                const res = await fetch(getApiUrl("/auth/phone/verify-access-token"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ app: String(selectedRole).toLowerCase(), accessToken: token }),
                });

                const backendData = await res.json();
                if (!res.ok) {
                    throw new Error(backendData.message || "Failed backend phone authentication.");
                }

                localStorage.setItem("onit_token", backendData.accessToken);
                if (backendData.refreshToken) {
                    localStorage.setItem("onit_refresh_token", backendData.refreshToken);
                }

                const profile = backendData.user;
                const backendRole = String(profile.role || "").toUpperCase();
                const isPending = backendRole === "PENDING" || !backendRole;

                if (!isPending) {
                    login(profile, backendData.accessToken);
                    localStorage.setItem("userRole", profile.role);
                    performRoleRedirection(backendRole, navigate, location.state?.taskData);
                } else {
                    setStep("COMPLETE_PROFILE");
                }
            } catch (err) {
                setError(err.message || "Failed backend phone authentication.");
            } finally {
                setIsVerifyingOtp(false);
            }
        } else {
            setError("Phone OTP is not ready. Use email login or reload the page.", { phase: "msg91" });
            setIsVerifyingOtp(false);
        }
    };

    const handleCompleteProfileWithoutPhone = async () => {
        if (!fullName.trim()) return;

        clearAuthError();
        setIsVerifyingOtp(true);

        try {
            const accessToken = localStorage.getItem("onit_token");
            assertTokenMatchesRole(selectedRole, accessToken);

            await onboardUser(selectedRole);
            if (selectedRole === "PROVIDER") {
                await createProviderProfile({ username: fullName.trim() });
            } else {
                await createTaskerProfile({ displayName: fullName.trim() });
            }

            const check = await refreshProfile();
            check.email = check.email || emailOrPhone;
            login(check, accessToken);
            performRoleRedirection(selectedRole, navigate, location.state?.taskData);
        } catch (err) {
            setError(err, { phase: "onboard" });
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleTriggerVerificationModal = async () => {
        clearAuthError();

        if (isInitialEmail) {
            if (!PHONE_OTP_ENABLED) {
                await handleCompleteProfileWithoutPhone();
                return;
            }
            if (!isPhoneInputValid) return;

            setIsVerifyingOtp(true);
            try {
                let active = msg91Active;
                if (!active) {
                    active = await loadMsg91Widget();
                    setMsg91Active(active);
                }
                if (!active) {
                    throw Object.assign(
                        new Error("Phone OTP could not load. Disable ad blocker or use email only."),
                        { code: "MSG91_NOT_READY" }
                    );
                }

                await sendMsg91Otp(getMsg91Identifier(phoneNumberInput));
                setModalTimer(20);
                setModalOtp(Array(modalOtpLength).fill(""));
                setOtpModalOpen(true);
            } catch (err) {
                setError(err, { phase: "msg91" });
            } finally {
                setIsVerifyingOtp(false);
            }
        } else {
            if (!isEmailInputValid) return;

            // Live email passwordless trigger for editable email field
            setIsVerifyingOtp(true);
            try {
                await sendEmailOtp(email, selectedRole);
                setModalTimer(20);
                setModalOtp(Array(modalOtpLength).fill(""));
                setOtpModalOpen(true);
            } catch (err) {
                setError(err.message || "Failed to trigger email verification. Please check your address.");
            } finally {
                setIsVerifyingOtp(false);
            }
        }
    };

    const handleConfirmModalOtp = async (e) => {
        e.preventDefault();
        const fullOtp = modalOtp.join("");
        if (fullOtp.length !== modalOtpLength) return;

        setIsVerifyingModalOtp(true);
        clearAuthError();

        if (!isInitialEmail) {
            let tokens;
            try {
                tokens = await verifyEmailOtp({
                    email,
                    otp: fullOtp,
                    role: selectedRole,
                });
            } catch (otpErr) {
                showOtpInvalid("modal", "Incorrect OTP. Please check the code and try again.", "auth0_otp");
                setModalOtp(Array(modalOtpLength).fill(""));
                modalOtpRefs.current[0]?.current?.focus();
                setIsVerifyingModalOtp(false);
                return;
            }

            try {
                // Link verified Auth0 email to the current phone-authenticated user session
                await apiFetch("/auth/profile-email/link-auth0", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        auth0AccessToken: tokens?.accessToken,
                    }),
                });

                // Onboard current user
                await onboardUser(selectedRole);
                if (selectedRole === "PROVIDER") {
                    await createProviderProfile({
                        username: fullName
                    });
                } else {
                    await createTaskerProfile({
                        displayName: fullName
                    });
                }

                const check = await refreshProfile();
                check.email = check.email || email;
                login(check, localStorage.getItem("onit_token"));
                setOtpModalOpen(false);
                performRoleRedirection(selectedRole, navigate, location.state?.taskData);
            } catch (err) {
                setError(err.message || "Failed to complete profile setup. Please try again.");
            } finally {
                setIsVerifyingModalOtp(false);
            }
        } else {
            let data, token;
            try {
                data = await verifyMsg91Otp(fullOtp);
                token = extractMsg91AccessToken(data);
                if (!token) {
                    throw new Error("OTP verified but no access token returned.");
                }
            } catch (otpErr) {
                showOtpInvalid("modal", "Incorrect OTP. Please check the code and try again.", "msg91");
                setModalOtp(Array(modalOtpLength).fill(""));
                modalOtpRefs.current[0]?.current?.focus();
                setIsVerifyingModalOtp(false);
                return;
            }

            try {
                const localToken = localStorage.getItem("onit_token");
                const ownerType = selectedRole === "PROVIDER" ? "PROVIDER" : "TASKER";

                await onboardUser(selectedRole);

                if (selectedRole === "PROVIDER") {
                    await createProviderProfile({ username: fullName });
                } else {
                    await createTaskerProfile({ displayName: fullName });
                }

                await apiFetch(
                    `/auth/profile-phone/verify-access-token?access-token=${token}`,
                    {
                        method: "POST",
                        body: JSON.stringify({ ownerType, accessToken: token }),
                    }
                );

                const check = await refreshProfile();
                check.email = check.email || emailOrPhone;
                login(check, localToken);
                setOtpModalOpen(false);
                performRoleRedirection(selectedRole, navigate, location.state?.taskData);
            } catch (err) {
                setError(err.message || "Failed to complete profile setup. Please try again.");
            } finally {
                setIsVerifyingModalOtp(false);
            }
        }
    };

    const handleGoogleAuth = () => {
        if (!selectedRole) {
            setError("Select Provider or Performer before continuing with Google.", {
                phase: "google_auth",
            });
            return;
        }
        clearAuthError();
        prepareAuthForRole(selectedRole);
        startGoogleRedirectAuth({
            loginWithRedirect,
            selectedRole,
            mode: isSignupMode ? "signup" : "login",
            taskData: location.state?.taskData || null,
            setError,
            setIsSubmitting,
        });
    };

    // Form button validity state
    const isProfileFormValid = PHONE_OTP_ENABLED
        ? fullName.trim().length > 0 && (isInitialEmail ? isPhoneInputValid : isEmailInputValid)
        : fullName.trim().length > 0;

    const roleLabel = selectedRole === "TASKER" ? "Performer" : "Provider";

    return (
        <AuthLayout illustrationSrc={loginImage}>
            <div className="relative w-full">
                {/* Brand header */}
                <div className="mb-6 text-center">
                    <Link to="/" className="inline-flex select-none items-baseline font-bold text-[var(--color-text)] text-2xl sm:text-3xl transition hover:opacity-80">
                        <span className="font-extrabold tracking-normal">OnIT</span>
                        <span className="ml-1.5 font-bold uppercase tracking-tight text-[var(--color-primary)]">INDIA</span>
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {/* Role selection — use /providerlogin or /performerlogin to skip */}
                    {step === "ROLE_SELECTION" && (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[0_22px_56px_-16px_rgba(15,23,42,0.12)] sm:p-8"
                        >
                            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--color-text)] text-center">
                                Choose Your Role
                            </h1>
                            <p className="mb-6 text-[13px] text-[var(--color-text-muted)] text-center">
                                How would you like to use OnIT India?
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("PROVIDER")}
                                    className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-[var(--color-border)] p-4 text-center transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--color-text)]">Provider</h3>
                                        <p className="mt-1 text-[11px] leading-tight text-[var(--color-text-muted)]">Post tasks & hire people</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("TASKER")}
                                    className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-[var(--color-border)] p-4 text-center transition hover:border-indigo-500 hover:bg-indigo-50"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--color-text)]">Performer</h3>
                                        <p className="mt-1 text-[11px] leading-tight text-[var(--color-text-muted)]">Find tasks & earn money</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: unified entry screen */}
                    {step === "ENTRY" && (
                        <motion.div
                            key="entry"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[0_22px_56px_-16px_rgba(15,23,42,0.12)] sm:p-8"
                        >
                            <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] text-center">
                                Welcome to OnIT INDIA
                            </h1>
                            <p className="mb-2 text-[13px] text-[var(--color-text-muted)] text-center">
                                {isSignupMode ? "Create your account to get started" : "Log in to your workspace"}
                            </p>
                            <p className="mb-6 text-center">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${selectedRole === "TASKER" ? "bg-indigo-50 text-indigo-700" : "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"}`}>
                                    {roleLabel} account
                                </span>
                            </p>

                            {renderAuthError()}

                            {/* Google Sign In */}
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={isSubmitting || !selectedRole}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-white py-3.5 text-[14px] font-bold text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)]/40 hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin mr-2" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <GoogleIcon />
                                        {isSignupMode ? "Sign up with Google" : "Continue with Google"}
                                    </>
                                )}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--color-border)]" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                        or
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleEntrySubmit} noValidate className="space-y-4">
                                <div>
                                    <label htmlFor="entry-input" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                        {PHONE_OTP_ENABLED ? "Email ID / Phone Number" : "Email ID"}
                                    </label>
                                    <div className="relative">
                                        {isPhoneEntry ? (
                                            <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--color-text-muted)]" strokeWidth={2} />
                                        ) : (
                                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--color-text-muted)]" strokeWidth={2} />
                                        )}
                                        <input
                                            id="entry-input"
                                            type="text"
                                            inputMode={isPhoneEntry ? "numeric" : "email"}
                                            value={emailOrPhone}
                                            onChange={(e) => { setEmailOrPhone(e.target.value); clearAuthError(); }}
                                            placeholder={PHONE_OTP_ENABLED ? "Email ID / Phone Number" : "Enter your email address"}
                                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-11 pr-4 text-[14px] font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                        />
                                    </div>
                                    {isPhoneEntry && PHONE_OTP_ENABLED ? (
                                        <p className="mt-2 text-[12px] font-medium text-[var(--color-text-muted)]">
                                            We&apos;ll send a 4-digit SMS code to verify your number.
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isEntryValid || isSubmitting}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-bold text-white transition active:scale-[0.98]
                                        ${isEntryValid && !isSubmitting
                                            ? "bg-[var(--color-primary)] shadow-[0_4px_16px_-4px_rgba(0,153,102,0.45)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                                            : "bg-zinc-300 cursor-not-allowed opacity-80"
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Sending code...
                                        </>
                                    ) : (
                                        <>
                                            {isInitialEmail || isPhoneEntry ? "Send OTP" : (isSignupMode ? "Sign Up" : "Continue")}
                                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-5 text-center text-[13px] text-[var(--color-text-muted)]">
                                {isSignupMode ? (
                                    <>
                                        Already registered?{" "}
                                        <button type="button" onClick={() => { setIsSignupMode(false); clearAuthError(); }} className="font-extrabold text-[var(--color-primary)] hover:underline">
                                            Login
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <button type="button" onClick={() => { setIsSignupMode(true); clearAuthError(); }} className="font-extrabold text-[var(--color-primary)] hover:underline">
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 2: phone or email OTP entry */}
                    {step === "PHONE_OTP" && (
                        <motion.div
                            key="phone-otp"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[0_22px_56px_-16px_rgba(15,23,42,0.12)] sm:p-8"
                        >
                            <button
                                type="button"
                                onClick={() => setStep("ENTRY")}
                                className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} /> Back
                            </button>

                            <div className="mb-6 flex flex-col items-center">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                                    <Lock className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <h1 className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                                    Enter Verification Code
                                </h1>
                                <p className="mt-1.5 text-[13px] text-center text-[var(--color-text-muted)] leading-relaxed">
                                    We&apos;ve sent a {primaryOtpLength}-digit code to <br />
                                    <span className="font-bold text-[var(--color-text)]">
                                        {isInitialEmail ? emailOrPhone : formatPhoneNumber(emailOrPhone)}
                                    </span>
                                </p>
                            </div>

                            {renderAuthError()}

                            <form onSubmit={handleVerifyPrimaryOtp} noValidate className="space-y-5">
                                {/* OTP input blocks */}
                                <motion.div
                                    className="flex justify-center gap-2 sm:gap-2.5"
                                    onPaste={(e) => handleOtpPaste(e, "primary")}
                                    animate={primaryOtpInvalid ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                                    transition={{ duration: 0.42 }}
                                >
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs.current[i]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value, "primary")}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e, "primary")}
                                            disabled={isVerifyingOtp}
                                            className={`h-12 w-11 rounded-xl border-2 text-center text-lg font-bold transition outline-none sm:h-13 sm:w-12 
                                                ${primaryOtpInvalid
                                                    ? "border-red-400 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                                                    : digit
                                                    ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-emerald-50/30 focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                                    : "border-zinc-200 bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:bg-emerald-50/30 focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                                }`}
                                        />
                                    ))}
                                </motion.div>

                                <button
                                    type="submit"
                                    disabled={!isPrimaryOtpComplete || isVerifyingOtp}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold text-white transition active:scale-[0.98]
                                        ${isPrimaryOtpComplete && !isVerifyingOtp
                                            ? "bg-[var(--color-primary)] shadow-[0_4px_16px_-4px_rgba(0,153,102,0.45)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                                            : "bg-zinc-300 cursor-not-allowed opacity-80"
                                        }`}
                                >
                                    {isVerifyingOtp ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </button>
                            </form>

                            {/* Resend timer */}
                            <div className="mt-6 text-center text-[13px] font-bold text-[var(--color-text-subtle)]">
                                {primaryTimer > 0 ? (
                                    <span>Resend code in {primaryTimer}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEntrySubmit}
                                        className="text-[var(--color-primary)] hover:underline"
                                    >
                                        Resend code
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Complete profile details */}
                    {step === "COMPLETE_PROFILE" && (
                        <motion.div
                            key="complete-profile"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[0_22px_56px_-16px_rgba(15,23,42,0.12)] sm:p-8"
                        >
                            <div className="mb-6 flex flex-col items-center">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                                    <User className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <h1 className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                                    Complete Your Profile
                                </h1>
                                <p className="mt-1 text-[13px] text-zinc-400 text-center">
                                    Just a few more details to get started
                                </p>
                            </div>

                            {renderAuthError()}

                            <div className="space-y-4">
                                {/* Full name */}
                                <div>
                                    <label htmlFor="fullname" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullname"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[14px] font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                    />
                                </div>

                                {isInitialEmail ? (
                                    <>
                                        <div>
                                            <label htmlFor="email-disabled" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                                Email ID
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email-disabled"
                                                    type="email"
                                                    disabled
                                                    value={emailOrPhone}
                                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] font-semibold text-zinc-400 cursor-not-allowed select-none"
                                                />
                                                <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                            </div>
                                        </div>

                                        {PHONE_OTP_ENABLED ? (
                                            <>
                                                <div>
                                                    <label htmlFor="phone-input" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                                        Phone number
                                                    </label>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            id="phone-input"
                                                            type="text"
                                                            value={phoneNumberInput}
                                                            onChange={(e) => setPhoneNumberInput(e.target.value)}
                                                            placeholder="Enter phone number"
                                                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-4 pr-20 text-[14px] font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                                        />
                                                        {isPhoneInputValid && (
                                                            <button
                                                                type="button"
                                                                onClick={handleTriggerVerificationModal}
                                                                className="absolute right-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold rounded-lg shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
                                                            >
                                                                verify
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        {/* Email (Editable / Verifiable) */}
                                        <div>
                                            <label htmlFor="email-input" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                                Email ID
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    id="email-input"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="poa@example.com"
                                                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-4 pr-20 text-[14px] font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                                />
                                                {isEmailInputValid && (
                                                    <button
                                                        type="button"
                                                        onClick={handleTriggerVerificationModal}
                                                        className="absolute right-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold rounded-lg shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
                                                    >
                                                        verify
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone Number (Disabled / Prefilled / Locked) */}
                                        <div>
                                            <label htmlFor="phone-disabled" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                                                Phone number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="phone-disabled"
                                                    type="text"
                                                    disabled
                                                    value={formatPhoneNumber(emailOrPhone)}
                                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] font-semibold text-zinc-400 cursor-not-allowed select-none"
                                                />
                                                <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Continue button */}
                                <button
                                    type="button"
                                    onClick={PHONE_OTP_ENABLED ? handleTriggerVerificationModal : handleCompleteProfileWithoutPhone}
                                    disabled={!isProfileFormValid || isVerifyingOtp}
                                    className={`w-full rounded-xl py-3.5 text-[15px] font-bold text-white transition active:scale-[0.98] mt-3
                                        ${isProfileFormValid && !isVerifyingOtp
                                            ? "bg-[var(--color-primary)] shadow-[0_4px_16px_-4px_rgba(0,153,102,0.45)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                                            : "bg-zinc-300 cursor-not-allowed opacity-80"
                                        }`}
                                >
                                    {isVerifyingOtp ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            {PHONE_OTP_ENABLED ? "Sending code..." : "Setting up account..."}
                                        </>
                                    ) : (
                                        "Continue to OnIt India"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* DYNAMIC MODAL OVERLAY: OTP Verification */}
                <AnimatePresence>
                    {otpModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full max-w-[420px] rounded-3xl border border-zinc-100 bg-white p-6 shadow-2xl sm:p-7"
                            >
                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={() => setOtpModalOpen(false)}
                                    className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                                >
                                    <X className="h-4.5 w-4.5" />
                                </button>

                                <div className="mb-5 flex flex-col items-center">
                                    <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <Mail className="h-4.5 w-4.5" />
                                    </div>
                                    <h2 className="text-[17px] font-extrabold text-[var(--color-text)]">
                                        {isInitialEmail ? "Verify phone number" : "Verify email ID"}
                                    </h2>
                                    <p className="mt-1 text-[13px] text-center text-zinc-400">
                                        Please enter the OTP sent to <br />
                                        <span className="font-bold text-[var(--color-text)]">
                                            {isInitialEmail ? formatPhoneNumber(phoneNumberInput) : email}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setOtpModalOpen(false)}
                                            className="ml-1.5 font-bold text-emerald-600 hover:underline"
                                        >
                                            Change details
                                        </button>
                                    </p>
                                </div>

                                <form onSubmit={handleConfirmModalOtp} noValidate className="space-y-4">
                                    {/* Modal OTP Boxes */}
                                    <motion.div
                                        className="flex justify-center gap-2 sm:gap-2.5"
                                        onPaste={(e) => handleOtpPaste(e, "modal")}
                                        animate={modalOtpInvalid ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                                        transition={{ duration: 0.42 }}
                                    >
                                        {modalOtp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={modalOtpRefs.current[i]}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value, "modal")}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e, "modal")}
                                                disabled={isVerifyingModalOtp}
                                                className={`h-11 w-10 rounded-xl border-2 text-center text-lg font-bold transition outline-none sm:h-12 sm:w-11
                                                    ${modalOtpInvalid
                                                        ? "border-red-400 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                                                        : digit
                                                        ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-emerald-50/30 focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                                        : "border-zinc-200 bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:bg-emerald-50/30 focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                                    }`}
                                            />
                                        ))}
                                    </motion.div>

                                    <button
                                        type="submit"
                                        disabled={!isModalOtpComplete || isVerifyingModalOtp}
                                        className={`w-full rounded-xl py-3 text-[14px] font-bold text-white transition active:scale-[0.98]
                                            ${isModalOtpComplete && !isVerifyingModalOtp
                                                ? "bg-[var(--color-primary)] shadow-[0_4px_16px_-4px_rgba(0,153,102,0.45)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                                                : "bg-zinc-300 cursor-not-allowed opacity-80"
                                            }`}
                                    >
                                        {isVerifyingModalOtp ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                                Confirming...
                                            </>
                                        ) : (
                                            "Confirm OTP"
                                        )}
                                    </button>
                                </form>

                                {/* Resend timer for modal */}
                                <div className="mt-5 text-center text-[13px] font-bold text-[var(--color-text-subtle)]">
                                    {modalTimer > 0 ? (
                                        <span>Resend OTP in {modalTimer}s</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleTriggerVerificationModal}
                                            className="text-[var(--color-primary)] hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Terms and conditions link */}
                <p className="mt-6 text-center text-[12px] font-medium leading-snug text-[var(--color-text-subtle)]">
                    By continuing, you agree to our{" "}
                    <Link to="/terms-and-conditions" className="font-bold text-[var(--color-primary)] hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="font-bold text-[var(--color-primary)] hover:underline">Privacy Policy</Link>.
                </p>
            </div>
        </AuthLayout>
    );
};

export default AuthPage;
