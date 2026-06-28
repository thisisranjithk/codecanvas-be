# Feature 014 - Education

## Objective

Implement the Education module for the Portfolio CMS API.

The Education module manages the user's academic history displayed on the public portfolio.

Each education record belongs to the authenticated user.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Swagger, and Shared Infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Education Model

Create a Prisma `Education` model.

Fields:

* id
* institution
* degree
* fieldOfStudy
* startDate
* endDate
* gpa
* location
* description
* activities (String[])
* displayOrder
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* `displayOrder` defaults to `0`.
* `endDate` is nullable.
* Generate and apply the migration.

---

## 2. Create Education Module

```text id="m1pc4v"
src/modules/education/

education.route.ts
education.controller.ts
education.service.ts
education.schema.ts
education.docs.ts
```

---

## 3. Implement APIs

```http id="2jfd3w"
POST    /api/v1/educations

GET     /api/v1/educations

GET     /api/v1/educations/:id

PUT     /api/v1/educations/:id

DELETE  /api/v1/educations/:id
```

All endpoints are protected.

---

## 4. Business Rules

* Users can manage only their own education records.
* `institution`, `degree`, `fieldOfStudy`, and `startDate` are required.
* `endDate` is optional.
* Records are returned ordered by:

  * `displayOrder ASC`
  * `startDate DESC`

---

## 5. Validation

Validate:

* Create Education
* Update Education

Rules:

* `institution` is required.
* `degree` is required.
* `fieldOfStudy` is required.
* `startDate` is required.
* `activities` is an array of strings.
* `gpa` is optional.

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

* Degree Master
* Institution Master
* Transcript Upload
* Certificate Upload
* Search
* Filtering
* Pagination

---

# Deliverables

```text id="0rmdgj"
src/modules/education/

education.route.ts
education.controller.ts
education.service.ts
education.schema.ts
education.docs.ts
```

Database:

* Education Model
* Prisma Migration

---

# Acceptance Criteria

Verify:

* CRUD operations work.
* Users access only their own education records.
* Records are returned in the correct order.
* Validation works correctly.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http id="7tkpfd"
POST    /api/v1/educations

GET     /api/v1/educations

GET     /api/v1/educations/:id

PUT     /api/v1/educations/:id

DELETE  /api/v1/educations/:id
```

Verify:

* Education record is created successfully.
* Education record is updated successfully.
* Education record is deleted successfully.
* Ordering is respected.
* Unauthorized access is blocked.
* Swagger endpoints execute successfully.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse Authentication and Shared Infrastructure.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Document all endpoints in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
