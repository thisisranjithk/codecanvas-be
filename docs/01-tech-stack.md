# Technology Stack

## Purpose

This document defines the official technology stack for the Portfolio CMS API. Every implementation must follow these standards unless explicitly changed in a future architectural decision.

---

# Runtime

## Node.js

- Latest Active LTS Version

Reason:

- Long-term support
- Stable ecosystem
- Excellent performance
- Large community support

---

# Language

## TypeScript

Version:
Latest Stable

Configuration:

- Strict Mode Enabled
- ES Modules
- Incremental Compilation
- Path Aliases

Reason:

- Type Safety
- Better Developer Experience
- Easier Refactoring
- Improved Maintainability

---

# Backend Framework

## Express.js

Reason:

- Minimal and flexible
- Mature ecosystem
- Large middleware support
- Easy integration with Prisma
- Ideal for REST APIs

---

# Database

## PostgreSQL

Provider:

Neon PostgreSQL

Reason:

- Relational database
- ACID compliance
- Excellent indexing
- JSON support
- Highly scalable
- Production ready

---

# ORM

## Prisma ORM

Reason:

- Excellent TypeScript support
- Type-safe queries
- Simple migrations
- Great developer experience
- Automatic client generation

Prisma will be the only ORM used in this project.

---

# Validation

## Zod

Reason:

- Type-safe schemas
- Excellent TypeScript integration
- Reusable validation
- Easy error handling

Every request payload must be validated using Zod.

---

# Authentication

## JWT (JSON Web Token)

Used For

- Access Token
- Refresh Token

Password Hashing

bcrypt

Reason

- Secure authentication
- Stateless API
- Industry standard

---

# Environment Variables

dotenv

Purpose

Store

- Database URL
- JWT Secrets
- Application Port
- Environment
- Other sensitive configuration

Environment variables must never be committed to Git.

---

# Security

The following middleware will be used.

- helmet
- cors
- compression
- express-rate-limit
- cookie-parser

Reason

Protect the API using standard security practices.

---

# Logging

Morgan

Purpose

- HTTP request logging

Future Enhancement

Application logger may be replaced by Winston or Pino if advanced logging is required.

---

# API Documentation

Swagger / OpenAPI

Purpose

- Interactive API documentation
- Request examples
- Response examples

Swagger integration will be added after the API foundation is completed.

---

# Testing

Testing Framework

Vitest

Future Scope

- Unit Tests
- Integration Tests
- API Tests

Testing is planned after core feature implementation.

---

# File Upload

Future Package

Multer

Purpose

- Image Uploads
- Resume Upload
- Portfolio Assets

Cloud storage integration may be added in future versions.

---

# Development Tools

Package Manager

npm

Version Control

Git

Repository Hosting

GitHub

API Client

Postman

Database Tool

Prisma Studio

---

# Project Conventions

Module System

ES Modules

Async Pattern

async / await only

Import Style

Named imports where applicable

Error Handling

Centralized

Validation

Request validation using Zod

Database Access

Prisma only

API Style

REST

Architecture

Feature-based Clean Architecture

---

# Dependencies

## Runtime Dependencies

- express
- prisma
- @prisma/client
- zod
- jsonwebtoken
- bcrypt
- dotenv
- cors
- helmet
- compression
- express-rate-limit
- cookie-parser
- morgan

---

## Development Dependencies

- typescript
- tsx
- @types/node
- @types/express
- @types/jsonwebtoken
- @types/bcrypt
- @types/cors
- @types/cookie-parser
- prisma
- vitest
- eslint
- prettier

---

# Technology Decisions

The following technologies are intentionally not used.

- MongoDB
- Mongoose
- Sequelize
- TypeORM
- Joi
- Yup
- CommonJS
- JavaScript
- GraphQL

These decisions are intentional to maintain consistency throughout the project.

---

# Future Considerations

The following technologies may be introduced in later versions if needed.

- Redis
- Docker
- GitHub Actions
- S3 Compatible Storage
- Pino
- Prometheus
- Grafana

These are outside the scope of the initial implementation.
