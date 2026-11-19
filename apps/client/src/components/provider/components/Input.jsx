import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', placeholder, value, onChange, onBlur, id, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex flex-col gap-2 w-full text-left items-start">
            {label && <label htmlFor={id} className="text-[13px] font-semibold text-[var(--dash-text)]">{label}</label>}
            <div className="relative flex items-center w-full">
                <input
                    id={id}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    aria-invalid={Boolean(error) || undefined}
                    className={`w-full rounded-xl border bg-[var(--dash-surface)] px-4 py-3 text-[14px] font-medium text-[var(--dash-text)] outline-none transition-all placeholder:text-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--dash-primary-700)]/20 ${error
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-[var(--dash-border)] focus:border-[var(--dash-primary-700)]"
                        }`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)]"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                )}
            </div>
            {error && (
                <span role="alert" className="text-rose-600 text-[12px] font-medium mt-[-2px] ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
