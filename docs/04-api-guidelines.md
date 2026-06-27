# API Guidelines

## Purpose

This document defines the standards for designing and implementing REST APIs in the Portfolio CMS API.

Every endpoint must follow these guidelines to ensure consistency, predictability, and maintainability.

---

# API Principles

Every API should be:

- RESTful
- Consistent
- Predictable
- Versioned
- Secure
- Easy to consume
- Self-explanatory

---

# Base URL

All endpoints must use versioning.

```text
/api/v1
```

Examples

```text
/api/v1/auth/login

/api/v1/projects

/api/v1/profile

/api/v1/settings
```

---

# API Categories

## Protected CMS APIs

Require JWT authentication.

Examples

```text
/api/v1/projects

/api/v1/blog

/api/v1/settings
```

---

## Public Portfolio APIs

Do not require authentication.

Examples

```text
/api/v1/portfolio/:username

/api/v1/portfolio/:username/projects

/api/v1/portfolio/:username/blogs
```

Public APIs must return only published or publicly visible data.

---

# Resource Naming

Use plural nouns.

Good

```text
/projects

/skills

/blogs

/certifications
```

Avoid

```text
/getProjects

/createProject

/projectList
```

---

# HTTP Methods

GET

Retrieve resources.

POST

Create resources.

PUT

Replace an existing resource.

PATCH

Partially update a resource.

DELETE

Delete a resource.

Use HTTP methods according to their intended purpose.

---

# URL Structure

Preferred

```text
/projects

/projects/:id

/blogs/:id

/settings/profile
```

Avoid verbs in URLs.

Bad

```text
/createProject

/deleteBlog

/updateSkill
```

---

# Request Body

Request bodies must use JSON.

Example

```json
{
  "title": "Portfolio CMS",
  "category": "Backend"
}
```

---

# Standard Success Response

Every successful response must follow this structure.

```json
{
  "success": true,
  "message": "Projects fetched successfully.",
  "data": {}
}
```

---

# Standard List Response

List endpoints should include pagination metadata.

```json
{
  "success": true,
  "message": "Projects fetched successfully.",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

---

# Standard Error Response

Every error response must follow this structure.

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

Unexpected server errors should never expose internal implementation details.

---

# HTTP Status Codes

Use standard HTTP status codes.

| Status | Meaning                     |
| ------ | --------------------------- |
| 200    | Success                     |
| 201    | Resource Created            |
| 204    | No Content                  |
| 400    | Bad Request                 |
| 401    | Unauthorized                |
| 403    | Forbidden                   |
| 404    | Not Found                   |
| 409    | Conflict                    |
| 422    | Validation Error (Optional) |
| 429    | Too Many Requests           |
| 500    | Internal Server Error       |

Do not return `200 OK` for failed operations.

---

# Pagination

List endpoints should support pagination.

Query Parameters

```text
?page=1

?limit=10
```

Example

```text
GET /projects?page=1&limit=10
```

Default values

```text
page = 1

limit = 10
```

Maximum limit

```text
100
```

---

# Sorting

Sorting should use the `sort` query parameter.

Examples

```text
?sort=createdAt

?sort=-createdAt

?sort=title
```

A minus (`-`) indicates descending order.

---

# Searching

Searching should use the `search` query parameter.

Example

```text
GET /projects?search=portfolio
```

The implementation may search across one or more relevant fields.

---

# Filtering

Filtering should use explicit query parameters.

Example

```text
GET /projects?status=published

GET /blogs?featured=true

GET /experience?current=true
```

Filters should be composable.

Example

```text
GET /projects?status=published&featured=true
```

---

# Route Parameters

Use route parameters only for resource identification.

Example

```text
/projects/:id

/blogs/:slug

/portfolio/:username
```

Do not mix resource identifiers with query parameters.

---

# Authentication

Protected endpoints require a Bearer Token.

Example

```http
Authorization: Bearer <access_token>
```

Authentication should be handled through middleware.

Controllers should assume the user is already authenticated.

---

# Validation

Every request must be validated before reaching the controller.

Validation failures should return a consistent error response.

Controllers should never perform manual validation.

---

# File Uploads

File uploads should use multipart/form-data.

Uploaded files should be validated before processing.

File metadata should be stored in the database.

---

# Idempotency

GET, PUT, and DELETE operations should be idempotent whenever possible.

POST requests are not required to be idempotent.

---

# Soft Delete

Where applicable, resources should be archived instead of permanently deleted.

Hard deletes should be reserved for exceptional cases.

---

# Response Messages

Messages should be concise and user-friendly.

Examples

```text
Project created successfully.

Profile updated successfully.

Blog published successfully.
```

Avoid vague messages such as

```text
Done

Success

OK
```

---

# API Versioning

All endpoints must include the version prefix.

Current version

```text
/api/v1
```

Future breaking changes should be introduced through a new version rather than modifying existing contracts.

---

# Documentation

Every public endpoint should eventually include:

- Purpose
- Authentication requirement
- Request example
- Response example
- Error responses

These will be exposed through Swagger/OpenAPI after the API foundation is complete.

---

# API Design Checklist

Before implementing a new endpoint, verify:

- RESTful URL
- Correct HTTP method
- Request validation defined
- Authentication applied (if required)
- Standard response format
- Correct status codes
- Pagination supported (if applicable)
- Filtering supported (if applicable)
- Sorting supported (if applicable)
- Search supported (if applicable)
- Error handling implemented
- API documentation updated
