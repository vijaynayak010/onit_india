# FirstDoer — Design System Audit & Token Reference

> **Visual Reference:** `apps/client/src/index.css`, `apps/client/src/components/landing/Landingpage.jsx`, `apps/client/src/components/landing/firstdoer.css`.

---

## 1. Canonical Design Tokens (`apps/client/src/index.css`)

- **Typography:** `"Poppins", ui-sans-serif, system-ui, sans-serif` (`--font-sans`, `--font-heading`, `--font-display`), loaded via Google Fonts (`400, 500, 600, 700, 800`).
  - Fluid scale: `.text-fluid-h1` (`clamp(1.875rem, 1.25rem + 2.5vw, 3rem)`), `.text-fluid-h2`, `.text-fluid-h3`, `.text-fluid-body`, `.dash-kpi` (`tabular-nums`).
- **Brand Palette:**
  - Primary: `#10605F` (`--color-primary`, `--dash-primary-800`)
  - Primary Hover / Deep: `#083B3A` (`--color-primary-hover`, `--dash-primary-900`), `#032120` (`--dash-primary-950`)
  - Primary Accent / Mint: `#29ADAC` (`--color-primary-accent`, `--dash-primary-600`), `#7EDEDD` (`--color-primary-glow`, `--dash-primary-400`)
  - Primary Muted / Subtle: `#EFFBFB`, `#DFF7F6`, `#EDF9FA` (`--dash-active-bg`)
- **Neutrals & Surfaces:**
  - Surface / Canvas: `#F9FAFA` (`--color-surface`), `#F5FAFA` (`--dash-canvas`), `#FFFFFF` (`--color-surface-elevated`, `--dash-surface`)
  - Text: `#0D1210` (`--color-text`), `#172B2B` (`--dash-text`), `#3F4A47` (`--color-text-muted`), `#647575` (`--dash-text-secondary`)
  - Borders: `#E4E7E6` (`--color-border`), `#E5EEEE` (`--dash-border`), `#C6F0F0` (`--color-border-subtle`)
- **Radii & Shadows:**
  - Radii: `--radius-sm` (`0.5rem`), `--radius-md` (`0.75rem`), `--radius-lg` (`1rem`), `--radius-xl` (`1.25rem`), `--radius-2xl` (`1.5rem`), `--radius-full` (`9999px`).
  - Shadows: `--shadow-xs` through `--shadow-xl` + `--shadow-glow` (teal ambience `rgba(0, 20, 13, 0.04–0.08)`).

---

## 2. Inconsistencies Between Landing, Provider & Performer

| Dimension | Landing Reference | Provider Portal | Performer Portal | Audit Finding |
|---|---|---|---|---|
| **Navigation Shell** | Top floating pill navbar | Top-only fixed `ProviderHeader` (except `SettingsPage` which adds `ProviderSettingsSidebar`) | Fixed `PerformerHeader` + persistent `240px` left `<aside>` on `lg+` | **Inconsistent shell**; Performer pages hardcode `lg:ml-[220px]` causing a 20px overlap |
| **Active Nav Highlight** | `#F1F3F3` pill | `--dash-primary-700` bottom border in header; `#d3f6e1` bright green in `ProviderSettingsSidebar` | `--dash-active-bg` (`#EDF9FA`) + `--dash-primary-700` (`#1B8887`) | `ProviderSettingsSidebar` & `AccountFlatNav` (`#2BA960` / `#E8F5EE`) use legacy emerald instead of `#10605F` teal |
| **Card Borders & Radii** | `.gloss` (`#C6F0F0` border, subtle teal gradient) | Mix of `rounded-2xl`, `rounded-3xl`, `rounded-[2rem]`, `#ccf2d9` (`BoostTaskPage`) | Mix of `rounded-2xl`, `rounded-[14px]` (`PerformerNotificationsPage`), `border-slate-200/80` | Needs standardization on `rounded-2xl` + `var(--dash-border)` |
| **Feedback / Alerts** | Inline UI states | Heavy use of native `window.alert()` / `window.confirm()` | Heavy use of native `window.alert()` / `window.confirm()` | Replace with `shared/Toast.jsx` & accessible modal dialogs |
| **Profile Avatar** | Clean initials / photo | `Gravatar` fallback `<img>` in `ProviderHeader` | Empty teal circle `<span className="h-6 w-6 rounded-full bg-[var(--color-primary)]" />` in `PerformerHeader` | Performer header pill should render initials or avatar image |
| **Max Content Width** | `max-w-[1440px]` / `max-w-7xl` | `max-w-[1440px]` (`DashboardPage`), `max-w-7xl`, `max-w-3xl` | `max-w-[1440px]` (`DashboardShell`), `max-w-4xl`, `max-w-5xl`, `max-w-6xl` | Standardize on `DashboardShell` (`1440px`) for dashboards, `max-w-5xl` for account/settings |
