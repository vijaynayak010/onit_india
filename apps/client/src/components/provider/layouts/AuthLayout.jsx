import React from "react";
import { Sparkles, ShieldCheck, Zap, IndianRupee } from "lucide-react";

const AuthLayout = ({ children, illustrationSrc }) => {
    return (
        <div className="box-border flex min-h-screen w-full overflow-x-hidden bg-[var(--color-surface)] font-sans text-[var(--color-text)] antialiased">
            {/* Left: brand + framed illustration — scrolls if viewport is short (no clipping) */}
            <div className="relative hidden w-[42%] min-w-[320px] max-w-[520px] shrink-0 flex-col border-r border-[var(--color-border)]/70 bg-gradient-to-b from-[var(--color-primary-subtle)]/30 via-white to-[var(--color-surface)] md:flex lg:max-w-[560px] lg:w-[44%]">
                <div
                    className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-[var(--color-surface)] to-transparent"
                    aria-hidden
                />

                <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-[0.28]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)`,
                            backgroundSize: "24px 24px",
                        }}
                    />
                    <div className="absolute -left-16 top-[12%] h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
                    <div className="absolute bottom-[8%] -right-8 h-56 w-56 rounded-full bg-emerald-400/12 blur-3xl" />
                </div>

                <div className="relative z-10 flex min-h-screen flex-col px-7 py-9 lg:px-9 lg:py-11">
                    <header className="shrink-0">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/22 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] shadow-[var(--shadow-xs)]">
                            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                            FirstDoer
                        </p>
                        <h2 className="mt-4 max-w-[22ch] text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-[1.2] tracking-tight text-[var(--color-text)]">
                            India&apos;s task execution workspace
                        </h2>
                        <p className="mt-2.5 max-w-sm text-[13px] font-medium leading-relaxed text-[var(--color-text-muted)] lg:text-[14px]">
                            Hire experts or earn on your terms — one account, clear roles, secure access.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {[
                                { icon: ShieldCheck, label: "Trusted sign-in" },
                                { icon: Zap, label: "Fast matching" },
                                { icon: IndianRupee, label: "INR-ready" },
                            ].map(({ icon: Icon, label }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[var(--color-text)] shadow-[var(--shadow-xs)]"
                                >
                                    <Icon className="h-3 w-3 text-[var(--color-primary)]" strokeWidth={2.5} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Illustration: fixed max height so it never pushes off-screen or gets clipped */}
                    <div className="mt-8 flex w-full flex-1 flex-col items-center justify-center lg:mt-10">
                        <div className="relative w-full max-w-[360px]">
                            <div
                                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[88%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)]/18 to-teal-200/10 opacity-90 blur-2xl"
                                aria-hidden
                            />

                            <div className="relative z-10 overflow-hidden rounded-2xl border border-white/95 bg-gradient-to-b from-white to-[var(--color-primary-subtle)]/20 p-[3px] shadow-[0_20px_50px_-14px_rgba(16,96,95,0.2)] ring-1 ring-[var(--color-primary)]/10">
                                <div className="flex items-center gap-1.5 rounded-t-[0.85rem] bg-[var(--color-border-subtle)]/90 px-2.5 py-1.5">
                                    <span className="h-2 w-2 rounded-full bg-red-400/95" />
                                    <span className="h-2 w-2 rounded-full bg-amber-400/95" />
                                    <span className="h-2 w-2 rounded-full bg-teal-500/85" />
                                    <span className="ml-1.5 min-w-0 flex-1 truncate rounded bg-white/95 px-2 py-0.5 text-center text-[9px] font-semibold text-[var(--color-text-subtle)]">
                                        firstdoer.com
                                    </span>
                                </div>
                                <div className="relative rounded-b-[0.8rem] bg-gradient-to-b from-[var(--color-primary-subtle)]/25 to-white px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
                                    <div className="pointer-events-none absolute right-2 top-2 h-12 w-12 rounded-full bg-[var(--color-primary)]/10 blur-xl" aria-hidden />
                                    {illustrationSrc ? (
                                        <div className="flex h-[min(280px,32vh)] w-full items-center justify-center sm:h-[min(300px,34vh)] lg:h-[min(320px,36vh)]">
                                            <img
                                                src={illustrationSrc}
                                                alt="Professionals collaborating in a secure FirstDoer workspace"
                                                className="max-h-full w-full max-w-[300px] object-contain object-center drop-shadow-[0_8px_32px_rgba(16,96,95,0.1)]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-white/70 text-xs font-medium text-[var(--color-text-muted)]">
                                            Illustration
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="mt-4 text-center text-[11px] font-semibold leading-snug text-[var(--color-text-subtle)]">
                                Secure workspace for providers & performers
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: form — wider panel so more fits without scrolling */}
            <div className="flex min-h-screen flex-1 flex-col justify-start bg-[var(--color-surface)] px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
                <div className="mx-auto flex w-full max-w-[540px] flex-col lg:max-w-[640px] xl:max-w-[720px]">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
