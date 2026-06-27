# Feature 009 - Media Management

## Objective

Implement the Media module for the Portfolio CMS API.

This module is responsible for uploading, storing, retrieving, and deleting media assets using Cloudinary.

It serves as the centralized media management system for the entire application. All future business modules must reference uploaded media using `mediaId` instead of storing Cloudinary URLs directly.

---

## Context

Before implementation:

* Read all documents inside the `docs/` folder.
* Assume all previous features already exist.
* Reuse the existing authentication module and shared infrastructure.
* Modify only the files required for this feature.

---

# Scope

## 1. Configure Cloudinary

Integrate Cloudinary as the application's media storage provider.

Configure using environment variables.

Required environment variables:

```text
CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Do not hardcode any credentials.

---

## 2. Create Media Model

Create a reusable Prisma `Media` model.

Fields:

* id
* originalName
* publicId
* url
* secureUrl
* resourceType
* format
* width
* height
* bytes
* folder
* uploadedById
* createdAt
* updatedAt

Requirements:

* `publicId` must be unique.
* Create a relation with the `User` model.
* Generate and apply the migration.

The Media model must not contain any business-specific fields such as:

* avatar
* thumbnail
* coverImage
* certificate

Business modules will reference `mediaId`.

---

## 3. Create Media Module

Expected structure:

```text
src/modules/media/

media.route.ts
media.controller.ts
media.service.ts
media.schema.ts
media.docs.ts
```

Responsibilities:

### media.route.ts

* Register media endpoints.
* Apply authentication middleware.

### media.controller.ts

* Handle HTTP requests and responses.
* Delegate business logic to the service.
* Return standardized API responses.

### media.service.ts

Responsibilities:

* Upload files to Cloudinary.
* Save media metadata.
* Retrieve uploaded media.
* Delete media.
* Delete Cloudinary assets.
* Interact directly with Prisma.

### media.schema.ts

Define request validation schemas.

### media.docs.ts

Register Swagger documentation.

---

## 4. Create Upload Middleware

Create reusable upload middleware.

Expected location:

```text
src/shared/middleware/upload.ts
```

Responsibilities:

* Configure Multer.
* Validate file size.
* Validate MIME types.
* Handle multipart/form-data.
* Pass validated files to the Media module.

Future modules must reuse this middleware.

---

## 5. Media APIs

Implement the following endpoints.

### Upload Media

```http
POST /api/v1/media/upload
```

Requirements:

* Protected endpoint.
* Accept multipart/form-data.
* Upload to Cloudinary.
* Save metadata.
* Return the created media resource.

---

### Get Media

```http
GET /api/v1/media/:id
```

Requirements:

* Protected endpoint.
* Return uploaded media metadata.

---

### Delete Media

```http
DELETE /api/v1/media/:id
```

Requirements:

* Protected endpoint.
* Delete the asset from Cloudinary.
* Delete the database record.
* Return a standardized success response.

---

## 6. Upload Rules

Supported file types:

Images

* JPG
* JPEG
* PNG
* WEBP
* SVG

Documents

* PDF

Maximum upload size:

```text
10 MB
```

Uploads outside these constraints must be rejected.

---

## 7. Cloudinary Folder Strategy

Support only predefined folders.

Allowed folders:

```text
avatars

projects

blogs

certificates

resume
```

Folder names must be validated.

Do not allow arbitrary folder names.

---

## 8. Swagger Documentation

Document every Media endpoint.

Include:

* Multipart upload
* Authentication
* Request schema
* Response schema
* Error responses

Swagger should allow testing uploads directly from the browser.

---

# Out of Scope

Do not implement:

* Multiple file upload
* Image cropping
* Image resizing
* Image transformations
* Video uploads
* Audio uploads
* Storage provider abstraction
* S3
* Local storage
* CDN configuration

These features may be introduced in future versions.

---

# Deliverables

Expected additions:

```text
src/

modules/
└── media/
    ├── media.route.ts
    ├── media.controller.ts
    ├── media.service.ts
    ├── media.schema.ts
    └── media.docs.ts

shared/
└── middleware/
    └── upload.ts

config/
└── cloudinary.ts
```

Database:

* Media Prisma Model
* Prisma Migration

---

# Acceptance Criteria

Verify the following:

* Cloudinary configured successfully.
* Media model created successfully.
* Migration executes successfully.
* Files upload successfully.
* Metadata stored successfully.
* Media retrieval works.
* Media deletion removes both the database record and the Cloudinary asset.
* Upload validation works correctly.
* Swagger supports multipart uploads.
* No TypeScript errors.
* No linting errors.

---

# Verification

Test:

```http
POST   /api/v1/media/upload

GET    /api/v1/media/:id

DELETE /api/v1/media/:id
```

Verify:

* Images upload successfully.
* PDFs upload successfully.
* Invalid file types are rejected.
* Oversized files are rejected.
* Deleted media no longer exists in Cloudinary.
* Deleted media no longer exists in the database.

---

# Project Rule

From this feature onward:

* Business modules must never upload files directly.
* Business modules must never store Cloudinary URLs.
* Business modules must store only `mediaId`.
* Every upload must pass through the Media module.

This rule applies to all future modules.

---

## AI Implementation Rules

* Implement only the requested scope.
* Use Cloudinary as the storage provider.
* Use Multer for multipart handling.
* Validate uploads before Cloudinary.
* Store only media metadata in the database.
* Keep business modules independent from Cloudinary.
* Document every endpoint in Swagger.
* Do not implement future media features.
* Keep the implementation production-ready.
* After implementation, provide:

  * Created files
  * Modified files
  * Installed dependencies
  * Summary of changes
