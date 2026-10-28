# ONIT INDIA — PERFORMER SETTINGS: REMOVAL OF NOTIFICATIONS & PREFERENCES PLAN

**Target File:** [`apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx)  
**Route:** `/performer/settings`  
**Reference Design:** Unified Dedicated Page Standard (`PerformerPageHeader`, unified glassmorphism, responsive container)  
**Date:** October 2026  
**Status:** Completed & Autonomous Browser Verified (0 Build Errors)  

---

## 1. Executive Summary & Rationale

The user requested the deletion of the **`Notifications & Preferences`** section from `/performer/settings`.

### Why This Simplification Makes Sense:
1. **Dedicated Notifications Page Exists**: Notifications are already fully handled by the dedicated Notifications page at [`/performer/notifications`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerNotificationsPage.jsx), which is directly linked from the Account Hub under **Account → Notifications**.
2. **Eliminates Local Mock State**: The toggles (push notifications, email summaries, sound effects, smart task matching) were client-side switches stored in `localStorage` rather than server-backed preference APIs. Removing them prevents user confusion regarding whether preferences sync across devices.
3. **Streamlined Information Architecture**: With `Notifications & Preferences` removed, Settings becomes laser-focused on **Security, Verification, Support, and Account Lifecycle Controls**.

---

## 2. Updated Layout & Architecture Model

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  PerformerPageHeader: "Settings"                                                      │
│  Subtitle: "Security, support, and account controls — all in one place"                │
│  [← Back to Account Hub]                                                              │
├──────────────────────────────────────┬─────────────────────────────────────────────────┤
│  LEFT COLUMN (Account & Verification)│  RIGHT COLUMN (Core Settings Categories)        │
│                                      │                                                 │
│  1. Profile Summary Card             │  1. SECURITY & AUTHENTICATION                   │
│     - Avatar, Name, Email            │     - Change Password (→ /change-password)      │
│     - Active Performer badge         │     - Two-Factor Auth (→ /two-factor-auth)      │
│     - "Edit Public Profile" link     │                                                 │
│                                      │  2. SUPPORT & POLICIES                          │
│  2. Account Verification Card        │     - Help Center & FAQs (→ /help)              │
│     - KYC Status Badge               │     - Privacy Policy (→ /privacy-policy)        │
│     - Payout limits & benefits note  │     - Terms of Service (→ /terms-and-conditions)│
│     - "Manage Verification" CTA      │                                                 │
│                                      │  3. ACCOUNT ACTIONS (DANGER ZONE)               │
│                                      │     - Switch to Provider Account                │
│                                      │     - Sign Out (Session logout)                 │
│                                      │     - Delete Account (→ /delete-account)        │
└──────────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. Sections to Remove vs. Final Sections Kept

| Category | Item | Action | Detail / Target Route |
|---|---|---|---|
| **PREFERENCES** | Push Notifications | **DELETE** | Removed from settings. |
| **PREFERENCES** | Email Summaries | **DELETE** | Removed from settings. |
| **PREFERENCES** | Smart Task Matching | **DELETE** | Removed from settings. |
| **PREFERENCES** | Sound & Haptic Feedback | **DELETE** | Removed from settings. |
| **SECURITY** | Change Password | **KEEP** | Routes to `/performer/change-password` with `{ state: { from: "/performer/settings" } }`. |
| **SECURITY** | Two-Factor Auth (2FA) | **KEEP** | Routes to `/performer/two-factor-auth` with `{ state: { from: "/performer/settings" } }`. |
| **SUPPORT** | Help Center & FAQs | **KEEP** | Routes to `/help`. |
| **SUPPORT** | Privacy Policy | **KEEP** | Routes to `/privacy-policy`. |
| **SUPPORT** | Terms of Service | **KEEP** | Routes to `/terms-and-conditions`. |
| **ACCOUNT** | Profile Summary Card | **KEEP** | Direct shortcut to `/performer/profile`. |
| **ACCOUNT** | KYC Verification Card | **KEEP** | Status badge and CTA to `/performer/kyc`. |
| **ACTIONS** | Switch to Provider | **KEEP** | Routes to `/performer/switch-to-provider`. |
| **ACTIONS** | Sign Out | **KEEP** | Authenticated logout via `logout()`. |
| **ACTIONS** | Delete Account | **KEEP** | Routes to `/performer/delete-account`. |

---

## 4. Code Changes Breakdown

### 4.1 Remove Unused Icons & Utilities
- Remove icon imports: `Bell`, `Mail`, `Sparkles`, `Volume2`.
- Remove `Toggle` component function (lines 26–41).
- Remove `preferences` state and `togglePreference` callback (lines 115–144).
- Clean up `SettingRow`: remove unused `isToggle` and `toggleActive` props.

### 4.2 Update Page Subtitle
- Update `PerformerPageHeader` subtitle:
  ```jsx
  <PerformerPageHeader
    title="Settings"
    subtitle="Security, support, and account controls — all in one place"
    backTo="/performer/account"
    backLabel="Back to Account Hub"
  />
  ```

### 4.3 Right Column Layout After Deletion
```jsx
{/* Right Column - Dedicated Settings Categories */}
<div className="flex-1 grid grid-cols-1 gap-8 md:grid-cols-2">
  {/* 1. SECURITY & AUTHENTICATION */}
  <div className="md:col-span-2">
    <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
      Security & Authentication
    </h2>
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
      <SettingRow
        icon={Lock}
        label="Change Password"
        sublabel="Update your account password regularly for security"
        hasArrow
        onClick={() =>
          navigate("/performer/change-password", {
            state: { from: "/performer/settings", fromLabel: "Back to Settings" },
          })
        }
      />
      <SettingRow
        icon={ShieldCheck}
        label="Two-Factor Authentication (2FA)"
        sublabel="Add extra protection with one-time verification codes"
        hasArrow
        onClick={() =>
          navigate("/performer/two-factor-auth", {
            state: { from: "/performer/settings", fromLabel: "Back to Settings" },
          })
        }
      />
    </div>
  </div>

  {/* 2. SUPPORT & POLICIES */}
  <div className="md:col-span-2">
    <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
      Support & Policies
    </h2>
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
      <SettingRow
        icon={HelpCircle}
        label="Help Center & FAQs"
        sublabel="Guides, platform rules, and support assistance"
        hasArrow
        onClick={() => navigate("/help")}
      />
      <SettingRow
        icon={Shield}
        label="Privacy Policy"
        sublabel="How we protect your personal and payment data"
        hasArrow
        onClick={() => navigate("/privacy-policy")}
      />
      <SettingRow
        icon={FileText}
        label="Terms of Service"
        sublabel="User agreement and platform service terms"
        hasArrow
        onClick={() => navigate("/terms-and-conditions")}
      />
    </div>
  </div>

  {/* 3. ACCOUNT ACTIONS (DANGER ZONE) */}
  <div className="md:col-span-2">
    <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
      Account Actions
    </h2>
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
      <SettingRow
        icon={SwitchCamera}
        label="Switch to Provider Account"
        sublabel="Post tasks and hire skilled performers as a client"
        hasArrow
        onClick={() =>
          navigate("/performer/switch-to-provider", {
            state: { from: "/performer/settings", fromLabel: "Back to Settings" },
          })
        }
      />
      <SettingRowDanger
        icon={LogOut}
        label="Sign Out"
        onClick={async () => {
          try {
            await logout();
          } finally {
            navigate("/");
          }
        }}
      />
      <SettingRowDanger
        icon={Trash2}
        label="Delete Account"
        onClick={() => navigate("/performer/delete-account")}
      />
    </div>
  </div>
</div>
```

---

## 5. Execution & Verification Steps

1. **Apply Changes**: Edit [`PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx) to remove `Notifications & Preferences` block and associated unused code.
2. **Autonomous Browser Verification**:
   - Navigate to `http://localhost:5173/performer/settings`.
   - Verify that the `Notifications & Preferences` card is completely gone.
   - Verify that `Security & Authentication`, `Support & Policies`, and `Account Actions` are cleanly laid out without visual gaps.
   - Verify that clicking `Change Password` or `Two-Factor Auth` navigates with `← Back to Settings` and returns on click.
   - Verify that top header `← Back to Account Hub` navigates to `/performer/account`.
3. **Build Validation**:
   - Run `npm run build` to confirm 0 compilation, lint, or bundling errors.
