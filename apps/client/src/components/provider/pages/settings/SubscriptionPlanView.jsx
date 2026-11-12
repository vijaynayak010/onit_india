import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

const SubscriptionPlanView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const planLabel = user?.subscriptionPlan || user?.plan || "Pro Plan";

  const features = [
    "Priority task matching",
    "Advanced provider insights",
    "Unlimited saved templates",
    "Premium support",
  ];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--color-border)] bg-gradient-to-br from-orange-50 to-white px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Crown size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Current plan</p>
              <h3 className="text-2xl font-medium text-[var(--color-text)]">{planLabel}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">{feature}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-border)] px-6 py-5">
          <button
            type="button"
            onClick={() => navigate("/provider/pricing")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            View all plans
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanView;
