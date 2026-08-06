# IMPERIA ESTATES — Backend REST API

Standalone Express.js 4.x REST API service for **IMPERIA ESTATES** (Luxury Real Estate Platform). Built with Node.js ES modules, Prisma ORM (PostgreSQL), JWT authentication with httpOnly refresh cookies, Zod schema validation, Multer file uploads, and standard response envelopes.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (LTS), ES Modules (`"type": "module"`)
- **Framework**: Express.js 4.x
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (Access Token in `Authorization: Bearer <token>`, Refresh Token in `httpOnly` Cookie) + `bcrypt`
- **Validation**: Zod
- **File Uploads**: Multer (local `/uploads` storage)
- **Security & Utilities**: Helmet, CORS, Morgan, Express Rate Limit
- **Testing**: Jest + Supertest

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your PostgreSQL connection string and secret keys:

```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/imperia_estates?schema=public"
JWT_ACCESS_SECRET="imperia_super_secret_access_key_2026_change_in_production"
JWT_REFRESH_SECRET="imperia_super_secret_refresh_key_2026_change_in_production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration & Seeding

Generate Prisma client, apply migrations, and populate the database with seed data:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 4. Running the Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000` with the health check available at `http://localhost:5000/api/v1/health`.

### 5. Running Tests

```bash
npm test
```

---

## 🔑 Default Seed Credentials

- **Admin Account**:
  - Email: `admin@imperiaestates.com`
  - Password: `Admin@123456`
  - Role: `admin`
- **Customer Account**:
  - Email: `customer@imperiaestates.com`
  - Password: `Customer@123456`
  - Role: `customer`

---

## 📦 API Response Envelope Format

All endpoints follow a unified response structure.

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error description message",
    "code": "ERROR_CODE"
  }
}
```

---

## 📚 API Endpoints Documentation

### Health Check

#### `GET /api/v1/health`
- **Auth**: Public
- **Response**: `{ "success": true, "data": { "status": "ok" }, "error": null }`

---

### Auth Endpoints (`/api/v1/auth`)

| Method | Path | Auth | Description | Payload Body |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new customer | `{ "name": "John", "email": "john@example.com", "phone": "9876543210", "password": "secretpassword" }` |
| `POST` | `/api/v1/auth/login` | Public | User login & token generation | `{ "email": "admin@imperiaestates.com", "password": "Admin@123456" }` |
| `POST` | `/api/v1/auth/refresh` | Public (Cookie) | Issue new access token via refresh cookie | `{}` |
| `POST` | `/api/v1/auth/logout` | Public | Clear httpOnly refresh cookie | `{}` |
| `GET` | `/api/v1/auth/me` | Bearer Token | Get logged-in user profile | None |

---

### Properties Endpoints (`/api/v1/properties`)

| Method | Path | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/api/v1/properties` | Public | Filter, sort & paginate properties | `?purpose=Buy&city=Chennai&type=Villa&minPrice=10000000&sort=price_desc&page=1&limit=12` |
| `GET` | `/api/v1/properties/:id` | Public | Get single property by slug ID | None |
| `POST` | `/api/v1/properties` | Admin | Create property | `{ "title": "New Villa", "location": "ECR", "city": "Chennai", "type": "Villa", "numericPrice": 150000000, "numericArea": 4500 }` |
| `PUT` | `/api/v1/properties/:id` | Admin | Update property details | `{ "title": "Updated Title", "status": "Ready to Move" }` |
| `DELETE` | `/api/v1/properties/:id` | Admin | Delete property | None |
| `POST` | `/api/v1/properties/bulk` | Admin | Bulk publish/archive/delete | `{ "ids": ["prop-1", "prop-2"], "action": "Publish" }` |
| `POST` | `/api/v1/admin/properties/media` | Admin | Upload images (multipart/form-data) | Form field `media` (files) |

---

### Search Endpoints (`/api/v1/search`)

| Method | Path | Auth | Description | Query Params |
|---|---|---|---|---|
| `GET` | `/api/v1/search` | Public | Full-text query match on title, location, city, type, builder, tag | `?q=Chennai` |

---

### User Wishlist, Compare, & Activity (`/api/v1/user`)

| Method | Path | Auth | Description | Body Payload |
|---|---|---|---|---|
| `GET` | `/api/v1/user/wishlist` | Bearer Token | Get user's saved wishlist | None |
| `POST` | `/api/v1/user/wishlist/toggle` | Bearer Token | Toggle property in/out of wishlist | `{ "propertyId": "imperia-ritz" }` |
| `GET` | `/api/v1/user/compare` | Bearer Token | Get user's active comparison list | None |
| `POST` | `/api/v1/user/compare/toggle` | Bearer Token | Toggle property in compare (Max 4) | `{ "propertyId": "imperia-ritz" }` |
| `GET` | `/api/v1/user/recently-viewed` | Bearer Token | Get recently viewed properties | None |
| `POST` | `/api/v1/user/recently-viewed` | Bearer Token | Track property view (Trims to 8) | `{ "propertyId": "imperia-ritz" }` |
| `PUT` | `/api/v1/user/profile` | Bearer Token | Update user preferences/profile | `{ "name": "Rajesh K", "city": "Chennai", "purpose": "Buy" }` |

