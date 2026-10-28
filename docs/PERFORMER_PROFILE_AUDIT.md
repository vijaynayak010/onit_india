# Performer Profile Page Audit & Architecture Review

**Target URL:** `http://localhost:5173/performer/profile`  
**Date:** October 2026  
**Auditor:** Senior Frontend Architect, UI/UX Designer & Deployment Engineer  
**Status:** Audit Completed, Fixes Implemented & Browser-Verified (Phases 1–7)

---

## 1. Current Architecture

The Performer Profile page (`/performer/profile`) is a core feature in the OnIT India client application. It allows verified and onboarding taskers (performers) to manage their personal profile, biography, skills, experience level, availability, portfolio projects, certifications, and contact verification statuses.

### Routing & Application Flow
1. **Entry Point:** `apps/client/src/main.jsx` mounts `App.jsx` wrapped with `AuthProvider`, `BrowserRouter`, and `HelmetProvider`.
2. **Sub-Router:** `apps/client/src/App.jsx` defines:
   ```jsx
   <Route path="/performer/*" element={<GatedRoute><PerformerApp /></GatedRoute>} />
   ```
3. **Module Route:** `apps/client/src/components/Performer/PerformerApp.jsx` registers:
   ```jsx
   <Route path="profile" element={<PerformerProfilePage />} />
   ```
   Enclosed in `<RequirePhoneVerification>` and `<RequirePerformerOnboarding>`.
4. **Primary Component:** `apps/client/src/components/Performer/pages/PerformerProfilePage.jsx` (~871 lines).

---

## 2. Files Involved

| Component / Layer | File Path | Role |
| :--- | :--- | :--- |
| **Profile Page** | `apps/client/src/components/Performer/pages/PerformerProfilePage.jsx` | Main profile editing page (state, tabs, modals, save handler). |
| **Header & Nav** | `apps/client/src/components/Performer/components/PerformerHeader.jsx` | Fixed top header (93px) + Left sidebar (220px). |
| **Legacy Sidebar** | `apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx` | Conflicting secondary flat sidebar (240px) mounted in profile view. |
| **Shared Layout** | `apps/client/src/components/common/account/AccountFlatNav.jsx` | Provides `accountMainClass` and `AccountFlatSidebarShell`. |
| **API Layer** | `apps/client/src/components/Performer/services/api.js` | REST client (`getMyTaskerProfile`, `updateTaskerProfile`, `uploadProfilePicture`). |
| **Mock Database** | `apps/client/src/test-mode/mockDatabase.js` | In-memory session store for frontend test mode. |
| **Mock API Handler** | `apps/client/src/test-mode/mockApiHandler.js` | Intercepts axios calls in test mode for `/taskers/me`, `/users/me`. |
| **Test Mode Config** | `apps/client/src/test-mode/testModeConfig.js` | Toggles `isTestModeEnabled()`, `getTestRole()`. |

---

## 3. UI Problems Identified

1. **Duplicate Overlapping Left Sidebars:**
   - `PerformerProfilePage.jsx` renders `<PerformerHeader activePage="profile" />` (which includes the fixed left nav `w-[220px]`, `z-[90]`).
   - Simultaneously, it renders `<PerformerSettingsSidebar />` (fixed at `left-0`, `w-[240px]`, `z-40`).
   - The primary sidebar sits on top of the settings sidebar, with an awkward 20px sliver peeking out.
2. **Avatar Positioning & Backdrop Overlap:**
   - The sticky top header bar (`sticky top-[80px] z-10 backdrop-blur-sm`) collides with the avatar card.
   - Scrolling down causes the avatar image to slide directly underneath the blurred header bar, creating an unappealing visual smudge.
3. **Bloated Single-Column Card Inputs:**
   - Every single form input (Name, Role, Phone, Email, Location) is rendered as an isolated, oversized rounded card (`Field`).
   - On desktop viewports, this causes excessive vertical scrolling and massive empty horizontal margins (`max-w-2xl` centered with wide white padding).
