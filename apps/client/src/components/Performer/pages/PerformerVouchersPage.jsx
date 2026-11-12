import React from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, ChevronRight, ArrowRight } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";

const PerformerVouchersPage = () => {
  const navigate = useNavigate();
  const stats = [
    {
      label: "Active vouchers",
      value: "0",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      tone: "emerald",
    },
    {
      label: "Total savings",
      value: "₹0",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tone: "sky",
    },
    {
      label: "Used this month",
      value: "0",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      tone: "violet",
    },
    {
      label: "Expiring soon",
      value: "0",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tone: "amber",
    },
  ];

  const statTone = {
    emerald: "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] ring-[var(--color-primary)]/20",
    sky: "bg-sky-50 text-sky-600 ring-sky-200/70",
    violet: "bg-violet-50 text-violet-700 ring-violet-200/70",
    amber: "bg-amber-50 text-amber-700 ring-amber-200/70",
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-6xl pb-12">
          <PerformerPageHeader
            title="My vouchers"
            subtitle="Manage discount codes and special offers applied to your tasks"
            backTo="/performer/account"
            actions={
              <div className="relative shrink-0">
                <div className="absolute -left-2 -top-3 z-10 rotate-[-12deg] rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 shadow-sm">Active</div>
                <img src="https://cdn-icons-png.flaticon.com/512/8313/8313360.png" className="h-14 w-14 object-contain sm:h-16 sm:w-16" alt="Vouchers and rewards icon" />
              </div>
            }
          />

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${statTone[stat.tone]}`}>{stat.icon}</div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">{stat.label}</p>
              <p className="mt-1 text-2xl font-medium tabular-nums tracking-tight text-[var(--color-text)] sm:text-[28px]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Clean Empty State */}
        <div className="flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)] bg-[var(--color-surface-elevated)]/50 p-12 sm:p-16 text-center shadow-[var(--shadow-sm)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-6 shadow-inner animate-pulse">
            <Ticket size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-[var(--color-text)] mb-2">No Vouchers Found</h2>
          <p className="text-sm font-semibold text-[var(--color-text-muted)] max-w-sm leading-relaxed mb-8">
            You don't have any vouchers, coupon codes, or active tasker rewards at the moment. Complete client bookings to unlock exclusive promotions!
          </p>
          <button
            type="button"
            onClick={() => navigate("/performer/dashboard")}
            className="flex items-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
          >
            Explore Available Tasks
            <ArrowRight size={16} />
          </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformerVouchersPage;
