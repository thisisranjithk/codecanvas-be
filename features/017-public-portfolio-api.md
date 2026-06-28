# Feature 017 - Public Portfolio API

## Objective

Implement the Public Portfolio API for the Portfolio CMS.

This feature exposes a read-only API that aggregates portfolio data into frontend-friendly responses.

The Portfolio API serves as the Backend For Frontend (BFF) for the portfolio website.

---

## Context

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse existing modules.
* Modify only the files required for this feature.

---

# Scope

## 1. Create Portfolio Module

Create a dedicated module.

```text
src/modules/portfolio/

portfolio.route.ts

portfolio.controller.ts

portfolio.service.ts

portfolio.docs.ts
```

No schema file is required because this module exposes read-only APIs.

---

## 2. Homepage API

Implement

```http
GET /api/v1/portfolio
```

Return:

* Profile
* Featured Projects
* Skills
* Experience
* Education
* Featured Certifications
* Latest Published Blogs

Return one optimized response.

The frontend should require only one request to render the homepage.

---

## 3. Project APIs

Implement

```http
GET /api/v1/portfolio/projects

GET /api/v1/portfolio/projects/:id
```

Requirements:

* Return only published projects.
* Support pagination.
* Support search.
* Support filtering.
* Reuse the shared Query Builder.

---

## 4. Blog APIs

Implement

```http
GET /api/v1/portfolio/blogs

GET /api/v1/portfolio/blogs/:slug
```

Requirements:

* Return only published blogs.
* Support pagination.
* Support search.
* Support tags filtering.
* Reuse the shared Query Builder.

---

## 5. Business Rules

The Public Portfolio API must never expose:

* Draft Projects
* Draft Blogs
* Private Data
* User Credentials
* Internal IDs
* Settings
* Authentication Information

Return only publicly visible information.

---

## 6. Data Aggregation

The homepage endpoint should aggregate data from:

* Profile
* Projects
* Skills
* Experience
* Education
* Certifications
* Blogs

Do not duplicate business logic.

Reuse existing services whenever possible.

---

## 7. Swagger

Document every endpoint.

Include:

* Query Parameters
* Response Schemas
* Error Responses

Authentication is not required.

---

# Out of Scope

Do not implement:

* Portfolio Analytics
* Portfolio Views
* Portfolio Themes
* Portfolio Search Engine
* GraphQL
* Caching

---

# Deliverables

```text
src/modules/portfolio/

portfolio.route.ts

portfolio.controller.ts

portfolio.service.ts

portfolio.docs.ts
```

---

# Acceptance Criteria

Verify:

* Homepage API returns aggregated data.
* Projects endpoint returns only published projects.
* Blogs endpoint returns only published blogs.
* Draft content is never exposed.
* Pagination works.
* Search works.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
GET /api/v1/portfolio

GET /api/v1/portfolio/projects

GET /api/v1/portfolio/projects/:id

GET /api/v1/portfolio/blogs

GET /api/v1/portfolio/blogs/:slug
```

Verify:

* Homepage loads with one request.
* Projects are publicly accessible.
* Blogs are publicly accessible.
* Draft content is hidden.
* Swagger endpoints execute successfully.

---

## AI Implementation Rules

* Implement only the requested scope.
* Reuse existing business modules.
* Do not duplicate business logic.
* Keep controllers thin.
* Keep the service focused on data aggregation.
* Do not expose private or internal data.
* Document every endpoint in Swagger.
* Keep the implementation clean, scalable, and production-ready.
