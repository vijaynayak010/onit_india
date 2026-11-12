import React from "react";
import { ChevronRight } from "lucide-react";

export const AccountHubProfileCard = ({ avatar, name, subtitle, onClick }) => (
  <section className="space-y-3">
    <h2 className="px-1 text-sm font-medium text-gray-900">Profile</h2>
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-emerald-100 hover:shadow-md"
    >
      <img
        src={avatar}
        alt={name}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gray-50"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-gray-900">{name}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-gray-300" strokeWidth={2} />
    </button>
  </section>
);

export const AccountHubSection = ({ title, children, className = "" }) => (
  <section className={`space-y-3 ${className}`}>
    <h2 className="px-1 text-sm font-medium text-gray-900">{title}</h2>
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {children}
    </div>
  </section>
);

export const AccountHubItem = ({ icon: Icon, label, sublabel, onClick, iconBg = "bg-emerald-50", iconColor = "text-emerald-600" }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center justify-between gap-3 border-b border-gray-50 px-4 py-3.5 text-left last:border-b-0 hover:bg-gray-50/80"
  >
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={16} className={iconColor} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-gray-800">{label}</p>
        {sublabel ? (
          <p className="truncate text-[11px] font-medium text-gray-400">{sublabel}</p>
        ) : null}
      </div>
    </div>
    <ChevronRight
      size={16}
      className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-400"
    />
  </button>
);

const AccountHubLayout = ({ profileCard, sections }) => (
  <div className="w-full space-y-8 pb-8">
    {profileCard}

    {sections.row2 ? (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {sections.row2.map((section) => (
          <AccountHubSection key={section.title} title={section.title}>
            {section.items}
          </AccountHubSection>
        ))}
      </div>
    ) : null}

    {sections.row3?.length ? (
      <div className={`grid grid-cols-1 gap-6 ${sections.row3.length > 1 ? "lg:grid-cols-5" : ""}`}>
        {sections.row3.map((section, idx) => (
          <AccountHubSection
            key={section.title}
            title={section.title}
            className={sections.row3.length > 1 ? (idx === 0 ? "lg:col-span-3" : "lg:col-span-2") : ""}
          >
            {section.items}
          </AccountHubSection>
        ))}
      </div>
    ) : null}
  </div>
);

export default AccountHubLayout;
