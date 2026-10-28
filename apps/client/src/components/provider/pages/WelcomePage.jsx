import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const loginAfterImage = "/assets/login_after.png";

const WelcomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isSignin = location.state?.authMode === 'signin';

    useEffect(() => {
        const role = String(user?.role || '').toUpperCase();
        // Only auto-redirect if we already know the role
        if (!role || role === 'PENDING') return;
        const timer = setTimeout(() => {
            if (role === 'TASKER' || role === 'PERFORMER') {
                navigate('/performer/dashboard', { replace: true });
            } else {
                navigate('/provider/dashboard', { replace: true });
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate, user?.role]);

    const displayName =
        user?.displayName ||
        user?.name ||
        user?.username ||
        user?.taskers?.displayName ||
        (user?.email ? user.email.split("@")[0] : null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 font-sans p-4">
            <h1 className="text-[2.5rem] font-bold text-black mb-2">
                {isSignin ? "Welcome Back!" : "Welcome to OnIT India!"}
            </h1>
            {displayName ? (
                <p className="mb-6 text-lg font-semibold text-zinc-600">{displayName}</p>
            ) : null}
            <img
                src={loginAfterImage}
                alt="Welcome"
                className="w-full max-w-[400px] h-auto object-contain"
            />
            <p className="mt-6 text-sm text-zinc-500">Redirecting to your dashboard…</p>
        </div>
    );
};

export default WelcomePage;
