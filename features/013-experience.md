# Feature 013 - Experience

## Objective

Implement the Experience module for the Portfolio CMS API.

The Experience module manages the user's professional work history displayed on the public portfolio.

Each experience belongs to the authenticated user and references an Employment Type from the Category module.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Category, Swagger, and Shared Infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Experience Model

Create a Prisma `Experience` model.

Fields:

* id
* company
* role
* employmentTypeId
* location
* startDate
* endDate
* isCurrent
* description
* responsibilities (String[])
* technologies (String[])
* displayOrder
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* Relation with Category (`EMPLOYMENT_TYPE`).
* `displayOrder` defaults to `0`.
* `endDate` must be nullable.
* Generate and apply the migration.

---

## 2. Create Experience Module

```text
src/modules/experience/

experience.route.ts
experience.controller.ts
experience.service.ts
experience.schema.ts
experience.docs.ts
```

---

## 3. Implement APIs

```http
POST    /api/v1/experiences

GET     /api/v1/experiences

GET     /api/v1/experiences/:id

PUT     /api/v1/experiences/:id

DELETE  /api/v1/experiences/:id
```

All endpoints are protected.

---

## 4. Business Rules

* Users can manage only their own experiences.
* `employmentTypeId` must reference an active Category with type `EMPLOYMENT_TYPE`.
* If `isCurrent` is `true`, `endDate` must be `null`.
* If `isCurrent` is `false`, `endDate` is required.
* Experiences are returned ordered by:

  * `displayOrder ASC`
  * `startDate DESC`

---

## 5. Validation

Validate:

* Create Experience
* Update Experience

Rules:

* `company` is required.
* `role` is required.
* `employmentTypeId` is required.
* `startDate` is required.
* `endDate` depends on `isCurrent`.
* `technologies` is an array of strings.
* `responsibilities` is an array of strings.

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

* Company Master
* Company Logos
* Company Verification
* Resume Generation
* Search
* Filtering
* Pagination

---

# Deliverables

```text
src/modules/experience/

experience.route.ts
experience.controller.ts
experience.service.ts
experience.schema.ts
experience.docs.ts
```

Database:

* Experience Model
* Prisma Migration

---

# Acceptance Criteria

Verify:

* CRUD operations work.
* Users access only their own experiences.
* Employment Type is validated.
* Current employment validation works.
* Experiences are ordered correctly.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST    /api/v1/experiences

GET     /api/v1/experiences

GET     /api/v1/experiences/:id

PUT     /api/v1/experiences/:id

DELETE  /api/v1/experiences/:id
```

Verify:

* Experience is created successfully.
* `employmentTypeId` references an existing Employment Type.
* Current employment cannot have an `endDate`.
* Previous employment must have an `endDate`.
* Experiences return in the correct order.
* Unauthorized access is blocked.
* Swagger endpoints execute successfully.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse Authentication and Category modules.
* Validate `employmentTypeId` before saving.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Document all endpoints in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
