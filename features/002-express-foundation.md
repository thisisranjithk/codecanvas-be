# Feature 002 - Express Foundation

## Objective

Set up the Express application foundation for the Portfolio CMS API.

This feature establishes the application entry point, Express configuration, middleware registration, routing foundation, and health check endpoint.

---

## Context

Before implementation:

- Read all project documentation inside the `docs/` folder.
- Ensure Feature 001 has been completed successfully.
- Follow the established architecture and project structure.

---

## Scope

### 1. Create Source Structure

Create the initial source structure.

```text
src/
├── app.ts
├── server.ts
├── routes/
│   └── index.ts
├── config/
├── modules/
└── shared/
```

Only create directories required for this feature.

---

### 2. Configure Express

- Create the Express application.
- Configure JSON body parsing.
- Configure URL encoded body parsing.
- Disable the `x-powered-by` header.

Do not add business logic.

---

### 3. Configure Middleware

Register only the following middleware:

- express.json()
- express.urlencoded()

Do not configure Helmet, CORS, Morgan, Compression, Rate Limiting, or Cookie Parser in this feature.

These belong to the Shared Infrastructure feature.

---

### 4. Configure API Versioning

Create the base API version.

```text
/api/v1
```

All future routes must be registered through this version.

---

### 5. Configure Health Endpoint

Create:

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "Portfolio CMS API is running.",
  "data": {
    "status": "healthy"
  }
}
```

This endpoint is public.

---

### 6. Configure Server Startup

Create the HTTP server entry point.

The server should:

- Read the application port.
- Start Express.
- Display a startup message.

Do not connect to the database.

---

## Out of Scope

Do not implement:

- Prisma
- Environment Variables
- Authentication
- Authorization
- Error Handling
- Logger
- Response Helpers
- Validation
- Feature Modules
- Swagger
- Testing

---

## Deliverables

Expected project structure:

```text
src/
├── app.ts
├── server.ts
├── routes/
│   └── index.ts
├── config/
├── modules/
└── shared/
```

No feature modules should be implemented yet.

---

## Acceptance Criteria

- Express starts successfully.
- Server starts without errors.
- `/api/v1/health` returns HTTP 200.
- API versioning is configured.
- Project compiles successfully.
- No linting or TypeScript errors.

---

## Verification

Verify the following:

```bash
npm run dev
```

Then test:

```http
GET /api/v1/health
```

Expected:

```json
{
  "success": true,
  "message": "Portfolio CMS API is running.",
  "data": {
    "status": "healthy"
  }
}
```

---

## AI Implementation Rules

- Implement only the requested scope.
- Do not modify unrelated files.
- Do not install packages outside this feature.
- Do not introduce future infrastructure.
- Keep controllers, services, and business modules out of this feature.
- After implementation, provide:

  - Created files
  - Modified files
  - Installed dependencies
  - Summary of changes
