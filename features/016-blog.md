# Feature 016 - Blog

## Objective

Implement the Blog module for the Portfolio CMS API.

The Blog module manages technical articles displayed on the public portfolio.

Each blog belongs to the authenticated user and supports draft and published workflows.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the Authentication, Media, Query Builder, Swagger, and Shared Infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Blog Model

Create a Prisma `Blog` model.

Fields:

* id
* title
* slug
* excerpt
* content
* coverMediaId
* readTime
* tags (String[])
* status (Enum)
* featured
* publishedAt
* seoTitle
* seoDescription
* userId
* createdAt
* updatedAt

Requirements:

* Relation with User.
* Optional relation with Media.
* `slug` must be unique.
* `status` defaults to `DRAFT`.
* `publishedAt` is nullable.
* Generate and apply the migration.

---

## 2. Create Blog Module

```text
src/modules/blog/

blog.route.ts
blog.controller.ts
blog.service.ts
blog.schema.ts
blog.docs.ts
```

---

## 3. Implement APIs

```http
POST    /api/v1/blogs

GET     /api/v1/blogs

GET     /api/v1/blogs/:id

PUT     /api/v1/blogs/:id

DELETE  /api/v1/blogs/:id
```

All endpoints are protected.

---

## 4. Query Support

Reuse the shared Query Builder.

Support:

* Pagination
* Search
* Filtering
* Sorting

Search:

* title
* excerpt
* tags

Filtering:

* status
* featured

Sorting:

* createdAt
* publishedAt
* title

---

## 5. Business Rules

* Users manage only their own blogs.
* `coverMediaId` must reference an existing Media record when provided.
* `slug` must be unique.
* When status changes to `PUBLISHED`, automatically populate `publishedAt`.
* Draft blogs are not exposed through future public APIs.

---

## 6. Validation

Validate:

* Create Blog
* Update Blog

Rules:

* `title` is required.
* `slug` is required and URL-friendly.
* `content` is required.
* `excerpt` is required.
* `tags` is an array of strings.
* `coverMediaId` is optional.

Use Zod only.

---

## 7. Swagger

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

* Rich Text Editor
* Comments
* Likes
* View Counter
* Scheduled Publishing
* Draft Version History
* AI Content Generation

---

# Deliverables

```text
src/modules/blog/

blog.route.ts
blog.controller.ts
blog.service.ts
blog.schema.ts
blog.docs.ts
```

Database:

* Blog Model
* Prisma Migration

---

# Acceptance Criteria

Verify:

* CRUD operations work.
* Slug uniqueness is enforced.
* Search, filtering, sorting, and pagination work.
* Cover media is validated.
* `publishedAt` is automatically set when publishing.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
POST    /api/v1/blogs

GET     /api/v1/blogs

GET     /api/v1/blogs/:id

PUT     /api/v1/blogs/:id

DELETE  /api/v1/blogs/:id
```

Verify:

* Blog is created successfully.
* Slug uniqueness is enforced.
* Draft and published workflows behave correctly.
* Query Builder features work.
* Swagger endpoints execute successfully.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse Authentication, Media, and Query Builder.
* Validate `coverMediaId` before saving.
* Keep controllers thin.
* Use Prisma Client directly inside services.
* Validate requests with Zod.
* Document all endpoints in Swagger.
* Do not modify unrelated modules.
* Keep the implementation clean, reusable, and production-ready.
