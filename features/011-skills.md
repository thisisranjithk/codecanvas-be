# Feature 011 - Skills

## Objective

Implement the Skills module for the Portfolio CMS API.

The Skills module allows authenticated users to manage their technical and professional skills displayed on the portfolio.

This module supports complete CRUD operations while keeping the implementation simple and lightweight.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Swagger, and Shared Infrastructure.
* Modify only the files required for this feature.

---

# Scope

### 1. Create Skill Model

Create a Prisma `Skill` model.

Fields:

* id
* name
* category
* proficiency
* yearsOfExperience
* displayOrder
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* `proficiency` must be between **0–100**.
* Generate and apply the migration.

---

### 2. Create Skill Module

```text
src/modules/skill/

skill.route.ts
skill.controller.ts
skill.service.ts
skill.schema.ts
skill.docs.ts
```

---

### 3. Implement APIs

```http
POST    /api/v1/skills

GET     /api/v1/skills

GET     /api/v1/skills/:id

PUT     /api/v1/skills/:id

DELETE  /api/v1/skills/:id
```

All endpoints are protected.

---

### 4. Business Rules

* Users can manage only their own skills.
* Skill names are required.
* `proficiency` must be between **0 and 100**.
* `yearsOfExperience` cannot be negative.
* `displayOrder` determines the portfolio display order.

---

### 5. Ordering

Support sorting by:

```text
displayOrder ASC
```

This should be the default order returned by the API.

---

### 6. Swagger

Document every endpoint.

Include:

* Authentication
* Request Schema
* Response Schema
* Error Responses

---

# Out of Scope

Do not implement:

* Search
* Filtering
* Pagination
* Skill Endorsements
* Categories Management
* Analytics

---

# Deliverables

```text
src/modules/skill/

skill.route.ts
skill.controller.ts
skill.service.ts
skill.schema.ts
skill.docs.ts
```

Database:

* Skill Model
* Prisma Migration

---

# Acceptance Criteria

* CRUD operations work.
* Users access only their own skills.
* Skills are returned ordered by `displayOrder`.
* Validation works correctly.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST    /api/v1/skills

GET     /api/v1/skills

GET     /api/v1/skills/:id

PUT     /api/v1/skills/:id

DELETE  /api/v1/skills/:id
```

Verify:

* CRUD operations work correctly.
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
* Keep the implementation simple, clean, and production-ready.
