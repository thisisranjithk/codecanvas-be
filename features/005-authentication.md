# Feature 005 - Authentication

## Objective

Implement the authentication module for the Portfolio CMS API.

This feature introduces the first application model (`User`), establishes the standard module structure, and provides secure JWT-based authentication.

This module becomes the reference implementation for all future business modules.

---

## Context

Before implementation:

- Read all documents inside the `docs/` folder.
- Assume all previous foundation features already exist.
- Reuse the existing project structure and shared infrastructure.
- Modify only the files required for this feature.

---

## Scope

### 1. Create User Model

Create the first Prisma model.

Fields:

- id
- fullName
- username
- email
- password
- role
- isActive
- createdAt
- updatedAt

Requirements:

- Email must be unique.
- Username must be unique.
- Password must be stored as a bcrypt hash.
- Role should default to `USER`.
- isActive should default to `true`.
- Use Prisma best practices.

After finalizing the schema:

- Generate Prisma Client.
- Create the first database migration.

---

### 2. Create Authentication Module

Create the following module structure:

```text
src/modules/auth/

auth.routes.ts
auth.controller.ts
auth.service.ts
auth.schema.ts
```

#### Responsibilities

**auth.routes.ts**

- Register authentication endpoints.
- Apply authentication middleware where required.
- Delegate requests to controllers.

**auth.controller.ts**

- Handle HTTP requests and responses.
- Call service methods.
- Return standardized API responses.
- No business logic.

**auth.service.ts**

- Implement authentication business logic.
- Interact directly with Prisma Client.
- Hash passwords.
- Compare passwords.
- Generate JWT tokens.
- Throw application errors when necessary.

**auth.schema.ts**

- Define all Zod validation schemas.
- Export reusable validation schemas.

This structure becomes the standard for future modules.

---

### 3. Request Validation

Create validation schemas for:

- Register
- Login

Requirements:

- Validate every request before reaching the controller.
- Use Zod only.

---

### 4. Authentication APIs

Implement the following endpoints:

```http
POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/me
```

---

### 5. Register

Requirements:

- Validate request.
- Check duplicate email.
- Check duplicate username.
- Hash password using bcrypt.
- Create the user.
- Return a standardized success response.

Never return the password.

---

### 6. Login

Requirements:

- Validate request.
- Verify email.
- Compare password.
- Generate JWT Access Token.
- Return authenticated user information.

Never return the password.

Do not implement Refresh Tokens in this feature.

---

### 7. JWT

Configure:

- JWT Access Token
- JWT Secret
- Token Expiration

Store secrets using environment variables.

---

### 8. Authentication Middleware

Create reusable middleware to:

- Validate JWT Access Token.
- Attach authenticated user to the request.

Future protected routes will reuse this middleware.

---

### 9. Current User Endpoint

Implement:

```http
GET /api/v1/auth/me
```

Requirements:

- Protected endpoint.
- Return authenticated user information.
- Never return the password.

---

## Out of Scope

Do **not** implement:

- Refresh Tokens
- Forgot Password
- Reset Password
- Email Verification
- OAuth
- Social Login
- Two Factor Authentication
- Account Locking
- Session Management

If it is not listed in the Scope section, do not implement it.

---

## Deliverables

Expected module structure:

```text
src/modules/auth/

auth.routes.ts
auth.controller.ts
auth.service.ts
auth.schema.ts
```

Database:

- User Prisma Model
- First Prisma Migration

---

## Acceptance Criteria

Verify the following:

- User model created successfully.
- Prisma migration executes successfully.
- Registration works.
- Login works.
- Passwords are hashed.
- JWT generation works.
- Authentication middleware validates tokens.
- `/api/v1/auth/me` returns the authenticated user.
- Password is never exposed.
- Project compiles successfully.
- No TypeScript errors.
- No linting errors.

---

## Verification

Test the following endpoints:

```http
POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/me
```

Expected results:

- Registration creates a new user.
- Login returns a valid JWT Access Token.
- Protected endpoint returns the authenticated user.
- Invalid credentials return appropriate errors.
- Invalid or expired tokens return `401 Unauthorized`.

---

## AI Implementation Rules

- Implement only the requested scope.
- Do not modify unrelated files.
- Follow the project architecture and API guidelines.
- Keep controllers thin.
- Keep business logic inside services.
- Use Prisma Client directly inside services.
- Validate every request using Zod.
- Never expose passwords.
- Use bcrypt for password hashing.
- Use JWT for authentication.
- Do not implement future authentication features.
- Keep the implementation simple, clean, and production-ready.
- After implementation, provide:

  - Created files
  - Modified files
  - Installed dependencies
  - Summary of changes
