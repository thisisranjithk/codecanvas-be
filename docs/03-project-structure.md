# Project Structure

## Purpose

This document defines the official project structure for the Portfolio CMS API.

Its purpose is to ensure consistency across the codebase by establishing clear conventions for organizing files, modules, and shared resources.

Every new feature must follow this structure.

---

# High-Level Directory Structure

```text
portfolio-cms-api/
│
├── docs/
│
├── prisma/
│
├── src/
│   ├── config/
│   ├── modules/
│   ├── shared/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# Directory Responsibilities

## docs/

Contains all project documentation.

Examples

- Architecture
- API Guidelines
- Database Design
- Development Workflow

Documentation must remain synchronized with implementation decisions.

---

## prisma/

Contains all Prisma-related files.

Examples

- schema.prisma
- migrations
- seed scripts (future)

Only Prisma resources belong in this directory.

---

## src/

Contains all application source code.

No documentation or configuration files should be placed here.

---

# Source Directory Structure

```text
src/
│
├── config/
├── modules/
├── shared/
├── routes/
├── app.ts
└── server.ts
```

---

# config/

Contains application configuration.

Examples

- Environment configuration
- Database configuration
- Logger configuration
- Swagger configuration (future)

Configuration files should not contain business logic.

---

# modules/

Contains all business modules.

Each feature owns its own implementation.

Example

```text
modules/

auth/

profile/

projects/

skills/

experience/

education/

certifications/

blog/

dashboard/

settings/

portfolio/

analytics/
```

No module should depend directly on another module's internal files.

---

# Module Structure

Each module follows the same structure.

```text
projects/

project.routes.ts

project.controller.ts

project.service.ts

project.repository.ts

project.validation.ts

project.types.ts

index.ts
```

Additional files may be added only when justified by feature complexity.

Examples

```text
project.mapper.ts

project.constants.ts

project.utils.ts
```

Avoid creating unnecessary files.

---

# shared/

Contains reusable application components.

Examples

```text
shared/

middleware/

errors/

constants/

utils/

types/

responses/

validators/
```

The shared directory must never contain business-specific logic.

If a piece of code belongs only to one feature, it should remain inside that feature module.

---

# routes/

Contains the application's root route registration.

Responsibilities

- Combine feature routes
- Register API version
- Export root router

Feature routes should not be defined here.

---

# app.ts

Responsibilities

- Create Express application
- Register middleware
- Register routes
- Configure error handling

No server startup logic belongs here.

---

# server.ts

Responsibilities

- Load environment variables
- Start HTTP server
- Handle graceful shutdown

No application configuration belongs here.

---

# Naming Conventions

Directories

Use lowercase.

Example

```text
projects
shared
middleware
```

---

Files

Use feature-based naming.

Examples

```text
project.controller.ts

project.service.ts

project.repository.ts
```

Avoid generic file names such as

```text
controller.ts

service.ts
```

---

Variables

Use camelCase.

Example

```ts
projectRepository;

userProfile;

accessToken;
```

---

Functions

Use descriptive verbs.

Examples

```ts
createProject();

updateProfile();

publishBlog();

changePassword();
```

Avoid generic names.

```ts
save();

process();

handle();
```

---

Interfaces

Prefix with "I" is not required.

Preferred

```ts
Project;

CreateProjectRequest;

ProjectRepository;
```

---

Enums

Use PascalCase.

Example

```ts
ProjectStatus;

UserRole;

BlogCategory;
```

---

Constants

Use UPPER_SNAKE_CASE.

Example

```ts
MAX_FILE_SIZE;

DEFAULT_PAGE_SIZE;

JWT_EXPIRATION;
```

---

# Import Order

Imports should always follow this order.

1. External packages
2. Internal shared modules
3. Feature modules
4. Relative imports

Group imports together.

Avoid scattered imports throughout the file.

---

# Module Independence

Every module should be independently maintainable.

A module may expose only its public interface.

Internal implementation details must remain private.

Modules communicate through exported services only when necessary.

---

# Shared Code Guidelines

Before adding code to the shared directory, ask:

- Will this be reused by multiple modules?
- Is it independent of business rules?

If the answer is "No", keep it inside the module.

---

# File Size Guidelines

Aim for focused, readable files.

Recommended limits

- Controller: ≤ 150 lines
- Service: ≤ 300 lines
- Repository: ≤ 200 lines

If a file grows significantly beyond these guidelines, consider extracting responsibilities.

These are guidelines, not strict limits.

---

# Project Growth

As the application grows, new modules should follow the existing conventions without changing the project structure.

Consistency is more important than introducing new organizational patterns.
