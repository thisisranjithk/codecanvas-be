# Feature 006 - API Documentation (Swagger)

## Objective

Integrate Swagger UI into the Portfolio CMS API to provide an interactive API testing environment during development.

Swagger should become the primary tool for manually testing APIs without requiring Postman.

From this feature onwards, every newly implemented endpoint must also be documented in Swagger.

---

## Context

Before implementation:

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the existing project structure.
* Modify only the files required for this feature.

---

# Scope

## 1. Install Dependencies

Install the required packages:

* swagger-ui-express
* @asteasolutions/zod-to-openapi

Do not install additional Swagger libraries.

---

## 2. Configure OpenAPI

Create a centralized Swagger configuration.

Configure:

* API Title
* Description
* Version
* Contact Information
* License
* Development Server URL

The configuration must be reusable across the application.

---

## 3. Configure Swagger UI

Expose Swagger UI at:

```http
GET /api-docs
```

Swagger should be available only in the development environment.

---

## 4. Configure JWT Authentication

Add Bearer Authentication.

Requirements:

* HTTP Bearer Scheme
* JWT Format

Protected APIs should support authorization directly from Swagger UI.

---

## 5. Organize Documentation

Swagger documentation should live alongside each feature module.

Example:

```text
src/modules/

auth/
├── auth.route.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.schema.ts
└── auth.docs.ts
```

Create a central registry.

Expected structure:

```text
src/config/

swagger.ts
```

Responsibilities:

* Create the OpenAPI registry.
* Import all module documentation.
* Generate the final OpenAPI document.
* Export the Swagger configuration.

---

## 6. Document Existing APIs

Document every currently implemented endpoint.

This includes:

```http
GET /api/v1/health

POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/me
```

Reuse existing Zod schemas wherever possible.

Avoid duplicating request and response models.

---

## 7. Integrate with Express

Register Swagger UI inside the Express application.

Swagger should not interfere with API routing.

---

# Out of Scope

Do not implement:

* Business Logic
* Authentication Changes
* Route Refactoring
* Validation Changes
* Testing Frameworks
* API Client Generation
* Code Generation

---

# Deliverables

Expected additions:

```text
src/

config/
└── swagger.ts

modules/

auth/
└── auth.docs.ts

health/
└── health.docs.ts
```

Only create files required for this feature.

---

# Acceptance Criteria

Verify the following:

* Swagger UI loads successfully.
* Swagger is available at `/api-docs`.
* Health endpoint is documented.
* Authentication endpoints are documented.
* JWT Authorize button is available.
* Existing APIs can be executed directly from Swagger UI.
* Request validation schemas are visible.
* Response schemas are visible.
* No TypeScript errors.
* No linting errors.

---

# Verification

Start the application.

Open:

```http
GET /api-docs
```

Verify:

* Swagger UI loads.
* Health endpoint works.
* Registration works.
* Login works.
* JWT Authorize works.
* `/auth/me` works after authorization.

No Postman should be required for manual API testing.

---

# Definition of Done

This feature is complete only if:

* Every currently implemented endpoint appears in Swagger.
* Every endpoint is executable from Swagger UI.
* Swagger reflects the actual implementation.
* There is no duplicate request or response schema definition.

From this point onward, every new API added to the project must include its Swagger documentation as part of the same feature.

---

## AI Implementation Rules

* Implement only the requested scope.
* Keep Swagger configuration modular.
* Co-locate documentation with feature modules.
* Use existing Zod schemas whenever possible.
* Do not duplicate request models.
* Do not modify unrelated modules.
* Keep the implementation clean, scalable, and production-ready.
* After implementation, provide:

  * Created files
  * Modified files
  * Installed dependencies
  * Summary of changes
