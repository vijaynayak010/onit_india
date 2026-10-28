import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuth0 } from '@auth0/auth0-react';
import { Shield, User, Lock, ArrowRight, Loader, Info, ExternalLink } from 'lucide-react';
import { markAdminAuthFlowStarted } from '../utils/adminAuthFlow';
import { getAuth0ScopeWithOfflineAccess } from '../utils/auth0Scope';

const Login = () => {
    const { login, isAuthenticated: isLocalAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        loginWithRedirect,
        isAuthenticated: isAuth0Authenticated,
        isLoading: isAuth0Loading,
        getAccessTokenSilently
    } = useAuth0();
    const from = location.state?.from?.pathname || '/';
    const forceLogin = Boolean(location.state?.forceLogin);
    const auth0DatabaseConnection =
        import.meta.env.VITE_AUTH0_DATABASE_CONNECTION || 'Username-Password-Authentication';

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forcefully redirect if already authenticated via Auth0
    useEffect(() => {
        if (isAuth0Authenticated && !isAuth0Loading && !forceLogin) {
            const targetRedirect = localStorage.getItem('admin_auth_redirect_return_to') || '/';
            localStorage.removeItem('admin_auth_redirect_return_to');
            navigate(targetRedirect === '/login' ? '/' : targetRedirect, { replace: true });
        }
    }, [forceLogin, isAuth0Authenticated, isAuth0Loading, navigate]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        // Store target route to preserve original destination across full-page Auth0 redirection
        localStorage.setItem('admin_auth_redirect_return_to', from);
        markAdminAuthFlowStarted();

        try {
            await loginWithRedirect({
                appState: { returnTo: '/dashboard' },
                authorizationParams: {
                    connection: auth0DatabaseConnection,
                    prompt: 'login',
                    redirect_uri: window.location.origin + '/login',
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: getAuth0ScopeWithOfflineAccess(),
                }
            });
        } catch (err) {
            console.error("Auth0 Redirect Failed:", err);
            setError('Could not start login process. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
            <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 transform rotate-3">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Admin Portal</h1>
                        <p className="text-slate-500 font-medium italic italic">Identity Verification Required</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl shadow-slate-200/50 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                            <p className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="text-center space-y-4">
                        <p className="text-[11px] text-slate-500 font-medium px-4">
                            Authentication will now proceed via **Auth0 Secure Gateway**. You will be redirected briefly to sign in.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading || isAuth0Loading}
                        className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] group"
                    >
                        {loading || isAuth0Loading ? (
                            <Loader size={20} className="animate-spin" />
                        ) : (
                            <>
                                <span>AUTHORIZE & ENTER</span>
                                <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="pt-4 text-center border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-relaxed opacity-50">
                            Official Authorization Required.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
