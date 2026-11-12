import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
const gmailImage = "/assets/gmail.png";

const CheckEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve the email passed from the previous page, or a fallback if navigated directly
    const email = location.state?.emailOrPhone || 'name@example.com.';

    const handleBackToLogin = () => {
        navigate('/auth', { state: { authMode: 'signin' } });
    };

    const handleResendLink = (e) => {
        e.preventDefault();
        console.log('Resending link to:', email);
    };

    return (
        <AuthLayout illustrationSrc={gmailImage}>
            <div className="w-full max-w-[450px] bg-white border border-[#86efac] rounded-[2rem] p-8 sm:p-12 shadow-[0_0_15px_rgba(22,163,74,0.05)]">

                <h2 className="text-[26px] font-medium text-center text-gray-900 mb-6">
                    Check your email
                </h2>

                <p className="text-center text-[14px] text-gray-800 font-medium mb-4">
                    We've sent a password reset link to
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/provider/change-password')}
                    className="text-center text-[14px] font-bold text-[#16a34a] mb-8 bg-transparent border-none p-0 cursor-pointer hover:underline mx-auto block"
                >
                    {email}
                </button>

                <p className="text-center text-[13px] text-gray-700 font-medium mb-8 leading-relaxed px-4">
                    Please check your inbox and follow the<br />instructions to reset your password.
                </p>

                <div className="w-full max-w-[85%] mx-auto mb-4">
                    <Button
                        type="button"
                        onClick={handleBackToLogin}
                        isActive={true}
                    >
                        Back To Login
                    </Button>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendLink}
                        className="text-[12px] font-bold text-[#16a34a] hover:text-green-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                    >
                        Resend Link
                    </button>
                </div>

            </div>
        </AuthLayout>
    );
};

export default CheckEmailPage;
