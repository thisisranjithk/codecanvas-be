# 05 - Development Rules

# Development Rules

## Purpose

This document defines the development workflow and implementation rules for the Portfolio CMS API.

Every feature, bug fix, and refactor must follow these guidelines to keep the codebase consistent, maintainable, and production-ready.

---

# Development Philosophy

The project is built incrementally.

Each implementation should:

* Solve one problem at a time.
* Be easy to review.
* Follow the existing architecture.
* Avoid unnecessary complexity.
* Leave the codebase in a better state.

---

# Feature Workflow

Every new feature follows the same workflow.

1. Read the project documentation.
2. Read the feature specification.
3. Understand the implementation scope.
4. Explain the implementation plan.
5. Implement only the requested scope.
6. Review the generated code.
7. Test the implementation.
8. Proceed to the next feature.

Never skip these steps.

---

# Scope Control

Every implementation must clearly define:

* Objective
* Scope
* Out of Scope
* Acceptance Criteria

Do not implement additional functionality unless explicitly requested.

Avoid placeholder implementations.

---

# Respect Existing Architecture

Before writing code:

* Reuse existing modules.
* Reuse shared utilities.
* Follow the standard module structure.
* Keep naming conventions consistent.

Do not introduce new architectural patterns without a valid reason.

---

# Layer Responsibilities

Every layer has a single responsibility.

## Route

* Register endpoints.
* Apply middleware.
* Delegate to controllers.

---

## Controller

* Receive requests.
* Call services.
* Return standardized responses.

Controllers must remain thin.

---

## Service

* Business rules.
* Authorization checks.
* Cross-module coordination.

Business logic belongs only here.

---

## Schema

* Validate requests using Zod.
* Parse incoming payloads.
* Reject invalid requests before reaching controllers.

---

# Database Rules

* Use Prisma Client only.
* Do not write raw SQL unless explicitly required.
* Apply every schema change through Prisma migrations.
* Keep persistence logic centralized.

---

# Authorization Rules

The application follows ownership-based authorization.

Rules:

* USER manages only their own resources.
* ADMIN may access any resource.
* Public Portfolio APIs never require authentication.

Never rely on client-provided identifiers to determine ownership.

---

# Shared Code Rules

Move code into `shared/` only when:

* It is reused by multiple modules.
* It contains no business-specific logic.

Otherwise, keep it inside the feature module.

---

# API Rules

Every endpoint must:

* Validate requests.
* Return standardized responses.
* Handle errors consistently.
* Update Swagger documentation.
* Follow the API Guidelines document.

---

# AI Collaboration Rules

When implementing a task:

* Read all documents inside the `docs/` folder.
* Understand the current feature specification.
* Modify only the required files.
* Do not refactor unrelated code.
* Reuse existing utilities whenever possible.
* Keep controllers thin.
* Keep services focused.
* Keep implementations production-ready.

---

# Before Completing Any Task

Verify:

* Scope is complete.
* No unrelated files were modified.
* Validation is implemented.
* Authorization is correct.
* Swagger is updated.
* No duplicated logic exists.
* TypeScript compiles successfully.
* No linting errors exist.

---

# When Architecture Changes

If an implementation introduces an architectural change:

1. Update the relevant documentation.
2. Keep the feature specification aligned.
3. Avoid introducing conflicting patterns.

Documentation should always reflect the current implementation.

---

# Code Review Checklist

Before considering a feature complete, confirm:

* Feature follows the architecture.
* Folder structure is respected.
* Naming conventions are consistent.
* Business logic is inside services.
* Shared utilities are reused.
* API responses are standardized.
* Error handling is centralized.
* Swagger documentation is synchronized.

---

# Project Goal

The goal is not simply to build a working backend.

The goal is to build a backend that is:

* Production-ready
* Modular
* Maintainable
* Easy to extend
* Easy to understand
* Well documented
* AI-friendly

Every implementation should contribute toward that goal.
