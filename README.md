# LEXA Internship Management System

Production-oriented scaffold for a Next.js 15 internship management platform.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL
- Auth.js
- Zod
- React Hook Form
- Shadcn/UI conventions
- ESLint and Prettier

## Architecture

The application uses a feature-based structure under `src/features`, shared platform utilities under
`src/lib`, reusable interface building blocks under `src/components`, and App Router route groups under
`src/app`.

Server Components are the default. Client Components should be added only when browser state, event
handlers, or effects are required.

## Route Groups

- `(public)`: landing page, internship information, login, register
- `(dashboard)`: protected role workspaces for intern, mentor, and admin
- `api`: route handlers for Auth.js and platform APIs

## Important Paths

- `src/app`: routing, layouts, pages, API route handlers
- `src/components/layout`: application shell, sidebar, public navigation
- `src/components/shared`: reusable non-domain UI patterns
- `src/components/ui`: Shadcn-compatible primitives
- `src/features`: feature modules with components, schemas, services, and types
- `src/lib`: database, auth, environment, navigation, permissions
- `src/services`: cross-feature service adapters
- `src/hooks`: reusable client hooks
- `src/types`: global TypeScript contracts
- `src/utils`: framework-agnostic helpers
- `prisma`: schema, migrations, seed entry

## Getting Started

1. Copy `.env.example` to `.env`.
2. Install dependencies.
3. Configure `DATABASE_URL` for PostgreSQL.
4. Run Prisma generate and migrations.
5. Start the development server.

Business logic is intentionally not implemented yet.
