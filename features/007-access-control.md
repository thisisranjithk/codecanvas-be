# Feature 007 - Access Control

## Objective

Implement application-level access control for the Portfolio CMS API.

This feature introduces reusable middleware to protect private APIs and enforce role-based access where required.

The implementation should remain simple and extensible for future roles.

---

## Context

Before implementation:

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the existing authentication module and shared infrastructure.
* Modify only the files required for this feature.

---

## Scope

### 1. Define User Roles

Define application roles.

Initial roles:

* ADMIN
* USER

Requirements:

* Use Prisma Enum.
* Default role should remain `USER`.
* Keep the implementation extensible for future roles.

---

### 2. Authentication Middleware

Review and refine the existing JWT middleware.

Responsibilities:

* Validate JWT Access Token.
* Extract authenticated user.
* Attach the authenticated user to the request.
* Reject invalid or expired tokens.

This middleware should remain reusable across all protected routes.

---

### 3. Authorization Middleware

Create reusable middleware to authorize users based on roles.

Requirements:

* Accept one or more allowed roles.
* Return `403 Forbidden` for unauthorized users.
* Keep the middleware generic for reuse across future modules.

Example usage:

```ts
authorize("ADMIN")

authorize("ADMIN", "USER")
```

---

### 4. Protect Existing Endpoints

Apply middleware where appropriate.

Examples:

```http
GET /api/v1/auth/me
```

Protected:

* Authentication Required

Future CMS modules should also use this middleware.

---

### 5. Route Protection Strategy

Define the project rule.

Protected APIs:

```text
/api/v1/auth/me

/api/v1/profile

/api/v1/projects

/api/v1/skills

/api/v1/blog

/api/v1/settings
```

Public APIs:

```text
/api/v1/health

/api-docs

/api/v1/auth/login

/api/v1/auth/register

/api/v1/portfolio/*
```

---

### 6. Swagger Integration

Update Swagger documentation.

Requirements:

* Protected endpoints must display Bearer Authentication.
* Public endpoints must remain accessible without authentication.

---

## Out of Scope

Do not implement:

* Refresh Tokens
* Permission Matrix
* OAuth
* Fine-grained Permissions
* Resource Ownership
* Multi-Tenant Authorization

If it is not listed in the Scope section, do not implement it.

---

## Deliverables

Expected additions:

```text
src/

shared/
└── middleware/
    ├── authenticate.ts
    └── authorize.ts
```

Only create files required for this feature.

---

## Acceptance Criteria

Verify the following:

* JWT middleware validates tokens correctly.
* Authorization middleware restricts access based on roles.
* Unauthorized requests return `401 Unauthorized`.
* Forbidden requests return `403 Forbidden`.
* Protected APIs require authentication.
* Swagger reflects authentication requirements.
* No TypeScript errors.
* No linting errors.

---

## Verification

Verify:

```http
GET /api/v1/auth/me
```

Without token:

```http
401 Unauthorized
```

With valid token:

```http
200 OK
```

Attempt access using an unauthorized role:

```http
403 Forbidden
```

Swagger should correctly indicate which endpoints require authentication.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse the existing authentication module.
* Keep middleware generic and reusable.
* Do not implement permission-based authorization.
* Do not modify unrelated modules.
* Update Swagger documentation for protected endpoints.
* Keep the implementation simple and production-ready.
* After implementation, provide:

  * Created files
  * Modified files
  * Installed dependencies
  * Summary of changes
