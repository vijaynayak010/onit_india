# Provider Payment Flow — Hiring a Performer for a Task

This document covers the complete payment flow a **Task Provider** goes through when hiring a performer and paying for a task on OnIT India.

---

## Overview

```
Provider selects a performer
        │
        ▼
/provider/confirm-and-pay
  ├── Pricing preview (server-side breakdown)
  ├── Optional: apply wallet balance
  ├── Optional: apply coupon / voucher
  └── Pay via Razorpay
        │
        ├── [wallet fully covers] ──► finalizeHire()
        │
        └── [Razorpay modal]
              ├── Payment captured
              ├── Signature verified (server)
              └── finalizeHire()
                      │
                      ▼
             /provider/active-task/:taskId
```

---

## Entry Points

The provider reaches the payment page from three places, each passing `{ taskData, performer }` via React Router state:

| Page | Trigger |
|------|---------|
| `TaskApplicantsPage` | Provider clicks **Hire** on a performer who expressed interest |
| `PostTaskSearchResultsPage` | Provider selects a matched performer after posting a task |
| `TaskPerformerProfilePage` | Provider clicks **Hire** from a performer's profile page |

**Route:** `GET /provider/confirm-and-pay`  
**Component:** `src/components/provider/pages/ConfirmAndPayPage.jsx`

**State shape received:**
```js
location.state = {
  taskData: { id, title, description, category, priceAmount, budget, deadline, ... },
  performer: {
    taskerId,       // performer's user ID
    interestId,     // their interest record ID (or "direct_hire")
    hireType,       // "accepted_invitation" | "direct_hire" | undefined
    person,         // display name
    ...
  }
}
```

---

## Step 1 — Pricing Preview

On load and whenever `useWallet` or the applied coupon changes, the page fetches a live pricing breakdown from the server:

```
POST /payments/tasks/:taskId/preview
Body: { useWallet?: bool, couponCode?: string }
```

**Response fields used by the UI:**

| Field | Description |
|-------|-------------|
| `commissionAmount` | Category-level service commission (₹) |
| `commissionRate` | Commission percentage (e.g. 10 for 10%) — set per category in `CategoryCommission` |
| `platformFeeAmount` | Flat platform fee (₹) |
| `couponDiscountAmount` | Discount applied by coupon (₹) |
| `walletBalance` | Provider's current wallet balance |
| `walletAppliedAmount` | Wallet amount used in this payment |
| `gatewayPaidAmount` | Amount actually charged via Razorpay |
| `totalProviderPaid` | Grand total paid by provider |
| `grossProviderAmount` | Task amount + commission + platform fee (before discounts) |
| `coupon` | Applied coupon object (`{ code, discountType, discountAmount }`) |

**Amount formula:**
```
grossProviderAmount = basePrice + commissionAmount + platformFeeAmount
totalProviderPaid   = grossProviderAmount - couponDiscountAmount - walletAppliedAmount
gatewayPaidAmount   = totalProviderPaid - walletAppliedAmount
```

> `basePrice` is read from `taskData.priceAmount ?? taskData.budget ?? taskData.price`.  
> Commission is always computed server-side from `CategoryCommission` — never trusted from the client.

---

## Step 2 — Coupons & Vouchers

On load, available vouchers are fetched:

```
GET /coupons/my-vouchers?status=available&limit=10
```

Only coupons with `minOrderValue <= grossProviderAmount` are shown as applicable.

**Coupon types:**
- `PERCENT` — percentage discount off the total
- Flat — fixed ₹ discount

The provider can type a code manually or pick from a modal. Applying a coupon re-fetches the pricing preview with `{ couponCode }`.

**Remove coupon** → re-fetches preview without `couponCode`, resets `appliedCouponCode`.

---

## Step 3 — Wallet

The provider can toggle **Use Wallet Balance**. When enabled:

- Preview re-fetches with `{ useWallet: true }`
- `walletAppliedAmount` is deducted from `gatewayPaidAmount`
- If wallet fully covers the total → `gatewayPaidAmount = 0`

**Wallet balance API:**
```
GET /wallet   →  { balance, ... }
```

---

## Step 4 — Payment Execution

Triggered by the provider clicking **Pay ₹X**.

### 4a. Guards

```
taskId must exist
performer.interestId must exist
basePrice must be > 0
```

### 4b. Load Razorpay SDK

```js
// src/utils/loadRazorpay.js
loadRazorpay()   // lazy-loads https://checkout.razorpay.com/v1/checkout.js
                 // cached after first load — safe to call multiple times
```

