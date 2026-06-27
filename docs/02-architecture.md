# Backend Architecture

## Purpose

This document defines the architectural principles for the Portfolio CMS API.

The goal is to build a scalable, maintainable, and production-ready backend that follows clean separation of responsibilities while remaining simple enough for long-term maintenance.

Every implementation must follow the architecture defined in this document.

---

# Architectural Style

The project follows a Feature-Based Modular Architecture inspired by Clean Architecture.

The application is organized around business features instead of technical layers.

Each feature owns its own routes, controllers, services, validation, and repository.

This minimizes coupling and keeps related code together.

---

# High-Level Architecture

```
                Client

                  │

            Express Router

                  │

             Route Layer

                  │

          Controller Layer

                  │

            Service Layer

                  │

          Repository Layer

                  │

             Prisma Client

                  │

             PostgreSQL
```

Each layer has a single responsibility.

Dependencies always flow downward.

Lower layers never depend on higher layers.

---

# Request Lifecycle

Every incoming request follows the same lifecycle.

```
HTTP Request

↓

Route

↓

Authentication (if required)

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Service

↓

Controller

↓

HTTP Response
```

No business logic should exist outside this flow.

---

# Layer Responsibilities

## Route Layer

Responsibilities

- Register endpoints
- Apply middleware
- Delegate to controllers

Must Not

- Access the database
- Contain business logic
- Validate business rules

---

## Controller Layer

Responsibilities

- Receive request
- Extract request data
- Call service
- Return formatted response

Must Not

- Execute business logic
- Write database queries
- Perform complex validation

Controllers should remain thin.

---

## Service Layer

Responsibilities

- Implement business logic
- Coordinate multiple repositories
- Execute business rules
- Throw domain-specific errors

The service layer is the heart of the application.

Most application logic belongs here.

---

## Repository Layer

Responsibilities

- Communicate with Prisma
- Execute database operations
- Return domain objects

Must Not

- Contain business rules
- Format API responses
- Access Express request or response objects

Repositories are responsible only for persistence.

---

## Validation Layer

Responsibilities

- Validate incoming requests
- Define reusable schemas
- Parse request payloads

Validation must happen before reaching the controller.

---

# Module Structure

Each business feature is implemented as an independent module.

Example

```
projects/

project.routes.ts

project.controller.ts

project.service.ts

project.schema.ts

project.docs.ts

index.ts
```

Every module should be self-contained.

Modules should not directly access files inside another module.

Communication between modules should happen through exported services only when required.

---

# Shared Layer

The shared layer contains reusable code used across multiple modules.

Examples

- Middleware
- Utilities
- Error classes
- Constants
- Database helpers
- Response helpers
- Authentication helpers

Business logic must never be placed inside the shared layer.

---

# Dependency Direction

Dependencies always move downward.

```
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database
```

The reverse direction is not allowed.

---

# Business Rules

Business rules always belong inside the Service Layer.

Examples

- Prevent duplicate slugs
- Validate ownership
- Publish rules
- Archive rules
- Portfolio visibility
- Analytics calculations

These rules must never exist in controllers or repositories.

---

# Database Access

All database operations must go through Prisma.

Repositories are the only layer allowed to access Prisma Client.

Controllers and services must never write raw database queries.

---

# Error Handling

The application uses centralized error handling.

Services throw meaningful errors.

Controllers do not catch business errors unless transformation is required.

A global error handler formats all responses consistently.

---

# Validation Strategy

All request validation uses Zod.

Validation occurs before controller execution.

Invalid requests never reach the service layer.

---

# Authentication Flow

Protected routes follow this order.

```
Request

↓

JWT Authentication

↓

Authorization

↓

Validation

↓

Controller
```

Authorization rules must remain separate from business logic.

---

# API Response Strategy

Every endpoint returns a standardized response structure.

Success

```
{
  success,
  message,
  data
}
```

Failure

```
{
  success,
  message,
  errors
}
```

Controllers should never return custom response formats.

---

# Design Principles

The architecture follows these principles.

- Feature-first organization
- Single Responsibility Principle
- Separation of Concerns
- Dependency Inversion
- Reusability
- Type Safety
- Explicit Dependencies
- Minimal Coupling
- High Cohesion

---

# Architectural Constraints

The following practices are prohibited.

- Fat Controllers
- Business Logic in Routes
- Database Queries in Controllers
- Shared Global State
- Circular Dependencies
- Duplicate Business Logic
- Direct Module Coupling
- Unvalidated Request Data

---

# Future Scalability

The architecture should support future enhancements without major refactoring.

Possible future additions include

- Redis
- Background Jobs
- Event Queue
- Email Service
- Object Storage
- API Versioning
- Webhooks
- Caching

The current architecture should accommodate these additions without changing the core module structure.
