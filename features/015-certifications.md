# Feature 015 - Certifications

## Objective

Implement the Certifications module for the Portfolio CMS API.

The Certifications module manages the user's professional certifications displayed on the public portfolio.

Each certification belongs to the authenticated user and can optionally reference an uploaded certificate using the Media module.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Media, Swagger, and Shared Infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Certification Model

Create a Prisma `Certification` model.

Fields:

* id
* name
* issuer
* issueDate
* expiryDate
* credentialId
* verificationUrl
* certificateMediaId
* displayOrder
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* Optional relation with Media.
* `displayOrder` defaults to `0`.
* `expiryDate` is nullable.
* `certificateMediaId` is optional.
* Generate and apply the migration.

---

## 2. Create Certification Module

```text
src/modules/certification/

certification.route.ts
certification.controller.ts
certification.service.ts
certification.schema.ts
certification.docs.ts
```

---

## 3. Implement APIs

```http
POST    /api/v1/certifications

GET     /api/v1/certifications

GET     /api/v1/certifications/:id

PUT     /api/v1/certifications/:id

DELETE  /api/v1/certifications/:id
```

All endpoints are protected.

---

## 4. Business Rules

* Users can manage only their own certifications.
* `name`, `issuer`, and `issueDate` are required.
* `certificateMediaId` must reference an existing Media record when provided.
* Deleting a certification must not delete the associated media.
* Records are returned ordered by:

  * `displayOrder ASC`
  * `issueDate DESC`

---

## 5. Validation

Validate:

* Create Certification
* Update Certification

Rules:

* `name` is required.
* `issuer` is required.
* `issueDate` is required.
* `expiryDate` is optional.
* `verificationUrl` must be a valid URL when provided.
* `certificateMediaId` is optional.

Use Zod only.

---

## 6. Swagger

Document every endpoint.

Include:

* Authentication
* Request Schema
* Response Schema
* Error Responses

---

# Out of Scope

Do not implement:

* Certification Categories
* Certification Verification
* Auto Expiry Notifications
* Search
* Filtering
* Pagination

---

# Deliverables

```text
src/modules/certification/

certification.route.ts
certification.controller.ts
certification.service.ts
certification.schema.ts
certification.docs.ts
```

Database:

* Certification Model
* Prisma Migration

---

# Acceptance Criteria

Verify:

* CRUD operations work.
* Users access only their own certifications.
* Media references are validated.
* Certifications return ordered by `displayOrder`.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST    /api/v1/certifications

GET     /api/v1/certifications

GET     /api/v1/certifications/:id

PUT     /api/v1/certifications/:id

DELETE  /api/v1/certifications/:id
```

Verify:

* Certification is created successfully.
* Optional certificate attachment works using `certificateMediaId`.
* Verification URL is validated.
* Ordering is respected.
* Unauthorized access is blocked.
* Swagger endpoints execute successfully.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse Authentication and Media modules.
* Validate `certificateMediaId` before saving.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Document all endpoints in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
