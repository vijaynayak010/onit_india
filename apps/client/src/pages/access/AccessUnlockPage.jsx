import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AccessUnlockPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Set the unique hidden key in localStorage
        const ACCESS_KEY = 'onit_dev_access_2026';
        localStorage.setItem(ACCESS_KEY, 'granted');

        // Capture the redirect path
        const targetPath = location.pathname.replace('/dev', '') || '/';

        // Faster redirect
        const timer = setTimeout(() => {
            navigate(targetPath);
        }, 800);

        return () => clearTimeout(timer);
    }, [navigate, location]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
            <div className="flex flex-col items-center p-12 bg-gray-50 rounded-[40px] border border-gray-100 shadow-2xl">
                <div className="w-16 h-16 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white text-[32px] mb-8 animate-bounce">
                    🛡️
                </div>
                <h1 className="text-[24px] font-medium text-gray-900 mb-2">Access Granted</h1>
                <p className="text-[14px] font-bold text-gray-400">Developer proxy unlocked. Redirecting...</p>

                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#16a34a]/60 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-[#16a34a]/30 animate-pulse delay-150"></div>
                </div>
            </div>
        </div>
    );
};

export default AccessUnlockPage;
