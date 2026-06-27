# Feature 010 - Projects

## Objective

Implement the Projects module for the Portfolio CMS API.

This feature includes complete project management with CRUD operations and introduces a reusable query utility for pagination, searching, filtering, and sorting that future modules can reuse.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Media, Swagger, and Shared Infrastructure modules.
* Modify only the files required for this feature.

---

# Scope

### 1. Create Project Model

Create a Prisma `Project` model.

Fields:

* id
* title
* description
* category
* status (Enum)
* technologies (String[])
* liveUrl
* githubUrl
* featured
* thumbnailMediaId
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* Optional relation with Media.
* Generate and apply migration.

---

### 2. Create Project Module

```text
src/modules/project/

project.route.ts
project.controller.ts
project.service.ts
project.schema.ts
project.docs.ts
```

---

### 3. Create Shared Query Utility

Create a reusable query utility.

```text
src/shared/utils/

query-builder.ts
```

Responsibilities:

* Pagination
* Searching
* Filtering
* Sorting

This utility must be generic and reusable across all future modules.

---

### 4. Implement APIs

```http
POST    /api/v1/projects

GET     /api/v1/projects

GET     /api/v1/projects/:id

PUT     /api/v1/projects/:id

DELETE  /api/v1/projects/:id
```

All endpoints are protected.

---

### 5. Features

Support:

* Create
* Update
* Delete
* Get by ID
* List Projects
* Pagination
* Search
* Filter
* Sort

---

### 6. Business Rules

* Users can access only their own projects.
* `thumbnailMediaId` must reference an existing Media record.
* Deleting a project must not delete media.
* Draft projects remain private.

---

### 7. Swagger

Document every endpoint.

Include:

* Authentication
* Request Schema
* Response Schema
* Query Parameters
* Error Responses

---

# Out of Scope

Do not implement:

* Public Portfolio APIs
* Multiple Images
* Gallery
* Analytics
* Project Views
* Likes
* Comments

---

# Deliverables

```text
src/modules/project/

project.route.ts
project.controller.ts
project.service.ts
project.schema.ts
project.docs.ts

src/shared/utils/

query-builder.ts
```

Database:

* Project Model
* Prisma Migration

---

# Acceptance Criteria

* CRUD operations work.
* Pagination works.
* Search works.
* Filtering works.
* Sorting works.
* Users access only their own projects.
* Media references are validated.
* Swagger documentation is available.
* Query Builder is reusable by future modules.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST    /api/v1/projects

GET     /api/v1/projects

GET     /api/v1/projects/:id

PUT     /api/v1/projects/:id

DELETE  /api/v1/projects/:id
```

Verify:

* CRUD works correctly.
* Search, filter, sort, and pagination work as expected.
* Ownership is enforced.
* Swagger testing works.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse Authentication and Media modules.
* Use the shared Query Builder for list APIs.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Document all endpoints in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
