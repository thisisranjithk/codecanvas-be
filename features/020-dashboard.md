# Feature 020 - Dashboard

## Objective

Implement the Dashboard module for the Portfolio CMS.

The Dashboard provides aggregated, user-specific information by combining data from existing modules.

It is a read-only module and must not introduce new database tables.

Reuse the existing business modules.

---

# Context

Read all documents inside the `docs/` folder.

Current implementation already includes:

* Authentication
* Profile
* Media
* Projects
* Skills
* Categories
* Experience
* Education
* Certifications
* Blog
* Portfolio API
* Portfolio Settings

Reuse the existing architecture.

Do not duplicate business logic.

---

# Scope

## 1. Create Dashboard Module

Create:

```text
src/modules/dashboard/

dashboard.route.ts
dashboard.controller.ts
dashboard.service.ts
dashboard.docs.ts
```

Do not create a validation schema.

The Dashboard exposes read-only APIs.

---

## 2. Dashboard API

Implement:

```http
GET /api/v1/dashboard
```

Return a single aggregated response containing:

* Overview Statistics
* Recent Activity
* Featured Content

The authenticated user should receive only their own dashboard data.

---

## 3. Overview Statistics

Return:

* Total Projects
* Published Projects
* Draft Projects
* Total Blogs
* Published Blogs
* Draft Blogs
* Total Skills
* Total Experience
* Total Education
* Total Certifications

Example:

```json
{
  "stats": {
    "projects": 12,
    "publishedProjects": 10,
    "draftProjects": 2,
    "blogs": 5,
    "publishedBlogs": 4,
    "draftBlogs": 1,
    "skills": 18,
    "experience": 4,
    "education": 2,
    "certifications": 6
  }
}
```

---

## 4. Recent Activity

Generate recent activity dynamically using existing modules.

Include activities from:

* Projects
* Blogs
* Certifications
* Experience
* Education

Return the latest activities ordered by the most recent `createdAt` or `updatedAt`.

Example:

```json
[
  {
    "type": "PROJECT_CREATED",
    "title": "Portfolio CMS",
    "timestamp": "2026-06-30T10:00:00Z"
  },
  {
    "type": "BLOG_PUBLISHED",
    "title": "Building a SaaS Portfolio",
    "timestamp": "2026-06-29T18:30:00Z"
  }
]
```

Do not create an Activity table.

Generate the response from existing data.

---

## 5. Featured Content

Return:

* Featured Project
* Latest Published Blog
* Latest Certification

Example:

```json
{
  "featuredContent": {
    "featuredProject": {},
    "latestBlog": {},
    "latestCertification": {}
  }
}
```

Return `null` for any item that does not exist.

---

## 6. Business Rules

* Dashboard is available only to authenticated users.
* Users can view only their own dashboard.
* ADMIN follows the same behavior when viewing their own dashboard.
* Do not expose another user's information.
* Do not duplicate business logic already implemented in other modules.

---

## 7. Swagger

Document the Dashboard endpoint.

Include:

* Authentication
* Response schema
* Error responses

Swagger must remain synchronized with implementation.

---

# Out of Scope

Do not implement:

* Portfolio Completion
* Portfolio Analytics
* Visitor Tracking
* Google Analytics
* Charts
* Monthly Statistics
* Activity Database Table
* Notifications

---

# Acceptance Criteria

Verify:

* Dashboard loads with a single API call.
* Statistics are accurate.
* Draft and published counts are correct.
* Recent activity is ordered correctly.
* Featured content is returned correctly.
* Only the authenticated user's data is returned.
* Swagger documentation is available.
* No TypeScript or linting errors.

---

# Verification

Test:

```http
GET /api/v1/dashboard
```

Verify:

* Statistics match the database.
* Draft and published counts are correct.
* Recent activity is ordered correctly.
* Featured content returns expected data.
* Unauthorized users receive `401 Unauthorized`.
* Swagger endpoint executes successfully.

---

# AI Implementation Rules

* Implement only the requested scope.
* Reuse existing modules and services wherever possible.
* Do not duplicate business logic.
* Do not create new database tables.
* Keep controllers thin.
* Perform aggregation inside the Dashboard service.
* Optimize database queries to minimize the number of requests.
* Return a frontend-friendly response.
* Update Swagger documentation.
* Modify only the required files.
* After implementation provide:

  * Modified files
  * API summary
  * Aggregation summary
  * Verification summary
