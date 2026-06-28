# Feature 012 - Master Data (Categories)

## Objective

Implement the first Master Data module by introducing reusable Categories.

This feature centralizes category management and refactors the existing Project and Skill modules to use `categoryId` instead of storing category names as strings.

Categories become the single source of truth for dropdowns, filtering, and future master data management.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the existing Authentication, Swagger, Shared Infrastructure, and Query Builder.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Category Model

Create a Prisma `Category` model.

Fields:

* id
* name
* slug
* type
* displayOrder
* isActive
* createdAt
* updatedAt

Requirements:

* `name` must be unique within the same type.
* `slug` must be unique.
* `type` must be an Enum.
* `displayOrder` defaults to `0`.
* `isActive` defaults to `true`.

Supported category types:

```text
PROJECT
SKILL
BLOG
```

Generate and apply the migration.

---

## 2. Refactor Existing Modules

Refactor the following modules:

### Project

Replace:

```text
category (String)
```

with

```text
categoryId
```

Create a relation with `Category`.

---

### Skill

Replace:

```text
category (String)
```

with

```text
categoryId
```

Create a relation with `Category`.

---

Update all related:

* Prisma models
* Zod schemas
* Services
* Swagger documentation

---

## 3. Create Category Module

```text
src/modules/category/

category.route.ts
category.controller.ts
category.service.ts
category.schema.ts
category.docs.ts
```

---

## 4. Implement APIs

### Category CRUD

```http
POST    /api/v1/categories

GET     /api/v1/categories

GET     /api/v1/categories/:id

PUT     /api/v1/categories/:id

DELETE  /api/v1/categories/:id
```

All endpoints are protected.

---

### Dropdown API

```http
GET /api/v1/categories/dropdown?type=PROJECT

GET /api/v1/categories/dropdown?type=SKILL

GET /api/v1/categories/dropdown?type=BLOG
```

Response:

```json
[
  {
    "id": "...",
    "name": "Frontend"
  }
]
```

Only return active categories ordered by `displayOrder`.

---

## 5. Business Rules

* Categories are managed independently.
* Projects and Skills must reference existing categories.
* Categories cannot be deleted while in use.
* Inactive categories should not appear in dropdown APIs.
* Slugs are immutable after creation.

---

## 6. Refactor Existing APIs

Update the existing Project and Skill APIs.

### Create / Update

Accept:

```json
{
  "categoryId": "..."
}
```

instead of

```json
{
  "category": "Frontend"
}
```

### Read

Return the related category object.

Example:

```json
{
  "id": "...",
  "title": "...",
  "category": {
    "id": "...",
    "name": "Frontend"
  }
}
```

---

## 7. Swagger

Document:

* Category CRUD APIs
* Dropdown API
* Updated Project APIs
* Updated Skill APIs

Swagger must remain synchronized with implementation.

---

# Out of Scope

Do not implement:

* Technology Master
* Employment Types
* Blog Tags
* Bulk Import
* Soft Delete
* Category Hierarchy

---

# Deliverables

```text
src/modules/category/

category.route.ts
category.controller.ts
category.service.ts
category.schema.ts
category.docs.ts
```

Database:

* Category Model
* Prisma Migration

Refactor:

* Project Module
* Skill Module

---

# Acceptance Criteria

Verify:

* Category CRUD works.
* Dropdown API works.
* Projects reference `categoryId`.
* Skills reference `categoryId`.
* Existing APIs continue to work with the new relationship.
* Categories in use cannot be deleted.
* Dropdown returns only active categories.
* Swagger reflects all changes.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST   /api/v1/categories

GET    /api/v1/categories

GET    /api/v1/categories/dropdown?type=PROJECT

GET    /api/v1/categories/dropdown?type=SKILL

PUT    /api/v1/categories/:id

DELETE /api/v1/categories/:id
```

Verify:

* Categories are created successfully.
* Project creation accepts `categoryId`.
* Skill creation accepts `categoryId`.
* Dropdown returns active categories only.
* Projects and Skills return populated category information.

---

## AI Implementation Rules

* Implement only the requested scope.
* Refactor Projects and Skills to use `categoryId`.
* Do not break existing API behavior except replacing `category` with `categoryId`.
* Use Prisma relations.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Update Swagger for all affected endpoints.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
