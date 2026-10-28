import React from 'react';

const Button = ({ children, onClick, variant = 'primary', isActive = false, className = '', disabled = false, type = 'button' }) => {
    const baseClass = 'inline-flex items-center justify-center py-4 px-6 text-[18px] font-bold rounded-[2rem] border-none cursor-pointer transition-all w-full tracking-wide focus:outline-none focus:ring-0';

    // If active use solid green. If not active use gray.
    const variantClass = variant === 'primary'
        ? (isActive ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.98] shadow-[var(--shadow-sm)]' : 'bg-[var(--color-border)] text-white cursor-not-allowed')
        : 'bg-transparent border border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary-subtle)] active:scale-[0.98]';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
