import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', placeholder, value, onChange, onBlur, id, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex flex-col gap-2 w-full text-left items-start">
            {label && <label htmlFor={id} className="text-[13px] font-bold text-[var(--color-text)]">{label}</label>}
            <div className="relative flex items-center w-full">
                <input
                    id={id}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={`w-full rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-4 py-3.5 text-[14px] font-semibold text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-subtle)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${error
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                        }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                {isPassword && (
                    <div
                        className="absolute right-4 text-gray-400 cursor-pointer flex items-center justify-center hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-red-500 text-[12px] font-medium mt-[-2px] ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