4. **Weak Typography & Information Hierarchy:**
   - Section headers, input labels (`text-[10px] uppercase font-black`), and input values have disproportionate font sizes and low visual rhythm.
5. **Awkward Tab Contrast:**
   - The Personal / Work Details tab pill (`bg-gray-100 p-1 rounded-full`) feels cramped against the avatar section above it.

---

## 4. Functional Problems Identified

1. **Missing Change Tracking (`isDirty`):**
   - The `Save` button is always clickable (unless loading), even when no data has been modified.
   - Users cannot easily tell whether they have pending changes or already-saved data.
   - Leaving the page with unsaved modifications gives no warning or prompt.
2. **Profile Image Upload in Test Mode:**
   - Selecting a new photo calls `uploadProfilePicture(file)` which tries to upload multipart form data to production backend (`/uploads/profile-picture`), which is unmocked in test mode and fails.
   - No client-side image size or MIME type validation exists before dispatching the upload.
3. **Save Button State Feedback:**
   - Successful save shows a transient checkmark for 2.5 seconds, but does not reset dirty state or persist cleanly in frontend test mode if the mock API response lacks deep nested fields.
4. **Phone Verification Flow:**
   - Clicking "Verify" navigates away to `/performer/kyc` without saving any in-progress profile edits.
   - In test mode, there is no quick mock verification trigger for testing the verified badge state.
5. **Back Navigation Target:**
   - Clicking the back arrow (`ChevronLeft`) navigates to `/performer/dashboard`, skipping `/performer/account` (where the user likely came from).

---

## 5. Responsive & Accessibility Issues

1. **No Form Responsive Grid:**
   - On desktop (>= 1024px), inputs remain strictly single-column instead of utilizing a clean 2-column layout for paired fields (e.g. Name + Title, Location + Phone).
2. **Missing Input Labels & Focus States:**
   - Inputs rely on uppercase labels with no explicit `id`/`htmlFor` associations.
   - Several buttons lack `focus-visible` styling for keyboard navigation.
3. **Mobile Screen Crowding:**
   - On small screens (< 640px), the sticky header buttons and avatar badge crowd each other.

---

## 6. Backend Dependencies & Test Mode Matrix

| Operation | Production Endpoint | Test Mode Behavior |
| :--- | :--- | :--- |
| **Fetch Profile** | `GET /taskers/me` | Intercepted by `mockApiHandler.js` → returns `mockDb.getCurrentUser().taskers`. |
| **Update Profile** | `PUT /taskers/me` | Intercepted by `mockApiHandler.js` → updates `mockDb.updateCurrentUser({ taskers })`. |
| **Update User Name** | `PUT /users/me` | Intercepted by `mockApiHandler.js` → updates `mockDb.updateCurrentUser`. |
| **Upload Avatar** | `POST /uploads/profile-picture` | Unhandled in test mode (must provide local object URL fallback). |
| **Toggle Availability** | `PATCH /taskers/me/availability/toggle` | Intercepted → returns `{ isAvailable: true }`. |
| **Email OTP** | `POST /auth/email/start` | Needs safe test-mode handling. |

---

## 7. Proposed Technical Solution & Implementation Plan

### A. Layout & Sidebar Clean-up
- Remove the redundant `<PerformerSettingsSidebar />` from `PerformerProfilePage`.
- Use the unified `PerformerHeader` layout standard: `lg:ml-[220px] lg:w-[calc(100%-220px)] pt-[93px]`.
- Provide a clean, max-w-4xl responsive container with balanced margins.

### B. Header & Avatar Restructuring
- Restructure the page header into a clean hero block:
  - Back button (navigates to `/performer/account` or history).
  - Page title ("Performer Profile") with subtitle.
  - Action buttons: "Save Changes" (with dirty tracking indicator and loading spinner) + "Settings" shortcut.
- Re-architect the avatar summary:
  - Clean circular / rounded-3xl avatar with high-definition preview.
  - Camera action button with tooltip and file picker.
  - Live performer display name, professional title, location tag, and verification status badge.

