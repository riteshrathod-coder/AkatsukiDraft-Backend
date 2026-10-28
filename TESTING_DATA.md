# 🧪 Akatsuki's Draft — API Testing Guide & Test Data

This document contains all API routes, sample test data, test cases, and expected responses for QA and backend testing.

---

## 📌 Test Environment Configuration

- **Base URL:** `http://localhost:5000`
- **Authentication:** Bearer Token via Header `Authorization: Bearer <TOKEN>`
- **Content Type:** `application/json` (except file uploads which use `multipart/form-data`)

---

## 👥 Standard Test Accounts

| Account Type | Name | Email | Password | Role |
|---|---|---|---|---|
| **Regular User** | Test User | `tester.user@akatsuki.io` | `UserTest@123` | `user` |
| **Admin User** | Test Admin | `tester.admin@akatsuki.io` | `AdminTest@123` | `admin` |

---

## 📋 Complete Route Reference & Test Payloads

---

### 1. Server Health & Status

#### `GET /` — Welcome & Status
- **Method:** `GET`
- **URL:** `http://localhost:5000/`
- **Headers:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Akatsuki's Draft API is running!",
  "health": "/api/health"
}
```

#### `GET /api/health` — Health Check
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Headers:** None
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "API is running"
}
```

---

### 2. User Authentication (`/api/auth`)

#### `POST /api/auth/register` — Register Normal User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "tester.user@akatsuki.io",
  "password": "UserTest@123",
  "role": "user"
}
```
- **Expected Status:** `201 Created`
- **Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6720...",
      "name": "Test User",
      "email": "tester.user@akatsuki.io",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### `POST /api/auth/login` — User Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body (raw JSON):**
```json
{
  "email": "tester.user@akatsuki.io",
  "password": "UserTest@123"
}
```
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6720...",
      "name": "Test User",
      "email": "tester.user@akatsuki.io",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### `GET /api/auth/me` — Current Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/me`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Expected Status:** `200 OK`

---

### 3. Admin Authentication & Role Protection (`/api/admin`)

#### `POST /api/admin/register` — Register Admin User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/admin/register`
- **Headers:** `Content-Type: application/json`
- **Request Body (raw JSON):**
```json
{
  "name": "Test Admin",
  "email": "tester.admin@akatsuki.io",
  "password": "AdminTest@123"
}
```
- **Expected Status:** `201 Created`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "user": {
      "id": "6720...",
      "name": "Test Admin",
      "email": "tester.admin@akatsuki.io",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### `POST /api/admin/login` — Separate Admin Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/admin/login`
- **Headers:** `Content-Type: application/json`
- **Request Body (raw JSON):**
```json
{
  "email": "tester.admin@akatsuki.io",
  "password": "AdminTest@123"
}
```
- **Expected Status:** `200 OK`

#### ⛔ NEGATIVE TEST: Regular User Tries Admin Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/admin/login`
- **Headers:** `Content-Type: application/json`
- **Request Body (raw JSON):**
```json
{
  "email": "tester.user@akatsuki.io",
  "password": "UserTest@123"
}
```
- **Expected Status:** `403 Forbidden`
- **Expected Response:**
```json
{
  "success": false,
  "message": "Access denied: Admin credentials required"
}
```

---

### 4. Post Management (`/api/posts`)

#### `POST /api/posts` — Create New Post (Draft or Submit)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_JWT_TOKEN>`
- **Request Body (raw JSON):**
```json
{
  "title": "Mastering Node.js and MongoDB in 2026",
  "description": "Comprehensive guide for developers building scalable backends.",
  "content": "Node.js provides an event-driven runtime that scales efficiently. Paired with MongoDB document storage, developers can build robust applications with minimal boilerplate.",
  "category": "Backend Development",
  "status": "draft"
}
```
- **Expected Status:** `201 Created`
- *(Save the returned `data.post._id` as `POST_ID` for subsequent steps)*

#### `GET /api/posts` — Public Approved Feed
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts`
- **Optional Query Parameters:**
  - `?page=1&limit=10`
  - `?category=Backend Development`
  - `?search=Node.js`
- **Expected Status:** `200 OK` (Only posts with `status: "approved"` appear here)

#### `GET /api/posts/my-posts` — Author's Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/my-posts`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Optional Query Parameters:** `?status=draft&page=1&limit=10`
- **Expected Status:** `200 OK`

#### `GET /api/posts/:id` — Get Post by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/<POST_ID>`
- **Expected Status:** `200 OK`

#### `PATCH /api/posts/:id` — Update Post
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/posts/<POST_ID>`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_JWT_TOKEN>`
- **Request Body (raw JSON):**
```json
{
  "title": "Mastering Node.js and MongoDB (Updated Edition)",
  "description": "Updated guide with advanced performance tips.",
  "content": "Updated content with indexing and aggregation pipeline strategies.",
  "category": "Backend Development"
}
```
- **Expected Status:** `200 OK`

#### `POST /api/posts/:id/submit` — Submit Draft for Admin Review
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts/<POST_ID>/submit`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Expected Status:** `200 OK`
- **Expected Result:** Post `status` changes from `"draft"` to `"pending"`.

#### `DELETE /api/posts/:id` — Delete Post
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/posts/<POST_ID>`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Expected Status:** `200 OK`

---

### 5. Admin Review Workflow (`/api/admin`)

#### `GET /api/admin/posts/pending` — View All Pending Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/posts/pending`
- **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "<POST_ID>",
        "title": "Mastering Node.js and MongoDB in 2026",
        "status": "pending",
        "createdBy": {
          "name": "Test User",
          "email": "tester.user@akatsuki.io"
        }
      }
    ],
    "pagination": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

