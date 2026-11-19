import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  FileText,
  Shield,
  RotateCcw,
  ChevronRight,
  Trash2,
  SwitchCamera,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

const SettingRowNav = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between gap-4 border-b border-[var(--color-border)]/70 py-4 text-left last:border-0 hover:bg-[var(--color-primary-subtle)]/30"
  >
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-sm font-bold text-[var(--color-text)]">{label}</span>
    </div>
    <ChevronRight size={18} className="shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2} />
  </button>
);

const SettingRowDanger = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between gap-4 border-b border-[var(--color-border)]/70 py-4 text-left last:border-0 hover:bg-rose-50 group"
  >
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-100">
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-sm font-bold text-rose-600">{label}</span>
    </div>
    <ChevronRight size={18} className="shrink-0 text-rose-300 group-hover:text-rose-500" strokeWidth={2} />
  </button>
);

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="px-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">{title}</h2>
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
      <div className="px-2">{children}</div>
    </div>
  </section>
);

const SettingsView = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <Section title="ACCOUNT ACTIONS">
            <SettingRowNav
              icon={SwitchCamera}
              label="Switch to Performer Account"
              onClick={() => navigate("/provider/switch-to-performer")}
            />
            <SettingRowDanger icon={LogOut} label="Sign Out" onClick={handleLogout} />
            <SettingRowDanger
              icon={Trash2}
              label="Delete Account"
              onClick={() => navigate("/provider/delete-account")}
            />
          </Section>
        </div>

        <div className="space-y-8">
          <Section title="SUPPORT">
            <SettingRowNav icon={HelpCircle} label="Help Center" onClick={() => navigate("/help")} />
            <SettingRowNav icon={Shield} label="Privacy Policy" onClick={() => navigate("/privacy-policy")} />
            <SettingRowNav icon={FileText} label="Terms & Conditions" onClick={() => navigate("/terms-and-conditions")} />
            <SettingRowNav icon={RotateCcw} label="Refund Policy" onClick={() => navigate("/refund-policy")} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
