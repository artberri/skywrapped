# AGENTS.md

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

Sky Wrapped is a SvelteKit app which uses PNPM to manage packages. It's a personalized year-in-review application for Bluesky users that generates beautiful, shareable summaries of Bluesky activity throughout the year.

### Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Turso (LibSQL) with Drizzle ORM
- **Authentication**: ATProto OAuth
- **Deployment**: Netlify
- **Package Manager**: PNPM

## Setup and Development Environment

### Prerequisites

Install **proto** (https://moonrepo.dev/proto) to synchronize all related tools (Node.js, Yarn, Terraform, etc.):

Run:

```sh
proto install
pnpm install
```

### Environment Setup

1. Create a `.env` file based on `.env.example`
2. Generate JWK keys for production OAuth: `node bin/gen-jwk`
3. Start local database: `pnpm run db:start`
4. Run migrations: `pnpm run db:migrate`

### Development Commands

- `pnpm run local` - Start both database and development server concurrently
- `pnpm run dev` - Start development server only
- `pnpm run db:start` - Start local Turso database
- `pnpm run db:studio` - Open Drizzle Studio for database management
- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:generate` - Generate migration files
- `pnpm run db:migrate` - Run database migrations

**Important**: The development server should be accessed at `http://127.0.0.1:5173` (not `localhost`) because authentication against Bluesky will not work otherwise.

## Code Quality and Formatting

### Linting

- Uses **oxlint** with type-aware checking
- Run linting: `pnpm run lint` or `pnpm run qa:lint`
- Configuration: `.oxlintrc.json`

### Formatting

- Uses **Prettier** for code formatting
- Run formatting: `pnpm run format`
- Configuration: `prettier.config.js`
- Uses **oxfmt** for additional formatting (configured in `.oxfmtrc.json`)

### Type Checking

- Uses **svelte-check** for Svelte-specific type checking
- Run type checking: `pnpm run check` or `pnpm run qa:svelte`
- Configuration: `tsconfig.json`

### Quality Assurance

Run all QA checks:

```sh
pnpm run qa
```

This runs:

- SvelteKit sync
- Svelte type checking
- Linting

## Project Structure

### Key Directories

- `src/lib/components/` - Reusable Svelte components
- `src/lib/components/slides/` - Slide components for the wrapped presentation
- `src/lib/server/` - Server-side code
  - `auth/` - Authentication logic (ATProto OAuth)
  - `db/` - Database schema and repository implementations
  - `domain/` - Domain models and interfaces
- `src/routes/` - SvelteKit routes
- `drizzle/` - Database migration files

### Important Patterns

- **Domain-Driven Design**: Domain models are defined in `src/lib/server/domain/`
- **Repository Pattern**: Database access is abstracted through repository interfaces
- **Server Context**: Application context is created in `src/lib/server/context.ts`
- **Component Architecture**: Uses Svelte 5 runes and component composition

## Database Management

- **ORM**: Drizzle ORM
- **Database**: Turso (LibSQL)
- **Schema Location**: `src/lib/server/db/schema.ts`
- **Migrations**: Stored in `drizzle/` directory

### Database Commands

- `pnpm run db:start` - Start local database
- `pnpm run db:push` - Push schema changes (development)
- `pnpm run db:generate` - Generate migration files
- `pnpm run db:migrate` - Run migrations
- `pnpm run db:studio` - Open Drizzle Studio UI
- `pnpm run db:drop` - Drop database (use with caution)

## Available MCP Tools

### Svelte MCP

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

#### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

#### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

#### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

#### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Best Practices

### When Writing Code

1. **Always use svelte-autofixer** before finalizing any Svelte component code
2. **Follow TypeScript strict mode** - ensure all types are properly defined
3. **Use Tailwind CSS** for styling - avoid inline styles unless necessary
4. **Follow the repository pattern** - use domain interfaces and repository implementations
5. **Run QA checks** - ensure code passes linting and type checking before completion

### When Modifying Database Schema

1. Update the schema in `src/lib/server/db/schema.ts`
2. Generate migration: `pnpm run db:generate --name=xxxxxx`
3. Review the generated migration file
4. Run migration: `pnpm run db:migrate`

### When Working with Authentication

- Authentication uses ATProto OAuth
- Session management is handled in `src/lib/server/auth/`
- JWK keys are required for production OAuth

### When Creating New Routes

- Follow SvelteKit conventions
- Use `+page.svelte` for page components
- Use `+page.server.ts` for server-side data loading
- Use `+server.ts` for API endpoints

## Deployment

- **Platform**: Netlify
- **Deploy Command**: `pnpm run deploy`
- **Build**: Handled automatically by Netlify
- **Database Migrations**: Run automatically during deployment

Ensure all required environment variables are set in the Netlify dashboard before deploying.
