# 01 - Tech Stack

# Technology Stack

## Purpose

This document defines the technologies used by the Portfolio CMS API and the reasoning behind each decision.

Only approved technologies should be used throughout the project unless an architectural change is made.

---

# Backend Runtime

## Node.js

**Purpose**

Provides the JavaScript runtime for the backend application.

**Why**

* High performance for I/O intensive applications.
* Large ecosystem.
* Excellent TypeScript support.
* Well suited for REST APIs.

---

## Express.js

**Purpose**

Web framework for building REST APIs.

**Why**

* Lightweight.
* Flexible middleware architecture.
* Mature ecosystem.
* Easy to scale with modular applications.

---

# Language

## TypeScript

**Purpose**

Primary programming language.

**Why**

* Static type checking.
* Better IDE support.
* Improved maintainability.
* Safer refactoring.
* Better developer experience.

The project uses strict TypeScript configuration.

---

# Database

## PostgreSQL (Neon)

**Purpose**

Primary relational database.

**Provider**

Neon Serverless PostgreSQL.

**Why**

* ACID compliant.
* Relational modeling.
* Excellent Prisma support.
* Serverless architecture.
* Automatic scaling.
* Reliable production performance.

---

## Prisma ORM

**Purpose**

Database access layer.

**Why**

* Type-safe queries.
* Automatic client generation.
* Migration management.
* Excellent TypeScript integration.
* Improved developer productivity.

Prisma is the only approved database access layer.

Raw SQL should only be used when absolutely necessary.

---

# Validation

## Zod

**Purpose**

Runtime request validation.

**Why**

* Type-safe schemas.
* Excellent TypeScript integration.
* Simple validation syntax.
* Reusable request schemas.

Every incoming request must be validated using Zod.

---

# Authentication

## JWT (JSON Web Token)

**Purpose**

Authenticate protected APIs.

**Why**

* Stateless authentication.
* Lightweight.
* Widely adopted.
* Easy frontend integration.

Used for:

* Access Tokens
* Refresh Tokens

---

# API Documentation

## Swagger (OpenAPI)

**Purpose**

Interactive API documentation.

**Why**

* Live API testing.
* Self-documenting backend.
* Frontend collaboration.
* Simplifies development.

Swagger is the primary interface for testing APIs.

Postman collections are optional.

---

# Media Storage

## Cloudinary

**Purpose**

Media management.

**Why**

* Image optimization.
* CDN delivery.
* Secure uploads.
* Automatic transformations.
* Production-ready asset management.

Business modules store media references instead of files.

---

# Environment Configuration

## dotenv

**Purpose**

Environment variable management.

Used for:

* Database configuration.
* JWT secrets.
* Cloudinary credentials.
* Application configuration.

Sensitive values must never be committed to source control.

---

# Code Quality

## ESLint

**Purpose**

Code quality and consistency.

Rules should enforce:

* TypeScript best practices.
* Code consistency.
* Error prevention.

---

## Prettier

**Purpose**

Automatic code formatting.

Used to maintain consistent formatting across the project.

---

# API Testing

Primary Tool

```text
Swagger UI
```

Purpose

* Endpoint testing
* Request validation
* Response verification
* API exploration

Swagger replaces the need for manually maintaining Postman collections during development.

---

# Project Architecture Stack

```text
Client

↓

REST API (Express)

↓

Authentication (JWT)

↓

Validation (Zod)

↓

Business Services

↓

Prisma ORM

↓

PostgreSQL (Neon)

↓

Cloudinary (Media)
```

---

# Guiding Principles

Technology choices should prioritize:

* Simplicity
* Maintainability
* Type Safety
* Scalability
* Developer Experience
* Production Readiness

New technologies should only be introduced when they provide clear architectural value.

---
