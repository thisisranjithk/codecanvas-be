# Feature 021 - Authentication v2 (Refresh Token + Cookie Authentication)

## Objective

Upgrade the existing authentication system to a production-ready authentication architecture using short-lived Access Tokens and long-lived Refresh Tokens.

The goal is to eliminate frontend localStorage token storage and replace it with a secure cookie-based refresh token flow while maintaining backward compatibility with the existing authentication module wherever possible.

---

# Context

Read all existing authentication-related modules before implementation.

Reuse the existing

* Authentication middleware
* User module
* JWT utilities
* Swagger setup
* Validation utilities
* Error handling
* Response helpers

Modify only the files required for this feature.

---

# Goal

Implement a production-ready authentication flow.

Authentication should use

* Short-lived Access Token
* Long-lived Refresh Token
* Refresh Token Rotation
* HttpOnly Cookies
* Automatic Session Restoration
* Secure Logout

---

# Existing APIs

These APIs already exist.

```http
POST   /api/v1/auth/register

POST   /api/v1/auth/login

GET    /api/v1/auth/me

PUT    /api/v1/auth/change-password

DELETE /api/v1/auth/account
```

Maintain compatibility with these endpoints.

---

# New APIs

Implement

```http
POST   /api/v1/auth/refresh

POST   /api/v1/auth/logout
```

Both endpoints should be documented in Swagger.

---

# Refresh Token Storage

Do not return the Refresh Token in the JSON response.

Instead

* Generate a Refresh Token
* Store it as an HttpOnly Cookie
* Secure
* SameSite=Lax (configurable)
* Path=/
* MaxAge configurable

The frontend should never have direct access to the Refresh Token.

---

# Access Token

The Login API should continue returning

```json
{
  "success": true,
  "message": "...",
  "data": {
    "user": {},
    "accessToken": "..."
  }
}
```

The Access Token should

* expire in approximately 15 minutes
* never be persisted by the backend
* be regenerated through the Refresh API

---

# Refresh Token Rotation

Every successful refresh request must

* Validate the existing Refresh Token
* Issue a brand-new Access Token
* Generate a brand-new Refresh Token
* Replace the existing Refresh Cookie
* Invalidate the previous Refresh Token

Never reuse Refresh Tokens.

---

# Database Changes

Extend the User model.

Suggested fields

```text
refreshToken

refreshTokenExpiresAt
```

Do not store raw Refresh Tokens.

Hash them before saving.

---

# Login Flow

After successful login

* Validate credentials
* Generate Access Token
* Generate Refresh Token
* Save hashed Refresh Token
* Set Refresh Token Cookie
* Return User
* Return Access Token

---

# Refresh Flow

```text
Client

↓

Refresh Cookie

↓

Validate Cookie

↓

Compare Hashed Refresh Token

↓

Generate New Access Token

↓

Generate New Refresh Token

↓

Update Database

↓

Replace Cookie

↓

Return New Access Token
```

---

# Logout Flow

Logout should

* Remove Refresh Token from database
* Clear Refresh Cookie
* Return success response

The frontend should no longer be able to refresh the session.

---

# Register Flow

Registration behavior should remain unchanged.

Do not automatically log users in unless the current business logic already supports it.

---

# Change Password

When password changes

* Invalidate Refresh Token
* Remove stored Refresh Token
* Clear Refresh Cookie

Force the user to log in again.

---

# Delete Account

When deleting an account

* Validate password
* Delete user
* Clear Refresh Cookie

---

# JWT Utilities

Separate token generation.

Example

```text
generateAccessToken()

generateRefreshToken()

verifyAccessToken()

verifyRefreshToken()
```

Keep responsibilities separated.

---

# Environment Variables

Add configurable environment variables.

Example

```text
ACCESS_TOKEN_SECRET

ACCESS_TOKEN_EXPIRES_IN

REFRESH_TOKEN_SECRET

REFRESH_TOKEN_EXPIRES_IN

COOKIE_SECURE

COOKIE_SAME_SITE

COOKIE_DOMAIN
```

Do not hardcode values.

---

# Cookie Configuration

Cookies should support production environments.

Use configuration instead of hardcoded values.

Support

* Development
* Production

---

# Security

Implement the following

* HttpOnly Refresh Cookie
* Secure Cookie
* SameSite Policy
* Refresh Token Rotation
* Hashed Refresh Tokens
* Token Expiration
* Token Revocation
* Invalid Token Detection

Do not expose Refresh Tokens.

---

# Swagger

Update Swagger.

Document

```http
POST /auth/login

POST /auth/refresh

POST /auth/logout
```

Include

* Request
* Response
* Cookies
* Authentication requirements
* Error responses

---

# Validation

Validate

Refresh Token

Logout

using Zod.

---

# Business Rules

* One active Refresh Token per user.
* Refresh Token rotation is mandatory.
* Expired Refresh Tokens are rejected.
* Invalid Refresh Tokens are rejected.
* Revoked Refresh Tokens are rejected.
* Access Tokens are never stored in the database.
* Refresh Tokens are always hashed before persistence.

---

# Deliverables

Authentication

* Updated Login
* Refresh API
* Logout API
* Updated JWT utilities
* Cookie helper
* Refresh Token persistence
* Updated authentication middleware (if required)

Database

* Refresh Token fields
* Migration

Swagger

* Updated authentication documentation

---

# Acceptance Criteria

Verify

✓ Login returns Access Token.

✓ Refresh Cookie is created.

✓ Refresh API returns a new Access Token.

✓ Refresh Token rotates after every refresh.

✓ Previous Refresh Token becomes invalid.

✓ Logout clears the Refresh Cookie.

✓ Password change invalidates active sessions.

✓ Delete account clears active sessions.

✓ Swagger documentation is updated.

✓ Zero TypeScript errors.

✓ Zero ESLint errors.

---

# Verification

Test

```http
POST /auth/login

↓

POST /auth/refresh

↓

POST /auth/refresh

↓

POST /auth/logout

↓

POST /auth/refresh
```

Verify

* Refresh rotation works.
* Previous Refresh Token cannot be reused.
* Logout prevents further refreshes.
* Access Tokens continue to authenticate protected endpoints.
* Refresh Cookie is never exposed in API responses.

---

# AI Implementation Rules

* Reuse the existing authentication module.
* Keep controllers thin.
* Keep business logic inside services.
* Validate requests using Zod.
* Reuse existing utilities wherever possible.
* Do not introduce unrelated architectural changes.
* Keep the implementation production-ready, secure, reusable, and maintainable.
* Follow SOLID principles.
* Use functional programming only.
* Do not use class-based implementations.
* Document every new endpoint in Swagger.
