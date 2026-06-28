# 00 - Project Overview

# Portfolio CMS API

## Overview

Portfolio CMS API is a SaaS backend application that enables developers to create, manage, and publish their own professional portfolio through a secure Content Management System (CMS).

Each registered user owns a single portfolio and manages its content through authenticated CMS APIs. The portfolio is exposed through a set of public APIs that can be consumed by any frontend application.

The project is designed with a clear separation between content management and portfolio presentation, allowing the backend to serve multiple portfolio websites while maintaining a consistent API contract.

---

# Vision

Build a production-ready backend that allows developers to:

* Manage their portfolio from a single dashboard.
* Publish projects, blogs, skills, experience, education, and certifications.
* Upload and manage media assets.
* Expose a fast, frontend-friendly public portfolio API.
* Scale from a single developer to a multi-user SaaS platform.

---

# Product Goals

The primary goals of the project are:

* Build a scalable REST API.
* Support multiple users with isolated portfolio data.
* Keep business logic modular and maintainable.
* Provide a consistent developer experience.
* Follow production-ready engineering practices.
* Serve as both a real SaaS product and a backend architecture reference.

---

# SaaS Model

The application follows a Software as a Service (SaaS) model.

Each registered user owns:

* One account
* One profile
* One portfolio
* One dashboard

Portfolio data is completely isolated between users.

Every resource belongs to exactly one user.

---

# User Roles

## USER

Represents a customer of the platform.

A USER can:

* Manage their own portfolio
* Manage their own content
* Upload media
* Publish projects and blogs
* Configure portfolio settings
* View their own dashboard

A USER can never access another user's data.

---

## ADMIN

Represents the platform administrator.

An ADMIN can:

* Manage users
* Access all portfolios
* Moderate platform content
* Manage platform-level configuration
* Access administrative features

The ADMIN role manages the platform, not an individual portfolio.

---

# Core Modules

The application currently consists of the following modules:

* Authentication
* Profile
* Media
* Projects
* Skills
* Categories (Master Data)
* Experience
* Education
* Certifications
* Blog
* Portfolio (Public API)

Future modules include:

* Dashboard
* Settings
* Platform Administration

---

# Public Portfolio

Every portfolio is publicly accessible using a unique username.

Example:

```text
GET /api/v1/portfolio/johndoe

GET /api/v1/portfolio/ranjithk
```

The public API exposes only published and publicly visible content.

Private CMS data is never returned.

---

# Key Architectural Decisions

The project follows these architectural decisions:

* Feature-first modular architecture.
* One portfolio per user.
* Ownership-based authorization.
* Public portfolios resolved by username.
* Backend For Frontend (BFF) pattern for portfolio APIs.
* Media managed through a centralized Media module.
* Shared master data managed through the Category module.
* Swagger as the primary API documentation and testing interface.

These decisions provide a consistent foundation for future development.

---

# Project Principles

The project is built around the following principles:

* Simplicity
* Maintainability
* Scalability
* Consistency
* Type Safety
* Secure by Default
* Reusable Components
* Clear Separation of Concerns

---

# Project Status

Current implementation includes:

* Authentication & Authorization
* Profile Management
* Media Management
* Projects
* Skills
* Categories
* Experience
* Education
* Certifications
* Blog
* Public Portfolio API

Remaining planned modules:

* Dashboard
* Settings
* Production Readiness

