# 02 - Architecture

# Backend Architecture

## Purpose

This document defines the architectural principles of the Portfolio CMS API.

Its purpose is to ensure every feature follows the same design patterns, responsibilities, and coding conventions.

All implementation decisions must align with this document.

---

# Architectural Style

The application follows a **Feature-First Modular Architecture**.

Each business capability is implemented as an independent module that owns its routes, controllers, services, validation, and API documentation.

Modules should be cohesive, loosely coupled, and independently maintainable.

---

# Core Principles

The architecture is built on the following principles:

* Feature-first organization
* Single Responsibility Principle
* Separation of Concerns
* Type Safety
* Reusability
* Ownership-based authorization
* Consistent API contracts
* Thin controllers
* Business logic inside services

---

# Request Lifecycle

Every request follows the same execution flow.

```text
HTTP Request

↓

Route

↓

Authentication (if required)

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Prisma Client

↓

Database

↓

Response
```

Every feature must follow this lifecycle.

---

# Module Structure

Each feature follows the same structure.

```text
module/

module.route.ts

module.controller.ts

module.service.ts

module.schema.ts

module.docs.ts
```

Every module owns its implementation.

Modules must not access another module's internal files directly.

---

# Layer Responsibilities

## Route

Responsible for:

* Registering endpoints
* Applying middleware
* Delegating requests to controllers

Routes must not contain business logic.

---

## Controller

Responsible for:

* Receiving requests
* Calling services
* Returning standardized responses

Controllers must remain thin.

They should never contain business logic or database queries.

---

## Service

Responsible for:

* Business rules
* Data orchestration
* Validation beyond request schemas
* Cross-module coordination

Services are the heart of the application.

---

## Validation

Every incoming request must be validated using Zod before reaching the controller.

Controllers should always receive validated data.

---

# Shared Layer

The `shared/` directory contains reusable utilities used across multiple modules.

Examples:

* Middleware
* Error handling
* Response helpers
* Constants
* Utility functions
* Shared types

Business logic must never exist inside the shared layer.

---

# Ownership Model

The application follows an ownership-based authorization model.

Every business resource belongs to exactly one user.

Examples:

* Project
* Skill
* Experience
* Education
* Certification
* Blog
* Media

Users may only manage resources they own.

Platform administrators may access all resources.

---

# Master Data

Reusable lookup data is managed through the Category module.

Current supported types include:

* Project Categories
* Skill Categories
* Employment Types

Business modules store foreign keys (`categoryId`) instead of display values.

---

# Media Architecture

All uploads pass through the Media module.

Business modules never upload files directly.

Instead, they store references such as:

* avatarMediaId
* thumbnailMediaId
* certificateMediaId

This keeps media management centralized and reusable.

---

# Public Portfolio Architecture

The public portfolio follows a **Backend For Frontend (BFF)** pattern.

Portfolio data is aggregated into frontend-friendly responses.

Example:

```text
GET /api/v1/portfolio/:username
```

The Portfolio module coordinates existing business modules rather than duplicating business logic.

---

# Authorization Strategy

Authentication and authorization are separate concerns.

Authentication verifies the user's identity.

Authorization verifies ownership of the requested resource.

Business logic should never perform authentication.

---

# Error Handling

The application uses centralized error handling.

Services throw meaningful errors.

Controllers return standardized API responses.

Internal implementation details must never be exposed.

---

# API Documentation

Swagger is the source of truth for API documentation.

Every module is responsible for documenting its own endpoints.

Documentation must remain synchronized with implementation.

---

# Key Architectural Decisions

The following decisions apply throughout the project:

* Feature-first modular architecture.
* Prisma is the only database access layer.
* Zod validates every request.
* JWT secures protected APIs.
* Swagger documents every endpoint.
* Media is managed centrally.
* Master data is managed through Categories.
* Public Portfolio APIs resolve users by `username`.
* Authorization is ownership-based.
* Business modules remain independent.


