import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader, ShieldCheck, TriangleAlert } from 'lucide-react';
import { verifyAdminGoogleAccount } from '../services/api';
import {
    getAdminGoogleProfile,
    isAdminGoogleVerified,
    storeAdminGoogleVerification,
} from '../utils/adminGoogleVerification';
import { clearAdminAuthFlowStarted } from '../utils/adminAuthFlow';
import { clearAdminFeatureAccessCache } from '../hooks/useAdminFeatureAccess';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const loadGoogleIdentityScript = () =>
    new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
        if (existingScript) {
            existingScript.addEventListener('load', resolve, { once: true });
            existingScript.addEventListener('error', reject, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = GOOGLE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

const AdminGoogleAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buttonRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const clientId = import.meta.env.VITE_ADMIN_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (isAdminGoogleVerified()) {
            navigate(localStorage.getItem('admin_google_redirect_return_to') || '/dashboard', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (!clientId) {
            setError('Google admin client is not configured.');
            return;
        }

        let cancelled = false;

        const initializeGoogle = async () => {
            try {
                await loadGoogleIdentityScript();
                if (cancelled || !buttonRef.current) return;

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: async (response) => {
                        setStatus('verifying');
                        setError('');

                        try {
                            const verification = await verifyAdminGoogleAccount(response.credential);
                            storeAdminGoogleVerification(verification);
                            clearAdminAuthFlowStarted();
                            clearAdminFeatureAccessCache();
                            setStatus('verified');

                            const target =
                                localStorage.getItem('admin_google_redirect_return_to') ||
                                location.state?.from?.pathname ||
                                '/dashboard';
                            localStorage.removeItem('admin_google_redirect_return_to');

                            setTimeout(() => navigate(target, { replace: true }), 250);
                        } catch (err) {
                            setStatus('idle');
                            setError(err.message || 'Google verification failed.');
                        }
                    },
                });

                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    type: 'standard',
                    shape: 'pill',
                    text: 'continue_with',
                    width: 320,
                });
            } catch {
                if (!cancelled) {
                    setError('Could not load Google authentication.');
                }
            }
        };

        initializeGoogle();

        return () => {
            cancelled = true;
        };
    }, [clientId, location.state?.from?.pathname, navigate]);

    const profile = getAdminGoogleProfile();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck size={30} />
                    </div>
                    <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
                        Google Verification
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Confirm your Google account to continue into the admin portal.
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    {profile?.googleEmail && (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                                    Last Verified
                                </p>
                                <p className="text-sm font-bold text-slate-800">{profile.googleEmail}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-3">
                            <TriangleAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-semibold text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="min-h-[48px] flex items-center justify-center">
                        {status === 'verifying' ? (
                            <div className="flex items-center gap-3 text-slate-700 font-bold">
                                <Loader size={20} className="animate-spin" />
                                Verifying Google account...
                            </div>
                        ) : status === 'verified' ? (
                            <div className="flex items-center gap-3 text-emerald-700 font-bold">
                                <CheckCircle2 size={20} />
                                Verified
                            </div>
                        ) : (
                            <div ref={buttonRef} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGoogleAuth;