#### `PATCH /api/admin/posts/approve/:id` — Approve Post
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/admin/posts/approve/<POST_ID>`
- **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Expected Status:** `200 OK`
- **Expected Result:** Post `status` changes to `"approved"`. Post now appears in `GET /api/posts`.

#### `PATCH /api/admin/posts/reject/:id` — Reject Post with Reason
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/admin/posts/reject/<POST_ID>`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body (raw JSON):**
```json
{
  "rejectionReason": "Please add code examples and architectural diagrams before re-submitting."
}
```
- **Expected Status:** `200 OK`
- **Expected Result:** Post `status` becomes `"rejected"` and `rejectionReason` is saved.

---

### 6. AI Content Improvement (`/api/ai`)

#### `POST /api/ai/improve/:id` — AI Draft Generation
Creates an enhanced AI version derived from an existing post.
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/ai/improve/<POST_ID>`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_JWT_TOKEN>`
- **Request Body (optional if ID in URL):**
```json
{}
```
*(Alternatively, you can call `POST http://localhost:5000/api/ai/improve` with `{"postId": "<POST_ID>"}`)*
- **Expected Status:** `201 Created`
- **Expected Response:**
```json
{
  "success": true,
  "message": "AI draft created successfully",
  "data": {
    "post": {
      "title": "Improved Title...",
      "description": "Improved summary...",
      "content": "Polished content...",
      "category": "Backend Development",
      "status": "draft",
      "versionType": "ai_improved",
      "improvedFrom": "<ORIGINAL_POST_ID>"
    }
  }
}
```

---

### 7. File & Media Uploads (`/api/upload`)

#### `POST /api/upload/image` — Cloudinary Image Upload
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/upload/image`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Body:** Select `form-data`
  - **Key:** `image` (Type: `File`)
  - **Value:** Select a `.jpg`, `.png`, or `.webp` file (Max 5MB)
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "akatsuki_drafts/..."
  }
}
```

#### `POST /api/upload/document` — Document Upload
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/upload/document`
- **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
- **Body:** Select `form-data`
  - **Key:** `document` (Type: `File`)
  - **Value:** Select a `.pdf`, `.docx`, or `.txt` file (Max 10MB)
- **Expected Status:** `200 OK`

---

## 🔄 End-to-End Testing Flow Checklist

1. [ ] **Health Check:** `GET /` &rarr; `200 OK`
2. [ ] **Register User:** `POST /api/auth/register` &rarr; `201 Created`
3. [ ] **Login User:** `POST /api/auth/login` &rarr; Save User `token`
4. [ ] **Register Admin:** `POST /api/admin/register` &rarr; `201 Created`
5. [ ] **Login Admin:** `POST /api/admin/login` &rarr; Save Admin `token`
6. [ ] **Negative Test:** Normal user logs in at `/api/admin/login` &rarr; `403 Forbidden`
7. [ ] **Create Draft:** User calls `POST /api/posts` with `status: "draft"` &rarr; `201 Created`
8. [ ] **Submit Draft:** User calls `POST /api/posts/:id/submit` &rarr; Status becomes `"pending"`
9. [ ] **Check Feed:** `GET /api/posts` &rarr; Pending post is **NOT** visible in public feed
10. [ ] **Admin Reviews:** Admin calls `GET /api/admin/posts/pending` &rarr; Post is visible
11. [ ] **Admin Approves:** Admin calls `PATCH /api/admin/posts/approve/:id` &rarr; Status becomes `"approved"`
12. [ ] **Check Feed Again:** `GET /api/posts` &rarr; Post **IS NOW** visible in public feed
13. [ ] **AI Improvement:** User calls `POST /api/ai/improve/:id` &rarr; Generates `ai_improved` draft
