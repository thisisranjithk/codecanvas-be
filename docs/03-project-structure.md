# 03 - Project Structure

# Project Structure

## Purpose

This document defines the official folder structure and organization of the Portfolio CMS API.

Every new feature, shared utility, and configuration file must follow this structure to maintain consistency across the project.

---

# Root Structure

```text
portfolio-cms-api/

docs/
features/
prisma/
src/

.env
package.json
tsconfig.json
README.md
```

---

# Directory Responsibilities

## docs/

Contains the permanent project documentation.

Examples:

* Project Overview
* Tech Stack
* Architecture
* API Guidelines
* Development Rules

These documents describe the project, not feature implementations.

---

## features/

Contains implementation prompts and feature specifications.

Each feature represents one development milestone.

Examples:

```text
001-project-foundation.md

010-projects.md

017-public-portfolio-api.md
```

These files are used during development and are independent of the runtime application.

---

## prisma/

Contains all database-related resources.

Examples:

```text
schema.prisma

migrations/
```

Only Prisma files belong here.

---

## src/

Contains the application source code.

Every runtime component belongs inside this directory.

---

# Source Structure

```text
src/

config/

modules/

routes/

shared/

app.ts

server.ts
```

---

# config/

Application configuration.

Examples:

```text
database.ts

env.ts

swagger.ts

cloudinary.ts
```

Configuration files should never contain business logic.

---

# modules/

Contains all business modules.

Each module owns its own implementation.

Current modules:

```text
auth/

profile/

media/

project/

skill/

category/

experience/

education/

certification/

blog/

portfolio/

health/
```

New business features should always be created inside this directory.

---

# Module Structure

Every module follows the same structure.

```text
module/

module.route.ts

module.controller.ts

module.service.ts

module.schema.ts

module.docs.ts
```

Responsibilities:

* route → Register endpoints
* controller → Handle HTTP requests
* service → Business logic
* schema → Zod validation
* docs → Swagger documentation

Avoid creating additional files unless they provide clear value.

---

# routes/

Registers all feature routes.

Responsibilities:

* Combine module routes
* Apply API version prefix
* Export the root router

Business logic must never exist here.

---

# shared/

Contains reusable components shared across multiple modules.

Current structure:

```text
shared/

constants/

errors/

middleware/

responses/

types/

utils/
```

Only reusable code belongs here.

Business-specific logic should remain inside its module.

---

# app.ts

Responsible for:

* Creating the Express application
* Registering middleware
* Registering routes
* Configuring global error handling

No server startup logic belongs here.

---

# server.ts

Responsible for:

* Loading environment variables
* Connecting to the database
* Starting the HTTP server
* Handling graceful shutdown

---

# Naming Conventions

## Directories

Use lowercase singular feature names.

Examples:

```text
project

skill

blog

media
```

---

## Files

Follow feature-based naming.

Examples:

```text
project.route.ts

project.controller.ts

project.service.ts

project.schema.ts

project.docs.ts
```

Avoid generic names such as:

```text
controller.ts

service.ts
```

---

# Shared Code Rules

Before moving code into `shared/`, ask:

* Is it reused by multiple modules?
* Is it independent of business logic?

If the answer is **No**, keep it inside the feature module.

---

# Project Growth

When adding a new feature:

1. Create a new module inside `src/modules`.
2. Follow the standard module structure.
3. Register the routes.
4. Add Swagger documentation.
5. Update the relevant feature specification if needed.

Do not introduce new architectural patterns unless they apply across the entire project.


