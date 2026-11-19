import React from 'react';

const Button = ({ children, onClick, variant = 'primary', isActive = false, className = '', disabled = false, type = 'button' }) => {
    const baseClass = 'inline-flex items-center justify-center py-4 px-6 text-[16px] font-medium rounded-full border-none cursor-pointer transition-all w-full tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] focus-visible:ring-offset-2';

    const variantClass = variant === 'primary'
        ? (isActive
            ? 'bg-[var(--dash-primary-700)] text-white hover:bg-[var(--dash-primary-800)] active:bg-[var(--dash-primary-900)] active:scale-[0.98] shadow-[var(--shadow-sm)]'
            : 'bg-[var(--dash-border)] text-[var(--dash-text-secondary)] cursor-not-allowed')
        : 'bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text)] hover:border-[var(--dash-primary-700)]/40 hover:bg-[var(--dash-active-bg)] active:scale-[0.98]';

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
