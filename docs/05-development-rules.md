# Development Rules

## Purpose

This document defines the mandatory development rules for the Portfolio CMS API.

These rules ensure that every implementation remains consistent, maintainable, production-ready, and aligned with the project architecture.

All future development must follow these rules.

---

# General Principles

- Build one feature at a time.
- Keep changes small and reviewable.
- Prioritize readability over cleverness.
- Favor simplicity over premature optimization.
- Follow the existing architecture instead of introducing new patterns.

---

# Scope Control

Every implementation must clearly define:

- Objective
- Scope
- Out of Scope
- Acceptance Criteria

Only implement what is explicitly requested.

Do not anticipate future features.

Do not create placeholder implementations.

---

# Respect Existing Code

Do not modify unrelated files.

Do not refactor existing modules unless explicitly requested.

Do not rename files or folders without a valid architectural reason.

Keep pull requests focused on a single concern.

---

# Architecture Compliance

Every implementation must follow:

- Project Overview
- Tech Stack
- Backend Architecture
- Project Structure
- API Guidelines

Do not introduce conflicting patterns.

---

# Layer Responsibilities

Routes

- Register endpoints
- Apply middleware
- Delegate to controllers

Controllers

- Receive requests
- Call services
- Return responses

Services

- Business logic only

Repositories

- Database operations only

Never violate these responsibilities.

---

# Database Rules

- Use Prisma only.
- Do not write raw SQL unless explicitly required.
- Keep database logic inside repositories.
- Every schema change must use Prisma migrations.
- Never modify the database directly.

---

# Validation Rules

- Validate every request using Zod.
- Never trust client input.
- Validation must occur before controller execution.

Controllers should assume validated input.

---

# Error Handling

Use centralized error handling.

Throw meaningful errors from the service layer.

Do not expose internal errors to clients.

Always return the standard API response format.

---

# Authentication

Protected endpoints must:

- Authenticate the user.
- Authorize the request.
- Validate the payload.
- Execute business logic.

Do not mix authorization with business logic.

---

# Code Quality

Prefer:

- Small functions
- Clear names
- Reusable utilities
- Explicit types

Avoid:

- Duplicate code
- Nested conditionals where simpler alternatives exist
- Large controllers
- Large services without justification

---

# AI Collaboration Rules

When implementing a feature:

1. Read the documentation in the `docs/` folder.
2. Understand the current feature objective.
3. Implement only the requested scope.
4. Do not create additional features.
5. Do not install unnecessary packages.
6. Reuse existing utilities where appropriate.
7. Explain important architectural decisions.
8. Keep generated code production-ready.

---

# Review Checklist

Before considering a task complete, verify:

- Scope completed.
- No unrelated files modified.
- Project structure respected.
- Validation implemented.
- Error handling implemented.
- API guidelines followed.
- Architecture respected.
- No duplicated logic introduced.

---

# Feature Workflow

Every feature should follow this sequence:

1. Read the project documentation.
2. Read the feature specification.
3. Explain the implementation plan.
4. Implement the requested scope.
5. Review the generated code.
6. Test the feature.
7. Commit the changes.
8. Proceed to the next feature.

Never skip steps.

---

# Decision Making

If multiple implementation options exist:

1. Prefer the simplest solution.
2. Prefer consistency with the existing codebase.
3. Prefer maintainability over optimization.
4. Explain architectural trade-offs before implementation.

---

# Project Goal

The objective is not only to build a working backend.

The objective is to build a backend that is:

- Production-ready
- Maintainable
- Extensible
- Easy to understand
- Suitable as a professional portfolio project

Every implementation should contribute toward that goal.
