import React from "react";

const Toggle = ({ options = [], activeOption, onChange }) => {
    return (
        <div
            className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-border-subtle)]/60 p-1 shadow-[var(--shadow-xs)]"
            role="tablist"
            aria-label="Sign up or sign in"
        >
            {options.map((option, index) => (
                <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={activeOption === option.value}
                    className={`rounded-full px-6 py-2.5 text-[15px] font-medium transition-all select-none sm:px-9 ${
                        activeOption === option.value
                            ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default Toggle;
