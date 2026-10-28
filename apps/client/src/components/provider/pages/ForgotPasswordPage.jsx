import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
const forgotPassImage = "/assets/forgot_pass.png";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [emailOrPhone, setEmailOrPhone] = useState('');

    const handleSendLink = (e) => {
        e.preventDefault();
        console.log('Sending reset link to:', emailOrPhone);
        navigate('/provider/check-email', { state: { emailOrPhone } });
    };

    const isValid = emailOrPhone.length > 0;

    return (
        <AuthLayout illustrationSrc={forgotPassImage}>
            <div className="w-full max-w-[400px] bg-white border border-[#86efac] rounded-[2rem] p-8 shadow-[0_0_15px_rgba(22,163,74,0.05)]">

                <h2 className="text-[24px] font-bold text-center text-gray-900 mb-4">
                    Forgot your password
                </h2>

                <p className="text-center text-[13px] text-gray-800 font-medium mb-8 leading-relaxed">
                    Please enter the email address you'd like<br />your password reset information sent to
                </p>

                <form onSubmit={handleSendLink} className="flex flex-col items-center w-full gap-5">

                    <Input
                        id="reset-contact-input"
                        label="Email or Phone"
                        placeholder="Name"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                    />

                    <div className="w-full max-w-[85%] mx-auto mt-2">
                        <Button
                            type="submit"
                            isActive={isValid}
                            disabled={!isValid}
                        >
                            Sent Link
                        </Button>
                    </div>

                    <div className="mt-2 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/auth', { state: { authMode: 'signin' } })}
                            className="text-[13px] font-bold text-[#16a34a] hover:text-green-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                            Back To Login
                        </button>
                    </div>

                </form>

            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
