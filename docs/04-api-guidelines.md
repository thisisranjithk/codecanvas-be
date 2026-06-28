# 04 - API Guidelines

# API Guidelines

## Purpose

This document defines the API standards for the Portfolio CMS API.

Every endpoint must follow these conventions to ensure consistency, predictability, and a great developer experience.

---

# API Categories

The application exposes two types of APIs.

## CMS APIs

Protected APIs used by authenticated users to manage their own portfolio.

Base URL:

```text
/api/v1
```

Examples:

```text
/api/v1/projects
/api/v1/skills
/api/v1/profile
/api/v1/blogs
```

Authentication is required.

Users may only access resources they own.

---

## Public Portfolio APIs

Read-only APIs consumed by portfolio websites.

Base URL:

```text
/api/v1/portfolio/:username
```

Examples:

```text
/api/v1/portfolio/:username

/api/v1/portfolio/:username/projects

/api/v1/portfolio/:username/blogs
```

Authentication is **not** required.

Only public data is returned.

---

# Resource Naming

Use plural nouns.

Examples:

```text
/projects

/skills

/blogs

/certifications
```

Avoid verbs in URLs.

Incorrect:

```text
/createProject

/updateBlog

/deleteSkill
```

---

# HTTP Methods

| Method | Purpose          |
| ------ | ---------------- |
| GET    | Retrieve data    |
| POST   | Create resources |
| PUT    | Update resources |
| DELETE | Remove resources |

Use the appropriate HTTP method for every operation.

---

# Authentication

Protected APIs require:

```http
Authorization: Bearer <access_token>
```

Authentication is handled through middleware.

Controllers should assume authenticated requests.

---

# Authorization

The application follows ownership-based authorization.

Rules:

* USER can access only their own resources.
* ADMIN can access every resource.
* Public Portfolio APIs do not require authentication.

Ownership validation belongs inside the service layer.

---

# Request Validation

Every request must be validated using Zod.

Validation occurs before the controller.

Controllers should never perform manual validation.

---

# Standard Success Response

```json
{
  "success": true,
  "message": "Projects retrieved successfully.",
  "data": {}
}
```

---

# Standard List Response

```json
{
  "success": true,
  "message": "Projects retrieved successfully.",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

Pagination metadata is returned only for paginated endpoints.

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "title",
      "message": "Title is required."
    }
  ]
}
```

Never expose internal server errors.

---

# Pagination

List endpoints that can grow over time should support pagination.

Query Parameters:

```text
?page=1

?limit=10
```

Default:

```text
page = 1

limit = 10
```

Maximum:

```text
limit = 100
```

Simple resources such as Skills or Education do not require pagination.

---

# Searching

Searchable resources use:

```text
?search=
```

Examples:

```text
GET /projects?search=portfolio

GET /blogs?search=react
```

Search should only be implemented where it provides value.

---

# Filtering

Filtering uses explicit query parameters.

Examples:

```text
GET /projects?status=PUBLISHED

GET /projects?featured=true

GET /blogs?status=PUBLISHED
```

Filters should be composable.

---

# Sorting

Sorting uses:

```text
?sort=
```

Examples:

```text
?sort=createdAt

?sort=-createdAt

?sort=title
```

A leading `-` indicates descending order.

---

# File Uploads

File uploads use:

```text
multipart/form-data
```

Rules:

* Validate before processing.
* Upload through the Media module only.
* Business modules store `mediaId` references.

---

# Public Portfolio APIs

Portfolio APIs follow the Backend For Frontend (BFF) pattern.

Example:

```text
GET /api/v1/portfolio/:username
```

The response is optimized for frontend consumption.

Do not expose raw database entities or internal fields.

---

# API Documentation

Swagger is the official API documentation.

Every endpoint must include:

* Purpose
* Authentication
* Request Schema
* Response Schema
* Error Responses

Swagger should remain synchronized with implementation.

---

# API Design Checklist

Before implementing an endpoint, verify:

* Correct REST URL
* Correct HTTP method
* Authentication applied (if required)
* Ownership validation implemented
* Zod validation added
* Standard response format
* Proper status codes
* Swagger updated
* No unnecessary fields exposed

