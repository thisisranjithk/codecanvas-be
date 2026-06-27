# Feature 008 - Profile

## Objective

Implement the Profile module for the Portfolio CMS API.

The Profile module manages the portfolio owner's personal and professional information displayed on the public portfolio.

Each authenticated user owns exactly one profile.

---

## Context

Before implementation:

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the existing authentication module and shared infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Profile Model

Create a dedicated Prisma `Profile` model.

A profile belongs to one user.

Use a one-to-one relationship.

Fields:

* id
* userId
* headline
* bio
* location
* timezone
* github
* linkedin
* twitter
* website
* avatar
* createdAt
* updatedAt

Requirements:

* Each user can own only one profile.
* Configure proper Prisma relations.
* Generate and apply the migration.

---

## 2. Create Profile Module

Expected structure:

```text
src/modules/profile/

profile.route.ts
profile.controller.ts
profile.service.ts
profile.schema.ts
profile.docs.ts
```

Responsibilities:

**profile.route.ts**

* Register profile endpoints.
* Apply authentication middleware.

**profile.controller.ts**

* Handle HTTP requests and responses.
* Delegate business logic to the service.
* Return standardized API responses.

**profile.service.ts**

* Manage profile business logic.
* Interact with Prisma Client.
* Enforce one-profile-per-user.

**profile.schema.ts**

* Define Zod validation schemas.

**profile.docs.ts**

* Register Swagger documentation for all Profile endpoints.

---

## 3. Validation

Create request validation schemas.

Support:

* Create Profile
* Update Profile

Validation must occur before reaching the controller.

---

## 4. Profile APIs

Implement:

```http
POST   /api/v1/profile

GET    /api/v1/profile

PUT    /api/v1/profile
```

### POST /profile

Requirements:

* Authenticated user only.
* Create the user's profile.
* Reject duplicate profile creation.

Return:

```text
201 Created
```

---

### GET /profile

Requirements:

* Authenticated user only.
* Return the authenticated user's profile.

---

### PUT /profile

Requirements:

* Authenticated user only.
* Update profile information.
* Support partial updates where appropriate.
* Never modify another user's profile.

---

## 5. Business Rules

Enforce:

* One profile per user.
* Users can only access their own profile.
* Profile cannot exist without a user.
* Profile creation is allowed only once.

---

## 6. Swagger Documentation

Document every endpoint.

Include:

* Authentication
* Request schema
* Response schema
* Success responses
* Error responses

Swagger must remain synchronized with the implementation.

---

# Out of Scope

Do not implement:

* Avatar Upload
* Resume Upload
* Social Link Verification
* Portfolio Settings
* Public Portfolio APIs
* Analytics
* Search
* Pagination

These will be implemented in future features.

---

# Deliverables

Expected structure:

```text
src/modules/profile/

profile.route.ts
profile.controller.ts
profile.service.ts
profile.schema.ts
profile.docs.ts
```

Database:

* Profile Prisma Model
* Prisma Migration

---

# Acceptance Criteria

Verify:

* Profile model created successfully.
* Migration executes successfully.
* One profile per user.
* Duplicate profile creation prevented.
* Users can retrieve only their own profile.
* Users can update only their own profile.
* Swagger documentation available.
* No TypeScript errors.
* No linting errors.

---

# Verification

Test:

```http
POST /api/v1/profile

GET /api/v1/profile

PUT /api/v1/profile
```

Expected:

* Profile created successfully.
* Duplicate creation returns `409 Conflict`.
* Authenticated user retrieves their own profile.
* Profile updates successfully.
* Unauthorized requests return `401 Unauthorized`.

---

# AI Implementation Rules

* Implement only the requested scope.
* Reuse existing authentication middleware.
* Keep controllers thin.
* Keep business logic inside services.
* Use Prisma Client directly.
* Validate every request using Zod.
* Document every endpoint in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean and production-ready.
* After implementation, provide:

  * Created files
  * Modified files
  * Installed dependencies
  * Summary of changes