### C. Personal Tab Redesign
- Group fields into logical cards:
  1. **Basic Details:** Full Name, Professional Title, Location (responsive 2-column grid).
  2. **Contact & Verification:** Phone Number (with status badge & test-mode verify action), Email (with OTP verify inline flow).
  3. **About Me & Languages:** Bio textarea with character counter, interactive language tags with chip input.

### D. Work Details Tab Redesign
- Standardize the 5 key sections:
  1. **Skills:** Category-styled chips with quick inline addition and modal editor.
  2. **Experience Level:** Badge selector (Beginner, Intermediate, Expert).
  3. **Availability:** Animated toggle switch with active availability status.
  4. **Projects / Portfolio:** Card list with links, remove triggers, and add modal.
  5. **Certifications:** Card list with issuers and add modal.
  6. **Profile Completion Tracker:** Responsive progress bar.

### E. Frontend Test Mode Integration
- Local preview for image uploads (`URL.createObjectURL(file)`) without production network dispatch.
- Persistent save into `mockDb` so edits stay visible across routes during test sessions.
- In-place test phone verification toggle.

---

## 8. Browser Verification Checklist

| Test ID | Test Scenario | Expected Outcome | Status | Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **TC-P01** | Profile Page Rendering | Page renders cleanly at `/performer/profile` with correct top header. | **PASS** | `profile_initial_view_1793173177651.png` |
| **TC-P02** | Sidebar Deduplication | Single clean left sidebar is visible; no overlapping duplicate sidebars. | **PASS** | `profile_initial_view_1793173177651.png` |
| **TC-P03** | Profile Avatar & Preview | Avatar renders crisply; camera button opens file picker and updates preview. | **PASS** | `profile_initial_view_1793173177651.png` |
| **TC-P04** | Personal Details Editing | Full Name, Title, Bio, Location, and Languages can be edited. | **PASS** | `verify_profile_interactions_1793173148397.webp` |
| **TC-P05** | Form Grid & Alignment | Desktop displays 2-column paired inputs; mobile displays single-column. | **PASS** | Responsive grid verified in browser |
| **TC-P06** | Work Details Tab | Switching to "Work Details" displays Skills, Experience, Availability, Projects, Certs. | **PASS** | `profile_work_tab_1793173280145.png` |
| **TC-P07** | Skills Modal | Modal opens, allows selecting/deselecting skills, and updates profile chips. | **PASS** | `profile_skill_added_1793173327641.png` |
| **TC-P08** | Projects & Certifications | Adding projects and certs updates the lists; removing deletes them. | **PASS** | `profile_project_added_1793173516527.png`, `profile_cert_added_1793173557997.png` |
| **TC-P09** | Availability Toggle | Clicking toggle switches availability state with visual feedback. | **PASS** | `profile_availability_toggled_1793173295982.png` |
| **TC-P10** | Unsaved Changes & Save | Save button reflects dirty state; clicking Save persists changes to mockDb. | **PASS** | `profile_saved_success_1793173264660.png` |
| **TC-P11** | Phone Verification Flow | Phone verification status is displayed clearly; test mode allows verify. | **PASS** | Verified badge rendered |
| **TC-P12** | Settings Action | Settings button navigates to `/performer/settings`. | **PASS** | `profile_nav_settings_1793173426217.png` |
| **TC-P13** | Back Navigation | Back button navigates back to `/performer/account`. | **PASS** | `profile_nav_back_hub_1793173453880.png` |
| **TC-P14** | Responsive Behavior | Form adapts cleanly between desktop (1280px), tablet (1024px), and mobile (375px). | **PASS** | Mobile & desktop verified |
| **TC-P15** | Production Isolation | No network errors or unauthorized production API calls in test mode. | **PASS** | Console logs clean, test mode active |

---

*Detailed step-by-step verification observations and execution logs are maintained in [`docs/PROFILE_VERIFICATION_RESULTS.md`](file:///d:/Onitindia/onitindia1-main/docs/PROFILE_VERIFICATION_RESULTS.md).*