### 4c. Create Razorpay Order

```
POST /payments/create-order
Body: { taskId, couponCode?, useWallet? }
```

Server creates a Razorpay order and returns:
```js
{
  id,               // Razorpay order ID
  amount,           // paise (₹ × 100)
  currency,         // "INR"
  paymentRequired,  // false if wallet fully covers
  breakdown         // updated pricing breakdown
}
```

### 4d. Wallet-Only Path (no Razorpay modal)

If `order.paymentRequired === false` or `order.amount === 0`:

```
Skip Razorpay modal → go directly to finalizeHire()
```

### 4e. Razorpay Modal

```js
const options = {
  key: VITE_RAZORPAY_KEY_ID,
  amount: order.amount,      // in paise
  currency: "INR",
  order_id: order.id,
  name: "OnIT India",
  description: `Hiring ${performer.person} for "${taskData.title}"`,
  theme: { color: "#16a34a" },
  handler: async (response) => {
    // called on successful payment capture
    await verifyRazorpayPayment({ ... });
    await finalizeHire();
  },
  modal: {
    ondismiss: () => setIsProcessing(false)
  }
};
```

Payment failure is caught via `rzp.on('payment.failed', ...)`.

### 4f. Verify Payment

```
POST /payments/verify-payment
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  taskId
}
```

Server verifies the HMAC signature and marks the payment as captured. Money is held in escrow at this point — **not yet released to performer**.

---

## Step 5 — Finalize Hire

```js
finalizeHire()
```

Assigns the performer to the task based on hire type:

| `performer.hireType` / `interestId` | Action |
|--------------------------------------|--------|
| `"accepted_invitation"` | No assignment API call needed — performer already assigned via invitation |
| `"direct_hire"` | `POST /tasks/:taskId/direct-hire  { taskerId }` |
| *(any other interestId)* | `PUT /tasks/interests/:interestId/accept` |

After assignment:
1. Clears `sessionStorage` caches (`onit_provider_tasks_cache`, `onit_provider_dashboard_cache`)
2. Sets `isSuccess = true` (shows success overlay)
3. Navigates to `/provider/active-task/:taskId` after **4 seconds**

---

## Step 6 — After Payment

Provider lands on `/provider/active-task/:taskId`.

From `PaymentSuccessPage` (used by the older `PaymentSelectionPage` flow), what happens next is communicated to the provider:

1. Payment held securely by the platform (escrow)
2. Performer is notified
3. Work begins
4. Amount released to performer **only after provider approves delivery**

---

## API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/payments/tasks/:taskId/preview` | Live pricing breakdown (pre-payment) |
| `POST` | `/payments/create-order` | Create Razorpay order |
| `POST` | `/payments/verify-payment` | Verify Razorpay signature, capture payment |
| `GET`  | `/coupons/my-vouchers` | List provider's available coupons |
| `POST` | `/coupons/validate` | Validate a coupon code |
| `GET`  | `/wallet` | Get provider's wallet balance |
| `PUT`  | `/tasks/interests/:interestId/accept` | Accept performer interest (hire) |
| `POST` | `/tasks/:taskId/direct-hire` | Direct-hire a performer without prior interest |

---

## Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/provider/confirm-and-pay` | `ConfirmAndPayPage` | Main payment flow |
| `/provider/payment-selection` | `PaymentSelectionPage` | Older UPI/card selection UI (not primary flow) |
| `/provider/payment-success` | `PaymentSuccessPage` | Static success screen (used by `PaymentSelectionPage`) |
| `/provider/active-task/:id` | `ProviderActiveTaskExecutionPage` | Task execution dashboard post-payment |

---

## Key Files

| File | Role |
|------|------|
| `src/components/provider/pages/ConfirmAndPayPage.jsx` | Main payment page (pricing, coupon, Razorpay) |
| `src/components/provider/pages/PaymentSuccessPage.jsx` | Static success screen |
| `src/components/provider/pages/PaymentSelectionPage.jsx` | Legacy UPI/card selection page |
| `src/components/provider/services/api.js` | All payment-related API calls |
| `src/utils/loadRazorpay.js` | Lazy-loads Razorpay SDK (cached singleton) |
| `src/components/provider/ProviderApp.jsx` | Route definitions |

---

## Escrow Model

```
Provider pays ──► Platform escrow ──► [task executes] ──► Provider approves ──► Performer paid
```

- Provider pays at **hire time**
- Funds sit in escrow during task execution
- Released to performer only after provider approves the delivered work
- Disputes handled by Trust & Safety team
