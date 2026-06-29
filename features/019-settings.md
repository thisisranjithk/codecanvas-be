# Feature 019 - Portfolio & Security Settings

## Objective

Implement the remaining Settings functionality for the Portfolio CMS.

The **Profile** tab has already been implemented.

The **Notifications** tab is intentionally deferred to a future feature.

This feature implements only:

* Portfolio Settings
* Security Settings

Reuse the existing modules.

Do **not** create a new `Settings` module or a new database table.

---

# Context

Read all documents inside the `docs/` folder before implementation.

Current implementation already includes:

* Authentication
* Authorization
* Profile
* Media
* Public Portfolio API
* SaaS Architecture
* Swagger

Modify only the files required.

---

# Scope

## 1. Portfolio Settings

Extend the existing **Profile** model.

Add the following fields:

* portfolioVisibility
* showEmail
* openToWork

Portfolio Visibility:

```text
PUBLIC

PRIVATE
```

Default values:

```text
portfolioVisibility = PUBLIC

showEmail = false

openToWork = false
```

Generate and apply the required Prisma migration.

---

## 2. Portfolio Settings APIs

Implement:

```http
GET /api/v1/profile/portfolio-settings

PUT /api/v1/profile/portfolio-settings
```

The authenticated user may only manage their own portfolio settings.

---

## 3. Portfolio Visibility

When

```text
portfolioVisibility = PRIVATE
```

the following endpoints must behave as if the portfolio does not exist:

```http
GET /api/v1/portfolio/:username

GET /api/v1/portfolio/:username/projects

GET /api/v1/portfolio/:username/projects/:id

GET /api/v1/portfolio/:username/blogs

GET /api/v1/portfolio/:username/blogs/:slug
```

Return

```http
404 Not Found
```

Do not expose any information about private portfolios.

---

# Security

Reuse the existing Authentication module.

Do not create a new Security module.

---

## 4. Change Password

Implement:

```http
PUT /api/v1/auth/change-password
```

Request

```json
{
  "currentPassword": "",
  "newPassword": "",
  "confirmPassword": ""
}
```

Business Rules

* Verify the current password.
* Validate the new password.
* Confirm both passwords match.
* Reject if the new password is the same as the current password.
* Hash the new password.
* Update the stored password.
* Invalidate all existing refresh tokens.
* Return a success response.

---

## 5. Delete Account

Implement

```http
DELETE /api/v1/auth/account
```

Request

```json
{
  "password": ""
}
```

Business Rules

* Verify the user's current password.
* Delete only the authenticated user's account.
* Permanently delete all resources owned by the user.
* Delete all associated media records.
* Delete Cloudinary assets where applicable.
* Invalidate all authentication tokens.
* Execute all database operations within a single Prisma transaction.
* Return a success response.

This operation is irreversible.

---

## Resources to Delete

The following resources must be removed:

* User
* Profile
* Projects
* Skills
* Categories owned by the user
* Experience
* Education
* Certifications
* Blogs
* Media Records
* Refresh Tokens

Delete only resources owned by the authenticated user.

Do not affect other users.

---

## 6. Swagger

Update Swagger documentation.

Document:

* Portfolio Settings APIs
* Change Password API
* Delete Account API

Swagger must remain synchronized with implementation.

---

# Out of Scope

Do not implement:

* Notification Settings
* Email Preferences
* Username Update
* Email Update
* Two-Factor Authentication
* Account Recovery
* Soft Delete
* GDPR Export

---

# Acceptance Criteria

Portfolio Settings

* User can retrieve portfolio settings.
* User can update portfolio settings.
* Public Portfolio API respects portfolio visibility.

Security

* Password change works correctly.
* Old password no longer works.
* New password works immediately.
* Refresh tokens are invalidated.

Delete Account

* Password verification is required.
* Only the authenticated user's data is deleted.
* Cloudinary assets are removed.
* Prisma transaction completes successfully.
* Other users' data remains untouched.

Swagger

* All new endpoints are documented.

General

* No TypeScript errors.
* No linting errors.

---

# Verification

Test

```http
GET /api/v1/profile/portfolio-settings

PUT /api/v1/profile/portfolio-settings

PUT /api/v1/auth/change-password

DELETE /api/v1/auth/account
```

Verify

* Portfolio visibility affects the Public Portfolio API.
* Password updates successfully.
* Refresh tokens are invalidated.
* Account deletion removes all owned resources.
* Cloudinary assets are deleted.
* Swagger endpoints execute successfully.

---

# AI Implementation Rules

* Implement only the requested scope.
* Reuse the existing Profile module.
* Reuse the existing Authentication module.
* Do not create a new Settings module.
* Do not create a new database table.
* Keep controllers thin.
* Keep business logic inside services.
* Use a dedicated account deletion service for tenant cleanup.
* Execute account deletion using a Prisma transaction.
* Update Swagger documentation.
* Modify only the required files.
* Preserve the existing architecture.
* After implementation provide:

  * Modified files
  * Database migration summary
  * API summary
  * Verification summary
  * Breaking changes (if any)
