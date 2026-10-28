# Templates API Documentation

This document describes the design, database model, and API endpoints for the **Templates** feature in the OnIT Backend.

## Overview
The Templates module allows providers (`Role.PROVIDER`) to save pre-configured details for tasks (such as title, description, skills, pricing, and location details) so they can easily reuse them when creating new tasks. 

---

## 1. Database Schema (`Prisma`)

The template data is stored in the `templates` table, mapped to the `Template` model. It has a one-to-many relationship with the `User` model (`providerUserId` references `User.id` with `onDelete: Cascade`).

### Model Definition: `Template`
| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | `String` | `@id`, `@default(uuid())`, `@db.Uuid` | Unique identifier for the template |
| `providerUserId` | `String` | `@map("provider_user_id")`, `@db.Uuid` | ID of the provider who owns the template |
| `title` | `String` | Required | Title of the task template |
| `description` | `String?` | Optional | Detailed description |
| `category` | `String?` | Optional | Task category |
| `locationAddress`| `String?` | Optional, `@map("location_address")` | Text address of the task location |
| `locationLat` | `Float?` | Optional, `@map("location_lat")` | Latitude coordinate |
| `locationLng` | `Float?` | Optional, `@map("location_lng")` | Longitude coordinate |
| `priceAmount` | `Float?` | Optional, `@map("price_amount")` | Base price amount |
| `priceCurrency` | `String?` | Optional, `@map("price_currency")` | Currency code (e.g., USD, INR) |
| `details` | `Json?` | Optional | Additional dynamic metadata / attributes |
| `skills` | `String[]` | Defaults to empty array | Array of required skills |
| `createdAt` | `DateTime` | `@default(now())`, `@map("created_at")` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt`, `@map("updated_at")` | Auto-updated modification timestamp |

---

## 2. Authentication & Authorization
* **Bearer Token**: All endpoints require a valid JWT token in the `Authorization` header (`Authorization: Bearer <token>`).
* **Role Restricting**: Access is restricted strictly to users with the **`PROVIDER`** role. 
* **Ownership Check**: For retrieval, updating, and deletion, the backend verifies that the requested template belongs to the authenticated provider. If not, it throws a `403 Forbidden` exception.

---

## 3. API Endpoints

### Base URL: `/templates`

### 1. Create a Template
* **URL**: `/templates`
* **Method**: `POST`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`

### 2. List Templates (Paginated)
* **URL**: `/templates`
* **Method**: `GET`
* **Query Parameters**: `page` (default `1`), `limit` (default `20`)
* **Response**: `{ data: Template[], pagination: { page, limit, total, totalPages } }`

### 3. Get Template by ID
* **URL**: `/templates/:id`
* **Method**: `GET`

### 4. Update Template
* **URL**: `/templates/:id`
* **Method**: `PUT`

### 5. Delete Template
* **URL**: `/templates/:id`
* **Method**: `DELETE`
* **Response**: `{ message: "Template successfully deleted" }`

---

## 4. Frontend integration

Client helpers live in:
- `client/src/components/provider/services/api.js` — `listTemplates`, `getTemplate`, `createTemplate`, `updateTemplate`, `deleteTemplate`
- `client/src/components/provider/utils/templateHelpers.js` — payload builder and response mappers