---

### Notifications (`/api/v1/user/notifications`)

| Method | Path | Auth | Description | Payload |
|---|---|---|---|---|
| `GET` | `/api/v1/user/notifications` | Bearer Token | Get user notifications | None |
| `PATCH` | `/api/v1/user/notifications/:id/read` | Bearer Token | Mark notification as read | None |
| `PATCH` | `/api/v1/user/notifications/read-all` | Bearer Token | Mark all notifications read | None |
| `DELETE` | `/api/v1/user/notifications/:id` | Bearer Token | Delete notification | None |

---

### Site Visits (`/api/v1/site-visits`)

| Method | Path | Auth | Description | Payload Body |
|---|---|---|---|---|
| `POST` | `/api/v1/site-visits` | Public / Optional | Book site tour | `{ "propertyId": "imperia-ritz", "customerName": "Priya", "customerEmail": "priya@example.com", "customerPhone": "9812345678", "scheduledDate": "2026-03-10", "scheduledTime": "11:00 AM" }` |
| `GET` | `/api/v1/site-visits/my-visits` | Bearer Token | Get user's booked site visits | None |
| `GET` | `/api/v1/admin/site-visits` | Admin | List all site visits | Query `?status=Scheduled` |
| `PATCH` | `/api/v1/admin/site-visits/:id/reschedule` | Admin | Reschedule site visit | `{ "scheduledDate": "2026-03-12", "scheduledTime": "02:00 PM" }` |
| `PATCH` | `/api/v1/admin/site-visits/:id/cancel` | Admin | Cancel site visit | `{ "cancelReason": "Customer requested change" }` |
| `PATCH` | `/api/v1/admin/site-visits/:id/complete` | Admin | Complete site visit | `{ "completionNote": "Tour completed successfully" }` |

---

### Admin CRM Customers (`/api/v1/admin/customers`)

| Method | Path | Auth | Description | Body Payload |
|---|---|---|---|---|
| `GET` | `/api/v1/admin/customers` | Admin | List CRM customer leads | Query `?search=Rajesh&city=Chennai` |
| `POST` | `/api/v1/admin/customers` | Admin | Create customer lead | `{ "name": "Anita", "email": "anita@example.com", "phone": "9876500000", "leadStatus": "New" }` |
| `PATCH` | `/api/v1/admin/customers/:id` | Admin | Update customer lead | `{ "leadStatus": "Contacted", "notes": "Called lead" }` |
| `DELETE` | `/api/v1/admin/customers/:id` | Admin | Delete customer lead | None |

---

### Blogs (`/api/v1/blogs`)

| Method | Path | Auth | Description | Payload Body |
|---|---|---|---|---|
| `GET` | `/api/v1/blogs` | Public | List published blog posts | Query `?category=Market Insights` |
| `GET` | `/api/v1/blogs/:slug` | Public | Get single blog by slug/ID | None |
| `POST` | `/api/v1/admin/blogs` | Admin | Create blog post | `{ "title": "2026 Market Trends", "body": "Full body text...", "category": "Insights" }` |
| `PUT` | `/api/v1/admin/blogs/:id` | Admin | Update blog post | `{ "title": "Updated Title" }` |
| `DELETE` | `/api/v1/admin/blogs/:id` | Admin | Delete blog post | None |

---

### Admin Broadcasts (`/api/v1/admin/broadcasts`)

| Method | Path | Auth | Description | Payload Body |
|---|---|---|---|---|
| `GET` | `/api/v1/admin/broadcasts` | Admin | List all sent broadcasts | None |
| `POST` | `/api/v1/admin/broadcasts` | Admin | Send marketing broadcast | `{ "title": "New VIP Villa Release", "message": "Check out our beachfront villas!", "channels": ["email", "whatsapp"] }` |

---

### Inquiries & Contact Forms (`/api/v1/inquiries`)

| Method | Path | Auth | Description | Payload Body |
|---|---|---|---|---|
| `POST` | `/api/v1/inquiries` | Public | Submit contact form | `{ "fullName": "Guest User", "email": "guest@example.com", "phone": "9876543210", "message": "Interested in consulting services." }` |
| `GET` | `/api/v1/admin/inquiries` | Admin | List all submitted inquiries | None |
