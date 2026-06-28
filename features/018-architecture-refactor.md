# Architecture Migration 001 - Convert Portfolio CMS to SaaS

## Objective

Refactor the existing Portfolio CMS backend from a **single-tenant CMS** to a **multi-tenant SaaS Portfolio CMS**.

The application must support multiple registered users, where each user owns and manages their own portfolio.

This migration updates the authentication assumptions, authorization strategy, and public portfolio APIs.

This is an architectural migration. Modify only the files required.

---

# Context

Read all documentation inside the `docs/` directory before making any changes.

Current implementation already includes:

* Authentication
* Authorization
* Profile
* Media
* Projects
* Skills
* Categories
* Experience
* Education
* Certifications
* Blog
* Public Portfolio API

Reuse the existing architecture.

Do not recreate existing modules.

---

# Business Rules

The application is now a SaaS product.

Every registered user owns exactly one portfolio.

Every business resource belongs to exactly one user.

The **username** is the user's permanent public identity.

The username is used for:

* Authentication
* Public Portfolio URLs

Usernames are immutable after account creation.

Do not implement username updates.

---

# 1. Update User Model

Review the existing User model.

Ensure the following business rules:

* `username` must be unique.
* Store usernames in lowercase.
* Username must be URL-safe.
* Username cannot be updated after registration.
* Existing authentication continues to use `username`.

If required, update validation schemas accordingly.

---

# 2. Update Role Responsibilities

## USER

Represents a customer of the SaaS platform.

A USER can:

* Manage their own Profile
* Manage their own Projects
* Manage their own Skills
* Manage their own Experience
* Manage their own Education
* Manage their own Certifications
* Manage their own Blogs
* Manage their own Media
* Manage their own Categories
* Manage their own Settings
* View their own Dashboard

Users may never access another user's resources.

---

## ADMIN

Represents the platform administrator.

An ADMIN can:

* Manage users
* View all portfolios
* Access every business resource
* Suspend users
* Delete users
* Manage platform configuration

The ADMIN role is not the portfolio owner.

---

# 3. Refactor Authorization

Review every protected module.

Replace any remaining role-based ownership assumptions.

Authorization rules:

* USER → Own resources only.
* ADMIN → Access all resources.

Ownership must always be validated using `userId`.

Do not rely on the user's role to determine ownership.

---

# 4. Refactor Public Portfolio APIs

Replace the current Portfolio API implementation.

Use the following routes:

```http
GET /api/v1/portfolio/:username

GET /api/v1/portfolio/:username/projects

GET /api/v1/portfolio/:username/projects/:id

GET /api/v1/portfolio/:username/blogs

GET /api/v1/portfolio/:username/blogs/:slug
```

Resolve portfolios using the `username`.

Do not use:

* First User
* First ADMIN
* Authenticated User

Return **404 Not Found** if the username does not exist.

---

# 5. Portfolio Response

The Portfolio module acts as a Backend For Frontend (BFF).

Return frontend-friendly view models.

Profile response should include:

* fullName
* username
* headline
* bio
* location
* github
* linkedin
* twitter
* website
* avatarUrl

Do not expose:

* id
* userId
* createdAt
* updatedAt
* internal foreign keys

unless explicitly required.

---

# 6. Resource Ownership

Review every business module.

Ensure CRUD operations always validate ownership.

Modules include:

* Profile
* Media
* Projects
* Skills
* Categories
* Experience
* Education
* Certifications
* Blogs

Users must never access another user's data.

---

# 7. Swagger

Update Swagger documentation.

Reflect the new Portfolio endpoints.

Update request and response examples where necessary.

---

# 8. Development Database Reset

This project is still under active development.

No existing data needs to be preserved.

After completing the migration:

* Generate the required Prisma migration.
* Reset the development database using Prisma.
* Reapply all migrations.
* Execute the seed script if one exists.
* Verify the schema matches the updated implementation.

Do **not** manually truncate individual tables.

Use Prisma's reset workflow so the database schema, migrations, and data remain consistent.

---

# Out of Scope

Do not implement:

* Subscription Plans
* Billing
* Teams
* Organizations
* Custom Domains
* Public User Search
* Email Verification
* Platform Analytics

---

# Acceptance Criteria

Verify:

* USER manages only their own resources.
* ADMIN can access every resource.
* Portfolio APIs resolve portfolios using username.
* Invalid usernames return 404.
* Username cannot be updated.
* Portfolio responses return frontend-friendly view models.
* Swagger reflects the new API design.
* Development database has been reset successfully.
* No TypeScript or linting errors.

---

# Verification Checklist

Authentication

* USER login works.
* ADMIN login works.

Authorization

* USER cannot access another user's resources.
* ADMIN can access all resources.

Portfolio

```http
GET /api/v1/portfolio/johndoe

GET /api/v1/portfolio/ranjithk
```

Verify:

* Correct portfolio is returned.
* Wrong username returns 404.
* Profile includes fullName and username.
* Internal fields are not exposed.

Database

* Prisma migration generated.
* Database reset completed.
* Seed executed (if available).

Swagger

* Portfolio endpoints updated.
* All examples updated.
* Endpoints execute successfully.

---

# AI Implementation Rules

* Implement only the requested scope.
* Reuse the existing architecture.
* Do not recreate modules.
* Modify only the required files.
* Preserve existing business logic where possible.
* Keep controllers thin.
* Keep services responsible for business logic.
* Update Swagger documentation.
* Do not manually truncate database tables.
* Use the Prisma reset workflow.
* After implementation, provide:

  * Modified files
  * Database changes
  * Migration summary
  * Breaking changes
  * Verification summary
