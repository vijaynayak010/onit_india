# 🛡️ Admin Task Flow APIs Documentation

Yeh document un saari APIs ko explain karta hai jo **Admin Dashboard** (Superadmin / Admins) use karenge Task Flow aur Disputes ko manage karne ke liye.
Sabhi APIs ke aage `@Roles(Role.ADMIN)` laga hua hai aur inhe call karne ke liye Admin JWT Token mandatory hai.

---

## 1. Get All Tasks (Monitoring)
Admin poore system ke tasks dekh sakta hai, filter kar sakta hai aur monitor kar sakta hai.

**API:** `GET /admin/tasks`
**Query Params:** `?page=1&limit=20&status=IN_PROGRESS&category=Painting`

**Response:**
```json
{
  "data": [
    {
      "id": "task_123",
      "title": "Paint my house",
      "status": "IN_PROGRESS",
      "priceAmount": 5000,
      "provider": { "id": "prov_1", "email": "client@example.com" },
      "createdAt": "..."
    }
  ],
  "pagination": { "total": 100, "page": 1, "limit": 20 }
}
```

---

## 2. Get Pending Approvals (Queue)
Task create/publish hone ke baad PENDING_APPROVAL state mein aate hain. Admin unhe is queue se fetch karta hai.

**API:** `GET /admin/tasks/approvals`
**Query Params:** `?page=1&limit=20`

**Response:** Same as `GET /admin/tasks` but pre-filtered for pending approvals.

---

## 3. Approve Task
Admin task ki details check karke usko live karta hai. Iske baad task `PUBLISHED` state mein chala jata hai aur taskers ko feed mein dikhne lagta hai.

**API:** `POST /admin/tasks/:taskId/approve`

**Request:** `{} ` (Empty body)

**Response:**
```json
{
  "id": "task_123",
  "status": "PUBLISHED",
  "publishedAt": "2026-09-02T10:00:00.000Z"
}
```

---

## 4. Reject Task
Agar task platform guidelines ke against hai (e.g. invalid content, wrong price), toh admin reason dekar reject kar sakta hai.

**API:** `POST /admin/tasks/:taskId/reject`

**Request:**
```json
{
  "reason": "The task description contains inappropriate language."
}
```

**Response:**
```json
{
  "id": "task_123",
  "status": "REJECTED",
  "reviewNote": "The task description contains inappropriate language."
}
```

---

## 5. Get Manual Disputes List
Sabhi raised disputes ki list fetch karna taaki admin unhe resolve kar sake.

**API:** `GET /admin/tasks/disputes`
**Query Params:** `?status=PENDING&page=1&limit=20`

**Response:**
```json
{
  "data": [
    {
      "id": "dispute_001",
      "taskId": "task_123",
      "reason": "SCOPE_CREEP",
      "status": "PENDING",
      "raisedByUserId": "user_456"
    }
  ],
  "pagination": { ... }
}
```

---

## 6. Resolve Manual Task Dispute
Admin investigate karne ke baad final verdict deta hai. Isse Escrow freeze resolve ho jata hai.

**API:** `PATCH /admin/tasks/disputes/:disputeId/resolve`

**Request:**
```json
{
  "resolution": "REFUND_PROVIDER", 
  // Options: REFUND_PROVIDER, RELEASE_TASKER, SPLIT_SETTLEMENT, DISMISS
  "adminNotes": "Found the tasker at fault based on chat history. Refunded client."
}
```

**Response:**
```json
{
  "id": "dispute_001",
  "status": "RESOLVED",
  "resolution": "REFUND_PROVIDER",
  "adminNotes": "Found the tasker at fault...",
  "resolvedAt": "2026-09-02T12:00:00.000Z"
}
```

---

## 7. Resolve Checklist Item Dispute (3 Rejections)
Jab koi checklist item lagataar 3 baar reject hota hai toh woh DISPUTED ho jata hai. Admin is API ke throw final decision leta hai.

**API:** `PUT /tasks/checklist/items/:itemId/resolve-dispute`

**Request:**
```json
{
  "status": "APPROVED", // Admin overrides and approves the item
  "providerFeedback": "Admin review: The photo clearly shows the wall is clean." // Admin ka feedback/note
}
```
*(Optionally, admin "REJECTED" (jisse status CHANGE_REQUESTED ho jaye) bhi kar sakta hai)*

**Response:**
```json
{
  "id": "item_123",
  "status": "COMPLETED", // ya CHANGE_REQUESTED
  "isDisputed": false,
  "adminApprovedAt": "2026-09-02T14:00:00.000Z"
}
```

---

## 8. Force Update Task Status / Delete Task
Agar koi extreme case ho jisme admin ko directly database status update karna pade ya task permanently delete karna pade (like spam/fraud).

**API (Update):** `PATCH /admin/tasks/:taskId/status`
**Request:**
```json
{
  "status": "CANCELED",
  "reason": "Fraudulent client account"
}
```

**API (Delete):** `DELETE /admin/tasks/:taskId`
**Request:**
```json
{
  "reason": "Spam listing",
  "issueRefund": true
}
```
