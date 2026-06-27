# Portfolio CMS API

Production-ready backend API for managing portfolio content through a secure Content Management System (CMS).

## Overview

Portfolio CMS API enables developers to manage their personal portfolio content through authenticated CMS APIs and exposes public APIs for portfolio websites.

## Tech Stack

- **Runtime:** Node.js (Active LTS)
- **Language:** TypeScript (strict mode, ES Modules)
- **Framework:** Express.js _(upcoming)_
- **Database:** PostgreSQL via Neon _(upcoming)_
- **ORM:** Prisma _(upcoming)_

## Prerequisites

- Node.js >= 20.0.0
- npm

## Getting Started

### Install dependencies

```bash
npm install
```

### Available Scripts

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development with hot reload |
| `npm run build`      | Compile TypeScript to `dist/`     |
| `npm run start`      | Run compiled production build     |
| `npm run lint`       | Run ESLint                        |
| `npm run lint:fix`   | Run ESLint with auto-fix          |
| `npm run format`     | Format code with Prettier         |
| `npm run type-check` | Run TypeScript type checking      |

## Project Structure

```text
portfolio-cms-api/
├── docs/           # Project documentation
├── features/       # Feature specifications
├── src/            # Application source code (Feature 002+)
├── dist/           # Compiled output
└── ...
```

## Documentation

See the [`docs/`](./docs/) folder for architecture, API guidelines, and development rules.

## License

ISC
