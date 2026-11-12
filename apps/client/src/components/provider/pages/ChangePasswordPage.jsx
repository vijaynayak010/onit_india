import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
const changePassImage = "/assets/chnage_pass.png";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = (e) => {
        e.preventDefault();
        console.log('Changing password...');
        // In a real app, this would submit the new password
        navigate('/provider/welcome', { state: { authMode: 'signin' } });
    };

    // Very basic validation - just check they aren't empty for now
    const isValid = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

    return (
        <AuthLayout illustrationSrc={changePassImage}>
            <div className="w-full max-w-[420px] bg-white border border-[#86efac] rounded-[2rem] p-8 sm:p-10 shadow-[0_0_15px_rgba(22,163,74,0.05)]">

                <h2 className="text-[22px] font-medium text-center text-gray-900 mb-8 mt-2">
                    Change Password
                </h2>

                <form onSubmit={handleChangePassword} className="flex flex-col w-full gap-5">

                    <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-medium text-gray-700 ml-1">New Password</label>
                        <Input
                            id="new-password-input"
                            type="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-[12px] font-medium text-gray-700 ml-1">Confirm Password</label>
                        <Input
                            id="confirm-password-input"
                            type="password"
                            placeholder="Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="w-full max-w-[90%] mx-auto mt-2 mb-2">
                        <Button
                            type="submit"
                            isActive={isValid}
                            disabled={!isValid}
                        >
                            Change Password
                        </Button>
                    </div>

                    <div className="text-center mt-1">
                        <button
                            type="button"
                            onClick={() => navigate('/provider/forgot-password')}
                            className="text-[12px] font-bold text-[#16a34a] hover:text-green-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                            Forget Password ?
                        </button>
                    </div>

                </form>

            </div>
        </AuthLayout>
    );
};

export default ChangePasswordPage;
